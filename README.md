# ShopAPI — Backend

API REST de e-commerce construida con **Node.js + Express + MySQL (Aiven)**.

## Requisitos

- Node.js v20 LTS
- MySQL 8 (Aiven Cloud)

## Instalación

```bash
git clone https://github.com/Giampier-pixel/shoutapi-backend.git
cd shoutapi-backend
npm install
```

## Variables de entorno

Copiar `.env.example` a `.env` y completar las credenciales:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (default: 3000) |
| `NODE_ENV` | `development` o `production` |
| `DB_HOST` | Host de MySQL (Aiven) |
| `DB_PORT` | Puerto de MySQL |
| `DB_NAME` | Nombre de la base de datos |
| `DB_USER` | Usuario de la base de datos |
| `DB_PASS` | Contraseña de la base de datos |
| `DB_SSL` | `true` para conexión SSL (requerido por Aiven) |
| `JWT_SECRET` | Secreto para access tokens (mín. 32 chars) |
| `JWT_REFRESH_SECRET` | Secreto para refresh tokens |
| `JWT_EXPIRES_IN` | Expiración del access token (ej: `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | Expiración del refresh token (ej: `7d`) |
| `CLIENT_URL` | URL del frontend para CORS |

## Scripts

```bash
npm start    # Producción
npm run dev  # Desarrollo (nodemon)
```

## Documentación API

Swagger UI disponible en: `http://localhost:3000/api-docs`

## Endpoints

### Auth
| Método | Ruta | Auth |
|---|---|---|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| POST | `/api/auth/refresh` | Cookie |
| POST | `/api/auth/logout` | JWT |

### Usuarios
| Método | Ruta | Auth |
|---|---|---|
| GET | `/api/users/me` | JWT |
| PUT | `/api/users/me` | JWT |
| GET | `/api/users` | Admin |
| PATCH | `/api/users/:id/status` | Admin |

### Categorías
| Método | Ruta | Auth |
|---|---|---|
| GET | `/api/categories` | No |
| GET | `/api/categories/:id` | No |
| POST | `/api/categories` | Admin |
| PUT | `/api/categories/:id` | Admin |
| DELETE | `/api/categories/:id` | Admin |

### Productos
| Método | Ruta | Auth |
|---|---|---|
| GET | `/api/products` | No |
| GET | `/api/products/:id` | No |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Carrito
| Método | Ruta | Auth |
|---|---|---|
| GET | `/api/cart` | JWT |
| POST | `/api/cart/items` | JWT |
| PUT | `/api/cart/items/:productId` | JWT |
| DELETE | `/api/cart/items/:productId` | JWT |
| DELETE | `/api/cart` | JWT |

### Órdenes
| Método | Ruta | Auth |
|---|---|---|
| POST | `/api/orders/checkout` | JWT |
| GET | `/api/orders/my` | JWT |
| GET | `/api/orders/my/:id` | JWT |
| GET | `/api/orders` | Admin |
| PATCH | `/api/orders/:id/status` | Admin |

## Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Admin | `admin@shopapi.com` | `Admin123!` |

## Deploy

- **Backend**: Render (Build: `npm install`, Start: `npm start`)
- **Base de datos**: MySQL en Aiven Cloud (SSL requerido)
- **Frontend**: Vercel
