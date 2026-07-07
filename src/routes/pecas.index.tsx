import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { PosterPlaceholder } from "./index";
import { listPecas } from "@/lib/public-data.functions";

export const Route = createFileRoute("/pecas/")({
  head: () => ({
    meta: [
      { title: "Peças — Libélula Teatro" },
      {
        name: "description",
        content: "Repertório completo de peças da companhia Libélula Teatro.",
      },
      { property: "og:title", content: "Peças — Libélula Teatro" },
      { property: "og:description", content: "Repertório completo da companhia." },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({ queryKey: ["pecas"], queryFn: () => listPecas() }),
  component: PecasPage,
  errorComponent: () => <SiteShell><div className="p-12">Erro a carregar peças.</div></SiteShell>,
  notFoundComponent: () => <SiteShell><div className="p-12">Não encontrado.</div></SiteShell>,
});

function PecasPage() {
  const fetcher = useServerFn(listPecas);
  const { data: pecas = [] } = useQuery({ queryKey: ["pecas"], queryFn: () => fetcher() });

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
        <header className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4">
              <span className="font-display text-lg italic text-muted-foreground/70">02</span>
              <span className="h-px w-8 bg-border" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">
                Arquivo
              </span>
            </div>
            <div className="mt-6 h-px w-12 bg-accent" />
          </div>
          <div className="lg:col-span-8">
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Repertório <span className="italic">completo</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Os trabalhos da companhia, do mais recente ao mais antigo — cada peça um pequeno
              voo, breve e necessário.
            </p>
          </div>
        </header>

        {pecas.length === 0 ? (
          <p className="mt-24 text-center text-sm italic text-muted-foreground">
            Ainda não há peças publicadas.
          </p>
        ) : (
          <div className="mt-20 grid gap-px border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
            {pecas.map((p, i) => (
              <Link
                key={p.id}
                to="/pecas/$slug"
                params={{ slug: p.slug }}
                className="group block bg-background p-6 transition-colors hover:bg-secondary/40 sm:p-7"
              >
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  {p.imagem_url ? (
                    <img
                      src={p.imagem_url}
                      alt={p.nome}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                  ) : (
                    <PosterPlaceholder text={p.nome} />
                  )}
                </div>
                <div className="mt-6 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Nº {String(pecas.length - i).padStart(2, "0")} · {p.ano ?? "—"}
                    </p>
                    <h2 className="mt-2 font-display text-2xl italic leading-tight transition-colors group-hover:text-accent">
                      {p.nome}
                    </h2>
                    {p.descricao_breve && (
                      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                        {p.descricao_breve}
                      </p>
                    )}
                  </div>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}