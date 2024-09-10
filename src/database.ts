import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log('Database connected');
  } catch (err) {
    console.error('Error connecting to the database', err);
    throw err;
  }
};