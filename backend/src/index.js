const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const knex = require('knex');
const { use } = require('react');

app.use(cors());
app.use(express.json());

const db=knex({
  client: 'sqlite3',
  connection: {
    filename: 'backend\\floristeria.db'
  },
  useNullAsDefault: true
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

app.get('/clientes', async (req, res) => {
  try {
    const clientes = await db('clientes').select('*');
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

app.get('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await db('clientes').select('*').where({ id }).first();
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(200).json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

app.post('/clientes', async (req, res) => {
  const { dni , nombre, apellidos, domicilio, telf} = req.body;
  try {
    const [id] = await db('clientes').insert({ dni, nombre, apellidos, domicilio, telf });
    res.status(201).json({ id, dni, nombre, apellidos, domicilio, telf });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

app.put('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { dni , nombre, apellidos, domicilio, telf  } = req.body;
  try {
    const updated = await db('clientes').where({ id }).update({ dni, nombre, apellidos, domicilio, telf });
    if (!updated) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(200).json({ id, dni, nombre, apellidos, domicilio, telf });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

app.delete('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db('clientes').where({ id }).del();
    if (!deleted) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(200).json({ message: 'Cliente eliminado' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});


app.get('/clientes/:id/pedidos', async (req, res) => {
  const { id } = req.params;
  try {
    const pedidos = await db('pedidos').select('*').where({ cliente_id: id });
    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

app.get('/clientes/:id/pedidos/:pedidoId', async (req, res) => {
  const { id, pedidoId } = req.params;
  try {
    const pedido = await db('pedidos')
      .select('*')
      .where({ id: pedidoId, cliente_id: id })
      .first();

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.status(200).json(pedido);
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
});

app.post('/clientes/:id/pedidos', async (req, res) => {
  const { id } = req.params;
  const { descripcion, tipo_flores, cantidad_flores, especificaciones } = req.body;
  try {
    const cliente = await db('clientes').select('*').where({ id }).first();
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const [pedidoId] = await db('pedidos').insert({
      cliente_id: id,
      descripcion,
      tipo_flores,
      cantidad_flores,
      especificaciones
    });

    res.status(201).json({
      id: pedidoId,
      cliente_id: Number(id),
      descripcion,
      tipo_flores,
      cantidad_flores,
      especificaciones
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});

app.put('/clientes/:id/pedidos/:pedidoId', async (req, res) => {
  const { id, pedidoId } = req.params;
  const { descripcion, tipo_flores, cantidad_flores, especificaciones } = req.body;
  try {
    const updated = await db('pedidos')
      .where({ id: pedidoId, cliente_id: id })
      .update({ descripcion, tipo_flores, cantidad_flores, especificaciones });

    if (!updated) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.status(200).json({
      id: Number(pedidoId),
      cliente_id: Number(id),
      descripcion,
      tipo_flores,
      cantidad_flores,
      especificaciones
    });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
});

app.delete('/clientes/:id/pedidos/:pedidoId', async (req, res) => {
  const { id, pedidoId } = req.params;
  try {
    const deleted = await db('pedidos').where({ id: pedidoId, cliente_id: id }).del();

    if (!deleted) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.status(200).json({ message: 'Pedido eliminado' });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ error: 'Error al eliminar pedido' });
  }
});

