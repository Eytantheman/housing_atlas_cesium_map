import { Router } from 'express';
import { getAllProjects } from '../services/projectsService';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    projectCount: getAllProjects().length,
    timestamp: new Date().toISOString(),
  });
});

export default router;
