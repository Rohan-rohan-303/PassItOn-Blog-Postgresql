import dns from 'dns'
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Prefer IPv4 DNS results first to avoid ENETUNREACH errors in environments
// that don't have IPv6 routing available (Render + some cloud DBs can prefer
// AAAA records and fail to connect). This is safe — it gracefully no-ops on
// Node versions that don't support setDefaultResultOrder.
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first')
}

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

/* Helper: lightweight retry/backoff for transient DB/network errors. */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isTransientError(err: any) {
  if (!err) return false;
  const transientCodes = new Set([
    'ENETUNREACH',
    'ETIMEDOUT',
    'ECONNRESET',
    'ECONNREFUSED',
    'EHOSTUNREACH',
    'EAI_AGAIN',
  ]);
  if (err.code && transientCodes.has(err.code)) return true;
  const msg = String(err.message || '').toLowerCase();
  if (msg.includes('timeout') || msg.includes('network') || msg.includes('connect')) return true;
  return false;
}

export const query = async (text: string, params?: unknown[]) => {
  const maxAttempts = 5;
  let attempt = 0;
  let delay = 200; // initial backoff (ms)

  while (true) {
    try {
      attempt++;
      return await pool.query(text, params);
    } catch (err: any) {
      // If it's not a transient error or we've exhausted retries -> throw
      if (!isTransientError(err) || attempt >= maxAttempts) {
        console.error('DB query failed (no more retries):', { text, params, attempt, error: err });
        throw err;
      }

      console.warn(
        `Transient DB error (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms`,
        err.code || err.message,
      );

      await sleep(delay);
      delay *= 2; // exponential backoff
    }
  }
};

// Lightweight health check used by deployments/health endpoints.
export const checkConnection = async () => {
  try {
    await query('SELECT 1');
    return true;
  } catch (err) {
    console.error('DB health check failed:', err);
    return false;
  }
};

export default pool;