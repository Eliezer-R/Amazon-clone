# Amazon Clone E-commerce

Un e-commerce completo similar a Amazon construido con React y Node.js, con diseño moderno y tema oscuro.

## 🚀 Características

### Frontend
- **React 18** con JavaScript
- **React Router** para navegación SPA
- **Diseño responsive** y moderno con tema oscuro
- **Animaciones fluidas** y transiciones suaves
- **Carrito de compras** persistente con localStorage
- **Sistema de autenticación** (login/register/logout)
- **Detalles de productos** con imágenes, descripción, precios
- **Integración con FakeStore API** para productos reales
- **Búsqueda y filtrado** de productos
- **Gestión de estado** con Context API

### Backend
- **Node.js** con Express
- **MySQL** como base de datos
- **JWT** para autenticación segura
- **CORS** configurado para desarrollo
- **Cookies** para manejo de sesiones
- **Bcrypt** para encriptación de contraseñas
- **Validación** de datos de entrada
- **API RESTful** bien estructurada

## 📁 Estructura del Proyecto

\`\`\`
amazon-clone-ecommerce/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── context/        # Context API para estado global
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # Servicios API
│   │   ├── styles/         # Estilos CSS
│   │   └── utils/          # Utilidades
│   ├── public/             # Archivos estáticos
│   └── package.json
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── controllers/    # Controladores
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Rutas API
│   │   ├── middleware/     # Middlewares
│   │   ├── config/         # Configuración
│   │   └── utils/          # Utilidades
│   └── package.json
├── .gitignore
├── README.md
└── package.json
\`\`\`

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- React Router DOM
- JavaScript ES6+
- CSS3 con variables personalizadas
- Fetch API para peticiones HTTP
- LocalStorage para persistencia

### Backend
- Node.js
- Express.js
- MySQL2
- JSON Web Tokens (JWT)
- bcryptjs
- CORS
- cookie-parser
- dotenv

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- pnpm
- MySQL

### Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone <repository-url>
cd amazon-clone-ecommerce
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
pnpm run install-all
\`\`\`

3. **Configurar variables de entorno**

**Frontend (.env en carpeta frontend/):**
\`\`\`env
VITE_API_URL=http://localhost:5000/api
VITE_FAKESTORE_API=https://fakestoreapi.com
\`\`\`

**Backend (.env en carpeta backend/):**
\`\`\`env
PORT=5000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=amazon_clone
JWT_SECRET=tu_jwt_secret_muy_seguro
NODE_ENV=development
\`\`\`

4. **Configurar base de datos**
\`\`\`sql
CREATE DATABASE amazon_clone;
\`\`\`

5. **Ejecutar el proyecto**
\`\`\`bash
pnpm dev
\`\`\`

## 🎨 Diseño y UX

- **Tema oscuro moderno** con paleta de colores cuidadosamente seleccionada
- **Responsive design** que se adapta a todos los dispositivos
- **Animaciones fluidas** para mejorar la experiencia de usuario
- **Interfaz intuitiva** similar a Amazon pero con identidad propia
- **Carga optimizada** de imágenes y contenido

## 🔐 Autenticación

- Sistema completo de registro y login
- Tokens JWT para sesiones seguras
- Protección de rutas privadas
- Logout con limpieza de sesión
- Validación de formularios

## 🛒 Funcionalidades del Carrito

- Agregar/eliminar productos
- Modificar cantidades
- Persistencia con localStorage
- Cálculo automático de totales
- Proceso de checkout simulado

## 📱 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `GET /api/products/category/:category` - Productos por categoría

### Carrito
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart/add` - Agregar producto al carrito
- `PUT /api/cart/update` - Actualizar cantidad
- `DELETE /api/cart/remove` - Eliminar del carrito

## 🚀 Despliegue

### Frontend
- Build optimizado con Vite
- Archivos estáticos listos para CDN
- Variables de entorno para producción

### Backend
- Configuración para producción
- Conexión segura a base de datos
- Manejo de errores robusto

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para crear una experiencia de e-commerce moderna y funcional.

---

**¡Disfruta construyendo tu e-commerce! 🛍️**
\`\`\`

Ahora vamos con el **Frontend**:
