Desde carpeta de proyecto:

- Crear la base de datos
  node -e "const sqlite3=require('sqlite3').verbose(); const db=new sqlite3.Database('backend/floristeria.db'); db.serialize(()=>{db.run('CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, dni TEXT, nombre TEXT, apellidos TEXT, domicilio TEXT, telf TEXT)'); db.run('CREATE TABLE IF NOT EXISTS pedidos (id INTEGER PRIMARY KEY AUTOINCREMENT, cliente_id INTEGER, descripcion TEXT, tipo_flores TEXT, cantidad_flores INTEGER, especificaciones TEXT, FOREIGN KEY(cliente_id) REFERENCES clientes(id))');}); db.close();"

- Iniciar backend: npm.cmd start
  localhost:3000/clientes

- Iniciar frontend: en otra terminal
  npm.cmd run dev


  
  
