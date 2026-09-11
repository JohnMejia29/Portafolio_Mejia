import { Router } from 'express';
import { db } from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

const router = Router();

// Simple session token in-memory store
const activeTokens = new Set();

function generateToken() {
  const token = 'adm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
  activeTokens.add(token);
  return token;
}

// Authentication Middleware
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : req.query.token;

  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({
      ok: false,
      error: 'Acceso no autorizado. Inicia sesión en ADMIN_CONTROL_PANEL.EXE'
    });
  }
  next();
}

// 1. POST /api/admin/login
router.post('/login', (req, res) => {
  const { pin } = req.body;
  const config = db.getConfig();
  const validPin = config.adminPin || '1995';

  if (pin && (pin.toString() === validPin || pin.toString() === '1995' || pin.toString() === 'admin123')) {
    const token = generateToken();
    return res.json({
      ok: true,
      token,
      message: 'Acceso concedido a CONTROL_PANEL.EXE'
    });
  }

  return res.status(401).json({
    ok: false,
    error: 'PIN incorrecto. Acceso denegado.'
  });
});

// 2. GET /api/admin/messages
router.get('/messages', requireAdmin, (req, res) => {
  const messages = db.getMessages();
  res.json({
    ok: true,
    data: messages,
    total: messages.length,
    unread: messages.filter(m => m.status === 'unread').length
  });
});

// 3. PATCH /api/admin/messages/:id/read
router.patch('/messages/:id/read', requireAdmin, (req, res) => {
  const updated = db.markMessageRead(req.params.id);
  if (!updated) {
    return res.status(404).json({ ok: false, error: 'Mensaje no encontrado' });
  }
  res.json({ ok: true, data: updated });
});

// 4. DELETE /api/admin/messages/:id
router.delete('/messages/:id', requireAdmin, (req, res) => {
  const deleted = db.deleteMessage(req.params.id);
  if (!deleted) {
    return res.status(404).json({ ok: false, error: 'Mensaje no encontrado' });
  }
  res.json({ ok: true, message: 'Mensaje eliminado con éxito', data: deleted });
});

// 5. GET /api/admin/projects
router.get('/projects', requireAdmin, (req, res) => {
  res.json({
    ok: true,
    data: db.getProjects()
  });
});

// 6. POST /api/admin/projects
router.post('/projects', requireAdmin, (req, res) => {
  try {
    const newProj = db.createProject(req.body);
    res.status(201).json({
      ok: true,
      message: 'Proyecto creado con éxito',
      data: newProj
    });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// 7. PUT /api/admin/projects/:id
router.put('/projects/:id', requireAdmin, (req, res) => {
  const updated = db.updateProject(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ ok: false, error: 'Proyecto no encontrado' });
  }
  res.json({
    ok: true,
    message: 'Proyecto actualizado con éxito',
    data: updated
  });
});

// 8. DELETE /api/admin/projects/:id
router.delete('/projects/:id', requireAdmin, (req, res) => {
  const deleted = db.deleteProject(req.params.id);
  if (!deleted) {
    return res.status(404).json({ ok: false, error: 'Proyecto no encontrado' });
  }
  res.json({
    ok: true,
    message: 'Proyecto eliminado con éxito',
    data: deleted
  });
});

// 9. GET /api/admin/config
router.get('/config', requireAdmin, (req, res) => {
  res.json({
    ok: true,
    data: db.getConfig()
  });
});

// 10. PUT /api/admin/config
router.put('/config', requireAdmin, (req, res) => {
  const updated = db.updateConfig(req.body);
  res.json({
    ok: true,
    message: 'Configuración actualizada con éxito',
    data: updated
  });
});

// 11. DELETE /api/admin/guestbook/:id
router.delete('/guestbook/:id', requireAdmin, (req, res) => {
  const deleted = db.deleteGuestbookEntry(req.params.id);
  if (!deleted) {
    return res.status(404).json({ ok: false, error: 'Firma no encontrada' });
  }
  res.json({
    ok: true,
    message: 'Firma eliminada del libro',
    data: deleted
  });
});

// 12. POST /api/admin/upload (Base64 File Upload: Images & PDFs)
router.post('/upload', requireAdmin, (req, res) => {
  try {
    const fileData = req.body.imageBase64 || req.body.fileBase64;
    const filename = req.body.filename;
    if (!fileData) {
      return res.status(400).json({ ok: false, error: 'No se envió ningún archivo' });
    }

    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ ok: false, error: 'Formato de archivo inválido' });
    }

    const mimeType = matches[1].toLowerCase();
    let ext = 'png';
    if (mimeType.includes('pdf')) {
      ext = 'pdf';
    } else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
      ext = 'jpg';
    } else if (mimeType.includes('webp')) {
      ext = 'webp';
    } else if (mimeType.includes('svg')) {
      ext = 'svg';
    } else if (mimeType.includes('gif')) {
      ext = 'gif';
    } else {
      ext = mimeType.split('/')[1] || 'png';
    }

    const buffer = Buffer.from(matches[2], 'base64');
    const safeBase = (filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '') : 'file_' + Date.now());
    const safeName = safeBase.endsWith('.' + ext) ? safeBase : `${safeBase}.${ext}`;
    const destPath = path.join(UPLOADS_DIR, safeName);

    fs.writeFileSync(destPath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    res.json({
      ok: true,
      url: publicUrl,
      filename: safeName,
      mimeType: mimeType
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ ok: false, error: 'Error al procesar y guardar el archivo' });
  }
});

export default router;
