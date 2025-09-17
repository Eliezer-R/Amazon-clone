import express from 'express'
import { getDB } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Obtener todas las órdenes del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const db = getDB()

    // Obtener órdenes del usuario
    const [orders] = await db.execute(
      `SELECT id, total, status, shipping_address, payment_method, payment_status, created_at, updated_at 
       FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    )

    // Obtener items para cada orden
    for (const order of orders) {
      const [items] = await db.execute(
        `SELECT product_id, quantity, price, product_title, product_image 
         FROM order_items 
         WHERE order_id = ?`,
        [order.id]
      )
      order.items = items
    }

    res.json({
      message: 'Órdenes obtenidas exitosamente',
      orders
    })
  } catch (error) {
    console.error('Error obteniendo órdenes:', error)
    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
})

// Obtener una orden específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const orderId = req.params.id
    const db = getDB()

    // Verificar que la orden pertenece al usuario
    const [orders] = await db.execute(
      `SELECT id, total, status, shipping_address, payment_method, payment_status, created_at, updated_at 
       FROM orders 
       WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    )

    if (orders.length === 0) {
      return res.status(404).json({
        message: 'Orden no encontrada'
      })
    }

    const order = orders[0]

    // Obtener items de la orden
    const [items] = await db.execute(
      `SELECT product_id, quantity, price, product_title, product_image 
       FROM order_items 
       WHERE order_id = ?`,
      [orderId]
    )

    order.items = items

    res.json({
      message: 'Orden obtenida exitosamente',
      order
    })
  } catch (error) {
    console.error('Error obteniendo orden:', error)
    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
})

// Crear nueva orden
router.post('/', authenticateToken, async (req, res) => {
  console.log(req.user.id, req.body)
  try {
    const userId = req.user.id
    const { items, total, shipping_address, payment_method } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Los items son requeridos'
      })
    }

    if (!total || !shipping_address || !payment_method) {
      return res.status(400).json({
        message: 'Total, dirección de envío y método de pago son requeridos'
      })
    }

    const db = getDB()

    // Iniciar transacción

    await db.query('START TRANSACTION')

    try {
      // Crear la orden
      const [orderResult] = await db.execute(
        `INSERT INTO orders (user_id, total, shipping_address, payment_method, payment_status, status) 
         VALUES (?, ?, ?, ?, 'completed', 'processing')`,
        [userId, total, shipping_address, payment_method]
      )

      const orderId = orderResult.insertId

      // Insertar items de la orden
      for (const item of items) {
        await db.execute(
          `INSERT INTO order_items (order_id, product_id, quantity, price, product_title, product_image) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price, item.product_title, item.product_image || null]
        )
      }

      // Confirmar transacción
      await db.query('COMMIT')

      // Obtener la orden creada con sus items
      const [newOrder] = await db.execute(
        `SELECT id, total, status, shipping_address, payment_method, payment_status, created_at 
         FROM orders 
         WHERE id = ?`,
        [orderId]
      )

      const [orderItems] = await db.execute(
        `SELECT product_id, quantity, price, product_title, product_image 
         FROM order_items 
         WHERE order_id = ?`,
        [orderId]
      )

      newOrder[0].items = orderItems

      res.status(201).json({
        message: 'Orden creada exitosamente',
        order: newOrder[0]
      })
    } catch (error) {
      // Revertir transacción en caso de error
      await db.query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('Error creando orden:', error)
    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
})

// Actualizar estado de orden (solo para admin - simplificado)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id
    const { status } = req.body
    const userId = req.user.id

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Estado inválido'
      })
    }

    const db = getDB()

    // Verificar que la orden pertenece al usuario
    const [orders] = await db.execute('SELECT id FROM orders WHERE id = ? AND user_id = ?', [orderId, userId])

    if (orders.length === 0) {
      return res.status(404).json({
        message: 'Orden no encontrada'
      })
    }

    // Actualizar estado
    await db.execute('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, orderId])

    res.json({
      message: 'Estado de orden actualizado exitosamente'
    })
  } catch (error) {
    console.error('Error actualizando estado de orden:', error)
    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
})

// Cancelar orden
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id
    const userId = req.user.id
    const db = getDB()

    // Verificar que la orden pertenece al usuario y puede ser cancelada
    const [orders] = await db.execute('SELECT id, status FROM orders WHERE id = ? AND user_id = ?', [orderId, userId])

    if (orders.length === 0) {
      return res.status(404).json({
        message: 'Orden no encontrada'
      })
    }

    const order = orders[0]

    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({
        message: 'No se puede cancelar una orden que ya ha sido enviada o entregada'
      })
    }

    // Actualizar estado a cancelado
    await db.execute("UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [orderId])

    res.json({
      message: 'Orden cancelada exitosamente'
    })
  } catch (error) {
    console.error('Error cancelando orden:', error)
    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
})

export default router
