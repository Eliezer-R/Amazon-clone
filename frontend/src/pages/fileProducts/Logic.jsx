// 📦 Fetch all products from the API and store them in state
export const fetchProducts = async ({ setLoading, setProducts, setError }) => {
  try {
    setLoading(true)
    const url = `${import.meta.env.VITE_FAKESTORE_API}/products`

    const response = await fetch(url)
    const data = await response.json()
    setProducts(data)
  } catch (err) {
    setError('Error loading products')
    console.error('Error fetching products:', err)
  } finally {
    setLoading(false)
  }
}

// 📂 Fetch all available categories from the API
export const fetchCategories = async (setCategories) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_FAKESTORE_API}/products/categories`)
    const data = await response.json()
    setCategories(data)
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

// 🔄 Reset all filters and navigate back to the products page
export const clearFilters = ({ setSortBy, setPriceRange, setSelectedCategory, navigate }) => {
  setSortBy('default')
  setPriceRange(['', ''])
  setSelectedCategory('all')
  navigate('/products')
}

// 🧹 Filter and sort products based on search query, category, price range, and sorting option
export const filterAndSortProducts = (filters) => {
  const { products, searchQuery, setFilteredProducts, selectedCategory, priceRange, sortBy } = filters

  let filtered = [...products]

  // 🔍 Filter by search query (title, description, or category)
  if (searchQuery) {
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredProducts(filtered)
    return
  }

  // 🏷️ Filter by category
  if (selectedCategory !== 'all') {
    filtered = filtered.filter((product) => product.category === selectedCategory)
  } else {
    filtered = products
  }

  // 💰 Filter by price range
  filtered = filtered.filter((product) => {
    const min = Number(priceRange[0])
    const max = Number(priceRange[1])
    return (
      (priceRange[0] === '' || product.price >= min) &&
      (priceRange[1] === '' || product.price <= max)
    )
  })

  // 📊 Sort products by selected option
  switch (sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      filtered.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
      break
    case 'name':
      filtered.sort((a, b) => a.title.localeCompare(b.title))
      break
    default:
      // Keep original order
      break
  }

  setFilteredProducts(filtered)
}

// 📊 Handle change of sorting option (price, rating, name, etc.)
export const handleSortChange = (e, setSortBy) => {
  setSortBy(e.target.value)
}

// 🏷️ Handle category change and navigate to the appropriate category page
export const handleCategoryChange = ({ newCategory, setSelectedCategory, navigate }) => {
  setSelectedCategory(newCategory)
  navigate(newCategory === 'all' ? '/products' : `/products/${newCategory}`)
}

// 💰 Handle changes in price range (min and max inputs)
export const handlePriceRangeChange = (e, setPriceRange) => {
  const { name, value } = e.target
  setPriceRange((prev) => {
    if (name === 'min') {
      return [value, prev[1]]
    } else {
      return [prev[0], value]
    }
  })
}

// 🌎 Translate category names from English to Spanish
export const getCategoryName = (cat) => {
  const names = {
    electronics: 'Electronics',
    jewelery: 'Jewelry',
    "men's clothing": "Men's Clothing",
    "women's clothing": "Women's Clothing"
  }
  return names[cat] || cat
}

// 📝 Generate a dynamic page title based on search query or category
export const getPageTitle = (searchQuery, category) => {
  if (searchQuery) {
    return `Results for "${searchQuery}"`
  }
  if (category) {
    return getCategoryName(category)
  }
  return 'All Products'
}
