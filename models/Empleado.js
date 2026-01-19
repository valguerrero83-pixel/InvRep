const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    cargo: {
        type: String,
        required: true,
        trim: true
    },
    creadoEn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Empleado', empleadoSchema);
