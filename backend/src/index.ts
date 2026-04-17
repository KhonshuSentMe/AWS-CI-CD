import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get('/api/message', (req, res) => {
  res.json({ text: 'Hello from the backend!' });
});

app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS timestamp');
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('DB ERROR:', err);
    res.status(500).json({
      error: 'Database query failed',
      details: err.message,
    });
  }
});

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS timestamp');
    res.json({ success: true, result: result.rows[0] });
  } catch (err: any) {
    console.error('DB ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});