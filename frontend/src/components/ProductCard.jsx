import { Link } from 'react-router-dom'
import { useCart } from '../context/CartC/CartContext'
import './ProductCard.css'

function ProductCard ({ product }) {
  const { addItem, isInCart, getItemQuantity } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ ...product, quantity: 1 })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const truncateTitle = (title, maxLength = 60) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title
  }

  const getRatingStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className='star filled' width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z' />
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key='half' className='star half' width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
          <defs>
            <linearGradient id='half-fill'>
              <stop offset='50%' stopColor='currentColor' />
              <stop offset='50%' stopColor='transparent' />
            </linearGradient>
          </defs>
          <path
            d='M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z'
            fill='url(#half-fill)'
          />
        </svg>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className='star empty'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
        >
          <path
            d='M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z'
            strokeWidth='2'
          />
        </svg>
      )
    }

    return stars
  }

  return (
    <div className='product-card'>
      <Link to={`/product/${product.id}`} className='product-link'>
        <div className='product-image-container'>
          <img src={product?.image || '/placeholder.svg'} alt={product.title} className='product-image' loading='lazy' />
          {product.rating && product.rating.rate >= 4.5 && (
            <div className='product-badge'>
              <span>Bestseller</span>
            </div>
          )}
        </div>

        <div className='product-info'>
          <h3 className='product-title'>{truncateTitle(product.title)}</h3>

          {product.rating && (
            <div className='product-rating'>
              <div className='rating-stars'>{getRatingStars(product.rating.rate)}</div>
              <span className='rating-count'>({product.rating.count})</span>
            </div>
          )}

          <div className='product-price'>
            <span className='current-price'>{formatPrice(product.price)}</span>
            {product.originalPrice && <span className='original-price'>{formatPrice(product.originalPrice)}</span>}
          </div>

          <p className='product-category'>{product.category}</p>
        </div>
      </Link>

      <div className='product-actions'>
        <button className={`add-to-cart-btn ${isInCart(product.id) ? 'in-cart' : ''}`} onClick={handleAddToCart}>
          {isInCart(product.id)
            ? (
              <>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M20 6L9 17L4 12'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                En carrito ({getItemQuantity(product.id)})
              </>
              )
            : (
              <>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13H7'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                Agregar al carrito
              </>
              )}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
