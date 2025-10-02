import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/fileHome/Home'
import Products from './pages/fileProducts/Products'
import ProductDetail from './pages/fileProductDetail/ProductDetail'
import Cart from './pages/fileCart/Cart'
import Login from './pages/fileLogin/Login'
import Register from './pages/fileRegister/Register'
import Checkout from './pages/fileCheckout/Checkout'
import Profile from './pages/fileProfile/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'
import Orders from './pages/fileOrders/Orders'
import BackendWarningToast from './Warning'

function App () {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className='app'>
      <Header />
      <main className='main-content'>
      <BackendWarningToast />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/:category' element={<Products />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route
            path='/checkout'
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/orders'
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
