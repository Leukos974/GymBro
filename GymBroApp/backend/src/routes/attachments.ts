import { Request, Response, Router } from 'express';
import multer from 'multer';
import pool from '../db/pool';

const router = Router();
const MAX_SIZE = parseInt(process.env.MAX_IMAGE_SIZE_MB || '5') * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
});

// ── POST /api/attachments ───────────────────────────────────
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  let conn;
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO attachment (namefile, data, mime_type) VALUES (?, ?, ?)',
      [req.file.originalname, req.file.buffer, req.file.mimetype]
    );
    res.json({ id: Number(result.insertId) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload' });
  } finally {
    if (conn) conn.release();
  }
});

// ── GET /api/attachments/:id ────────────────────────────────
// Serves the raw image with the correct Content-Type
router.get('/:id', async (req: Request, res: Response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [row] = await conn.query(
      'SELECT data, mime_type, namefile FROM attachment WHERE id = ?',
      [req.params.id]
    );
    if (!row) return res.status(404).json({ error: 'Not found' });

    res.set('Content-Type', row.mime_type);
    res.set('Content-Disposition', `inline; filename="${row.namefile}"`);
    res.send(row.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attachment' });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
