import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useStatesHome, useStatesLoadingError } from './States'
import { fetchHomeData, upperCaseCategory } from './Logic'
import {
  FastShippingIcon,
  GuaranteeIcon,
  SupportIcon,
  EasyReturnIcon
} from './HomeIcons'
import './Home.css'
import ShoppingDesign from './Desagin'

function Home () {
  const {
    featuredProducts,
    setFeaturedProducts,
    categories,
    setCategories,
    imgByCategorys,
    setImgByCategorys
  } = useStatesHome()
  const {
    loading,
    setLoading,
    error,
    setError
  } = useStatesLoadingError()

  // Fetch data on component mount
  useEffect(() => {
    fetchHomeData({ setLoading, setCategories, setImgByCategorys, setFeaturedProducts, setError })
  }, [])

  if (loading) return <LoadingSpinner text='Cargando página principal...' />

  if (error) {
    return (
      <div className='error-container'>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchHomeData} className='btn btn-primary'>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className='home'>

      <section className='hero'>
        <div className='hero-content'>
          <div className='hero-text'>
            <h1 className='hero-title'>
              Descubre productos increíbles
              <span className='gradient-text'> a precios únicos</span>
            </h1>
            <p className='hero-description'>
              Miles de productos de las mejores marcas, con envío rápido y garantía de calidad. Tu tienda online de
              confianza.
            </p>
            <div className='hero-actions'>
              <Link to='/products' className='btn btn-primary btn-large'>
                Explorar productos
              </Link>
              <Link to='/products/electronics' className='btn btn-outline btn-large'>
                Ver ofertas
              </Link>
            </div>
          </div>         
            <ShoppingDesign />
          
        </div>
      </section>

      <section className='categories-section'>
        <div className='container'>
          <div className='section-header'>
            <h2 className='section-title'>Compra por categoría</h2>
            <p className='section-description'>
              Encuentra exactamente lo que buscas en nuestras categorías especializadas
            </p>
          </div>

          <div className='categories-grid'>
            {categories.map((category) => (
              <Link key={category} to={`/products/${category}`} className='category-card'>
                <div className='category-image'>
                  <img
                    src={imgByCategorys[category]}
                    alt={category}
                    loading='lazy'
                  />
                </div>
                <div className='category-info'>
                  <h3>{upperCaseCategory(category)}</h3>
                  <span className='category-link-text'>Ver productos</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className='featured-section'>
        <div className='container'>
          <div className='section-header'>
            <h2 className='section-title'>Productos destacados</h2>
            <p className='section-description'>Los productos más populares y mejor valorados por nuestros clientes</p>
          </div>

          <div className='products-grid'>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className='section-footer'>
            <Link to='/products' className='btn btn-outline btn-large'>
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>

      <section className='features-section'>
        <div className='container'>
          <div className='features-grid'>
            <div className='feature-card'>
              <div className='feature-icon'>{FastShippingIcon}</div>
              <h3>Envío rápido</h3>
              <p>Recibe tus productos en 24-48 horas con nuestro servicio de envío express</p>
            </div>

            <div className='feature-card'>
              <div className='feature-icon'>{GuaranteeIcon}</div>
              <h3>Garantía de calidad</h3>
              <p>Todos nuestros productos cuentan con garantía y certificación de calidad</p>
            </div>

            <div className='feature-card'>
              <div className='feature-icon'>{SupportIcon}</div>
              <h3>Soporte 24/7</h3>
              <p>Nuestro equipo de atención al cliente está disponible las 24 horas del día</p>
            </div>

            <div className='feature-card'>
              <div className='feature-icon'>{EasyReturnIcon}</div>
              <h3>Devoluciones fáciles</h3>
              <p>30 días para devolver cualquier producto sin preguntas, reembolso completo</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
