import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export type Peca = {
  id: string;
  nome: string;
  slug: string;
  ano: string | null;
  descricao_breve: string | null;
  descricao_completa: string | null;
  imagem_url: string | null;
  ficha_tecnica: string | null;
  galeria: string[];
  ordem: number;
};

export type Apresentacao = {
  id: string;
  peca_id: string;
  data: string;
  hora: string | null;
  local: string | null;
  link_bilhetes: string | null;
  forcar_sold_out: boolean;
};

export type SiteSettings = {
  logo_url: string | null;
  logo_dark_url: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  sobre_titulo: string | null;
  sobre_texto: string | null;
  hero_images: string[];
  diretores: Diretor[];
};

export type Diretor = {
  nome: string;
  descricao: string;
  imagem_url: string | null;
};

const PECAS_COLS =
  "id,nome,slug,ano,descricao_breve,descricao_completa,imagem_url,ficha_tecnica,galeria,ordem";
const APRES_COLS = "id,peca_id,data,hora,local,link_bilhetes,forcar_sold_out";

function normalizePeca(raw: unknown): Peca {
  const p = raw as Record<string, unknown>;
  return {
    id: String(p.id ?? ""),
    nome: String(p.nome ?? ""),
    slug: String(p.slug ?? ""),
    ano: p.ano != null ? String(p.ano) : null,
    descricao_breve: p.descricao_breve != null ? String(p.descricao_breve) : null,
    descricao_completa: p.descricao_completa != null ? String(p.descricao_completa) : null,
    imagem_url: p.imagem_url != null ? String(p.imagem_url) : null,
    ficha_tecnica: p.ficha_tecnica != null ? String(p.ficha_tecnica) : null,
    galeria: Array.isArray(p.galeria)
      ? p.galeria.filter((x: unknown): x is string => typeof x === "string")
      : [],
    ordem: Number(p.ordem ?? 0),
  };
}

export const getSiteSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteSettings> => {
    const sb = publicClient();
    const { data } = await sb
      .from("site_settings")
      .select("logo_url,logo_dark_url,hero_title,hero_subtitle,sobre_titulo,sobre_texto,hero_images,diretores")
      .eq("id", 1)
      .maybeSingle();
    return {
      logo_url: data?.logo_url ?? null,
      logo_dark_url: data?.logo_dark_url ?? null,
      hero_title: data?.hero_title ?? null,
      hero_subtitle: data?.hero_subtitle ?? null,
      sobre_titulo: data?.sobre_titulo ?? null,
      sobre_texto: data?.sobre_texto ?? null,
      hero_images: Array.isArray(data?.hero_images) ? (data!.hero_images as string[]) : [],
      diretores: Array.isArray(data?.diretores) ? (data!.diretores as Diretor[]) : [],
    };
  },
);

export const listPecas = createServerFn({ method: "GET" }).handler(async (): Promise<Peca[]> => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("pecas")
    .select(PECAS_COLS)
    .order("ordem", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalizePeca);
});

export const getPecaBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<{ peca: Peca | null; apresentacoes: Apresentacao[] }> => {
    const sb = publicClient();
    const { data: peca } = await sb
      .from("pecas")
      .select(PECAS_COLS)
      .eq("slug", data.slug)
      .maybeSingle();
    if (!peca) return { peca: null, apresentacoes: [] };
    const { data: apres } = await sb
      .from("apresentacoes")
      .select(APRES_COLS)
      .eq("peca_id", normalizePeca(peca).id)
      .order("data", { ascending: true });
    return { peca: normalizePeca(peca), apresentacoes: (apres ?? []) as Apresentacao[] };
  });

export const listAllApresentacoes = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ apresentacoes: Apresentacao[]; pecas: Peca[] }> => {
    const sb = publicClient();
    const [{ data: apres }, { data: pecas }] = await Promise.all([
      sb.from("apresentacoes").select(APRES_COLS).order("data", { ascending: false }),
      sb.from("pecas").select(PECAS_COLS),
    ]);
    return {
      apresentacoes: (apres ?? []) as Apresentacao[],
      pecas: (pecas ?? []).map(normalizePeca),
    };
  },
);

export const listHomepageData = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: proximas }, { data: pecas }, { data: settings }] = await Promise.all([
    sb
      .from("apresentacoes")
      .select(APRES_COLS)
      .gte("data", today)
      .order("data", { ascending: true })
      .limit(4),
    sb
      .from("pecas")
      .select(PECAS_COLS)
      .order("ordem", { ascending: false })
      .limit(2),
    sb
      .from("site_settings")
      .select("hero_title,hero_subtitle,sobre_titulo,sobre_texto,hero_images,diretores")
      .eq("id", 1)
      .maybeSingle(),
  ]);
  // also get peca info for the upcoming apresentações
  const pecaIds = Array.from(new Set((proximas ?? []).map((a) => a.peca_id)));
  let pecasMap: Record<string, Peca> = {};
  if (pecaIds.length) {
    const { data: ps } = await sb.from("pecas").select(PECAS_COLS).in("id", pecaIds);
    for (const p of ps ?? []) pecasMap[normalizePeca(p).id] = normalizePeca(p);
  }
  return {
    proximas: (proximas ?? []) as Apresentacao[],
    pecasMap,
    ultimasPecas: (pecas ?? []).map(normalizePeca),
    settings: {
      hero_title: settings?.hero_title ?? null,
      hero_subtitle: settings?.hero_subtitle ?? null,
      sobre_titulo: settings?.sobre_titulo ?? null,
      sobre_texto: settings?.sobre_texto ?? null,
      hero_images: Array.isArray(settings?.hero_images) ? (settings!.hero_images as string[]) : [],
      diretores: Array.isArray(settings?.diretores) ? (settings!.diretores as Diretor[]) : [],
    },
  };
});