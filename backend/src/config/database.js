import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

let connection = null

export const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      charset: 'utf8mb4'
    })

    console.log('✅ Conectado a MySQL')
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message)
    process.exit(1)
  }
}

export const getDB = () => {
  if (!connection) {
    throw new Error('Base de datos no conectada')
  }
  return connection
}

export default { connectDB, getDB }
