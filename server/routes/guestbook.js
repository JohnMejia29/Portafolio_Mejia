import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// GET /api/guestbook - Listar firmas del libro de visitas
router.get('/', (req, res) => {
  try {
    const entries = db.getGuestbook();
    return res.json({
      ok: true,
      total: entries.length,
      data: entries
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Error al consultar el libro de visitas.' });
  }
});

// POST /api/guestbook - Firmar el libro de visitas
router.post('/', (req, res) => {
  try {
    const { name, avatar, badge, message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'El mensaje no puede estar vacío.'
      });
    }

    const newEntry = db.addGuestbookEntry({
      name,
      avatar,
      badge,
      message
    });

    return res.status(201).json({
      ok: true,
      message: '¡Firma agregada exitosamente al libro de visitas retro!',
      data: newEntry
    });
  } catch (error) {
    console.error('Error al firmar guestbook:', error);
    return res.status(500).json({ ok: false, error: 'Error al guardar la firma.' });
  }
});

// POST /api/guestbook/:id/like - Dar un like retro a una firma
router.post('/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.likeGuestbookEntry(id);
    if (!updated) {
      return res.status(404).json({ ok: false, error: 'Entrada no encontrada.' });
    }
    return res.json({ ok: true, data: updated });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Error al procesar el like.' });
  }
});

export default router;
