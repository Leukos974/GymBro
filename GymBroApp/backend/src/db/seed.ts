import pool from './pool';

/**
 * Insert demo data so the front-end has content to display immediately.
 */
async function seed() {
  let conn;
  try {
    conn = await pool.getConnection();

    // ── Gyms ────────────────────────────────────────────────────
    await conn.query(`
      INSERT IGNORE INTO gym (id, name, location) VALUES
        (1, 'FitPark Central',   'Paris 1er'),
        (2, 'IronHouse',         'Lyon 3e'),
        (3, 'Muscle Factory',    'Marseille 6e');
    `);

    // ── Users (no real images, attachment_id NULL for seed) ─────
    await conn.query(`
      INSERT IGNORE INTO user (id, name, family_name, age, type, description, gym_id) VALUES
        (1, 'Alex',    'Dupont',   24, 'mass_gain',   'Looking for a gym buddy to push through heavy sets!', 1),
        (2, 'Marie',   'Leroy',    22, 'cardio',      'Running lover, training for a marathon 🏃‍♀️',         1),
        (3, 'Thomas',  'Bernard',  28, 'strength',    'Powerlifter, always down for PR attempts.',          2),
        (4, 'Camille', 'Moreau',   25, 'mass_loss',   'On a cut right now, need accountability partner.',   1),
        (5, 'Lucas',   'Petit',    30, 'flexibility', 'Yoga + calisthenics. Let\\'s stretch and grow!',      3);
    `);

    // ── Exos (max 3 per user) ──────────────────────────────────
    await conn.query(`
      INSERT IGNORE INTO user_exos (id, user_id, label) VALUES
        (1, 1, 'Bench'),  (2, 1, 'Squat'),   (3, 1, 'Deadlift'),
        (4, 2, 'Running'),(5, 2, 'Cycling'),  (6, 2, 'HIIT'),
        (7, 3, 'Squat'),  (8, 3, 'Deadlift'), (9, 3, 'OHP'),
        (10, 4, 'Push'),  (11, 4, 'Pull'),    (12, 4, 'Legs'),
        (13, 5, 'Yoga'),  (14, 5, 'Handstand'),(15, 5, 'Rings');
    `);

    console.log('🌱  Seed data inserted.');
  } catch (err) {
    console.error('❌  Seed failed:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
