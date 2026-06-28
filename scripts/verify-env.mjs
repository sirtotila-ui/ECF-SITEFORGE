import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const REQUIRED = [
  { key: "STRIPE_SECRET_KEY", hint: "Stripe Dashboard → API Keys" },
  { key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", hint: "Stripe Dashboard → API Keys" },
  { key: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BASE", hint: "npm run stripe:setup-links" },
  { key: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO", hint: "npm run stripe:setup-links" },
  { key: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_ELITE", hint: "npm run stripe:setup-links" },
  { key: "NEXT_PUBLIC_SUPABASE_URL", hint: "Supabase → Settings → API" },
  { key: "SUPABASE_SERVICE_ROLE_KEY", hint: "Supabase → Settings → API (secret)" },
  { key: "NEXT_PUBLIC_BASE_URL", hint: "https://tuodominio.vercel.app" },
];

const RECOMMENDED = [
  { key: "STRIPE_WEBHOOK_SECRET", hint: "Stripe → Webhooks (email automatiche)" },
  { key: "RESEND_API_KEY", hint: "resend.com → API Keys" },
  { key: "EMAIL_FROM", hint: "SiteForge <noreply@tuodominio.it>" },
  { key: "ADMIN_EMAIL", hint: "info@ecfmedia.it" },
];

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = {
  ...loadEnvFile(resolve(root, ".env.local")),
  ...process.env,
};

console.log("\n=== SiteForge — Verifica variabili d'ambiente ===\n");

let missing = 0;

for (const { key, hint } of REQUIRED) {
  const ok = Boolean(env[key]);
  console.log(`${ok ? "✓" : "✗"} ${key}${ok ? "" : `  → ${hint}`}`);
  if (!ok) missing++;
}

console.log("\n--- Consigliate per produzione ---\n");

for (const { key, hint } of RECOMMENDED) {
  const ok = Boolean(env[key]);
  console.log(`${ok ? "✓" : "○"} ${key}${ok ? "" : `  → ${hint}`}`);
}

if (env.NEXT_PUBLIC_BASE_URL?.includes("localhost")) {
  console.log("\n⚠ NEXT_PUBLIC_BASE_URL punta a localhost — aggiorna per produzione.");
}

console.log(missing ? `\n${missing} variabili obbligatorie mancanti.\n` : "\nTutte le variabili obbligatorie sono presenti.\n");
process.exit(missing > 0 ? 1 : 0);
