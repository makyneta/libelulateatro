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
};

const PECAS_COLS =
  "id,nome,slug,ano,descricao_breve,descricao_completa,imagem_url,ficha_tecnica,ordem";
const APRES_COLS = "id,peca_id,data,hora,local,link_bilhetes,forcar_sold_out";

export const getSiteSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteSettings> => {
    const sb = publicClient();
    const { data } = await sb
      .from("site_settings")
      .select("logo_url,logo_dark_url")
      .eq("id", 1)
      .maybeSingle();
    return { logo_url: data?.logo_url ?? null, logo_dark_url: data?.logo_dark_url ?? null };
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
  return (data ?? []) as Peca[];
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
      .eq("peca_id", (peca as Peca).id)
      .order("data", { ascending: true });
    return { peca: peca as Peca, apresentacoes: (apres ?? []) as Apresentacao[] };
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
      pecas: (pecas ?? []) as Peca[],
    };
  },
);

export const listHomepageData = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: proximas }, { data: pecas }] = await Promise.all([
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
  ]);
  // also get peca info for the upcoming apresentações
  const pecaIds = Array.from(new Set((proximas ?? []).map((a) => a.peca_id)));
  let pecasMap: Record<string, Peca> = {};
  if (pecaIds.length) {
    const { data: ps } = await sb.from("pecas").select(PECAS_COLS).in("id", pecaIds);
    for (const p of (ps ?? []) as Peca[]) pecasMap[p.id] = p;
  }
  return {
    proximas: (proximas ?? []) as Apresentacao[],
    pecasMap,
    ultimasPecas: (pecas ?? []) as Peca[],
  };
});