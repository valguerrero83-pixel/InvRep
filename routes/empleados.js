const express = require('express');
const router = express.Router();
const Empleado = require('../models/Empleado');

// GET /api/empleados → listar todos
router.get('/', async (req, res) => {
    try {
        const empleados = await Empleado.find().sort({ creadoEn: -1 });
        res.json(empleados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener empleados' });
    }
});

// GET /api/empleados/:id → obtener empleado por ID
router.get('/:id', async (req, res) => {
    try {
        const empleado = await Empleado.findById(req.params.id);
        if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
        res.json(empleado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener empleado' });
    }
});

// POST /api/empleados → crear empleado
router.post('/', async (req, res) => {
    try {
        const { nombre, cargo } = req.body;
        const nuevoEmpleado = new Empleado({ nombre, cargo });
        const empleadoGuardado = await nuevoEmpleado.save();
        res.status(201).json(empleadoGuardado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear empleado' });
    }
});

// PUT /api/empleados/:id → actualizar empleado
router.put('/:id', async (req, res) => {
    try {
        const { nombre, cargo } = req.body;
        const empleado = await Empleado.findByIdAndUpdate(
            req.params.id,
            { nombre, cargo },
            { new: true, runValidators: true }
        );
        if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
        res.json(empleado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar empleado' });
    }
});

// DELETE /api/empleados/:id → eliminar empleado
router.delete('/:id', async (req, res) => {
    try {
        const empleado = await Empleado.findByIdAndDelete(req.params.id);
        if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
        res.json({ mensaje: 'Empleado eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar empleado' });
    }
});

module.exports = router;
