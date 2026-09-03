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
      | {
          peca?: {
            nome?: string;
            slug?: string;
            descricao_breve?: string | null;
            imagem_url?: string | null;
          };
          apresentacoes?: Array<{
            data: string;
            hora: string | null;
            local: string | null;
            link_bilhetes: string | null;
            forcar_sold_out?: boolean;
          }>;
        }
      | undefined;
    const nome = ld?.peca?.nome ?? "Peça";
    const desc = ld?.peca?.descricao_breve ?? "Peça da companhia Libélula Teatro.";
    const img = ld?.peca?.imagem_url ?? undefined;
    const url = `https://libelulateatro.lovable.app/pecas/${ctx.params.slug}`;
    const eventos = (ld?.apresentacoes ?? [])
      .filter((a) => a.data >= new Date().toISOString().slice(0, 10))
      .slice(0, 12)
      .map((a) => ({
        "@context": "https://schema.org",
        "@type": "TheaterEvent",
        name: nome,
        description: desc,
        url,
        startDate: a.hora ? `${a.data}T${a.hora}` : a.data,
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: a.local ?? "Leiria",
          address: {
            "@type": "PostalAddress",
            addressLocality: a.local ?? "Leiria",
            addressCountry: "PT",
          },
        },
        performer: { "@type": "PerformingGroup", name: "Libélula Teatro" },
        organizer: { "@type": "Organization", name: "Libélula Teatro" },
        ...(img ? { image: img } : {}),
        ...(a.link_bilhetes
          ? {
              offers: {
                "@type": "Offer",
                url: a.link_bilhetes,
                availability: a.forcar_sold_out
                  ? "https://schema.org/SoldOut"
                  : "https://schema.org/InStock",
              },
            }
          : {}),
      }));
    return {
      meta: [
        { title: `${nome} — Libélula Teatro` },
        { name: "description", content: desc },
        { property: "og:title", content: `${nome} — Libélula Teatro` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(img ? [{ property: "og:image" as const, content: img }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: eventos.map((e) => ({
        type: "application/ld+json",
        children: JSON.stringify(e),
      })),
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
      <article className="mx-auto max-w-6xl px-5 pb-8 pt-12 sm:px-8 sm:pt-16">
        <Link
          to="/pecas"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Arquivo de peças
        </Link>

        <header className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="aspect-[3/4] overflow-hidden bg-muted">
              {peca.imagem_url ? (
                <img
                  src={peca.imagem_url}
                  alt={peca.nome}
                  className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                />
              ) : (
                <PosterPlaceholder text={peca.nome} />
              )}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <span className="font-display text-lg italic text-muted-foreground/70">Peça</span>
              <span className="h-px w-8 bg-border" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">
                {peca.ano ?? "—"}
              </span>
            </div>
            <h1 className="mt-6 font-display text-5xl italic leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              {peca.nome}
            </h1>
            {peca.descricao_breve && (
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/85">
                {peca.descricao_breve}
              </p>
            )}
          </div>
        </header>
      </article>

      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto grid max-w-6xl gap-16 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                Sinopse
              </p>
              <div className="mt-4 h-px w-12 bg-accent" />
            </div>
          </div>
          <div className="lg:col-span-8">
            <div className="space-y-5 text-base leading-relaxed text-foreground/85 sm:text-lg">
              {(peca.descricao_completa ?? peca.descricao_breve ?? "")
                .split(/\n\n+/)
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>
            {peca.ficha_tecnica && (
              <div className="mt-12 border-t border-border/60 pt-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                  Ficha técnica
                </p>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                  {peca.ficha_tecnica}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {peca.galeria.length > 0 && (
        <section className="border-t border-border/60">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border/60 pb-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                  Galeria
                </p>
                <h2 className="mt-3 font-display text-3xl italic tracking-tight sm:text-4xl">
                  Fotografias do espectáculo
                </h2>
              </div>
            </div>
            <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {peca.galeria.map((url, i) => (
                <div
                  key={url + i}
                  className="break-inside-avoid mb-4 overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <img
                    src={url}
                    alt={`Fotografia ${i + 1} da peça ${peca.nome}`}
                    loading="lazy"
                    className="h-auto w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border/60 pb-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                Agenda
              </p>
              <h2 className="mt-3 font-display text-3xl italic tracking-tight sm:text-4xl">
                Apresentações desta peça
              </h2>
            </div>
          </div>
          {apres.length === 0 ? (
            <p className="mt-12 text-center text-sm italic text-muted-foreground">
              Sem apresentações agendadas neste momento.
            </p>
          ) : (
            <div>
              <div className="mt-6 hidden gap-x-6 border-b border-border/40 pb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/70 md:grid md:grid-cols-[10rem_1fr_1fr_auto]">
                <span>Data</span>
                <span>Espectáculo</span>
                <span>Local</span>
                <span className="text-right">Bilhetes</span>
              </div>
              {apres.map((a) => (
                <ApresentacaoRow key={a.id} apres={a} peca={peca} withPecaLink={false} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}