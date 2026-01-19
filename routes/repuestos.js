const express = require('express');
const router = express.Router();
const repuestosController = require('../controllers/repuestosController');

router.get('/', repuestosController.getAllRepuestos);
router.post('/', repuestosController.createRepuesto);
router.put('/:id', repuestosController.updateRepuesto);

module.exports = router;
