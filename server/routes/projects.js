import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// GET /api/projects - Public list of all portfolio projects
router.get('/', (req, res) => {
  const category = req.query.category;
  let projects = db.getProjects();

  if (category && category !== 'all') {
    projects = projects.filter(p => p.category === category);
  }

  res.json({
    ok: true,
    data: projects,
    total: projects.length
  });
});

// GET /api/projects/:id - Get specific project by ID
router.get('/:id', (req, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ ok: false, error: 'Proyecto no encontrado' });
  }
  res.json({ ok: true, data: project });
});

export default router;
