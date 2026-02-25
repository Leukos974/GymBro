import { Request, Response, Router } from 'express';
import pool from '../db/pool';

const router = Router();

// ── GET /api/users/discover ─────────────────────────────────
// Returns users the current user has NOT yet liked, applying optional filters.
// Query params: currentUserId, minAge, maxAge, type, gymId
router.get('/discover', async (req: Request, res: Response) => {
  let conn;
  try {
    conn = await pool.getConnection();

    const currentUserId = parseInt(req.query.currentUserId as string) || 1;
    const minAge = req.query.minAge ? parseInt(req.query.minAge as string) : null;
    const maxAge = req.query.maxAge ? parseInt(req.query.maxAge as string) : null;
    const type = req.query.type as string | undefined;
    const gymId = req.query.gymId ? parseInt(req.query.gymId as string) : null;

    let sql = `
      SELECT u.id, u.name, u.family_name, u.age, u.type, u.description,
             u.gym_id, u.attachment_id,
             g.name AS gym_name, g.location AS gym_location
      FROM user u
      LEFT JOIN gym g ON u.gym_id = g.id
      WHERE u.id != ?
        AND u.id NOT IN (SELECT liked_id FROM user_like WHERE liker_id = ?)
    `;
    const params: any[] = [currentUserId, currentUserId];

    if (minAge !== null) {
      sql += ' AND u.age >= ?';
      params.push(minAge);
    }
    if (maxAge !== null) {
      sql += ' AND u.age <= ?';
      params.push(maxAge);
    }
    if (type) {
      sql += ' AND u.type = ?';
      params.push(type);
    }
    if (gymId !== null) {
      sql += ' AND u.gym_id = ?';
      params.push(gymId);
    }

    sql += ' ORDER BY RAND() LIMIT 20';

    const users = await conn.query(sql, params);

    // Attach exos for each user
    for (const user of users) {
      const exos = await conn.query(
        'SELECT label FROM user_exos WHERE user_id = ? LIMIT 3',
        [user.id]
      );
      user.exos = exos.map((e: any) => e.label);
    }

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  } finally {
    if (conn) conn.release();
  }
});

// ── GET /api/users/:id ──────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [user] = await conn.query(
      `SELECT u.*, g.name AS gym_name, g.location AS gym_location
       FROM user u LEFT JOIN gym g ON u.gym_id = g.id
       WHERE u.id = ?`,
      [req.params.id]
    );
    if (!user) return res.status(404).json({ error: 'User not found' });

    const exos = await conn.query(
      'SELECT label FROM user_exos WHERE user_id = ? LIMIT 3',
      [user.id]
    );
    user.exos = exos.map((e: any) => e.label);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  } finally {
    if (conn) conn.release();
  }
});

// ── PUT /api/users/:id ──────────────────────────────────────
router.put('/:id', async (req: Request, res: Response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { name, family_name, age, type, description, gym_id, exos } = req.body;

    await conn.query(
      `UPDATE user SET name=?, family_name=?, age=?, type=?, description=?, gym_id=?
       WHERE id=?`,
      [name, family_name, age, type, description, gym_id, req.params.id]
    );

    // Update exos: delete old, insert new (max 3)
    if (exos && Array.isArray(exos)) {
      await conn.query('DELETE FROM user_exos WHERE user_id = ?', [req.params.id]);
      for (const label of exos.slice(0, 3)) {
        await conn.query(
          'INSERT INTO user_exos (user_id, label) VALUES (?, ?)',
          [req.params.id, label]
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  } finally {
    if (conn) conn.release();
  }
});

// ── POST /api/users/:id/like ────────────────────────────────
// Like another user. If mutual, create a relation (match).
router.post('/:id/like', async (req: Request, res: Response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const likerId = parseInt(req.params.id);
    const likedId = parseInt(req.body.likedUserId);

    // Insert the like
    await conn.query(
      'INSERT IGNORE INTO user_like (liker_id, liked_id) VALUES (?, ?)',
      [likerId, likedId]
    );

    // Check if it's mutual
    const mutual = await conn.query(
      'SELECT id FROM user_like WHERE liker_id = ? AND liked_id = ?',
      [likedId, likerId]
    );

    let matched = false;
    if (mutual.length > 0) {
      // Create relation (lower id first for unique constraint)
      const u1 = Math.min(likerId, likedId);
      const u2 = Math.max(likerId, likedId);
      await conn.query(
        'INSERT IGNORE INTO relation (user1_id, user2_id) VALUES (?, ?)',
        [u1, u2]
      );
      matched = true;
    }

    res.json({ success: true, matched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to like user' });
  } finally {
    if (conn) conn.release();
  }
});

// ── POST /api/users/:id/pass ────────────────────────────────
// Record a pass (still insert into user_like so they don't reappear — or use a separate table)
// For now we just acknowledge it; the user won't reappear because the discover
// query already filters out previously-seen users via user_like.
// We add a special "pass" so they are excluded.
router.post('/:id/pass', async (req: Request, res: Response) => {
  // We just don't insert anything — the frontend will skip them in local state.
  // In a real app you'd have a "user_seen" table.
  res.json({ success: true });
});

// ── GET /api/users/:id/matches ──────────────────────────────
router.get('/:id/matches', async (req: Request, res: Response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const userId = parseInt(req.params.id);

    const matches = await conn.query(
      `SELECT r.id AS relation_id,
              CASE WHEN r.user1_id = ? THEN r.user2_id ELSE r.user1_id END AS partner_id,
              u.name, u.family_name, u.age, u.type, u.attachment_id,
              g.name AS gym_name
       FROM relation r
       JOIN user u ON u.id = CASE WHEN r.user1_id = ? THEN r.user2_id ELSE r.user1_id END
       LEFT JOIN gym g ON u.gym_id = g.id
       WHERE r.user1_id = ? OR r.user2_id = ?
       ORDER BY r.created_at DESC`,
      [userId, userId, userId, userId]
    );

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch matches' });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
