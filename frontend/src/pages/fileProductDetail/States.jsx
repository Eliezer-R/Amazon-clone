import { useState } from 'react'

// States for data loading and error handling
export const useDataStates = () => {
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  return {
    product,
    setProduct,
    relatedProducts,
    setRelatedProducts,
    loading,
    setLoading,
    error,
    setError
  }
}

// States for the user interface
export const useUIStates = () => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  return {
    selectedImage,
    setSelectedImage,
    quantity,
    setQuantity,
    activeTab,
    setActiveTab
  }
}
