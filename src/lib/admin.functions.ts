import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

type GateSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env.SESSION_SECRET!,
    name: "libelula-admin",
    maxAge: 60 * 60 * 24 * 30,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

async function adminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function requireUnlocked() {
  const session = await useSession<GateSession>(sessionConfig());
  if (!session.data.unlocked) throw new Error("Não autorizado");
}

// --- Auth ---

export const getAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await adminClient();
  const session = await useSession<GateSession>(sessionConfig());
  const { data } = await sb
    .from("site_settings")
    .select("admin_password_hash")
    .eq("id", 1)
    .maybeSingle();
  return {
    hasPassword: !!data?.admin_password_hash,
    unlocked: !!session.data.unlocked,
  };
});

export const setupAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) =>
    z.object({ password: z.string().min(6).max(200) }).parse(d),
  )
  .handler(async ({ data }) => {
    const sb = await adminClient();
    const { data: existing } = await sb
      .from("site_settings")
      .select("admin_password_hash")
      .eq("id", 1)
      .maybeSingle();
    if (existing?.admin_password_hash) {
      return { ok: false as const, error: "Já existe uma palavra-passe definida." };
    }
    const salt = randomBytes(16).toString("hex");
    const hash = hashPassword(data.password, salt);
    const { error } = await sb
      .from("site_settings")
      .update({ admin_password_hash: hash, admin_password_salt: salt, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) return { ok: false as const, error: error.message };
    const session = await useSession<GateSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => z.object({ password: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const sb = await adminClient();
    const { data: row } = await sb
      .from("site_settings")
      .select("admin_password_hash,admin_password_salt")
      .eq("id", 1)
      .maybeSingle();
    if (!row?.admin_password_hash || !row?.admin_password_salt) {
      return { ok: false as const, error: "Palavra-passe ainda não foi definida." };
    }
    const candidate = Buffer.from(hashPassword(data.password, row.admin_password_salt), "hex");
    const stored = Buffer.from(row.admin_password_hash, "hex");
    const match = candidate.length === stored.length && timingSafeEqual(candidate, stored);
    if (!match) return { ok: false as const, error: "Palavra-passe incorreta." };
    const session = await useSession<GateSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

// --- Settings (logo) ---

export const updateLogos = createServerFn({ method: "POST" })
  .inputValidator((d: { logo_url?: string | null; logo_dark_url?: string | null }) =>
    z
      .object({
        logo_url: z.string().url().nullable().optional(),
        logo_dark_url: z.string().url().nullable().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    await requireUnlocked();
    const sb = await adminClient();
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.logo_url !== undefined) patch.logo_url = data.logo_url;
    if (data.logo_dark_url !== undefined) patch.logo_dark_url = data.logo_dark_url;
    const { error } = await sb.from("site_settings").update(patch).eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// --- Peças CRUD ---

const pecaSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug só pode conter minúsculas, números e hífens."),
  ano: z.string().trim().max(50).optional().nullable(),
  descricao_breve: z.string().trim().max(500).optional().nullable(),
  descricao_completa: z.string().trim().max(5000).optional().nullable(),
  imagem_url: z.string().url().optional().nullable().or(z.literal("")),
  ficha_tecnica: z.string().trim().max(2000).optional().nullable(),
  ordem: z.number().int().optional(),
});

export const listPecasAdmin = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  const sb = await adminClient();
  const { data, error } = await sb
    .from("pecas")
    .select("*")
    .order("ordem", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const upsertPeca = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => pecaSchema.parse(d))
  .handler(async ({ data }) => {
    await requireUnlocked();
    const sb = await adminClient();
    // slug uniqueness check (excluding self)
    const { data: clash } = await sb
      .from("pecas")
      .select("id")
      .eq("slug", data.slug)
      .maybeSingle();
    if (clash && clash.id !== data.id) {
      return { ok: false as const, error: "Já existe uma peça com este slug." };
    }
    const payload = {
      nome: data.nome,
      slug: data.slug,
      ano: data.ano ?? null,
      descricao_breve: data.descricao_breve ?? null,
      descricao_completa: data.descricao_completa ?? null,
      imagem_url: data.imagem_url ? data.imagem_url : null,
      ficha_tecnica: data.ficha_tecnica ?? null,
      ordem: data.ordem ?? 0,
      updated_at: new Date().toISOString(),
    };
    if (data.id) {
      const { error } = await sb.from("pecas").update(payload).eq("id", data.id);
      if (error) return { ok: false as const, error: error.message };
    } else {
      const { error } = await sb.from("pecas").insert(payload);
      if (error) return { ok: false as const, error: error.message };
    }
    return { ok: true as const };
  });

export const deletePeca = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    await requireUnlocked();
    const sb = await adminClient();
    const { error } = await sb.from("pecas").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// --- Apresentações CRUD ---

const apresSchema = z.object({
  id: z.string().uuid().optional(),
  peca_id: z.string().uuid(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hora: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional().nullable().or(z.literal("")),
  local: z.string().trim().max(200).optional().nullable(),
  link_bilhetes: z.string().url().optional().nullable().or(z.literal("")),
  forcar_sold_out: z.boolean().optional(),
});

export const listApresentacoesAdmin = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  const sb = await adminClient();
  const { data, error } = await sb
    .from("apresentacoes")
    .select("*")
    .order("data", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const upsertApresentacao = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => apresSchema.parse(d))
  .handler(async ({ data }) => {
    await requireUnlocked();
    const sb = await adminClient();
    const payload = {
      peca_id: data.peca_id,
      data: data.data,
      hora: data.hora ? data.hora : null,
      local: data.local ?? null,
      link_bilhetes: data.link_bilhetes ? data.link_bilhetes : null,
      forcar_sold_out: data.forcar_sold_out ?? false,
    };
    if (data.id) {
      const { error } = await sb.from("apresentacoes").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await sb.from("apresentacoes").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });

export const deleteApresentacao = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    await requireUnlocked();
    const sb = await adminClient();
    const { error } = await sb.from("apresentacoes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const getAdminSettings = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  const sb = await adminClient();
  const { data } = await sb
    .from("site_settings")
    .select("logo_url,logo_dark_url")
    .eq("id", 1)
    .maybeSingle();
  return data ?? { logo_url: null, logo_dark_url: null };
});