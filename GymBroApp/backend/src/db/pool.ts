import dotenv from 'dotenv';
import mariadb from 'mariadb';

dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'gymbro',
  password: process.env.DB_PASSWORD || 'gymbro_pass',
  database: process.env.DB_NAME || 'gymbro',
  connectionLimit: 10,
  acquireTimeout: 30000,
});

export default pool;
