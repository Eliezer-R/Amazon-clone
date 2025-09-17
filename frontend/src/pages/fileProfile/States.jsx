import { useState } from 'react'

export const useEditFormStates = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  })

  return {
    isEditing,
    setIsEditing,
    isLoading,
    setIsLoading,
    formData,
    setFormData
  }
}

export const useOrders = () => {
  const [message, setMessage] = useState('')
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  return {
    message,
    setMessage,
    orders,
    setOrders,
    loadingOrders,
    setLoadingOrders
  }
}
