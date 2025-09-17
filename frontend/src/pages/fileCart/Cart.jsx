import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartC/CartContext'
import { useAuth } from '../../context/AuthContext'
import { formatPrice, handleCheckout, handleQuantityChange, calculateCartTotals, cartIsEmpty } from './Logic'
import {
  TrashIcon,
  RemoveIcon,
  SecureIcon,
  GuaranteeIcon,
  FastShippingIcon, 
  BackIcon
} from './CartIcons'
import './Cart.css'

function Cart () {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart()
  const { user } = useAuth()
  const { shipping, tax, finalTotal } = calculateCartTotals(items, total)
  const navigate = useNavigate()

  if (items.length === 0) return cartIsEmpty()

  return (
    <div className='cart-page'>
      <div className='container'>
        <div className='cart-header'>
          <h1>Carrito de Compras</h1>
          <p>
            {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className='cart-content'>
          <div className='cart-items-section'>
            <div className='cart-actions-header'>
              <button onClick={clearCart} className='clear-cart-btn'>
                {TrashIcon}
                Vaciar carrito
              </button>
            </div>

            <div className='cart-items'>
              {items.map((item) => (
                <div key={item.id} className='cart-item'>
                  <div className='item-image'>
                    <Link to={`/product/${item.id}`}>
                      <img src={item.image || '/placeholder.svg'} alt={item.title} />
                    </Link>
                  </div>

                  <div className='item-details'>
                    <Link to={`/product/${item.id}`} className='item-title'>
                      {item.title}
                    </Link>
                    <p className='item-category'>{item.category}</p>
                    <div className='item-price'>
                      <span className='current-price'>{formatPrice(item.price)}</span>
                    </div>
                  </div>

                  <div className='item-controls'>
                    <div className='quantity-controls'>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1, removeItem, updateQuantity)}
                        className='quantity-btn'
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className='quantity-display'>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1, removeItem, updateQuantity)}
                        className='quantity-btn'
                      >
                        +
                      </button>
                    </div>

                    <div className='item-total'>{formatPrice(item.price * item.quantity)}</div>

                    <button onClick={() => removeItem(item.id)} className='remove-btn' aria-label='Eliminar producto'>
                      {RemoveIcon}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className='continue-shopping'>
              <Link to='/products' className='btn btn-outline'>
                {BackIcon}
                Continuar comprando
              </Link>
            </div>
          </div>

          <div className='cart-summary'>
            <div className='summary-card'>
              <h3>Resumen del pedido</h3>

              <div className='summary-details'>
                <div className='summary-row'>
                  <span>
                    Subtotal ({items.length} {items.length === 1 ? 'producto' : 'productos'}):
                  </span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className='summary-row'>
                  <span>Envío:</span>
                  <span>{shipping > 0 ? formatPrice(shipping) : 'Gratis'}</span>
                </div>
                <div className='summary-row'>
                  <span>Impuestos estimados:</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className='summary-row total-row'>
                  <span>Total:</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <button onClick={() => handleCheckout(user, navigate)} className='btn btn-primary btn-full checkout-btn'>
                {user ? 'Proceder al pago' : 'Iniciar sesión para continuar'}
              </button>

              {!user && (
                <p className='login-note'>
                  ¿Ya tienes cuenta? <Link to='/login'>Inicia sesión</Link>
                </p>
              )}

              <div className='security-badges'>
                <div className='security-item'>
                  {SecureIcon}
                  <span>Pago seguro</span>
                </div>
                <div className='security-item'>
                  {GuaranteeIcon}
                  <span>Garantía de devolución</span>
                </div>
                <div className='security-item'>
                  {FastShippingIcon}
                  <span>Envío rápido</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
