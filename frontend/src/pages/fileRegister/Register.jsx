import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { usePasswordState, usePasswordErrosState } from './States'
import { useHandleChange, useValidatePassword, useHandleSubmit, useIsFormValid } from './Logic'
import LoadingSpinner from '../../components/LoadingSpinner'
import { EyeOpenIcon, EyeClosedIcon } from './PasswordIcons'
import './Register.css'

function Register () {
  const {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword
  } = usePasswordState()

  const { isLoading, setIsLoading, passwordErrors, setPasswordErrors } = usePasswordErrosState()
  const { register, user, error } = useAuth()
  const navigate = useNavigate()
  const { validatePassword } = useValidatePassword(setPasswordErrors)
  const { handleChange } = useHandleChange(setFormData, validatePassword)
  const { handleSubmit } = useHandleSubmit({ formData, passwordErrors, setIsLoading, register, navigate })

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const isFormValid = useIsFormValid({ formData, passwordErrors })
  const passwordsMatch = formData.password === formData.confirmPassword

  return (
    <div className='register-page'>
      <div className='register-container'>
        <div className='register-card'>
          <div className='register-header'>
            <h1>Crear Cuenta</h1>
            <p>Únete a nuestra comunidad y disfruta de beneficios exclusivos</p>
          </div>

          <form onSubmit={handleSubmit} className='register-form'>
            {error && <div className='error-message'>{error}</div>}

            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='name' className='form-label'>
                  Nombre completo *
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className='form-input'
                  placeholder='Tu nombre completo'
                  required
                  autoComplete='name'
                />
              </div>

              <div className='form-group'>
                <label htmlFor='email' className='form-label'>
                  Email *
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='form-input'
                  placeholder='tu@email.com'
                  required
                  autoComplete='email'
                />
              </div>
            </div>

            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='password' className='form-label'>
                  Contraseña *
                </label>
                <div className='password-input-container'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${passwordErrors.length > 0 ? 'error' : ''}`}
                    placeholder='Tu contraseña'
                    required
                    autoComplete='new-password'
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
                {passwordErrors.length > 0 && (
                  <div className='password-requirements'>
                    {passwordErrors.map((error, index) => (
                      <span key={index} className='requirement-error'>
                        {error}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className='form-group'>
                <label htmlFor='confirmPassword' className='form-label'>
                  Confirmar contraseña *
                </label>
                <div className='password-input-container'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id='confirmPassword'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${formData.confirmPassword && !passwordsMatch ? 'error' : ''}`}
                    placeholder='Confirma tu contraseña'
                    required
                    autoComplete='new-password'
                  />
                  <button
                    type='button'
                    className='password-toggle'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showConfirmPassword ? EyeClosedIcon : EyeOpenIcon}
                  </button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <span className='requirement-error'>Las contraseñas no coinciden</span>
                )}
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='phone' className='form-label'>
                Teléfono (opcional)
              </label>
              <input
                type='tel'
                id='phone'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                className='form-input'
                placeholder='+1 234 567 8900'
                autoComplete='tel'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='address' className='form-label'>
                Dirección (opcional)
              </label>
              <textarea
                id='address'
                name='address'
                value={formData.address}
                onChange={handleChange}
                className='form-input form-textarea'
                placeholder='Tu dirección completa'
                rows='3'
                autoComplete='address-line1'
              />
            </div>

            <button type='submit' className='btn btn-primary btn-full' disabled={!isFormValid || isLoading}>
              {isLoading ? <LoadingSpinner size='small' text='' /> : 'Crear Cuenta'}
            </button>
          </form>

          <div className='register-footer'>
            <p>
              ¿Ya tienes una cuenta?{' '}
              <Link to='/login' className='auth-link'>
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
