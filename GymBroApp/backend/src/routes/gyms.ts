import { Request, Response, Router } from 'express';
import pool from '../db/pool';

const router = Router();

// ── GET /api/gyms ───────────────────────────────────────────
router.get('/', async (_req: Request, res: Response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const gyms = await conn.query('SELECT * FROM gym ORDER BY name');
    res.json(gyms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch gyms' });
  } finally {
    if (conn) conn.release();
  }
});

// ── GET /api/gyms/:id ───────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [gym] = await conn.query('SELECT * FROM gym WHERE id = ?', [req.params.id]);
    if (!gym) return res.status(404).json({ error: 'Gym not found' });
    res.json(gym);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch gym' });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
