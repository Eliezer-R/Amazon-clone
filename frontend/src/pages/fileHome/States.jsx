import { useState } from 'react'

export const useStatesHome = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [imgByCategorys, setImgByCategorys] = useState([])

  return {
    featuredProducts,
    setFeaturedProducts,
    categories,
    setCategories,
    imgByCategorys,
    setImgByCategorys
  }
}

export const useStatesLoadingError = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  return {
    loading,
    setLoading,
    error,
    setError
  }
}
