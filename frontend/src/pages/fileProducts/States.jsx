import { useState } from 'react'

export const useStatesProducts = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])

  return { products, setProducts, filteredProducts, setFilteredProducts, categories, setCategories }
}

export const useStatesFilters = () => {
  const [sortBy, setSortBy] = useState('default')
  const [priceRange, setPriceRange] = useState(['', ''])
  const [selectedCategory, setSelectedCategory] = useState('all')

  return { sortBy, setSortBy, priceRange, setPriceRange, selectedCategory, setSelectedCategory }
}

export const useStatesLoading = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  return { loading, setLoading, error, setError }
}
