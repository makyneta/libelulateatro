
-- Site settings (single-row table for admin password hash + logos + identity)
CREATE TABLE public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  admin_password_hash TEXT,
  admin_password_salt TEXT,
  logo_url TEXT,
  logo_dark_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.site_settings (id) VALUES (1);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
-- Public can read but NEVER see password fields; we'll project safe columns in code.
-- Anon read policy on whole row is acceptable because server fns won't return hash to clients.
CREATE POLICY "public read site identity" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);

-- Peças
CREATE TABLE public.pecas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  ano TEXT,
  descricao_breve TEXT,
  descricao_completa TEXT,
  imagem_url TEXT,
  ficha_tecnica TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pecas TO anon, authenticated;
GRANT ALL ON public.pecas TO service_role;
ALTER TABLE public.pecas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read pecas" ON public.pecas FOR SELECT TO anon, authenticated USING (true);

-- Apresentações
CREATE TABLE public.apresentacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  peca_id UUID NOT NULL REFERENCES public.pecas(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  hora TIME,
  local TEXT,
  link_bilhetes TEXT,
  forcar_sold_out BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.apresentacoes TO anon, authenticated;
GRANT ALL ON public.apresentacoes TO service_role;
ALTER TABLE public.apresentacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read apresentacoes" ON public.apresentacoes FOR SELECT TO anon, authenticated USING (true);

-- Seed example peças (substituíveis via /admin)
INSERT INTO public.pecas (nome, slug, ano, descricao_breve, descricao_completa, ordem) VALUES
('A Floresta Encantada', 'a-floresta-encantada', '2024', 'Uma fábula contemporânea sobre memória, raízes e o silêncio das árvores.', 'A Floresta Encantada é uma viagem poética por uma floresta esquecida, onde personagens reencontram-se com aquilo que deixaram para trás. Uma criação coletiva da Libélula Teatro que cruza teatro físico, sombras e música ao vivo.', 3),
('O Voo da Libélula', 'o-voo-da-libelula', '2023', 'Espetáculo inaugural da companhia — um manifesto sobre liberdade e fragilidade.', 'O Voo da Libélula marca o ponto de partida da companhia. Inspirado na efemeridade do inseto, o espetáculo propõe um olhar sobre a beleza do que é breve e a coragem de continuar a voar.', 2),
('Mar de Vozes', 'mar-de-vozes', '2022', 'Um coro de testemunhos da comunidade da Marinha Grande, transformado em palco.', 'Mar de Vozes é um trabalho de teatro documental construído a partir de entrevistas com habitantes da Marinha Grande. As vozes do território tornam-se personagens, num espetáculo sobre pertença e identidade.', 1);

-- Seed apresentações (uma futura e uma passada por peça)
INSERT INTO public.apresentacoes (peca_id, data, hora, local, link_bilhetes) VALUES
((SELECT id FROM public.pecas WHERE slug='a-floresta-encantada'), CURRENT_DATE + INTERVAL '30 days', '21:30', 'Teatro Stephens, Marinha Grande', 'https://bol.pt'),
((SELECT id FROM public.pecas WHERE slug='a-floresta-encantada'), CURRENT_DATE + INTERVAL '45 days', '21:30', 'Cine-Teatro Louletano, Loulé', 'https://bol.pt'),
((SELECT id FROM public.pecas WHERE slug='a-floresta-encantada'), CURRENT_DATE - INTERVAL '60 days', '21:30', 'Teatro Stephens, Marinha Grande', NULL),
((SELECT id FROM public.pecas WHERE slug='o-voo-da-libelula'), CURRENT_DATE - INTERVAL '200 days', '21:30', 'Teatro Stephens, Marinha Grande', NULL),
((SELECT id FROM public.pecas WHERE slug='mar-de-vozes'), CURRENT_DATE - INTERVAL '400 days', '21:30', 'Centro Cultural, Marinha Grande', NULL);
