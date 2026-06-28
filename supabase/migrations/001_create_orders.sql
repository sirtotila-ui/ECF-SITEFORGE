-- Tabella ordini SiteForge (esegui in Supabase → SQL Editor → Run)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  package_id TEXT NOT NULL CHECK (package_id IN ('base', 'pro', 'elite')),
  form_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  stripe_session_id TEXT
);

CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS attivo senza policy pubbliche: solo service_role (server) accede ai dati
