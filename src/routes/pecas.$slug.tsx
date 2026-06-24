import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { ApresentacaoRow } from "@/components/apresentacao-row";
import { PosterPlaceholder } from "./index";
import { getPecaBySlug } from "@/lib/public-data.functions";

export const Route = createFileRoute("/pecas/$slug")({
  head: (ctx) => {
    const ld = ctx.loaderData as
      | { peca?: { nome?: string; descricao_breve?: string | null; imagem_url?: string | null } }
      | undefined;
    const nome = ld?.peca?.nome ?? "Peça";
    const desc = ld?.peca?.descricao_breve ?? "Peça da companhia Libélula Teatro.";
    const img = ld?.peca?.imagem_url ?? undefined;
    return {
      meta: [
        { title: `${nome} — Libélula Teatro` },
        { name: "description", content: desc },
        { property: "og:title", content: `${nome} — Libélula Teatro` },
        { property: "og:description", content: desc },
        ...(img ? [{ property: "og:image" as const, content: img }] : []),
      ],
    };
  },
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData({
      queryKey: ["peca", params.slug],
      queryFn: () => getPecaBySlug({ data: { slug: params.slug } }),
    });
    if (!data.peca) throw notFound();
    return data;
  },
  component: PecaPage,
  errorComponent: () => <SiteShell><div className="p-12">Erro a carregar peça.</div></SiteShell>,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">404</p>
        <h1 className="mt-4 font-display text-4xl">Peça não encontrada</h1>
        <p className="mt-4 text-muted-foreground">A peça que procura não existe ou foi removida.</p>
        <Link
          to="/pecas"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar a todas as peças
        </Link>
      </div>
    </SiteShell>
  ),
});

function PecaPage() {
  const { slug } = Route.useParams();
  const fetcher = useServerFn(getPecaBySlug);
  const { data } = useQuery({
    queryKey: ["peca", slug],
    queryFn: () => fetcher({ data: { slug } }),
  });
  const peca = data?.peca;
  const apres = data?.apresentacoes ?? [];
  if (!peca) return null;

  return (
    <SiteShell>
      <article className="mx-auto max-w-5xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        <Link
          to="/pecas"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Todas as peças
        </Link>

        <div className="mt-10 grid gap-12 md:grid-cols-[minmax(0,1fr)_1fr]">
          <div className="aspect-[3/4] overflow-hidden bg-muted">
            {peca.imagem_url ? (
              <img src={peca.imagem_url} alt={peca.nome} className="h-full w-full object-cover" />
            ) : (
              <PosterPlaceholder text={peca.nome} />
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">{peca.ano}</p>
            <h1 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              {peca.nome}
            </h1>
            <div className="prose prose-neutral mt-6 max-w-none text-base leading-relaxed text-foreground/85">
              {(peca.descricao_completa ?? peca.descricao_breve ?? "")
                .split(/\n\n+/)
                .map((para, i) => (
                  <p key={i} className="mb-4">
                    {para}
                  </p>
                ))}
            </div>
            {peca.ficha_tecnica && (
              <div className="mt-8 border-t border-border/60 pt-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Ficha técnica
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm text-foreground/80">
                  {peca.ficha_tecnica}
                </p>
              </div>
            )}
          </div>
        </div>

        <section className="mt-20">
          <h2 className="font-display text-2xl">Apresentações desta peça</h2>
          <div className="mt-6">
            {apres.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sem apresentações agendadas neste momento.
              </p>
            ) : (
              apres.map((a) => (
                <ApresentacaoRow key={a.id} apres={a} peca={peca} withPecaLink={false} />
              ))
            )}
          </div>
        </section>
      </article>
    </SiteShell>
  );
}