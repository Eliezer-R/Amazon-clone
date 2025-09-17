import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useStatesfileLogin } from './States'
import { handleChange, handleSubmit } from './Logic'
import './Login.css'
import { EyeOpenIcon, EyeClosedIcon, CheckIcon } from './LoginIcons'

function Login () {
  const { formData, setFormData, isLoading, setIsLoading, showPassword, setShowPassword } = useStatesfileLogin()
  const { login, user, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  const isFormValid = formData.email && formData.password

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='login-card'>
          <div className='login-header'>
            <h1>Iniciar Sesión</h1>
            <p>Accede a tu cuenta para continuar comprando</p>
          </div>

          <form onSubmit={(e) => handleSubmit({ e, setIsLoading, formData, navigate, login, from })} className='login-form'>
            {error && <div className='error-message'>{error}</div>}

            <div className='form-group'>
              <label htmlFor='email' className='form-label'>
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={(e) => handleChange(e, setFormData)}
                className='form-input'
                placeholder='tu@email.com'
                required
                autoComplete='email'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password' className='form-label'>
                Contraseña
              </label>
              <div className='password-input-container'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={(e) => handleChange(e, setFormData)}
                  className='form-input'
                  placeholder='Tu contraseña'
                  required
                  autoComplete='current-password'
                />
                <button
                  type='button'
                  className='password-toggle'
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? EyeClosedIcon : EyeOpenIcon}
                </button>
              </div>
            </div>

            <button type='submit' className='btn btn-primary btn-full' disabled={!isFormValid || isLoading}>
              {isLoading ? <LoadingSpinner size='small' text='' /> : 'Iniciar Sesión'}
            </button>
          </form>

          <div className='login-footer'>
            <p>
              ¿No tienes una cuenta?{' '}
              <Link to='/register' className='auth-link'>
                Regístrate aquí
              </Link>
            </p>
            <Link to='/forgot-password' className='forgot-password-link'>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <div className='login-benefits'>
          <h3>¿Por qué crear una cuenta?</h3>
          <ul>
            <li>
              {CheckIcon}
              Compras más rápidas
            </li>
            <li>
              {CheckIcon}
              Historial de pedidos
            </li>
            <li>
              {CheckIcon}
              Ofertas exclusivas
            </li>
            <li>
              {CheckIcon}
              Lista de deseos
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login
