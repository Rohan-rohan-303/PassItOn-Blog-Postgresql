#!/usr/bin/env node
// Simple initializer: reads backend/db/init.sql and runs it against the configured DB
import fs from 'fs/promises'
import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const getConnection = () => {
  if (process.env.DATABASE_URL) return { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  return {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT) || 5432,
  }
}

const run = async () => {
  try {
    const conn = getConnection()
    const client = new Client(conn)
    await client.connect()

    const sql = await fs.readFile(new URL('../db/init.sql', import.meta.url), 'utf8')
    console.log('Running SQL initialization...')
    await client.query(sql)
    console.log('Database initialization finished.')
    await client.end()
  } catch (err) {
    console.error('Failed to initialize DB:', err)
    process.exit(1)
  }
}

run()
