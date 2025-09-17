import express from 'express'
import bcrypt from 'bcryptjs'
import { getDB } from '../config/database.js'
import { authenticateToken, sendcookie } from '../middleware/auth.js'

const router = express.Router()

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Nombre, email y contraseña son requeridos'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 6 caracteres'
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Email inválido'
      })
    }

    const db = getDB()

    // Verificar si el usuario ya existe
    const [existingUsers] = await db.execute('SELECT id FROM users WHERE email = ?', [email])

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: 'El email ya está registrado'
      })
    }

    // Encriptar contraseña
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Crear usuario
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null, address || null]
    )

    // Obtener datos del usuario creado
    const [newUser] = await db.execute('SELECT id, name, email, phone, address, created_at FROM users WHERE id = ?', [
      result.insertId
    ])

    // generar y enviar cookie con token JWT
    console.log(newUser[0])
    sendcookie(res, newUser[0])

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: newUser[0]
    })
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
})

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son requeridos'
      })
    }

    const db = getDB()

    // Buscar usuario por email
    const [users] = await db.execute('SELECT id, name, email, password, phone, address FROM users WHERE email = ?', [
      email
    ])

    console.log(users)

    if (users.length === 0) {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      })
    }

    const user = users[0]

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      })
    }

    // Generar token JWT
    sendcookie(res, user)

    // Remover contraseña de la respuesta
    delete user.password

    res.json({
      message: 'Login exitoso',
      user
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
})

// Obtener usuario actual
router.get('/me', authenticateToken, async (req, res) => {
  console.log(req.user)
  try {
    const db = getDB()

    const [users] = await db.execute('SELECT id, name, email, phone, address, created_at FROM users WHERE id = ?', [
      req.user.id
    ])

    if (users.length === 0) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      })
    }

    res.json({
      user: users[0]
    })
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
})

// Salir de mi perfil
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/'
  })
  return res.status(200).json({ message: 'Logout exitoso' })
})

// Actualizar perfil de usuario
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body
    const userId = req.user.id

    if (!name) {
      return res.status(400).json({
        message: 'El nombre es requerido'
      })
    }

    const db = getDB()

    // Actualizar usuario
    await db.execute('UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?', [
      name,
      phone || null,
      address || null,
      userId
    ])

    // Obtener datos actualizados
    const [updatedUser] = await db.execute(
      'SELECT id, name, email, phone, address, created_at FROM users WHERE id = ?',
      [userId]
    )

    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser[0]
    })
  } catch (error) {
    console.error('Error actualizando perfil:', error)
    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
})

export default router
