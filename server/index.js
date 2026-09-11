import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import contactRoutes from './routes/contact.js';
import guestbookRoutes from './routes/guestbook.js';
import systemRoutes from './routes/system.js';
import adminRoutes from './routes/admin.js';
import projectsRoutes from './routes/projects.js';
import configRoutes from './routes/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const uploadsDir = path.join(rootDir, 'uploads');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/guestbook', guestbookRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/config', configRoutes);

// Static files (frontend portfolio)
app.use(express.static(rootDir));

// Fallback to index.html for root navigation
app.get('*', (req, res) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(rootDir, 'index.html'));
  } else {
    res.status(404).json({ error: 'Not Found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('========================================================');
  console.log(`PORTFOLIO.EXE BACKEND SERVER`);
  console.log(`Servidor activo en: http://localhost:${PORT}`);
  console.log(`Endpoints API disponibles:`);
  console.log(`   - POST /api/contact       (Envio de mensajes)`);
  console.log(`   - GET  /api/guestbook     (Firmas publicas)`);
  console.log(`   - POST /api/guestbook     (Firmar libro)`);
  console.log(`   - GET  /api/system/stats  (Visitas y metricas)`);
  console.log(`   - GET  /api/system/sysinfo(Telemetria de servidor)`);
  console.log('========================================================');
});
