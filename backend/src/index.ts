import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

app.get('/api/message', (req, res) => {
  res.json({ text: 'Hello from the backend!' });
});

app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sample_data');
    res.json(result.rows);
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
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, result: result.rows });
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