export const handleChange = (e, setFormData) => {
  const { name, value } = e.target
  setFormData((prev) => ({
    ...prev,
    [name]: value
  }))
}
export const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ''
  const parts = []

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }

  if (parts.length) {
    return parts.join(' ')
  } else {
    return v
  }
}

export const formatExpiryDate = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  if (v.length >= 2) {
    return v.substring(0, 2) + '/' + v.substring(2, 4)
  }
  return v
}

export const handleCardNumberChange = ({ e, setFormData, formatCardNumber }) => {
  const formatted = formatCardNumber(e.target.value)
  setFormData((prev) => ({
    ...prev,
    cardNumber: formatted
  }))
}

export const handleExpiryDateChange = ({ e, setFormData, formatExpiryDate }) => {
  const formatted = formatExpiryDate(e.target.value)
  setFormData((prev) => ({
    ...prev,
    expiryDate: formatted
  }))
}

export const simulatePayment = async () => {
// Simulate payment processing
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate payment success (90% probability)
      const success = Math.random() > 0.1
      resolve(success)
    }, 2000)
  })
}

export const handleSubmit = async ({ e, setIsLoading, setError, items, setSuccess, clearCart, navigate, total, formData }) => {
  e.preventDefault()
  setIsLoading(true)
  setError('')

  try {
    // Simulate payment processing
    const paymentSuccess = await simulatePayment()

    if (!paymentSuccess) {
      throw new Error('Error en el procesamiento del pago. Intenta de nuevo.')
    }

    const orderData = {
      items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        product_title: item.title,
        product_image: item.image
      })),
      total,
      shipping_address: formData.shippingAddress,
      payment_method: formData.paymentMethod
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(orderData)
    })

    const data = await response.json()

    if (response.ok) {
      setSuccess(true)
      clearCart()
      setTimeout(() => {
        navigate('/profile')
      }, 4000)
    } else {
      throw new Error(data.message || 'Error al crear la orden')
    }
  } catch (err) {
    setError(err.message)
  } finally {
    setIsLoading(false)
  }
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Calculate additional cart costs (shipping, taxes, and final total).
export const calculateCartTotals = (total) => {
  const shipping = 9.99
  const tax = total * 0.08
  const finalTotal = total + shipping + tax

  return { shipping, tax, finalTotal }
}

export const successMessage = (navigate) => {
  return (
    <div className='checkout-page'>
      <div className='container'>
        <div className='success-container'>
          <div className='success-icon'>
            <svg width='64' height='64' viewBox='0 0 24 24' fill='none'>
              <path
                d='M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4905 2.02168 11.3363C2.16356 9.18203 2.99721 7.13214 4.39828 5.49883C5.79935 3.86553 7.69279 2.72636 9.79619 2.24223C11.8996 1.75809 14.1003 1.95185 16.07 2.79'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M22 4L12 14.01L9 11.01'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <h1>¡Pedido Realizado con Éxito!</h1>
          <p>Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación en breve.</p>
          <p className='redirect-message'>Serás redirigido a tu perfil en unos segundos...</p>
          <button className='btn btn-primary' onClick={() => navigate('/profile')}>
            Ver Mis Pedidos
          </button>
        </div>
      </div>
    </div>
  )
}
