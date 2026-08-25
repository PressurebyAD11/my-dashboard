import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from '../server/routes/auth.js';
import apiRoutes from '../server/routes/api.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '../client/dist');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Serve built static files; SPA fallback for unmatched routes
app.use(express.static(distDir));
app.get('*', (_req, res) => res.sendFile(join(distDir, 'index.html')));

export default app;
