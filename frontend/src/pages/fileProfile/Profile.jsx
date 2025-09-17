import { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useEditFormStates, useOrders } from './States'
import {
  fetchOrders,
  handleChange,
  handleSubmit,
  formatDate,
  formatPrice,
  getStatusColor,
  getStatusText
} from './Logic'
import './Profile.css'
import { EditIcon, EmptyOrdersIcon } from './ProfileIcons'

function Profile () {
  const { user, setUser } = useAuth()
  const { isEditing, setIsEditing, isLoading, setIsLoading, formData, setFormData } = useEditFormStates()
  const { message, setMessage, orders, setOrders, loadingOrders, setLoadingOrders } = useOrders()

  // Initialize form data with user info when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      })
    }
  }, [user])

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders(setLoadingOrders, setOrders)
  }, [])

  if (!user) {
    return <LoadingSpinner text='Cargando perfil...' />
  }

  return (
    <div className='profile-page'>
      <div className='container'>
        <div className='profile-header'>
          <h1>Mi Perfil</h1>
          <p>Gestiona tu información personal y revisa tus pedidos</p>
        </div>

        <div className='profile-content'>

          <div className='profile-section'>
            <div className='section-header'>
              <h2>Información Personal</h2>
              {!isEditing && (
                <button className='btn btn-outline' onClick={() => setIsEditing(true)}>
                  {EditIcon}
                  Editar
                </button>
              )}
            </div>

            {message && (
              <div className={`message ${message.includes('exitosamente') ? 'success' : 'error'}`}>{message}</div>
            )}

            {isEditing
              ? (
                <form onSubmit={(e) => handleSubmit({ e, formData, setIsLoading, setMessage, setIsEditing, setUser })} className='profile-form'>
                  <div className='form-group'>
                    <label htmlFor='name' className='form-label'>
                      Nombre completo
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={(e) => handleChange(e, setFormData)}
                      className='form-input'
                      required
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='phone' className='form-label'>
                      Teléfono
                    </label>
                    <input
                      type='tel'
                      id='phone'
                      name='phone'
                      value={formData.phone}
                      onChange={(e) => handleChange(e, setFormData)}
                      className='form-input'
                      placeholder='+1 234 567 8900'
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='address' className='form-label'>
                      Dirección
                    </label>
                    <textarea
                      id='address'
                      name='address'
                      value={formData.address}
                      onChange={(e) => handleChange(e, setFormData)}
                      className='form-input form-textarea'
                      rows='3'
                      placeholder='Tu dirección completa'
                    />
                  </div>

                  <div className='form-actions'>
                    <button type='submit' className='btn btn-primary' disabled={isLoading}>
                      {isLoading ? <LoadingSpinner size='small' text='' /> : 'Guardar Cambios'}
                    </button>
                    <button
                      type='button'
                      className='btn btn-outline'
                      onClick={() => {
                        setIsEditing(false)
                        setMessage('')
                        setFormData({
                          name: user.name || '',
                          phone: user.phone || '',
                          address: user.address || ''
                        })
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
                )
              : (
                <div className='profile-info'>
                  <div className='info-item'>
                    <label>Email</label>
                    <span>{user.email}</span>
                  </div>
                  <div className='info-item'>
                    <label>Nombre</label>
                    <span>{user.name}</span>
                  </div>
                  <div className='info-item'>
                    <label>Teléfono</label>
                    <span>{user.phone || 'No especificado'}</span>
                  </div>
                  <div className='info-item'>
                    <label>Dirección</label>
                    <span>{user.address || 'No especificada'}</span>
                  </div>
                  <div className='info-item'>
                    <label>Miembro desde</label>
                    <span>{formatDate(user.created_at)}</span>
                  </div>
                </div>
                )}
          </div>

          <div className='profile-section'>
            <div className='section-header'>
              <h2>Historial de Pedidos</h2>
            </div>

            {loadingOrders
              ? (
                <LoadingSpinner text='Cargando pedidos...' />
                )
              : orders.length === 0
                ? (
                  <div className='empty-orders'>
                    {EmptyOrdersIcon}
                    <h3>No tienes pedidos aún</h3>
                    <p>Cuando realices tu primera compra, aparecerá aquí</p>
                  </div>
                  )
                : (
                  <div className='orders-list'>
                    {orders.map((order) => (
                      <div key={order.id} className='order-card'>
                        <div className='order-header'>
                          <div className='order-info'>
                            <h3>Pedido #{order.id}</h3>
                            <span className='order-date'>{formatDate(order.created_at)}</span>
                          </div>
                          <div className='order-status'>
                            <span className='status-badge' style={{ backgroundColor: getStatusColor(order.status) }}>
                              {getStatusText(order.status)}
                            </span>
                            <span className='order-total'>{formatPrice(order.total)}</span>
                          </div>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className='order-items'>
                            {order.items.map((item, index) => (
                              <div key={index} className='order-item'>
                                <img
                                  src={item.product_image || '/placeholder.svg'}
                                  alt={item.product_title}
                                  className='item-image'
                                />
                                <div className='item-details'>
                                  <h4>{item.product_title}</h4>
                                  <span className='item-quantity'>Cantidad: {item.quantity}</span>
                                  <span className='item-price'>{formatPrice(item.price)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className='order-footer'>
                          <span className='payment-method'>Método: {order.payment_method}</span>
                          <span className='payment-status'>
                            Estado del pago: {order.payment_status === 'completed' ? 'Completado' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
