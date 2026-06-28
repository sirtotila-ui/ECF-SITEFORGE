import Stripe from "stripe";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error(".env.local non trovato");
    process.exit(1);
  }
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

const PACKAGES = [
  { id: "base", name: "SiteForge Base", amount: 9700, envKey: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BASE" },
  { id: "pro", name: "SiteForge Pro", amount: 29700, envKey: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO" },
  { id: "elite", name: "SiteForge Elite", amount: 69700, envKey: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_ELITE" },
];

loadEnv();

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY mancante in .env.local");
  process.exit(1);
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const stripe = new Stripe(key);

async function main() {
  const results = {};

  for (const pkg of PACKAGES) {
    const product = await stripe.products.create({
      name: pkg.name,
      description: `Sito web professionale — Pacchetto ${pkg.id.charAt(0).toUpperCase() + pkg.id.slice(1)}`,
      metadata: { packageId: pkg.id },
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: pkg.amount,
      currency: "eur",
    });

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: { packageId: pkg.id },
      after_completion: {
        type: "redirect",
        redirect: { url: `${baseUrl}/conferma?session_id={CHECKOUT_SESSION_ID}` },
      },
    });

    results[pkg.envKey] = paymentLink.url;
    console.log(`${pkg.name}: ${paymentLink.url}`);
  }

  let envContent = readFileSync(envPath, "utf-8");
  for (const [envKey, url] of Object.entries(results)) {
    const regex = new RegExp(`^${envKey}=.*$`, "m");
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${envKey}=${url}`);
    } else {
      envContent += `\n${envKey}=${url}`;
    }
  }
  writeFileSync(envPath, envContent, "utf-8");
  console.log("\nPayment link salvati in .env.local");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
