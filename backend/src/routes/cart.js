import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import { getDB } from '../config/database.js'
const router = express.Router()

// Agregar item al carrito
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const { productId, quantity, price } = req.body
  console.log(productId, quantity, price, userId)

  if (!userId) {
    res.status(401).json({ message: 'Usuario no encontrado' })
  }

  const db = getDB()

  try {
    await db.execute('INSERT INTO carts (user_id, product_id, quantity, price, created_at ) VALUES (?, ?, ?, ?, NOW())', [
      userId,
      productId,
      quantity,
      price
    ])

    res.status(200).json({ message: 'Carrito insertado con exito' })
  } catch (error) {
    console.error('Error al insertar el carrito', error)
    res.status(500).json({ message: 'error interno del servidor' })
  }
})

// Actualizar cantidad de un item en el carrito
router.put('/:productId', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const { productId } = req.params
  const { quantity } = req.body
  const db = getDB()

  if (quantity <= 0) {
    return res.status(400).json({ message: 'Cantidad inválida' })
  }

  try {
    const [result] = await db.execute(
      'UPDATE carts SET quantity = ?, updated_at = NOW() WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item no encontrado en el carrito' })
    }

    res.status(200).json({ message: 'Cantidad actualizada con éxito' })
  } catch (error) {
    console.error('Error al actualizar la cantidad del item del carrito:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Vaciar carrito
router.delete('/clear', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const db = getDB()

  try {
    await db.execute('DELETE FROM carts WHERE user_id = ?', [userId])
    res.status(200).json({ message: 'Carrito vaciado con éxito' })
  } catch (error) {
    console.error('Error al vaciar el carrito:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Eliminar item del carrito
router.delete('/:productId', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const { productId } = req.params
  const db = getDB()

  try {
    const [result] = await db.execute(
      'DELETE FROM carts WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item no encontrado en el carrito' })
    }

    res.status(200).json({ message: 'Item eliminado del carrito con éxito' })
  } catch (error) {
    console.error('Error al eliminar el item del carrito:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Obtener items del carrito
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const db = getDB()

  try {
    const [cartItems] = await db.execute(
      `SELECT product_id, quantity, price 
       FROM carts 
       WHERE user_id = ?`,
      [userId]
    )

    res.json({
      message: 'Carrito obtenido exitosamente',
      cartItems: cartItems || []
    })
  } catch (error) {
    console.error('Error obteniendo el carrito:', error)
    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
})

// Reemplazar todo el carrito
router.put('/', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const { items } = req.body
  const conn = getDB()
  console.log(items)

  if (!Array.isArray(items)) {
    return res.status(400).json({ message: 'Formato inválido' })
  }

  try {
    await conn.beginTransaction()

    await conn.execute('DELETE FROM carts WHERE user_id = ?', [userId])

    const insertPromises = items.map(item =>
      conn.execute(
        'INSERT INTO carts (user_id, product_id, quantity, price, created_at) VALUES (?, ?, ?, ?, NOW())',
        [userId, item.productId, item.quantity, item.price]
      )
    )

    await Promise.all(insertPromises)
    await conn.commit()

    return res.json({ message: 'Carrito actualizado', items })
  } catch (error) {
    await conn.rollback()
    console.error('Error actualizando el carrito:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
})

export default router
