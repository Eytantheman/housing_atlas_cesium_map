import { Router, Request, Response } from 'express';
import { filterProjects, getProjectById, toGeoJSON } from '../services/projectsService';
import { getSplatUrl } from '../services/splatsService';
import { searchArchive } from '../services/rijksmuseum';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { city, era, social_org, q } = req.query as Record<string, string>;
  res.json(toGeoJSON(filterProjects({ city, era, social_org, q })));
});

router.get('/list', (req: Request, res: Response) => {
  const { city, era, social_org, q } = req.query as Record<string, string>;
  res.json(filterProjects({ city, era, social_org, q }));
});

router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const project = getProjectById(id);
  if (!project) {
    res.status(404).json({ error: 'Not found', code: 404 });
    return;
  }
  res.json(project);
});

router.get('/:id/archive', async (req: Request, res: Response) => {
  const project = getProjectById(parseInt(req.params.id));
  if (!project) {
    res.status(404).json({ error: 'Not found', code: 404 });
    return;
  }
  const results = await searchArchive(project.name, project.architect);
  res.json(results);
});

router.get('/:id/splat', (req: Request, res: Response) => {
  const url = getSplatUrl(parseInt(req.params.id));
  res.json({ url });
});

export default router;
