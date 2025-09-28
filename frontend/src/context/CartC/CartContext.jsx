import { mergeCarts } from './CartUtils'
import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { useAuth } from '../AuthContext'
import { fetchCartFromServer, fetchRemoveFromServer, fetchUpdateQuantityOnServer, fetchClearCartOnServer } from './CartService'
const CartContext = createContext()

const initialState = {
  items: [],
  total: 0,
  itemCount: 0
}

function cartReducer (state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = { ...action.payload }
      return { ...state, items: [...state.items, newItem] }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      return { ...state, items: updatedItems }
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id ? { ...item, quantity: Math.max(0, action.payload.quantity) } : item
        )
        .filter((item) => item.quantity > 0)

      return { ...state, items: updatedItems }
    }

    case 'CLEAR_CART': {
      return { ...state, items: [] }
    }

    case 'REPLACE_CART': {
      return { ...state, items: action.payload }
    }

    case 'CALCULATE_TOTALS': {
      // we could multiply by item.price * item.quantity but leave it flexible
      // to allow dynamic pricing
      const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
      const total = state.items.reduce((total, item) => total + item.price * item.quantity, 0)

      return { ...state, itemCount, total: Number.parseFloat(total.toFixed(2)) }
    }

    default:
      return state
  }
}

export function CartProvider ({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { user } = useAuth()
  const prevUserRef = useRef(null)

  useEffect(() => {
    // sync only when user switches from falsy to truthy (login/registration)
    const syncCartAfterLogin = async () => {
      if (!user) return

      try {
      // 1) fetch cart from backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          method: 'GET',
          credentials: 'include'
        })

        if (!response.ok) {
          // if backend has no cart returns 404 or 200 with empty array — we tolerate
          const text = await response.text()
          throw new Error(`Error obteniendo carrito del servidor: ${response.status} ${text}`)
        }

        const serverCart = await response.json()
        // supports two forms: { cartItems: [...] } or directly an array
        const serverItems = Array.isArray(serverCart.cartItems) ? serverCart.cartItems : (Array.isArray(serverCart) ? serverCart : [])

        // 2) fetch products from the fake API to enrich info
        const productsRes = await fetch(`${import.meta.env.VITE_FAKESTORE_API}/products`)
        const products = await productsRes.json()

        // 3) create serverCartWithDetails (ensure id, title, price, quantity)
        const serverCartWithDetails = serverItems.map(item => {
          const product = Array.isArray(products) ? products.find(p => p.id === item.product_id) : undefined
          return {
            id: product?.id ?? item.product_id ?? item.id,
            title: product?.title ?? item.name ?? '',
            image: product?.image ?? '',
            description: product?.description ?? '',
            price: item.price ?? product?.price ?? 0,
            quantity: item.quantity ?? 1,
            rating: product?.rating?.rate ?? 0,
            category: product?.category ?? ''
          }
        })

        // 4) get local cart (guest)
        const localCart = JSON.parse(localStorage.getItem('cart')) || []

        // 5) merge
        const mergedCart = (localCart.length > 0) ? mergeCarts(localCart, serverCartWithDetails) : serverCartWithDetails

        // 6) update LOCAL state at once
        dispatch({ type: 'REPLACE_CART', payload: mergedCart })

        // 7) upload merged cart to backend,
        // normalize payload to { items: [{ productId, quantity, price }] }
        const payloadItems = mergedCart.map(i => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price
        }))

        // We only upload if there are items to save (and if the backend needs it)
        if (payloadItems.length > 0) {
          const putRes = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ items: payloadItems })
          })
          if (!putRes.ok) {
            const txt = await putRes.text()
            console.warn('PUT /cart responded:', putRes.status, txt)
          }
        }

        // 8) clean up localStorage now that it's synced
        localStorage.removeItem('cart')
      } catch (err) {
        console.error('Error sincronizando carrito tras login:', err)
      }
    }

    if (!prevUserRef.current && user) {
      syncCartAfterLogin()
    }
    prevUserRef.current = user
  }, [user])

  // Calculate totals when items change
  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTALS' })
  }, [state.items])

  // Save to localStorage when items change
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(state.items))
    }
  }, [state.items, user])

  const addItem = (product) => {
    const existingItem = state.items.find((item) => item.id === product.id)
    if (existingItem) return
    dispatch({ type: 'ADD_ITEM', payload: product })
    // Synchronize with the server
    if (user) fetchCartFromServer(product)
  }

  const removeItem = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
    // Synchronize with the server
    if (user) fetchRemoveFromServer(productId)
  }

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
    // Synchronize with the server
    if (user) fetchUpdateQuantityOnServer(productId, quantity)
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    // Synchronize with the server
    if (user) fetchClearCartOnServer()
  }

  const clearLocalCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    localStorage.removeItem('cart')
  }

  const isInCart = (productId) => {
    return state.items.some((item) => item.id === productId)
  }

  const getItemQuantity = (productId) => {
    const item = state.items.find((item) => item.id === productId)
    return item ? item.quantity : 0
  }

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    clearLocalCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart () {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
