import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hostsToTry = [
  { host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 6543 },
  { host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 5432 },
];

const password = process.env.SUPABASE_DB_PASSWORD || 'bersamabuira@2026';
const user = 'postgres.muxjnzfyrorvxgmbtdvx';
const database = 'postgres';

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, 'supabase_schema.sql'), 'utf8');

  for (const target of hostsToTry) {
    console.log(`Connecting to Supabase Pooler at ${target.host}:${target.port}...`);
    const client = new Client({
      host: target.host,
      port: target.port,
      user: user,
      password: password,
      database: database,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    });

    try {
      await client.connect();
      console.log(`✅ Connected to Supabase Postgres database!`);
      console.log(`Executing SQL migration script...`);
      await client.query(sql);
      console.log(`🚀 SQL Migration executed cleanly on Supabase database!`);
      await client.end();
      return true;
    } catch (err) {
      console.log(`Failed connecting: ${err.message}`);
      try { await client.end(); } catch {}
    }
  }

  return false;
}

migrate();
