import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import attachmentsRouter from './routes/attachments';
import gymsRouter from './routes/gyms';
import relationsRouter from './routes/relations';
import usersRouter from './routes/users';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001');

app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/api/users', usersRouter);
app.use('/api/gyms', gymsRouter);
app.use('/api/relations', relationsRouter);
app.use('/api/attachments', attachmentsRouter);

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏋️  GymBro API running on http://localhost:${PORT}`);
});
