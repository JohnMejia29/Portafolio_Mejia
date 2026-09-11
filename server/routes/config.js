import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// GET /api/config - Public profile and social links
router.get('/', (req, res) => {
  const config = db.getConfig();
  // Strip private info like adminPin for public response
  const { adminPin, ...publicConfig } = config;
  res.json({
    ok: true,
    data: publicConfig
  });
});

export default router;
