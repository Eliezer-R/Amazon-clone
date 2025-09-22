export const fetchCartFromServer = async (product) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: product.id,
        quantity: product.quantity,
        price: product.price
      }),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al sincronizar el carrito con el servidor')
    }
  } catch (error) {
    console.error('Error al sincronizar el carrito:', error)
  }
}

export const fetchRemoveFromServer = async (productId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${productId}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al eliminar el item del carrito en el servidor')
    }
  } catch (error) {
    console.error('Error al eliminar el item del carrito:', error)
  }
}

export const fetchUpdateQuantityOnServer = async (productId, quantity) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity }),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al actualizar la cantidad en el servidor')
    }
  } catch (error) {
    console.error('Error al actualizar la cantidad del carrito:', error)
  }
}

export const fetchClearCartOnServer = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/clear`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al limpiar el carrito en el servidor')
    }
  } catch (error) {
    console.error('Error al limpiar el carrito:', error)
  }
}
