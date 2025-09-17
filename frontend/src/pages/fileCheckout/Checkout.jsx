import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartC/CartContext'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useStatesLoading, useStatesData } from './States'
import {
  CreditCardIcon,
  PaypalIcon,
  SecureIcon,
  GuaranteeIcon
} from './CheckoutIcons'

import {
  handleChange,
  handleSubmit,
  formatExpiryDate,
  handleExpiryDateChange,
  successMessage,
  calculateCartTotals,
  formatPrice,
  formatCardNumber,
  handleCardNumberChange
} from './Logic'

import './Checkout.css'

function Checkout () {
  const { user } = useAuth()
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const { isLoading, setIsLoading, error, setError } = useStatesLoading()
  const { success, setSuccess, formData, setFormData } = useStatesData()
  const { shipping, tax, finalTotal } = calculateCartTotals(total)

  // Redirect to cart if there are no items
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
    }
  }, [items, navigate])

  // Prefill shipping address if the user has one
  useEffect(() => {
    if (user?.address) {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: user.address
      }))
    }
  }, [user])

  // Show success message upon completing the purchase
  if (success) return successMessage(navigate)

  return (
    <div className='checkout-page'>
      <div className='container'>
        <div className='checkout-header'>
          <h1>Finalizar Compra</h1>
          <p>Revisa tu pedido y completa la información de pago</p>
        </div>

        <div className='checkout-content'>
          <div className='checkout-form-section'>
            <form onSubmit={(e) => handleSubmit({ e, setIsLoading, setError, items, setSuccess, clearCart, navigate, formData, total })} className='checkout-form'>
              {error && <div className='error-message'>{error}</div>}

              {/* Dirección de envío */}
              <div className='form-section'>
                <h3>Dirección de Envío</h3>
                <div className='form-group'>
                  <label htmlFor='shippingAddress' className='form-label'>
                    Dirección completa *
                  </label>
                  <textarea
                    id='shippingAddress'
                    name='shippingAddress'
                    value={formData.shippingAddress}
                    onChange={(e) => handleChange(e, setFormData)}
                    className='form-input form-textarea'
                    rows='3'
                    placeholder='Calle, número, ciudad, código postal, país'
                    required
                  />
                </div>
              </div>

              <div className='form-section'>
                <h3>Metodo de Pago</h3>
                <div className='payment-methods'>
                  <label className='payment-method'>
                    <input
                      type='radio'
                      name='paymentMethod'
                      value='credit_card'
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={(e) => handleChange(e, setFormData)}
                    />
                    <div className='payment-method-content'>
                      {CreditCardIcon}
                      <span>Tarjeta de Crédito/Débito</span>
                    </div>
                  </label>

                  <label className='payment-method'>
                    <input
                      type='radio'
                      name='paymentMethod'
                      value='paypal'
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={(e) => handleChange(e, setFormData)}
                    />
                    <div className='payment-method-content'>
                      {PaypalIcon}
                      <span>PayPal</span>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'credit_card' && (
                  <div className='card-details'>
                    <div className='form-row'>
                      <div className='form-group'>
                        <label htmlFor='cardNumber' className='form-label'>
                          Número de tarjeta *
                        </label>
                        <input
                          type='text'
                          id='cardNumber'
                          name='cardNumber'
                          value={formData.cardNumber}
                          onChange={(e) => handleCardNumberChange({ e, setFormData, formatCardNumber })}
                          className='form-input'
                          placeholder='1234 5678 9012 3456'
                          maxLength='19'
                          required
                        />
                      </div>

                      <div className='form-group'>
                        <label htmlFor='cardName' className='form-label'>
                          Nombre en la tarjeta *
                        </label>
                        <input
                          type='text'
                          id='cardName'
                          name='cardName'
                          value={formData.cardName}
                          onChange={(e) => handleChange(e, setFormData)}
                          className='form-input'
                          placeholder='Juan Pérez'
                          required
                        />
                      </div>
                    </div>

                    <div className='form-row'>
                      <div className='form-group'>
                        <label htmlFor='expiryDate' className='form-label'>
                          Fecha de vencimiento *
                        </label>
                        <input
                          type='text'
                          id='expiryDate'
                          name='expiryDate'
                          value={formData.expiryDate}
                          onChange={(e) => handleExpiryDateChange({ e, setFormData, formatExpiryDate })}
                          className='form-input'
                          placeholder='MM/AA'
                          maxLength='5'
                          required
                        />
                      </div>

                      <div className='form-group'>
                        <label htmlFor='cvv' className='form-label'>
                          CVV *
                        </label>
                        <input
                          type='text'
                          id='cvv'
                          name='cvv'
                          value={formData.cvv}
                          onChange={(e) => handleChange(e, setFormData)}
                          className='form-input'
                          placeholder='123'
                          maxLength='4'
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button type='submit' className='btn btn-primary btn-full checkout-btn' disabled={isLoading}>
                {isLoading
                  ? (
                    <>
                      <LoadingSpinner size='small' text='' />
                      Procesando Pago...
                    </>
                    )
                  : (
                  `Pagar ${formatPrice(finalTotal)}`
                    )}
              </button>
            </form>
          </div>

          <div className='order-summary'>
            <h3>Resumen del Pedido</h3>

            <div className='order-items'>
              {items.map((item) => (
                <div key={item.id} className='order-item'>
                  <img src={item.image || '/placeholder.svg'} alt={item.title} className='item-image' />
                  <div className='item-details'>
                    <h4>{item.title}</h4>
                    <span className='item-quantity'>Cantidad: {item.quantity}</span>
                    <span className='item-price'>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className='order-totals'>
              <div className='total-row'>
                <span>Subtotal:</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className='total-row'>
                <span>Envío:</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className='total-row'>
                <span>Impuestos:</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className='total-row total-final'>
                <span>Total:</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className='security-info'>
              <div className='security-item'>
                {SecureIcon}
                <span>Pago 100% seguro</span>
              </div>
              <div className='security-item'>
                {GuaranteeIcon}
                <span>Garantía de devolución</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
