import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site-shell";
import { getSiteSettings } from "@/lib/public-data.functions";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Libélula Teatro" },
      {
        name: "description",
        content:
          "Sobre a Libélula Teatro: a companhia, a sua missão e os seus diretores artísticos.",
      },
      { property: "og:title", content: "Sobre — Libélula Teatro" },
      {
        property: "og:description",
        content: "A companhia, a sua missão e os seus diretores artísticos.",
      },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["site-settings"],
      queryFn: () => getSiteSettings(),
    }),
  component: SobrePage,
  errorComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-3xl">Algo correu mal</h1>
      </div>
    </SiteShell>
  ),
  notFoundComponent: () => <div className="p-8">Não encontrado.</div>,
});

function SobrePage() {
  const fetcher = useServerFn(getSiteSettings);
  const { data } = useQuery({ queryKey: ["site-settings"], queryFn: () => fetcher() });
  const titulo = data?.sobre_titulo ?? "Sobre a companhia";
  const texto =
    data?.sobre_texto ??
    "Sediada em Leiria, a Libélula Teatro dedica-se à criação de espectáculos contemporâneos em diálogo com o território e as comunidades onde se apresenta.";
  const diretores = data?.diretores ?? [];

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 sm:pt-28">
        <header className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="flex items-center gap-4">
                <span className="font-display text-lg italic text-muted-foreground/70">01</span>
                <span className="h-px w-8 bg-border" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">
                  Sobre
                </span>
              </div>
              <div className="mt-6 h-px w-12 bg-accent" />
            </div>
          </div>
          <div className="lg:col-span-8">
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              {titulo}
            </h1>
            <div className="mt-10 space-y-6 whitespace-pre-line text-base leading-relaxed text-muted-foreground sm:text-lg">
              {texto}
            </div>
          </div>
        </header>
      </section>

      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border/60 pb-8">
            <div>
              <div className="flex items-center gap-4">
                <span className="font-display text-lg italic text-muted-foreground/70">02</span>
                <span className="h-px w-8 bg-border" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">
                  Direção
                </span>
              </div>
              <h2 className="mt-4 font-display text-4xl italic tracking-tight sm:text-5xl">
                Diretores artísticos
              </h2>
            </div>
            {diretores.length > 0 && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {String(diretores.length).padStart(2, "0")} · À frente da companhia
              </span>
            )}
          </div>

          {diretores.length === 0 ? (
            <p className="mt-16 text-center text-sm italic text-muted-foreground">Em breve.</p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {diretores.map((d, i) => (
                <article
                  key={`${d.nome}-${i}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-accent/50 sm:p-8"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                    {d.imagem_url ? (
                      <img
                        src={d.imagem_url}
                        alt={d.nome}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-secondary p-8 text-center">
                        <span className="font-display text-2xl text-muted-foreground/70">
                          {d.nome}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Nº {String(i + 1).padStart(2, "0")} · Direção artística
                  </p>
                  <h3 className="mt-2 font-display text-3xl italic leading-tight">{d.nome}</h3>
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {d.descricao}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}