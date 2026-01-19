const express = require('express');
const router = express.Router();
const controller = require('../controllers/movimientosController');

// ENTRADAS
router.post('/entrada', controller.registrarEntrada);

// SALIDAS
router.post('/salida', controller.registrarSalida);

// HISTORIAL
router.get('/', controller.obtenerMovimientos);

module.exports = router;
