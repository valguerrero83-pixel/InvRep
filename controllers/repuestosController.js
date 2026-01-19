const Repuesto = require('../models/Repuesto');
const Movimiento = require('../models/Movimiento');

// Listar todos los repuestos
exports.getAllRepuestos = async (req, res) => {
  try {
    const repuestos = await Repuesto.find();
    res.json(repuestos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear repuesto
exports.createRepuesto = async (req, res) => {
  try {
    const { nombre, cantidad, unidad, cantidadMinima } = req.body;

    const existe = await Repuesto.findOne({ nombre });
    if (existe) return res.status(400).json({ message: 'Repuesto ya existe' });

    const repuesto = new Repuesto({ nombre, cantidad, unidad, cantidadMinima });
    await repuesto.save();

    res.status(201).json({ message: 'Repuesto creado', repuesto });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Actualizar repuesto (cantidad, mínimo, etc.)
exports.updateRepuesto = async (req, res) => {
  try {
    const repuesto = await Repuesto.findById(req.params.id);
    if (!repuesto) return res.status(404).json({ message: 'Repuesto no encontrado' });

    const { nombre, cantidad, unidad, cantidadMinima } = req.body;
    if (nombre) repuesto.nombre = nombre;
    if (cantidad !== undefined) repuesto.cantidad = cantidad;
    if (unidad) repuesto.unidad = unidad;
    if (cantidadMinima !== undefined) repuesto.cantidadMinima = cantidadMinima;

    await repuesto.save();
    res.json({ message: 'Repuesto actualizado', repuesto });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
