# SiteForge by ECF Media

Sito web professionale per il servizio SiteForge — generazione automatica di siti web per attività locali.

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS 4**
- **Stripe Checkout** per i pagamenti
- **Supabase** per il salvataggio ordini
- **Resend** per le email automatiche

## Avvio rapido

```bash
npm install
cp .env.example .env.local
# Configura le variabili in .env.local
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Configurazione Stripe

1. Crea un account su [stripe.com](https://stripe.com) o usa `stripe sandbox create` con la CLI
2. Copia la **Secret Key** in `STRIPE_SECRET_KEY`
3. Per i webhook in locale:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copia il webhook signing secret in `STRIPE_WEBHOOK_SECRET`

## Configurazione Supabase

1. Crea un progetto su [supabase.com](https://supabase.com)
2. Vai su **SQL Editor** ed esegui il file `supabase/migrations/001_create_orders.sql`
3. In **Project Settings → API**, copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

Gli ordini vengono salvati nella tabella `orders` con i campi: `id`, `package_id`, `form_data` (JSON), `status`, `created_at`, `paid_at`, `stripe_session_id`.

## Configurazione Email (Resend)

1. Registrati su [resend.com](https://resend.com)
2. Verifica il tuo dominio o usa `onboarding@resend.dev` per i test
3. Copia la API key in `RESEND_API_KEY`

## Struttura

| Pagina | Percorso | Descrizione |
|--------|----------|-------------|
| Landing | `/` | Hero, come funziona, pacchetti, FAQ |
| Ordine | `/ordine?pacchetto=base\|pro\|elite` | Form 22 domande in 6 sezioni |
| Conferma | `/conferma` | Pagina post-pagamento |
| Privacy | `/privacy` | Privacy policy |

## Pacchetti

| Pacchetto | Prezzo |
|-----------|--------|
| Base | 97€ |
| Pro | 297€ |
| Elite | 697€ |

## Flusso utente

1. L'utente sceglie un pacchetto dalla landing page
2. Compila il questionario (22 domande, 6 sezioni)
3. Viene reindirizzato a Stripe Checkout
4. Dopo il pagamento → pagina di conferma + email automatica

## Deploy su Vercel

Guida completa: **[DEPLOY.md](./DEPLOY.md)**

Verifica variabili locali:

```bash
npm run env:check
```
