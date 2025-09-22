import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/LoadingSpinner'
import { AuthRequiredIcon, EmptyOrdersIcon } from './OrdersIcons'
import { formatDate, formatPrice, getStatusColor, getStatusText, getPaymentStatusColor, getPaymentStatusText, fetchOrders, cancelOrder } from './Logic'

import { useStatesOrders, useStatesLoading } from './States'
import './Orders.css'

function Orders () {
  const { user } = useAuth()
  const { orders, setOrders, selectedOrder, setSelectedOrder } = useStatesOrders()
  const { loading, setLoading, error, setError } = useStatesLoading()

  // Fetch orders when user logs in
  useEffect(() => {
    if (user) {
      fetchOrders({ setLoading, setError, setOrders })
    }
  }, [user])

  //  // If not logged in, show message
  if (!user) {
    return (
      <div className='orders-page'>
        <div className='container'>
          <div className='auth-required'>
            {AuthRequiredIcon}
            <h2>Inicia sesión para ver tus pedidos</h2>
            <p>Necesitas estar autenticado para acceder a tu historial de pedidos</p>
            <Link to='/login' className='btn btn-primary'>
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner text='Cargando pedidos...' />
  }

  if (error) {
    return (
      <div className='orders-page'>
        <div className='container'>
          <div className='error-container'>
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => fetchOrders({ setLoading, setError, setOrders })} className='btn btn-primary'>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='orders-page'>
      <div className='container'>
        <div className='orders-header'>
          <h1>Mis Pedidos</h1>
          <p>Historial completo de tus compras y estado de envíos</p>
        </div>

        {orders.length === 0
          ? (
            <div className='empty-orders'>
              <div className='empty-orders-icon'>
                {EmptyOrdersIcon}
              </div>
              <h2>No tienes pedidos aún</h2>
              <p>Cuando realices tu primera compra, aparecerá aquí con toda la información de seguimiento</p>
              <div className='empty-orders-actions'>
                <Link to='/products' className='btn btn-primary btn-large'>
                  Explorar productos
                </Link>
                <Link to='/' className='btn btn-outline btn-large'>
                  Volver al inicio
                </Link>
              </div>
            </div>
            )
          : (
            <div className='orders-content'>
              <div className='orders-stats'>
                <div className='stat-card'>
                  <div className='stat-number'>{orders.length}</div>
                  <div className='stat-label'>Total de pedidos</div>
                </div>
                <div className='stat-card'>
                  <div className='stat-number'>{orders.filter((order) => order.status === 'delivered').length}</div>
                  <div className='stat-label'>Entregados</div>
                </div>
                <div className='stat-card'>
                  <div className='stat-number'>
                    {orders.filter((order) => order.status === 'processing' || order.status === 'shipped').length}
                  </div>
                  <div className='stat-label'>En proceso</div>
                </div>
                <div className='stat-card'>
                  <div className='stat-number'>
                    {/* Solo sumar los totales de las órdenes que no estén canceladas */}
                    {formatPrice(orders.reduce((sum, order) => order.status !== 'cancelled' ? sum + Number.parseFloat(order.total) : sum, 0))}
                  </div>
                  <div className='stat-label'>Total gastado</div>
                </div>
              </div>

              <div className='orders-list'>
                {orders.map((order) => (
                  <div key={order.id} className='order-card'>
                    <div className='order-header'>
                      <div className='order-info'>
                        <h3>Pedido #{order.id}</h3>
                        <span className='order-date'>{formatDate(order.created_at)}</span>
                      </div>
                      <div className='order-status-section'>
                        <div className='status-badges'>
                          <span className='status-badge' style={{ backgroundColor: getStatusColor(order.status) }}>
                            {getStatusText(order.status)}
                          </span>
                          <span
                            className='payment-badge'
                            style={{ backgroundColor: getPaymentStatusColor(order.payment_status) }}
                          >
                            Pago: {getPaymentStatusText(order.payment_status)}
                          </span>
                        </div>
                        <span className='order-total'>{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    <div className='order-details'>
                      <div className='order-meta'>
                        <div className='meta-item'>
                          <span className='meta-label'>Método de pago:</span>
                          <span className='meta-value'>
                            {order.payment_method === 'credit_card' ? 'Tarjeta de crédito' : 'PayPal'}
                          </span>
                        </div>
                        <div className='meta-item'>
                          <span className='meta-label'>Dirección de envío:</span>
                          <span className='meta-value'>{order.shipping_address}</span>
                        </div>
                      </div>

                      {order.items && order.items.length > 0 && (
                        <div className='order-items'>
                          <h4>Productos ({order.items.length})</h4>
                          <div className='items-list'>
                            {order.items.slice(0, 3).map((item, index) => (
                              <div key={index} className='order-item'>
                                <div className='item-image'>
                                  <img
                                    src={item.product_image || '/placeholder.svg'}
                                    alt={item.product_title}
                                    loading='lazy'
                                  />
                                </div>
                                <div className='item-details'>
                                  <h5>{item.product_title}</h5>
                                  <div className='item-meta'>
                                    <span>Cantidad: {item.quantity}</span>
                                    <span className='item-price'>{formatPrice(item.price)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className='more-items'>
                                <span>+{order.items.length - 3} productos más</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className='order-actions'>
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className='btn btn-outline btn-small'
                        >
                          {selectedOrder === order.id ? 'Ocultar detalles' : 'Ver detalles'}
                        </button>
                        {order.status === 'delivered' && (
                          <button className='btn btn-outline btn-small'>Volver a comprar</button>
                        )}
                        {(order.status === 'pending' || order.status === 'processing') && (
                          <button className='btn btn-outline btn-small text-error' onClick={() => cancelOrder({ orderId: order.id})}>Cancelar pedido</button>
                        )}
                      </div>

                      {selectedOrder === order.id && (
                        <div className='order-expanded'>
                          <div className='expanded-section'>
                            <h4>Información de seguimiento</h4>
                            <div className='tracking-info'>
                              <div className='tracking-step completed'>
                                <div className='step-icon'>✓</div>
                                <div className='step-content'>
                                  <span className='step-title'>Pedido confirmado</span>
                                  <span className='step-date'>{formatDate(order.created_at)}</span>
                                </div>
                              </div>
                              <div className={`tracking-step ${order.status !== 'pending' ? 'completed' : ''}`}>
                                <div className='step-icon'>{order.status !== 'pending' ? '✓' : '○'}</div>
                                <div className='step-content'>
                                  <span className='step-title'>En preparación</span>
                                  <span className='step-date'>
                                    {order.status !== 'pending' ? 'Completado' : 'Pendiente'}
                                  </span>
                                </div>
                              </div>
                              <div className={`tracking-step ${order.status === 'shipped' ? 'completed' : ''}`}>
                                <div className='step-icon'>{order.status === 'shipped' ? '✓' : '○'}</div>
                                <div className='step-content'>
                                  <span className='step-title'>Enviado</span>
                                  <span className='step-date'>
                                    {order.status === 'shipped' ? 'En camino' : 'Pendiente'}
                                  </span>
                                </div>
                              </div>
                              <div className={`tracking-step ${order.status === 'delivered' ? 'completed' : ''}`}>
                                <div className='step-icon'>{order.status === 'delivered' ? '✓' : '○'}</div>
                                <div className='step-content'>
                                  <span className='step-title'>Entregado</span>
                                  <span className='step-date'>
                                    {order.status === 'delivered' ? 'Completado' : 'Pendiente'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {order.items && (
                            <div className='expanded-section'>
                              <h4>Todos los productos</h4>
                              <div className='all-items-list'>
                                {order.items.map((item, index) => (
                                  <div key={index} className='expanded-item'>
                                    <div className='item-image'>
                                      <img
                                        src={item.product_image || '/placeholder.svg'}
                                        alt={item.product_title}
                                        loading='lazy'
                                      />
                                    </div>
                                    <div className='item-info'>
                                      <h5>{item.product_title}</h5>
                                      <div className='item-details-expanded'>
                                        <span>Cantidad: {item.quantity}</span>
                                        <span>Precio unitario: {formatPrice(item.price)}</span>
                                        <span className='item-total'>
                                          Total: {formatPrice(item.price * item.quantity)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}
      </div>
    </div>
  )
}

export default Orders
