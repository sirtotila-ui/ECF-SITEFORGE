import pg from "pg";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env.local");
const sqlPath = resolve(root, "supabase/migrations/001_create_orders.sql");

function loadEnv() {
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    process.env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
}

loadEnv();

const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error(`
SUPABASE_DB_URL mancante in .env.local

1. Supabase Dashboard → Project Settings → Database
2. Copia "Connection string" (URI, mode Session)
3. Aggiungi in .env.local:
   SUPABASE_DB_URL=postgresql://postgres.osliugkfojfxvukvjrvg:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres

Oppure esegui manualmente il SQL in Supabase → SQL Editor:
   supabase/migrations/001_create_orders.sql
`);
  process.exit(1);
}

const sql = readFileSync(sqlPath, "utf-8");
const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log("Tabella orders creata con successo.");
} catch (err) {
  console.error("Errore:", err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await client.end();
}
