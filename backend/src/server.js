import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/orders.js'
import { connectDB } from './config/database.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = [
  'http://localhost:3000',
  process.env.API_URL
]

// Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('No permitido por CORS'))
      }
    },
     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Conectar a la base de datos
connectDB()

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada',
    path: req.originalUrl
  })
})

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)

  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`)
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`)
})
