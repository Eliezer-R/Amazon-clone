import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartC/CartContext'
import './Header.css'

function Header () {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useAuth()
  const { itemCount, clearLocalCart } = useCart()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = async () => {
    await logout()
    clearLocalCart() // Clear local cart on logout
    navigate('/')
  }

  const categories = [
    { name: 'Electrónicos', path: '/products/electronics' },
    { name: 'Joyería', path: '/products/jewelery' },
    { name: 'Ropa Hombre', path: "/products/men's clothing" },
    { name: 'Ropa Mujer', path: "/products/women's clothing" }
  ]

  return (
    <header className='header'>
      <div className='header-top'>
        <div className='container'>
          <div className='header-content'>

            <Link to='/' className='logo'>
              <span className='logo-text'>AmazonClone</span>
            </Link>

            <form className='search-form' onSubmit={handleSearch}>
              <input
                type='text'
                placeholder='Buscar productos...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-input'
              />
              <button type='submit' className='search-btn'>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
            </form>

            <nav className='header-nav'>
              {user
                ? (
                  <div className='user-menu'>
                    <button className='user-btn' onClick={() => setIsMenuOpen(!isMenuOpen)}>
                      <span>Hola, {user.name}</span>
                      <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                        <path
                          d='M6 9L12 15L18 9'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>

                    {isMenuOpen && (
                      <div className='dropdown-menu'>
                        <Link to='/profile' onClick={() => setIsMenuOpen(false)}>
                          Mi Perfil
                        </Link>
                        <Link to='/orders' onClick={() => setIsMenuOpen(false)}>
                          Mis Pedidos
                        </Link>
                        <button onClick={() => {
                          handleLogout()
                        }}
                        >Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </div>
                  )
                : (
                  <div className='auth-links'>
                    <Link to='/login' className='auth-link'>
                      Iniciar Sesión
                    </Link>
                    <Link to='/register' className='auth-link'>
                      Registrarse
                    </Link>
                  </div>
                  )}

              <Link to='/cart' className='cart-link'>
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13H7'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <span className='cart-count'>{itemCount}</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className='header-bottom'>
        <div className='container'>
          <nav className='categories-nav'>
            <Link to='/products' className='category-link'>
              Todos los Productos
            </Link>
            {categories.map((category) => (
              <Link key={category.name} to={category.path} className='category-link'>
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
