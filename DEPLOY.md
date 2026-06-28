# Deploy SiteForge su Vercel

## Variabili d'ambiente (Vercel → Settings → Environment Variables)

Imposta tutte per **Production**, **Preview** e **Development**.

| Variabile | Obbligatoria | Descrizione |
|-----------|:------------:|-------------|
| `STRIPE_SECRET_KEY` | ✓ | Chiave segreta Stripe (`sk_test_` o `sk_live_`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✓ | Chiave pubblica Stripe (`pk_test_` o `pk_live_`) |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BASE` | ✓ | Payment Link pacchetto Base |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO` | ✓ | Payment Link pacchetto Pro |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_ELITE` | ✓ | Payment Link pacchetto Elite |
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ | `https://osliugkfojfxvukvjrvg.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ | Secret key Supabase (server only) |
| `NEXT_PUBLIC_BASE_URL` | ✓ | URL produzione es. `https://ecf-siteforge.vercel.app` |
| `STRIPE_WEBHOOK_SECRET` | ○ | Per email post-pagamento |
| `RESEND_API_KEY` | ○ | API key Resend |
| `EMAIL_FROM` | ○ | Mittente email |
| `ADMIN_EMAIL` | ○ | Notifiche nuovi ordini |

**Non serve** `SUPABASE_DB_URL` su Vercel (solo per `npm run db:setup` in locale).

---

## Passo 1 — Push su GitHub

```bash
git add .
git commit -m "SiteForge: ready for Vercel deploy"
git push -u origin main
```

---

## Passo 2 — Import su Vercel

1. Vai su [vercel.com/new](https://vercel.com/new)
2. **Import** del repo `sirtotila-ui/ECF-SITEFORGE`
3. Framework: **Next.js** (rilevato automaticamente)
4. **Environment Variables** → incolla tutte le variabili dalla tabella sopra
5. Clicca **Deploy**

Al primo deploy Vercel assegna un URL tipo:
`https://ecf-siteforge.vercel.app`

---

## Passo 3 — Aggiorna URL produzione

1. In Vercel → **Settings → Environment Variables**
2. Imposta `NEXT_PUBLIC_BASE_URL` = il tuo URL Vercel (con `https://`)
3. **Redeploy** (Deployments → ⋯ → Redeploy)

---

## Passo 4 — Rigenera Payment Link Stripe

I link attuali reindirizzano a `localhost`. In locale, con `.env.local` aggiornato:

```bash
# In .env.local imposta:
# NEXT_PUBLIC_BASE_URL=https://TUO-URL.vercel.app

npm run stripe:setup-links
```

Copia i 3 nuovi link in **Vercel → Environment Variables** e redeploy.

In alternativa, modifica i redirect manualmente in **Stripe Dashboard → Payment Links**.

---

## Passo 5 — Webhook Stripe (produzione)

1. [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. **Add endpoint**
3. URL: `https://TUO-URL.vercel.app/api/webhooks/stripe`
4. Evento: `checkout.session.completed`
5. Copia **Signing secret** → `STRIPE_WEBHOOK_SECRET` su Vercel → Redeploy

---

## Passo 6 — Verifica

- [ ] Landing page carica
- [ ] Questionario → Procedi al pagamento → Stripe
- [ ] Pagamento test → pagina `/conferma`
- [ ] Ordine visibile in Supabase → Table Editor → `orders`
- [ ] (Opzionale) Email di conferma ricevuta

---

## Dominio custom (opzionale)

1. Vercel → **Settings → Domains** → aggiungi dominio
2. Aggiorna `NEXT_PUBLIC_BASE_URL` con il dominio custom
3. Rigenera Payment Link e webhook Stripe con il nuovo dominio
