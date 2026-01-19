const BASE_URL = 'https://nombre-de-tu-proyecto.up.railway.app';  // Cambia por el de tu proyecto en Railway

const DBAPI = {
  async obtenerRepuestos() {
    try {
      const res = await fetch(`${BASE_URL}/api/repuestos`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('Error obteniendo repuestos:', e);
      return [];
    }
  },

  async login(usuario, password) {
    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });
      if (!res.ok) return false;
      return await res.json();
    } catch (err) {
      console.error('Error en login:', err);
      return false;
    }
  },

  async registrarMovimiento(movimiento) {
    try {
      const url = movimiento.tipo === 'entrada'
        ? `${BASE_URL}/api/movimientos/entrada`
        : `${BASE_URL}/api/movimientos/salida`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movimiento)
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Error registrando movimiento:', err);
        return false;
      }

      return true;
    } catch (e) {
      console.error('Error registrando movimiento:', e);
      return false;
    }
  },

  async obtenerMovimientos(tipo = '') {
    try {
      const params = tipo ? `?tipo=${tipo}` : '';
      const res = await fetch(`${BASE_URL}/api/movimientos${params}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('Error obteniendo movimientos:', e);
      return [];
    }
  }
};
