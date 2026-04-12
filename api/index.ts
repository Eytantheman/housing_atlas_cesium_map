/**
 * Vercel serverless entry point — self-contained Express app.
 * Data files are copied into api/data/ at build time (see vercel.json buildCommand).
 */
import path from 'path';
// Redirect data path to api/data when running on Vercel
process.env.DATA_DIR = path.join(__dirname, 'data');

import app from '../server/src/index';
export default app;
