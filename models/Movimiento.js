const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: ['entrada', 'salida'],
        required: true
    },

    repuesto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repuesto',
        required: true
    },

    repuestoNombre: {
        type: String,
        required: true
    },

    cantidad: {
        type: Number,
        required: true,
        min: 1
    },

    unidad: {
        type: String,
        default: ''
    },

    // ENTRADA
    ingresadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empleado'
    },

    // SALIDA
    entregadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empleado'
    },
    recibidoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empleado'
    },

    notas: {
        type: String,
        default: ''
    },

    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Movimiento', movimientoSchema);
