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

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(compression());
app.use(express.json());

// Rate-limit only the PDOK-proxying bbox endpoint
const bboxLimiter = rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false });

app.use('/api/projects', projectsRouter);
app.use('/api/buildings/bbox', bboxLimiter);
app.use('/api/buildings', buildingsRouter);
app.use('/api/health', healthRouter);

app.use(errorHandler);

// Resolve BAG IDs once at startup (cached after first run)
resolveBagIds().catch(e => console.error('[bagIdResolver] Failed:', e));

export default app;

// Start local server only when not running on Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT ?? 3001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
