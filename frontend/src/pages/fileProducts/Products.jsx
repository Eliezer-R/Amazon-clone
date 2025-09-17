import { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useStatesProducts, useStatesFilters, useStatesLoading } from './States'
import { fetchProducts, fetchCategories, filterAndSortProducts, clearFilters, handleSortChange, handleCategoryChange, handlePriceRangeChange, getCategoryName, getPageTitle } from './Logic'

import { SearchIcon, ShippingIcon, WarrantyIcon, SupportIcon } from './ProductsIcons'
import './Products.css'

function Products () {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const searchQuery = searchParams.get('search')
  const { products, setProducts, filteredProducts, setFilteredProducts, categories, setCategories } = useStatesProducts()
  const { loading, setLoading, error, setError } = useStatesLoading()
  const { sortBy, setSortBy, priceRange, setPriceRange, selectedCategory, setSelectedCategory } = useStatesFilters()
  const filters = {
    products,
    searchQuery,
    setFilteredProducts,
    selectedCategory,
    priceRange,
    sortBy
  }

  // 🛒 Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts({ setLoading, setProducts, setError })
    fetchCategories(setCategories)
  }, [])

  // 🔄 Re-filter and sort products whenever filters change
  useEffect(() => {
    filterAndSortProducts(filters)
  }, [products, sortBy, priceRange, selectedCategory, searchQuery, category])

  // 🔄 Update selected category when URL param changes
  useEffect(() => {
    setSelectedCategory(category || 'all')
    setSortBy('default')
    setPriceRange(['', ''])
  }, [category])

  if (loading) {
    return <LoadingSpinner text='Cargando productos...' />
  }

  if (error) {
    return (
      <div className='error-container'>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => fetchProducts({ setLoading, setProducts, setError })} className='btn btn-primary'>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className='products-page'>
      <div className='container'>
        <div className='products-header'>
          <div className='page-title'>
            <h1>{getPageTitle(searchQuery, category)}</h1>
            <p>{filteredProducts.length} productos encontrados</p>
          </div>

          <div className='products-controls'>
            <select value={sortBy} onChange={(e) => handleSortChange(e, setSortBy)} className='sort-select'>
              <option value='default'>Ordenar por</option>
              <option value='price-low'>Precio: Menor a Mayor</option>
              <option value='price-high'>Precio: Mayor a Menor</option>
              <option value='rating'>Mejor Valorados</option>
              <option value='name'>Nombre A-Z</option>
            </select>
          </div>
        </div>

        <div className='products-content'>
          {/* Filtros laterales */}
          <aside className='filters-sidebar'>
            <div className='filters-header'>
              <h3>Filtros</h3>
              <button onClick={() => clearFilters({ setSortBy, setPriceRange, setSelectedCategory, navigate })} className='clear-filters'>
                Limpiar filtros
              </button>
            </div>

            {!category && (
              <div className='filter-section'>
                <h4>Categoría</h4>
                <div className='category-filters'>
                  <label className='filter-option'>
                    <input
                      type='radio'
                      name='category'
                      value='all'
                      checked={selectedCategory === 'all' || !selectedCategory}
                      onChange={() => handleCategoryChange({ newCategory: 'all', setSelectedCategory, navigate })}
                    />
                    <span>Todas las categorías</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat} className='filter-option'>
                      <input
                        type='radio'
                        name='category'
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={() => handleCategoryChange({ newCategory: cat, setSelectedCategory, navigate })}
                      />
                      <span>{getCategoryName(cat)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className='filter-section'>
              <h4>Rango de Precio</h4>
              <div className='price-range'>
                <div className='price-inputs'>
                  <input
                    type='number'
                    name='min'
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(e, setPriceRange)}
                    placeholder='Mín'
                    className='price-input'
                    min='0'
                  />
                  <span>-</span>
                  <input
                    type='number'
                    name='max'
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(e, setPriceRange)}
                    placeholder='Máx'
                    className='price-input'
                    min='0'
                  />
                </div>
                <div className='price-range-display'>
                  ${priceRange[0] || 0} - ${priceRange[1] || 0}
                </div>
              </div>
            </div>

            <div className='filter-section'>
              <h4>Información</h4>
              <div className='info-items'>
                <div className='info-item'>
                  {ShippingIcon}
                  <span>Envío gratis</span>
                </div>
                <div className='info-item'>
                  {WarrantyIcon}
                  <span>Garantía incluida</span>
                </div>
                <div className='info-item'>
                  {SupportIcon}
                  <span>Soporte 24/7</span>
                </div>
              </div>
            </div>
          </aside>

          <main className='products-grid-container'>
            {filteredProducts.length === 0
              ? (
                <div className='no-products'>
                  {SearchIcon}
                  <h3>No se encontraron productos</h3>
                  <p>Intenta ajustar los filtros o buscar algo diferente</p>
                  <button onClick={() => clearFilters({ setSortBy, setPriceRange, setSelectedCategory, navigate })} className='btn btn-primary'>
                    Limpiar filtros
                  </button>
                </div>
                )
              : (
                <div className='products-grid'>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Products
