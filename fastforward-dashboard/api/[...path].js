import express from 'express';
import cors from 'cors';
import authRoutes from '../server/routes/auth.js';
import apiRoutes from '../server/routes/api.js';

const app = express();
app.use(cors());
app.use(express.json());

// /api/auth/* → authRoutes (called as /api/auth/login from client)
app.use('/api/auth', authRoutes);
// /api/* → apiRoutes
app.use('/api', apiRoutes);

export default app;
