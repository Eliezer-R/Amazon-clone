import { Link } from 'react-router-dom'

// Formats a number to a dollar (USD) price format using Spanish (es-ES) style.
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Handles changes to the cart quantity.
// If the new quantity is 0, delete the product.
// If it's greater than 0, update the product's quantity in the cart.
export const handleQuantityChange = (productId, newQuantity, removeItem, updateQuantity) => {
  if (newQuantity === 0) {
    removeItem(productId)
  } else {
    updateQuantity(productId, newQuantity)
  }
}

// Handles the checkout process.
// If the user is NOT logged in, redirects them to /login and saves the origin path.
// If they are already logged in, takes them directly to /checkout.
export const handleCheckout = (user, navigate) => {
  if (!user) {
    navigate('/login', { state: { from: { pathname: '/checkout' } } })
  } else {
    navigate('/checkout')
  }
}

// Calculate additional cart costs (shipping, taxes, and final total).
export const calculateCartTotals = (items, total) => {
  const shipping = items.length > 0 ? 9.99 : 0
  const tax = total * 0.08
  const finalTotal = total + shipping + tax

  return { shipping, tax, finalTotal }
}

export function cartIsEmpty () {
  return (
    <div className='cart-page'>
      <div className='container'>
        <div className='empty-cart'>
          <div className='empty-cart-icon'>
            <svg width='120' height='120' viewBox='0 0 24 24' fill='none'>
              <path
                d='M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13H7'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <h2>Tu carrito está vacío</h2>
          <p>¡Agrega algunos productos increíbles a tu carrito y comienza a comprar!</p>
          <div className='empty-cart-actions'>
            <Link to='/products' className='btn btn-primary btn-large'>
              Explorar productos
            </Link>
            <Link to='/' className='btn btn-outline btn-large'>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
