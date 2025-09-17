import { useState } from 'react'

export const useStatesOrders = () => {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)

  return { orders, setOrders, selectedOrder, setSelectedOrder }
}

export const useStatesLoading = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  return { loading, setLoading, error, setError }
}
