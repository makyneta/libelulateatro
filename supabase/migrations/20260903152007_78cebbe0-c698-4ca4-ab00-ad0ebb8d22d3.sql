ALTER TABLE public.pecas ADD COLUMN IF NOT EXISTS galeria JSONB DEFAULT '[]'::jsonb;
COMMENT ON COLUMN public.pecas.galeria IS 'Array de URLs de fotografias da galeria da peça';