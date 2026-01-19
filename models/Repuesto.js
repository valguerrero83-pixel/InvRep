const mongoose = require('mongoose');

const repuestoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  cantidad: { type: Number, required: true, default: 0 },
  unidad: { type: String, required: true }, // metros, litros, piezas, etc.
  cantidadMinima: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Repuesto', repuestoSchema);
