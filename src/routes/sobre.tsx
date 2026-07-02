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
      <section className="mx-auto max-w-4xl px-5 pb-8 pt-16 sm:px-8 sm:pt-24">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Sobre</p>
        <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">{titulo}</h1>
        <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-muted-foreground sm:text-lg">
          {texto}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-24 pt-8 sm:px-8 sm:pb-32">
        <div className="border-t border-border/60 pt-12">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Direção</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
            Diretores artísticos
          </h2>
        </div>

        {diretores.length === 0 ? (
          <p className="mt-10 rounded-md border border-dashed border-border bg-secondary/30 px-6 py-10 text-center text-sm text-muted-foreground">
            Em breve.
          </p>
        ) : (
          <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-12">
            {diretores.map((d, i) => (
              <article key={`${d.nome}-${i}`} className="flex flex-col">
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  {d.imagem_url ? (
                    <img
                      src={d.imagem_url}
                      alt={d.nome}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-secondary p-8 text-center">
                      <span className="font-display text-2xl text-muted-foreground/70">
                        {d.nome}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="mt-6 font-display text-2xl text-foreground">{d.nome}</h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {d.descricao}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}