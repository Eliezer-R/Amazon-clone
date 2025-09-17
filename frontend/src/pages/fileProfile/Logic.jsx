// ✅ Get the orders of the user
export const fetchOrders = async (setLoadingOrders, setOrders) => {
  try {
    setLoadingOrders(true)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      setOrders(data.orders || [])
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    setLoadingOrders(false)
  }
}

// ✅ Handle form changes
export const handleChange = (e, setFormData) => {
  const { name, value } = e.target
  setFormData((prev) => ({
    ...prev,
    [name]: value
  }))
}

// ✅ Delete message with timeout
export const timeMessage = (setMessage) => {
  setTimeout(() => {
    setMessage('')
  }, 5000)
}

// ✅ Handle form submission
export const handleSubmit = async ({
  e,
  formData,
  setIsLoading,
  setMessage,
  setIsEditing,
  setUser
}) => {
  e.preventDefault()
  setIsLoading(true)
  setMessage('')

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    })

    const data = await response.json()

    if (response.ok) {
      setMessage('Perfil actualizado exitosamente')
      timeMessage(setMessage)
      setIsEditing(false)
      setUser(data.user)
    } else {
      setMessage(data.message || 'Error al actualizar el perfil')
    }
  } catch (error) {
    setMessage('Error de conexión. Intenta de nuevo.')
  } finally {
    setIsLoading(false)
  }
}

// ✅ Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ✅ Format price
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// ✅ Get color by state
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

// ✅ Get text by status
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
