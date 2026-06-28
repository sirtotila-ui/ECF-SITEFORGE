import { readFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

if (!existsSync(envPath)) {
  console.error(".env.local non trovato");
  process.exit(1);
}

const vars = {};
for (const line of readFileSync(envPath, "utf-8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq);
  const value = trimmed.slice(eq + 1);
  if (value) vars[key] = value;
}

const environments = ["production", "preview", "development"];

for (const [key, value] of Object.entries(vars)) {
  for (const env of environments) {
    try {
      execSync(`npx vercel env rm ${key} ${env} --yes`, {
        cwd: root,
        stdio: "ignore",
      });
    } catch {
      // var may not exist yet
    }
    execSync(`npx vercel env add ${key} ${env}`, {
      cwd: root,
      input: value,
      stdio: ["pipe", "inherit", "inherit"],
    });
    console.log(`✓ ${key} (${env})`);
  }
}

console.log("\nVariabili sincronizzate su Vercel.");
