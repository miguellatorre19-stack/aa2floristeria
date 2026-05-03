# Floristeria

Proyecto web para gestionar una floristeria.

El modelo de datos tiene dos entidades principales:

- Clientes: usuarios de la aplicacion que pueden realizar pedidos.
- Pedidos: pedidos asociados a un cliente concreto.

Ambas entidades tienen un CRUD basico completo. El backend esta desarrollado con Node.js, Express, Knex y SQLite. El frontend esta desarrollado con React + Vite y se comunica con la API REST del backend.

La aplicacion usa SQLite. La base de datos se encuentra en:

backend/floristeria.db

## Iniciar backend

Desde la carpeta del proyecto:

npm install
npm start

API:
http://localhost:3000/clientes


## Iniciar frontend

cd frontend/floristeria
npm install
npm run dev

Aplicacion:
http://localhost:5173/

