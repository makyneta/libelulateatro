ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS hero_title text,
  ADD COLUMN IF NOT EXISTS hero_subtitle text,
  ADD COLUMN IF NOT EXISTS sobre_titulo text,
  ADD COLUMN IF NOT EXISTS sobre_texto text,
  ADD COLUMN IF NOT EXISTS hero_images jsonb NOT NULL DEFAULT '[]'::jsonb;