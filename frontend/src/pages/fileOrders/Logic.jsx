// 🔹 Format date to Spanish
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 🔹 Format price to currency format
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// 🔹 Order status colors
export const getStatusColor = (status) => {
  const colors = {
    pending: 'var(--warning-color)',
    processing: 'var(--primary-color)',
    shipped: 'var(--secondary-color)',
    delivered: 'var(--success-color)',
    cancelled: 'var(--error-color)'
  }
  return colors[status] || 'var(--muted-text)'
}

// 🔹 Order status text
export const getStatusText = (status) => {
  const texts = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }
  return texts[status] || status
}

// 🔹 Payment status text
export const getPaymentStatusText = (status) => {
  const texts = {
    pending: 'Pendiente',
    completed: 'Completado',
    failed: 'Fallido'
  }
  return texts[status] || status
}

// 🔹 Payment status colors
export const getPaymentStatusColor = (status) => {
  const colors = {
    pending: 'var(--warning-color)',
    completed: 'var(--success-color)',
    failed: 'var(--error-color)'
  }
  return colors[status] || 'var(--muted-text)'
}

// 🔹 Function to get orders from the backend
export const fetchOrders = async ({ setLoading, setError, setOrders }) => {
  try {
    setLoading(true)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      method: 'GET',
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      setOrders(data.orders || [])
    } else {
      throw new Error('Error al cargar los pedidos')
    }
  } catch (err) {
    setError(err.message)
    console.error('Error fetching orders:', err)
  } finally {
    setLoading(false)
  }
}

// 🔹 Function to cancel an order
export const cancelOrder = async ({ orderId }) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al cancelar la orden')
    }
  } catch (err) {
    console.error('Error cancelling order:', err)
  }
}
