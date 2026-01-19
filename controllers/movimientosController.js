const Movimiento = require('../models/Movimiento');
const Repuesto = require('../models/Repuesto');

// ==============================
// REGISTRAR ENTRADA
// ==============================
exports.registrarEntrada = async (req, res) => {
    try {
        const { repuestoId, cantidad, ingresadoPor, notas } = req.body;

        if (!repuestoId || !cantidad || cantidad <= 0 || !ingresadoPor) {
            return res.status(400).json({ message: 'Datos incompletos o inválidos' });
        }

        const repuesto = await Repuesto.findById(repuestoId);
        if (!repuesto) {
            return res.status(404).json({ message: 'Repuesto no encontrado' });
        }

        // Actualizar stock
        repuesto.stock = (repuesto.stock || 0) + cantidad;
        await repuesto.save();

        const movimiento = await Movimiento.create({
            tipo: 'entrada',
            repuesto: repuesto._id,
            repuestoNombre: repuesto.nombre,
            cantidad,
            unidad: repuesto.unidad,
            ingresadoPor,
            notas
        });

        res.status(201).json({ message: 'Entrada registrada', movimiento });

    } catch (error) {
        console.error('Error registrar entrada:', error);
        res.status(500).json({ message: 'Error al registrar entrada', error: error.message });
    }
};

// ==============================
// REGISTRAR SALIDA
// ==============================
exports.registrarSalida = async (req, res) => {
    try {
        const { repuestoId, cantidad, entregadoPor, recibidoPor } = req.body;

        if (!repuestoId || !cantidad || cantidad <= 0 || !entregadoPor || !recibidoPor) {
            return res.status(400).json({ message: 'Datos incompletos o inválidos' });
        }

        const repuesto = await Repuesto.findById(repuestoId);
        if (!repuesto) {
            return res.status(404).json({ message: 'Repuesto no encontrado' });
        }

        if (cantidad > (repuesto.stock || 0)) {
            return res.status(400).json({
                message: `Stock insuficiente (${repuesto.stock || 0} ${repuesto.unidad})`
            });
        }

        // Actualizar stock
        repuesto.stock -= cantidad;
        await repuesto.save();

        const movimiento = await Movimiento.create({
            tipo: 'salida',
            repuesto: repuesto._id,
            repuestoNombre: repuesto.nombre,
            cantidad,
            unidad: repuesto.unidad,
            entregadoPor,
            recibidoPor
        });

        res.status(201).json({ message: 'Salida registrada', movimiento });

    } catch (error) {
        console.error('Error registrar salida:', error);
        res.status(500).json({ message: 'Error al registrar salida', error: error.message });
    }
};

// ==============================
// OBTENER HISTORIAL
// ==============================
exports.obtenerMovimientos = async (req, res) => {
    try {
        const { tipo, repuestoNombre, empleadoId, desde, hasta } = req.query;
        const filtro = {};

        if (tipo) filtro.tipo = tipo;
        if (repuestoNombre) filtro.repuestoNombre = repuestoNombre;
        if (empleadoId) {
            filtro.$or = [
                { ingresadoPor: empleadoId },
                { entregadoPor: empleadoId },
                { recibidoPor: empleadoId }
            ];
        }
        if (desde || hasta) {
            filtro.fecha = {};
            if (desde) filtro.fecha.$gte = new Date(desde);
            if (hasta) filtro.fecha.$lte = new Date(hasta);
        }

        const movimientos = await Movimiento
            .find(filtro)
            .sort({ fecha: -1 })
            .limit(200);

        res.json({ movimientos });

    } catch (error) {
        console.error('Error obtener historial:', error);
        res.status(500).json({ message: 'Error al obtener movimientos', error: error.message });
    }
};
