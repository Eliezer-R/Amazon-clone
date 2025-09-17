import jwt from 'jsonwebtoken'
import { getDB } from '../config/database.js'
import dotenv from 'dotenv'

dotenv.config()

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ message: 'Token de acceso requerido' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Verificar que el usuario existe en la base de datos
    const db = getDB()
    const [users] = await db.execute(
      'SELECT id, name, email FROM users WHERE id = ?',
      [decoded.userId]
    )

    if (users.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    req.user = users[0]
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Token inválido' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expirado' })
    }

    console.error('Error en autenticación:', error.message)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

// Función para enviar la cookie con el token JWT
export const sendcookie = (res, user) => {
  console.log(user)
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' })
  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 90
  })
  return res
}
