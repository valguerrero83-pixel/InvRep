const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let db;

async function startServer() {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI);
    db = client.db(process.env.DB_NAME);
    console.log('✅ Conectado a MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  }
}

startServer();
