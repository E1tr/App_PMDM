# Ruby on Rails Backend API

API Backend para la aplicación de gestión de alquileres construida con Ruby on Rails, PostgreSQL y Docker.

## Requisitos previos

- Docker
- Docker Compose

## Instalación y ejecución

1. **Construir y levantar los contenedores:**

```bash
docker-compose up --build
```

Esto hará automáticamente:

- Construir la imagen de Rails
- Crear el contenedor de PostgreSQL
- Crear la base de datos
- Ejecutar las migraciones
- Cargar los datos de prueba (seeds)
- Iniciar el servidor en <http://localhost:3000>

1. **Acceder a la API:**

La API estará disponible en: `http://localhost:3000`

## Endpoints principales

### Autenticación

- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/register` - Registrarse
- `GET /api/v1/auth/me` - Obtener usuario actual

### Usuarios y Roles

- `GET /api/v1/roles` - Listar roles
- `GET /api/v1/users` - Listar usuarios
- `POST /api/v1/users` - Crear usuario
- `GET /api/v1/users/:id` - Ver usuario
- `PUT /api/v1/users/:id` - Actualizar usuario
- `DELETE /api/v1/users/:id` - Eliminar usuario

### Clientes

- `GET /api/v1/clientes` - Listar clientes
- `POST /api/v1/clientes` - Crear cliente
- `GET /api/v1/clientes/:id` - Ver cliente
- `PUT /api/v1/clientes/:id` - Actualizar cliente
- `DELETE /api/v1/clientes/:id` - Desactivar cliente
- `GET /api/v1/clientes/:id/pedidos` - Ver pedidos del cliente

### Direcciones de cliente

- `GET /api/v1/clientes/:cliente_id/direcciones` - Listar direcciones
- `POST /api/v1/clientes/:cliente_id/direcciones` - Crear dirección
- `PUT /api/v1/clientes/:cliente_id/direcciones/:id` - Actualizar dirección
- `DELETE /api/v1/clientes/:cliente_id/direcciones/:id` - Eliminar dirección

### Productos

- `GET /api/v1/productos` - Listar productos
- `POST /api/v1/productos` - Crear producto
- `GET /api/v1/productos/:id` - Ver producto
- `PUT /api/v1/productos/:id` - Actualizar producto
- `DELETE /api/v1/productos/:id` - Desactivar producto

### Tallas de producto

- `GET /api/v1/productos/:producto_id/tallas` - Listar tallas
- `POST /api/v1/productos/:producto_id/tallas` - Crear talla
- `PUT /api/v1/productos/:producto_id/tallas/:id` - Actualizar talla
- `DELETE /api/v1/productos/:producto_id/tallas/:id` - Desactivar talla

### Pedidos

- `GET /api/v1/pedidos` - Listar pedidos
- `POST /api/v1/pedidos` - Crear pedido
- `GET /api/v1/pedidos/:id` - Ver pedido completo
- `PUT /api/v1/pedidos/:id` - Actualizar pedido
- `DELETE /api/v1/pedidos/:id` - Eliminar pedido
- `GET /api/v1/pedidos/:id/historial` - Ver historial de estados
- `POST /api/v1/pedidos/:id/cambiar_estado` - Cambiar estado del pedido

### Líneas de pedido

- `GET /api/v1/pedidos/:pedido_id/lineas` - Listar líneas
- `POST /api/v1/pedidos/:pedido_id/lineas` - Crear línea
- `PUT /api/v1/pedidos/:pedido_id/lineas/:id` - Actualizar línea
- `DELETE /api/v1/pedidos/:pedido_id/lineas/:id` - Eliminar línea

## Datos de prueba

El sistema viene con datos de prueba precargados:

**Usuarios:**

- Admin: `admin@alquilerapp.com` / `123`
- Prueba: `a@a.com` / `123`
- Operario: `operario1@alquilerapp.com` / `123`

## Comandos útiles

**Acceder al contenedor:**

```bash
docker-compose exec api bash
```

**Ver logs:**

```bash
docker-compose logs -f api
```

**Ejecutar migraciones:**

```bash
docker-compose exec api rails db:migrate
```

**Recargar seeds:**

```bash
docker-compose exec api rails db:seed
```

**Consola de Rails:**

```bash
docker-compose exec api rails console
```

**Detener los contenedores:**

```bash
docker-compose down
```

**Eliminar volúmenes (reset completo):**

```bash
docker-compose down -v
```

## Estructura del proyecto

```
BackEnd/
├── app/
│   ├── controllers/
│   │   └── api/
│   │       └── v1/          # Controladores de la API
│   └── models/              # Modelos ActiveRecord
├── config/
│   ├── database.yml         # Configuración de PostgreSQL
│   ├── routes.rb            # Rutas de la API
│   └── application.rb       # Configuración de Rails
├── db/
│   ├── migrate/             # Migraciones de base de datos
│   └── seeds.rb             # Datos de prueba
├── lib/
│   └── json_web_token.rb    # Servicio JWT
├── Dockerfile               # Imagen de Docker
└── docker-compose.yml       # Orquestación de contenedores
```

## Tecnologías

- Ruby 3.2.2
- Rails 7.1.0
- PostgreSQL 15
- Docker & Docker Compose
- JWT para autenticación
- Bcrypt para encriptación de contraseñas
