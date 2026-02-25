import pool from './pool';

/**
 * Initialise the GymBro database schema.
 *
 * Tables
 * ------
 * attachment  – raw image blobs stored in-DB (no external service)
 * gym         – gym name + location
 * user        – profiles, linked to gym & attachment
 * user_exos   – favourite exercises per user (max 3 enforced in app)
 * user_like   – directional "I like this person" edges
 * relation    – created once a mutual like exists (match)
 * message     – chat messages inside a relation
 */
async function initDB() {
  let conn;
  try {
    conn = await pool.getConnection();

    // ── ATTACHMENT ──────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS attachment (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        namefile    VARCHAR(255)   NOT NULL,
        data        LONGBLOB       NOT NULL,
        mime_type   VARCHAR(100)   NOT NULL DEFAULT 'image/jpeg',
        created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ── GYM ────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS gym (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        name          VARCHAR(255)  NOT NULL,
        location      VARCHAR(500)  NOT NULL,
        attachment_id INT           NULL,
        FOREIGN KEY (attachment_id) REFERENCES attachment(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ── USER ───────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS user (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        name          VARCHAR(100)  NOT NULL,
        family_name   VARCHAR(100)  NOT NULL,
        age           INT           NOT NULL,
        type          ENUM('mass_gain','mass_loss','cardio','strength','flexibility')
                                    NOT NULL DEFAULT 'mass_gain',
        description   TEXT          NULL,
        gym_id        INT           NULL,
        attachment_id INT           NULL,
        created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (gym_id)        REFERENCES gym(id)        ON DELETE SET NULL,
        FOREIGN KEY (attachment_id) REFERENCES attachment(id)  ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ── USER_EXOS (favourite exercises, max 3 per user) ────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS user_exos (
        id      INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT          NOT NULL,
        label   VARCHAR(50)  NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ── USER_LIKE (directional like) ───────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS user_like (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        liker_id    INT      NOT NULL,
        liked_id    INT      NOT NULL,
        created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (liker_id, liked_id),
        FOREIGN KEY (liker_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (liked_id) REFERENCES user(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ── RELATION (match = mutual like) ─────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS relation (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user1_id   INT      NOT NULL,
        user2_id   INT      NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_relation (user1_id, user2_id),
        FOREIGN KEY (user1_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (user2_id) REFERENCES user(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ── MESSAGE ────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS message (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        relation_id  INT      NOT NULL,
        from_user_id INT      NOT NULL,
        content      TEXT     NOT NULL,
        sent_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (relation_id)  REFERENCES relation(id) ON DELETE CASCADE,
        FOREIGN KEY (from_user_id) REFERENCES user(id)     ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ── USER_SEEN (tracks passes so users don't reappear) ──────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS user_seen (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        viewer_id   INT      NOT NULL,
        seen_id     INT      NOT NULL,
        created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_seen (viewer_id, seen_id),
        FOREIGN KEY (viewer_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (seen_id)   REFERENCES user(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('✅  Database schema initialised successfully.');
  } catch (err) {
    console.error('❌  DB init failed:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

// Allow running directly: `npx ts-node src/db/init.ts`
initDB()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
