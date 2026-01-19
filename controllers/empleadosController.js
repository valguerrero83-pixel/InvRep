const Empleado = require('../models/Empleado');

// Funciones temporales para hash (solo pruebas)
const hashPassword = (password) => password;
const comparePassword = (password, hash) => password === hash;

// Listar todos los empleados
exports.getAllEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.json(empleados);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear empleado nuevo
exports.createEmpleado = async (req, res) => {
  try {
    const { nombre, email, rol, password } = req.body;

    // Verificar email
    const existe = await Empleado.findOne({ email });
    if (existe) return res.status(400).json({ message: 'Email ya registrado' });

    const empleado = new Empleado({
      nombre,
      email,
      rol,
      password: hashPassword(password)
    });

    await empleado.save();
    res.status(201).json({ message: 'Empleado creado', empleado });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Login
exports.loginEmpleado = async (req, res) => {
  try {
    const { email, password } = req.body;
    const empleado = await Empleado.findOne({ email });
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });

    if (!comparePassword(password, empleado.password))
      return res.status(401).json({ message: 'Contraseña incorrecta' });

    res.json({ message: 'Login exitoso', empleado });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
