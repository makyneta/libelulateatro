import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { LogOut, Plus, Pencil, Trash2, X, Upload, ArrowUp, ArrowDown } from "lucide-react";
import { LibelulaLogo } from "@/components/libelula-logo";
import {
  getAdminStatus,
  setupAdminPassword,
  adminLogin,
  adminLogout,
  listPecasAdmin,
  upsertPeca,
  deletePeca,
  listApresentacoesAdmin,
  upsertApresentacao,
  deleteApresentacao,
  updateLogos,
  getAdminSettings,
  updateContent,
  uploadImage,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração — Libélula Teatro" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  ssr: false,
  component: AdminPage,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function AdminPage() {
  const status = useServerFn(getAdminStatus);
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["admin-status"],
    queryFn: () => status(),
    staleTime: 0,
  });

  if (isLoading || !data) {
    return <CenterShell><p className="text-muted-foreground">A carregar…</p></CenterShell>;
  }
  if (!data.hasPassword) return <SetupView onDone={() => refetch()} />;
  if (!data.unlocked) return <LoginView onDone={() => refetch()} />;
  return <Dashboard onLogout={() => refetch()} />;
}

function CenterShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-secondary/30 px-5">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
        <div className="mb-6 flex justify-center"><LibelulaLogo size={48} showWordmark={false} /></div>
        {children}
      </div>
    </div>
  );
}

function SetupView({ onDone }: { onDone: () => void }) {
  const setup = useServerFn(setupAdminPassword);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const p1 = String(fd.get("p1") ?? "");
    const p2 = String(fd.get("p2") ?? "");
    if (p1.length < 6) return setErr("Mínimo 6 caracteres.");
    if (p1 !== p2) return setErr("As palavras-passe não coincidem.");
    setBusy(true);
    const r = await setup({ data: { password: p1 } });
    setBusy(false);
    if (!r.ok) return setErr(r.error ?? "Erro.");
    onDone();
  }

  return (
    <CenterShell>
      <h1 className="font-display text-2xl">Definir palavra-passe de administrador</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Primeiro acesso. Esta palavra-passe será exigida nos próximos logins.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input name="p1" type="password" placeholder="Palavra-passe" className={inputCls} autoFocus />
        <input name="p2" type="password" placeholder="Confirmar" className={inputCls} />
        {err && <p className="text-xs text-destructive">{err}</p>}
        <button type="submit" disabled={busy} className={btnPrimary}>
          {busy ? "A gravar…" : "Definir e entrar"}
        </button>
      </form>
    </CenterShell>
  );
}

function LoginView({ onDone }: { onDone: () => void }) {
  const login = useServerFn(adminLogin);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const r = await login({ data: { password: String(fd.get("p") ?? "") } });
    setBusy(false);
    if (!r.ok) return setErr(r.error ?? "Erro.");
    onDone();
  }
  return (
    <CenterShell>
      <h1 className="font-display text-2xl">Administração</h1>
      <p className="mt-2 text-sm text-muted-foreground">Introduza a palavra-passe.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input name="p" type="password" placeholder="Palavra-passe" className={inputCls} autoFocus />
        {err && <p className="text-xs text-destructive">{err}</p>}
        <button type="submit" disabled={busy} className={btnPrimary}>
          {busy ? "A entrar…" : "Entrar"}
        </button>
      </form>
    </CenterShell>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const logout = useServerFn(adminLogout);
  const [tab, setTab] = useState<"pecas" | "apres" | "conteudo" | "ident">("pecas");
  return (
    <div className="min-h-dvh bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <LibelulaLogo size={32} />
            <span className="hidden font-display text-sm text-muted-foreground sm:inline">/ administração</span>
          </div>
          <button
            onClick={async () => { await logout(); onLogout(); }}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs uppercase tracking-widest text-foreground hover:bg-muted"
          >
            <LogOut className="h-3.5 w-3.5" /> Sair
          </button>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 px-5 sm:px-8">
          {[
            { id: "pecas", label: "Peças" },
            { id: "apres", label: "Apresentações" },
            { id: "conteudo", label: "Conteúdo" },
            { id: "ident", label: "Identidade visual" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
                tab === t.id
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {tab === "pecas" && <PecasAdmin />}
        {tab === "apres" && <ApresAdmin />}
        {tab === "conteudo" && <ContentAdmin />}
        {tab === "ident" && <IdentAdmin />}
      </main>
    </div>
  );
}

// ---- Peças ----
function PecasAdmin() {
  const list = useServerFn(listPecasAdmin);
  const save = useServerFn(upsertPeca);
  const del = useServerFn(deletePeca);
  const qc = useQueryClient();
  const { data: pecas = [] } = useQuery({ queryKey: ["admin-pecas"], queryFn: () => list() });
  const [editing, setEditing] = useState<null | (typeof pecas)[number] | "new">(null);

  async function onSave(form: PecaForm) {
    const r = await save({ data: form });
    if (!r.ok) { alert(r.error); return; }
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-pecas"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Peças</h2>
        <button onClick={() => setEditing("new")} className={btnPrimaryInline}>
          <Plus className="h-4 w-4" /> Nova peça
        </button>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Ano</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {pecas.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{p.nome}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">/pecas/{p.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.ano}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(p)} className="mr-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-muted">
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Remover "${p.nome}"?`)) return;
                      await del({ data: { id: p.id } });
                      qc.invalidateQueries({ queryKey: ["admin-pecas"] });
                    }}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remover
                  </button>
                </td>
              </tr>
            ))}
            {pecas.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Nenhuma peça.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <PecaEditor
          initial={editing === "new" ? undefined : editing}
          onCancel={() => setEditing(null)}
          onSave={onSave}
        />
      )}
    </div>
  );
}

type PecaForm = {
  id?: string;
  nome: string;
  slug: string;
  ano?: string | null;
  descricao_breve?: string | null;
  descricao_completa?: string | null;
  imagem_url?: string | null;
  ficha_tecnica?: string | null;
  ordem?: number;
};

function PecaEditor({
  initial,
  onCancel,
  onSave,
}: {
  initial?: Partial<PecaForm>;
  onCancel: () => void;
  onSave: (f: PecaForm) => void;
}) {
  const [nome, setNome] = useState(initial?.nome ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [ano, setAno] = useState(initial?.ano ?? "");
  const [breve, setBreve] = useState(initial?.descricao_breve ?? "");
  const [completa, setCompleta] = useState(initial?.descricao_completa ?? "");
  const [imagem, setImagem] = useState(initial?.imagem_url ?? "");
  const [ficha, setFicha] = useState(initial?.ficha_tecnica ?? "");
  const [ordem, setOrdem] = useState<number>(initial?.ordem ?? 0);

  function onNomeChange(v: string) {
    setNome(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  return (
    <Modal title={initial?.id ? "Editar peça" : "Nova peça"} onClose={onCancel}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            id: initial?.id,
            nome,
            slug,
            ano: ano || null,
            descricao_breve: breve || null,
            descricao_completa: completa || null,
            imagem_url: imagem || null,
            ficha_tecnica: ficha || null,
            ordem: Number(ordem) || 0,
          });
        }}
        className="space-y-4"
      >
        <AdminField label="Nome" value={nome} onChange={onNomeChange} required />
        <AdminField
          label="Slug (URL)"
          value={slug}
          onChange={(v) => { setSlug(v); setSlugTouched(true); }}
          hint={`URL: /pecas/${slug || "..."}`}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Ano / Período" value={ano ?? ""} onChange={setAno} />
          <AdminField
            label="Ordem (maior = aparece primeiro)"
            value={String(ordem)}
            onChange={(v) => setOrdem(Number(v) || 0)}
            type="number"
          />
        </div>
        <ImageField
          label="Imagem / cartaz"
          value={imagem ?? ""}
          onChange={setImagem}
          folder="pecas"
        />
        <AdminField label="Descrição breve" value={breve ?? ""} onChange={setBreve} multiline rows={3} />
        <AdminField label="Descrição completa" value={completa ?? ""} onChange={setCompleta} multiline rows={6} />
        <AdminField label="Ficha técnica (opcional)" value={ficha ?? ""} onChange={setFicha} multiline rows={4} />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className={btnSecondary}>Cancelar</button>
          <button type="submit" className={btnPrimary}>Guardar</button>
        </div>
      </form>
    </Modal>
  );
}

// ---- Apresentações ----
function ApresAdmin() {
  const list = useServerFn(listApresentacoesAdmin);
  const listP = useServerFn(listPecasAdmin);
  const save = useServerFn(upsertApresentacao);
  const del = useServerFn(deleteApresentacao);
  const qc = useQueryClient();
  const { data: apres = [] } = useQuery({ queryKey: ["admin-apres"], queryFn: () => list() });
  const { data: pecas = [] } = useQuery({ queryKey: ["admin-pecas"], queryFn: () => listP() });
  const [editing, setEditing] = useState<null | (typeof apres)[number] | "new">(null);
  const pecaMap: Record<string, string> = {};
  for (const p of pecas) pecaMap[p.id] = p.nome;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Apresentações</h2>
        <button
          onClick={() => setEditing("new")}
          disabled={pecas.length === 0}
          className={btnPrimaryInline}
        >
          <Plus className="h-4 w-4" /> Nova data
        </button>
      </div>
      {pecas.length === 0 && (
        <p className="mt-4 rounded-md border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
          Crie primeiro uma peça para poder adicionar datas.
        </p>
      )}
      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Peça</th>
              <th className="px-4 py-3">Local</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {apres.map((a) => {
              const past = new Date(a.data) < new Date(new Date().toISOString().slice(0, 10));
              return (
                <tr key={a.id} className="border-t border-border">
                  <td className="px-4 py-3">{a.data} {a.hora?.slice(0, 5)}</td>
                  <td className="px-4 py-3">{pecaMap[a.peca_id] ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.local}</td>
                  <td className="px-4 py-3 text-xs">
                    {past || a.forcar_sold_out ? (
                      <span className="rounded-full border border-foreground/30 px-2 py-0.5">SOLD OUT</span>
                    ) : (
                      <span className="text-accent">À venda</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(a)} className="mr-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-muted">
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Remover esta apresentação?")) return;
                        await del({ data: { id: a.id } });
                        qc.invalidateQueries({ queryKey: ["admin-apres"] });
                      }}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remover
                    </button>
                  </td>
                </tr>
              );
            })}
            {apres.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Nenhuma data.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {editing && (
        <ApresEditor
          initial={editing === "new" ? undefined : editing}
          pecas={pecas}
          onCancel={() => setEditing(null)}
          onSave={async (form) => {
            await save({ data: form });
            setEditing(null);
            qc.invalidateQueries({ queryKey: ["admin-apres"] });
          }}
        />
      )}
    </div>
  );
}

type ApresForm = {
  id?: string;
  peca_id: string;
  data: string;
  hora?: string | null;
  local?: string | null;
  link_bilhetes?: string | null;
  forcar_sold_out?: boolean;
};

function ApresEditor({
  initial,
  pecas,
  onCancel,
  onSave,
}: {
  initial?: Partial<ApresForm>;
  pecas: Array<{ id: string; nome: string }>;
  onCancel: () => void;
  onSave: (f: ApresForm) => void;
}) {
  const [pecaId, setPecaId] = useState(initial?.peca_id ?? pecas[0]?.id ?? "");
  const [data, setData] = useState(initial?.data ?? "");
  const [hora, setHora] = useState(initial?.hora?.slice(0, 5) ?? "");
  const [local, setLocal] = useState(initial?.local ?? "");
  const [link, setLink] = useState(initial?.link_bilhetes ?? "");
  const [forc, setForc] = useState(!!initial?.forcar_sold_out);

  return (
    <Modal title={initial?.id ? "Editar apresentação" : "Nova apresentação"} onClose={onCancel}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            id: initial?.id,
            peca_id: pecaId,
            data,
            hora: hora || null,
            local: local || null,
            link_bilhetes: link || null,
            forcar_sold_out: forc,
          });
        }}
        className="space-y-4"
      >
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Peça</span>
          <select value={pecaId} onChange={(e) => setPecaId(e.target.value)} className={inputCls}>
            {pecas.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Data" type="date" value={data} onChange={setData} required />
          <AdminField label="Hora" type="time" value={hora} onChange={setHora} />
        </div>
        <AdminField label="Local" value={local ?? ""} onChange={setLocal} />
        <AdminField label="Link de bilhetes (URL)" type="url" value={link ?? ""} onChange={setLink} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={forc} onChange={(e) => setForc(e.target.checked)} />
          Forçar etiqueta "SOLD OUT" mesmo se data futura
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className={btnSecondary}>Cancelar</button>
          <button type="submit" className={btnPrimary}>Guardar</button>
        </div>
      </form>
    </Modal>
  );
}

// ---- Identidade ----
function IdentAdmin() {
  const get = useServerFn(getAdminSettings);
  const upd = useServerFn(updateLogos);
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-settings"], queryFn: () => get() });
  const [logo, setLogo] = useState("");
  const [logoDark, setLogoDark] = useState("");
  // sync once
  if (data && logo === "" && logoDark === "") {
    if (data.logo_url) setTimeout(() => setLogo(data.logo_url ?? ""), 0);
    if (data.logo_dark_url) setTimeout(() => setLogoDark(data.logo_dark_url ?? ""), 0);
  }
  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl">Identidade visual</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Logótipo oficial da companhia, usado no cabeçalho, rodapé e ecrã de administração.
        Pode carregar uma imagem diretamente ou colar um URL.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await upd({ data: { logo_url: logo || null, logo_dark_url: logoDark || null } });
          qc.invalidateQueries({ queryKey: ["site-settings"] });
          qc.invalidateQueries({ queryKey: ["admin-settings"] });
          alert("Identidade atualizada.");
        }}
        className="mt-6 space-y-4"
      >
        <ImageField label="Logótipo principal" value={logo} onChange={setLogo} folder="logos" />
        <ImageField
          label="Logótipo alternativo (para fundos escuros, opcional)"
          value={logoDark}
          onChange={setLogoDark}
          folder="logos"
        />
        <div className="flex justify-end"><button type="submit" className={btnPrimary}>Guardar</button></div>
      </form>
    </div>
  );
}

// ---- Conteúdo (hero + sobre) ----
function ContentAdmin() {
  const get = useServerFn(getAdminSettings);
  const upd = useServerFn(updateContent);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: () => get() });
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [sobreTitulo, setSobreTitulo] = useState("");
  const [sobreTexto, setSobreTexto] = useState("");
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [diretores, setDiretores] = useState<
    { nome: string; descricao: string; imagem_url: string | null }[]
  >([]);
  const [loaded, setLoaded] = useState(false);

  if (data && !loaded) {
    setLoaded(true);
    setHeroTitle(data.hero_title ?? "");
    setHeroSubtitle(data.hero_subtitle ?? "");
    setSobreTitulo(data.sobre_titulo ?? "");
    setSobreTexto(data.sobre_texto ?? "");
    setHeroImages(Array.isArray(data.hero_images) ? (data.hero_images as string[]) : []);
    setDiretores(
      Array.isArray((data as { diretores?: unknown }).diretores)
        ? ((data as { diretores: { nome: string; descricao: string; imagem_url: string | null }[] })
            .diretores)
        : [],
    );
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= heroImages.length) return;
    const next = heroImages.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setHeroImages(next);
  }
  function remove(i: number) {
    setHeroImages(heroImages.filter((_, idx) => idx !== i));
  }

  if (isLoading) return <p className="text-muted-foreground">A carregar…</p>;

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl">Conteúdo da homepage</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Edite o texto da secção principal (hero) e a apresentação "Sobre".
        As imagens do hero passam automaticamente em diaporama.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await upd({
            data: {
              hero_title: heroTitle || null,
              hero_subtitle: heroSubtitle || null,
              sobre_titulo: sobreTitulo || null,
              sobre_texto: sobreTexto || null,
              hero_images: heroImages,
              diretores: diretores
                .filter((d) => d.nome.trim())
                .map((d) => ({
                  nome: d.nome.trim(),
                  descricao: d.descricao,
                  imagem_url: d.imagem_url || null,
                })),
            },
          });
          qc.invalidateQueries({ queryKey: ["admin-settings"] });
          qc.invalidateQueries({ queryKey: ["site-settings"] });
          qc.invalidateQueries({ queryKey: ["homepage"] });
          alert("Conteúdo atualizado.");
        }}
        className="mt-6 space-y-6"
      >
        <fieldset className="space-y-4 rounded-lg border border-border bg-background p-5">
          <legend className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Hero
          </legend>
          <AdminField label="Título" value={heroTitle} onChange={setHeroTitle} />
          <AdminField
            label="Subtítulo / descrição curta"
            value={heroSubtitle}
            onChange={setHeroSubtitle}
            multiline
            rows={3}
          />

          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Imagens em diaporama
            </span>
            {heroImages.length === 0 && (
              <p className="mb-3 rounded-md border border-dashed border-border bg-secondary/30 px-4 py-6 text-center text-xs text-muted-foreground">
                Sem imagens. Carregue uma para começar.
              </p>
            )}
            <ul className="space-y-2">
              {heroImages.map((url, i) => (
                <li
                  key={url + i}
                  className="flex items-center gap-3 rounded-md border border-border bg-card p-2"
                >
                  <img src={url} alt="" className="h-14 w-20 rounded object-cover" />
                  <span className="flex-1 truncate text-xs text-muted-foreground">{url}</span>
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                    aria-label="Mover para cima"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === heroImages.length - 1}
                    className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                    aria-label="Mover para baixo"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="rounded p-1 text-destructive hover:bg-destructive/10"
                    aria-label="Remover"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <UploadButton
                folder="hero"
                label="Adicionar imagem"
                onUploaded={(url) => setHeroImages((cur) => [...cur, url])}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-lg border border-border bg-background p-5">
          <legend className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Sobre
          </legend>
          <AdminField label="Título" value={sobreTitulo} onChange={setSobreTitulo} />
          <AdminField
            label="Texto"
            value={sobreTexto}
            onChange={setSobreTexto}
            multiline
            rows={6}
          />
        </fieldset>

        <fieldset className="space-y-4 rounded-lg border border-border bg-background p-5">
          <legend className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Diretores artísticos
          </legend>
          {diretores.length === 0 && (
            <p className="rounded-md border border-dashed border-border bg-secondary/30 px-4 py-6 text-center text-xs text-muted-foreground">
              Sem diretores. Adicione o primeiro.
            </p>
          )}
          <div className="space-y-6">
            {diretores.map((d, i) => (
              <div key={i} className="space-y-3 rounded-md border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Diretor {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setDiretores((cur) => cur.filter((_, idx) => idx !== i))
                    }
                    className="inline-flex items-center gap-1 rounded p-1 text-destructive hover:bg-destructive/10"
                    aria-label="Remover diretor"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <AdminField
                  label="Nome"
                  value={d.nome}
                  onChange={(v) =>
                    setDiretores((cur) =>
                      cur.map((x, idx) => (idx === i ? { ...x, nome: v } : x)),
                    )
                  }
                />
                <ImageField
                  label="Fotografia"
                  value={d.imagem_url ?? ""}
                  onChange={(v) =>
                    setDiretores((cur) =>
                      cur.map((x, idx) => (idx === i ? { ...x, imagem_url: v || null } : x)),
                    )
                  }
                  folder="diretores"
                />
                <AdminField
                  label="Descrição"
                  value={d.descricao}
                  onChange={(v) =>
                    setDiretores((cur) =>
                      cur.map((x, idx) => (idx === i ? { ...x, descricao: v } : x)),
                    )
                  }
                  multiline
                  rows={5}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setDiretores((cur) => [...cur, { nome: "", descricao: "", imagem_url: null }])
            }
            className={btnSecondary}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar diretor
          </button>
        </fieldset>

        <div className="flex justify-end"><button type="submit" className={btnPrimary}>Guardar</button></div>
      </form>
    </div>
  );
}

// ---- Upload primitives ----
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

function UploadButton({
  folder,
  label = "Carregar imagem",
  onUploaded,
}: {
  folder: string;
  label?: string;
  onUploaded: (url: string) => void;
}) {
  const up = useServerFn(uploadImage);
  const [busy, setBusy] = useState(false);
  return (
    <label className={`${btnSecondary} cursor-pointer ${busy ? "opacity-60" : ""}`}>
      <Upload className="mr-2 h-4 w-4" />
      {busy ? "A carregar…" : label}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={busy}
        onChange={async (e) => {
          const file = e.currentTarget.files?.[0];
          e.currentTarget.value = "";
          if (!file) return;
          if (file.size > 8 * 1024 * 1024) {
            alert("Imagem demasiado grande (máx 8MB).");
            return;
          }
          setBusy(true);
          try {
            const dataUrl = await fileToDataUrl(file);
            const r = await up({ data: { filename: file.name, dataUrl, folder } });
            if (!r.ok) alert(r.error ?? "Erro a carregar.");
            else onUploaded(r.url);
          } catch (err) {
            alert((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      />
    </label>
  );
}

function ImageField({
  label,
  value,
  onChange,
  folder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  folder: string;
}) {
  return (
    <div>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {value && (
          <img
            src={value}
            alt=""
            className="h-20 w-28 shrink-0 rounded-md border border-border object-cover"
          />
        )}
        <div className="flex-1 space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL da imagem ou carregue um ficheiro"
            className={inputCls}
          />
          <div className="flex flex-wrap gap-2">
            <UploadButton folder={folder} onUploaded={onChange} />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted"
              >
                Remover
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- UI primitives ----
const inputCls =
  "block w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";
const btnPrimary =
  "inline-flex w-full items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold uppercase tracking-widest text-accent-foreground transition hover:opacity-90 disabled:opacity-60";
const btnPrimaryInline =
  "inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-widest text-accent-foreground transition hover:opacity-90 disabled:opacity-60";
const btnSecondary =
  "inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted";

function AdminField({
  label, value, onChange, type = "text", multiline = false, rows = 3, required = false, hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}{required && <span className="text-accent"> *</span>}
      </span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={inputCls} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} type={type} required={required} className={inputCls} />
      )}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/30 p-4 backdrop-blur-sm">
      <div className="my-12 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)]">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-xl">{title}</h3>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted" aria-label="Fechar"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}