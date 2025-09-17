import { StarFilledIcon, StarHalfIcon, StarEmptyIcon } from './ProductDetailIcons'

// Function to get products from the API
export const fetchProducts = async (id, setProduct, setRelatedProducts, setLoading, setError) => {
  try {
    setLoading(true)

    const response = await fetch(`${import.meta.env.VITE_FAKESTORE_API}/products`)
    const data = await response.json()

    // Search for the current product by the id received as a parameter
    const filterIdProduct = data.find((elem) => elem.id === Number(id))
    setProduct(filterIdProduct)

    // Filter products from the same category excluding the current one
    // and take only the first 3 as related products
    const filterFourProducts = data.filter(
      (elem) => elem.category === filterIdProduct.category && elem.id !== filterIdProduct.id
    ).slice(0, 3)
    setRelatedProducts(filterFourProducts)
  } catch (error) {
    setError('No se pudo cargar el producto')
  } finally {
    setLoading(false)
  }
}

// Function to format prices in currency format
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Function to generate rating stars based on the score
export const getRatingStars = (rating) => {
  const stars = []
  const fullStars = Math.floor(rating) // Full stars
  const hasHalfStar = rating % 1 !== 0 // If there is half a star

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarFilledIcon key={i} index={i} />)
  }

  // Add half stars if necessary
  if (hasHalfStar) {
    stars.push(<StarHalfIcon key='half' />)
  }

  // Calculate and add empty stars
  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<StarEmptyIcon key={`empty-${i}`} index={i} />)
  }

  return stars
}

// Function to translate category names into Spanish
export const getCategoryName = (category) => {
  const names = {
    electronics: 'Electrónicos',
    jewelery: 'Joyería',
    "men's clothing": 'Ropa para Hombre',
    "women's clothing": 'Ropa para Mujer'
  }
  return names[category] || category
}

// Function to handle adding products to the cart
export const handleAddToCart = (product, quantity, addItem) => {
  addItem({ ...product, quantity })
}

// Function to handle immediate purchase
export const handleBuyNow = (product, quantity, addItem, navigate) => {
  // First add to cart
  handleAddToCart(product, quantity, addItem)
  // Then navigate to the cart page
  navigate('/cart')
}
