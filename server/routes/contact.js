import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// POST /api/contact - Recibe mensajes del formulario de contacto
router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: 'Por favor completa todos los campos requeridos (nombre, email y mensaje).'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        error: 'El formato de correo electrónico no es válido.'
      });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const saved = db.addMessage({ name, email, subject, message, ip });

    return res.status(201).json({
      ok: true,
      message: '¡Mensaje recibido y guardado con éxito en el servidor de PORTFOLIO.EXE!',
      data: {
        id: saved.id,
        createdAt: saved.createdAt
      }
    });
  } catch (error) {
    console.error('Error al procesar mensaje de contacto:', error);
    return res.status(500).json({
      ok: false,
      error: 'Error interno del servidor al procesar el mensaje.'
    });
  }
});

// GET /api/contact - Obtener mensajes recibidos (para panel / terminal)
router.get('/', (req, res) => {
  try {
    const messages = db.getMessages();
    return res.json({
      ok: true,
      total: messages.length,
      data: messages
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Error al consultar mensajes.' });
  }
});

export default router;
