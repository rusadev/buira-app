import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPassword = process.env.SUPABASE_DB_PASSWORD || 'bersamabuira@2026';
const projectRef = 'muxjnzfyrorvxgmbtdvx';

const connectionHosts = [
  { host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 6543, user: `postgres.${projectRef}` },
  { host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 5432, user: `postgres.${projectRef}` },
  { host: `db.${projectRef}.supabase.co`, port: 5432, user: 'postgres' },
];

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  console.log(`📁 Found ${files.length} migration files in supabase/migrations/`);

  let connectedClient = null;

  for (const conn of connectionHosts) {
    console.log(`🔌 Connecting to Supabase Postgres (${conn.host}:${conn.port})...`);
    const client = new Client({
      host: conn.host,
      port: conn.port,
      user: conn.user,
      password: dbPassword,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    });

    try {
      await client.connect();
      console.log(`✅ Connected successfully to Supabase Postgres database!`);
      connectedClient = client;
      break;
    } catch (err) {
      console.log(`⚠️ Connection to ${conn.host}:${conn.port} failed: ${err.message}`);
      try { await client.end(); } catch {}
    }
  }

  if (!connectedClient) {
    console.log(`\n================================================================`);
    console.log(`💡 NOTE: Direct TCP Postgres connection couldn't reach Supabase pooler.`);
    console.log(`Please run the migration directly in Supabase SQL Editor.`);
    console.log(`File: supabase/migrations/20260808000001_add_module_prefixes.sql`);
    console.log(`================================================================\n`);
    return;
  }

  try {
    for (const file of files) {
      console.log(`⚡ Running migration: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      await connectedClient.query(sql);
      console.log(`✅ Applied: ${file}`);
    }
    console.log(`🎉 All database migrations applied successfully to Supabase!`);
  } catch (err) {
    console.error(`❌ Migration Error:`, err.message);
  } finally {
    await connectedClient.end();
  }
}

runMigrations();
