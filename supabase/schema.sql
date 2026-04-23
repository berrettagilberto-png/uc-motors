-- UC Motors – Schema database
-- Esegui questo script nell'editor SQL di Supabase

-- ============================================================
-- TABELLE
-- ============================================================

CREATE TABLE IF NOT EXISTS veicoli (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  marca TEXT NOT NULL,
  modello TEXT NOT NULL,
  anno INTEGER NOT NULL,
  km INTEGER NOT NULL DEFAULT 0,
  prezzo DECIMAL(10,2) NOT NULL,
  cilindrata INTEGER,
  tipo TEXT NOT NULL CHECK (tipo IN ('moto', 'scooter')),
  descrizione TEXT,
  immagini TEXT[] DEFAULT '{}',
  disponibile BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prenotazioni (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT,
  marca_moto TEXT NOT NULL,
  modello_moto TEXT NOT NULL,
  anno_moto INTEGER,
  tipo_tagliando TEXT NOT NULL CHECK (tipo_tagliando IN ('base', 'completo')),
  data_preferita DATE NOT NULL,
  note TEXT,
  stato TEXT DEFAULT 'da_confermare' CHECK (stato IN ('da_confermare', 'confermato', 'completato')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE veicoli ENABLE ROW LEVEL SECURITY;
ALTER TABLE prenotazioni ENABLE ROW LEVEL SECURITY;

-- Veicoli: lettura pubblica, scrittura solo utenti autenticati
CREATE POLICY "veicoli_select_public"
  ON veicoli FOR SELECT USING (true);

CREATE POLICY "veicoli_insert_auth"
  ON veicoli FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "veicoli_update_auth"
  ON veicoli FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "veicoli_delete_auth"
  ON veicoli FOR DELETE USING (auth.role() = 'authenticated');

-- Prenotazioni: chiunque può inserire, solo autenticati possono leggere/modificare
CREATE POLICY "prenotazioni_insert_public"
  ON prenotazioni FOR INSERT WITH CHECK (true);

CREATE POLICY "prenotazioni_select_auth"
  ON prenotazioni FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "prenotazioni_update_auth"
  ON prenotazioni FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "prenotazioni_delete_auth"
  ON prenotazioni FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('veicoli-immagini', 'veicoli-immagini', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "storage_select_public"
  ON storage.objects FOR SELECT USING (bucket_id = 'veicoli-immagini');

CREATE POLICY "storage_insert_auth"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'veicoli-immagini' AND auth.role() = 'authenticated');

CREATE POLICY "storage_update_auth"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'veicoli-immagini' AND auth.role() = 'authenticated');

CREATE POLICY "storage_delete_auth"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'veicoli-immagini' AND auth.role() = 'authenticated');
