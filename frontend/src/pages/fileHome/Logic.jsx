export const fetchHomeData = async ({ setLoading, setCategories, setImgByCategorys, setFeaturedProducts, setError }) => {
  try {
    setLoading(true)

    // Get featured products (first 8)
    const productsResponse = await fetch(`${import.meta.env.VITE_FAKESTORE_API}/products`)
    const products = await productsResponse.json()

    // Get categories
    const Categories = () => {
      const categories = []
      // Get image by category
      const img = {}
      products.forEach((product) => {
        if (!categories.includes(product.category)) {
          categories.push(product.category)
          img[product.category] = product.image
        }
      })
      setCategories(() => categories)
      setImgByCategorys(img)
    }

    Categories()

    // Get featured products (first 8)
    setFeaturedProducts(products.slice(0, 8))
  } catch (err) {
    setError('Error al cargar los datos')
    console.error('Error fetching home data:', err)
  } finally {
    setLoading(false)
  }
}

export const upperCaseCategory = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1)
}
