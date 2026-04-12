import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import projectsRouter from './routes/projects';
import buildingsRouter from './routes/buildings';
import healthRouter from './routes/health';
import { resolveBagIds } from './services/bagIdResolver';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(compression());
app.use(express.json());

// Rate-limit only the PDOK-proxying bbox endpoint — it triggers upstream
// requests to PDOK which rate-limits aggressively above ~3 req/s.
// All other routes (projects, metadata) are un-throttled.
const bboxLimiter = rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false });

app.use('/api/projects', projectsRouter);
app.use('/api/buildings/bbox', bboxLimiter);
app.use('/api/buildings', buildingsRouter);
app.use('/api/health', healthRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Resolve BAG IDs in the background — first run hits 3DBAG API, subsequent
  // runs load from bag-ids-cache.json instantly.
  resolveBagIds().catch(e => console.error('[bagIdResolver] Failed:', e));
});

export default app;
