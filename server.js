const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let db;

// Conexión a MongoDB
MongoClient.connect(process.env.MONGO_URI)
  .then(client => {
    db = client.db(process.env.DB_NAME);
    console.log('✅ Conectado a MongoDB');
  })
  .catch(err => console.error('❌ Error al conectar MongoDB:', err));

// =========================
// LOGIN
// =========================
app.post('/api/login', async (req, res) => {
  const { usuario, password } = req.body;
  try {
    const user = await db.collection('usuarios').findOne({ usuario, activo: true });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    res.json({ usuario: { id: user._id, nombre: user.nombre, rol: user.rol } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// =========================
// REPUESTOS
// =========================
app.get('/api/repuestos', async (req, res) => {
  try {
    const repuestos = await db.collection('repuestos').find().toArray();
    res.json(repuestos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.post('/api/repuestos', async (req, res) => {
  const { nombre, cantidad, unidad, minimo } = req.body;
  try {
    const result = await db.collection('repuestos').insertOne({ nombre, cantidad, unidad, minimo });
    res.json({ id: result.insertedId, nombre, cantidad, unidad, minimo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.put('/api/repuestos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, cantidad, unidad, minimo } = req.body;
  try {
    await db.collection('repuestos').updateOne(
      { _id: new ObjectId(id) },
      { $set: { nombre, cantidad, unidad, minimo } }
    );
    res.json({ id, nombre, cantidad, unidad, minimo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.delete('/api/repuestos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('repuestos').deleteOne({ _id: new ObjectId(id) });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// =========================
// EMPLEADOS
// =========================
app.get('/api/empleados', async (req, res) => {
  try {
    const empleados = await db.collection('empleados').find().toArray();
    res.json(empleados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// =========================
// MOVIMIENTOS (entradas/salidas)
// =========================
app.post('/api/movimientos/entrada', async (req, res) => {
  const mov = req.body;
  try {
    await db.collection('movimientos').insertOne({ ...mov, fecha: new Date() });
    // Actualizar stock del repuesto
    await db.collection('repuestos').updateOne(
      { _id: new ObjectId(mov.repuestoId) },
      { $inc: { cantidad: mov.cantidad } }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.post('/api/movimientos/salida', async (req, res) => {
  const mov = req.body;
  try {
    await db.collection('movimientos').insertOne({ ...mov, fecha: new Date() });
    // Actualizar stock del repuesto
    await db.collection('repuestos').updateOne(
      { _id: new ObjectId(mov.repuestoId) },
      { $inc: { cantidad: -mov.cantidad } }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/api/movimientos', async (req, res) => {
  const tipo = req.query.tipo; // 'entrada' o 'salida'
  try {
    const query = tipo ? { tipo } : {};
    const movimientos = await db.collection('movimientos').find(query).toArray();
    res.json(movimientos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// =========================
// LEVANTAR SERVIDOR
// =========================
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
