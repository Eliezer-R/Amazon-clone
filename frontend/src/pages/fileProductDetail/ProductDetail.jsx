import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartC/CartContext'
import LoadingSpinner from '../../components/LoadingSpinner'
import ProductCard from '../../components/ProductCard'
import './ProductDetail.css'
import { useDataStates, useUIStates } from './States'

import {
  fetchProducts,
  formatPrice,
  getRatingStars,
  getCategoryName,
  handleAddToCart,
  handleBuyNow
} from './Logic'

import {
  CheckIcon,
  CartIcon,
  ShippingIcon,
  WarrantyIcon,
  ReturnsIcon
} from './ProductDetailIcons'

function ProductDetail () {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, isInCart, getItemQuantity } = useCart()

  // States for data and error handling
  const {
    product,
    setProduct,
    relatedProducts,
    setRelatedProducts,
    loading,
    setLoading,
    error,
    setError
  } = useDataStates()

  // States for the user interface
  const {
    selectedImage,
    setSelectedImage,
    quantity,
    setQuantity,
    activeTab,
    setActiveTab
  } = useUIStates()

  // Effect to load data when the product ID changes
  useEffect(() => {
    fetchProducts(id, setProduct, setRelatedProducts, setLoading, setError)
  }, [id, setProduct, setRelatedProducts, setLoading, setError])

  if (loading) {
    return <LoadingSpinner text='Cargando producto...' />
  }

  if (error) {
    return (
      <div className='error-container'>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/products')} className='btn btn-primary'>
          Volver a productos
        </button>
      </div>
    )
  }

  // Show message if the product was not found
  if (!product) {
    return (
      <div className='error-container'>
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no existe o ha sido eliminado</p>
        <button onClick={() => navigate('/products')} className='btn btn-primary'>
          Volver a productos
        </button>
      </div>
    )
  }

  // Simulate multiple images (in a real case they would come from the API)
  const productImages = [product.image, product.image, product.image]

  return (
    <div className='product-detail-page'>
      <div className='container'>
        {/* Breadcrumb of navegation */}
        <nav className='breadcrumb'>
          <button onClick={() => navigate('/')} className='breadcrumb-link'>
            Inicio
          </button>
          <span className='breadcrumb-separator'>/</span>
          <button onClick={() => navigate('/products')} className='breadcrumb-link'>
            Productos
          </button>
          <span className='breadcrumb-separator'>/</span>
          <button onClick={() => navigate(`/products/${product.category}`)} className='breadcrumb-link'>
            {getCategoryName(product.category)}
          </button>
          <span className='breadcrumb-separator'>/</span>
          <span className='breadcrumb-current'>{product.title}</span>
        </nav>

        <div className='product-detail-content'>
          {/* imagen galery */}
          <div className='product-gallery'>
            <div className='gallery-thumbnails'>
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image || '/placeholder.svg'} alt={`${product.title} ${index + 1}`} />
                </button>
              ))}
            </div>
            <div className='gallery-main'>
              <img
                src={productImages[selectedImage] || '/placeholder.svg'}
                alt={product.title}
                className='main-image'
              />
              {product.rating && product.rating.rate >= 4.5 && (
                <div className='product-badge'>
                  <span>Bestseller</span>
                </div>
              )}
            </div>
          </div>

          <div className='product-info'>
            <div className='product-header'>
              <h1 className='product-title'>{product.title}</h1>
              <span className='product-category'>{getCategoryName(product.category)}</span>
            </div>

            {product.rating && (
              <div className='product-rating'>
                <div className='rating-stars'>{getRatingStars(product.rating.rate)}</div>
                <span className='rating-text'>
                  {product.rating.rate} ({product.rating.count} reseñas)
                </span>
              </div>
            )}

            <div className='product-price'>
              <span className='current-price'>{formatPrice(product.price)}</span>
              {product.originalPrice && <span className='original-price'>{formatPrice(product.originalPrice)}</span>}
            </div>

            <div className='product-actions'>
              <div className='quantity-selector'>
                <label htmlFor='quantity'>Cantidad:</label>
                <div className='quantity-controls'>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className='quantity-btn'>
                    -
                  </button>
                  <input
                    type='number'
                    id='quantity'
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className='quantity-input'
                    min='1'
                  />
                  <button onClick={() => setQuantity(quantity + 1)} className='quantity-btn'>
                    +
                  </button>
                </div>
              </div>

              <div className='action-buttons'>
                <button
                  onClick={() => handleAddToCart(product, quantity, addItem)}
                  className={`btn btn-outline add-to-cart ${isInCart(product.id) ? 'in-cart' : ''}`}
                >
                  {isInCart(product.id)
                    ? (
                      <>
                        <CheckIcon />
                        En carrito ({getItemQuantity(product.id)})
                      </>
                      )
                    : (
                      <>
                        <CartIcon />
                        Agregar al carrito
                      </>
                      )}
                </button>

                <button
                  onClick={() => handleBuyNow(product, quantity, addItem, navigate)}
                  className='btn btn-primary buy-now'
                >
                  Comprar ahora
                </button>
              </div>
            </div>

            <div className='product-features'>
              <div className='feature'>
                <ShippingIcon />
                <span>Envío gratis</span>
              </div>
              <div className='feature'>
                <WarrantyIcon />
                <span>Garantía de 1 año</span>
              </div>
              <div className='feature'>
                <ReturnsIcon />
                <span>Devoluciones fáciles</span>
              </div>
            </div>
          </div>
        </div>

        <div className='product-tabs'>
          <div className='tabs-header'>
            <button
              className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Descripción
            </button>
            <button
              className={`tab-button ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Especificaciones
            </button>
            <button
              className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reseñas ({product.rating?.count || 0})
            </button>
          </div>

          <div className='tabs-content'>
            {activeTab === 'description' && (
              <div className='tab-panel'>
                <h3>Descripción del producto</h3>
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className='tab-panel'>
                <h3>Especificaciones</h3>
                <div className='specifications'>
                  <div className='spec-item'>
                    <span className='spec-label'>Categoría:</span>
                    <span className='spec-value'>{getCategoryName(product.category)}</span>
                  </div>
                  <div className='spec-item'>
                    <span className='spec-label'>ID del producto:</span>
                    <span className='spec-value'>{product.id}</span>
                  </div>
                  <div className='spec-item'>
                    <span className='spec-label'>Disponibilidad:</span>
                    <span className='spec-value'>En stock</span>
                  </div>
                  {product.rating && (
                    <div className='spec-item'>
                      <span className='spec-label'>Valoración promedio:</span>
                      <span className='spec-value'>{product.rating.rate}/5</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className='tab-panel'>
                <h3>Reseñas de clientes</h3>
                {product.rating
                  ? (
                    <div className='reviews-summary'>
                      <div className='rating-overview'>
                        <div className='rating-score'>
                          <span className='score'>{product.rating.rate}</span>
                          <div className='rating-stars'>{getRatingStars(product.rating.rate)}</div>
                          <span className='rating-count'>Basado en {product.rating.count} reseñas</span>
                        </div>
                      </div>
                      <p className='reviews-note'>
                        Las reseñas detalladas estarían disponibles en una implementación completa.
                      </p>
                    </div>
                    )
                  : (
                    <p>No hay reseñas disponibles para este producto.</p>
                    )}
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className='related-products'>
            <h2>Productos relacionados</h2>
            <div className='related-products-grid'>
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
