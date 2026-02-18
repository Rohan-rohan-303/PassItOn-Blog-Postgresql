import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Prefer DATABASE_URL (Supabase). Fall back to individual PG_* for local dev.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: Number(process.env.PG_PORT) || 5432,
    });

export const query = (text: string, params?: unknown[]) => pool.query(text, params);

export default pool;