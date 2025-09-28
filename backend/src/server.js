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

// 🚨 CONFIGURACIÓN TEMPORAL - PERMITE TODOS LOS ORÍGENES
// Solo para resolver el problema inmediato
console.log('⚠️ CORS ABIERTO - SOLO PARA DEBUG')
console.log('API_URL env var:', process.env.API_URL)
console.log('NODE_ENV:', process.env.NODE_ENV)

app.use(cors({
  origin: true, // Permite CUALQUIER origen
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  optionsSuccessStatus: 200
}))

// Middleware para loggear todas las peticiones
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} desde origen: ${req.get('origin') || 'sin origen'}`)
  next()
})

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
