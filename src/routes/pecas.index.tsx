import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
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
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        <header className="max-w-2xl animate-fade-up">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Repertório</p>
          <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">Peças</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Os trabalhos da companhia, do mais recente ao mais antigo.
          </p>
        </header>

        {pecas.length === 0 ? (
          <p className="mt-16 text-muted-foreground">Ainda não há peças publicadas.</p>
        ) : (
          <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {pecas.map((p) => (
              <Link
                key={p.id}
                to="/pecas/$slug"
                params={{ slug: p.slug }}
                className="group block"
              >
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  {p.imagem_url ? (
                    <img
                      src={p.imagem_url}
                      alt={p.nome}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <PosterPlaceholder text={p.nome} />
                  )}
                </div>
                <h2 className="mt-5 font-display text-2xl text-foreground transition-colors group-hover:text-accent">
                  {p.nome}
                </h2>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{p.ano}</p>
                {p.descricao_breve && (
                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                    {p.descricao_breve}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}