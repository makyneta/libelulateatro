import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { SiteShell } from "@/components/site-shell";
import { ApresentacaoRow, isPast } from "@/components/apresentacao-row";
import { listAllApresentacoes } from "@/lib/public-data.functions";

export const Route = createFileRoute("/bilhetes")({
  head: () => ({
    meta: [
      { title: "Bilhetes — Libélula Teatro" },
      {
        name: "description",
        content: "Próximas apresentações e histórico de espectáculos da Libélula Teatro.",
      },
      { property: "og:title", content: "Bilhetes — Libélula Teatro" },
      { property: "og:description", content: "Próximas apresentações e espectáculos passados." },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["all-apres"],
      queryFn: () => listAllApresentacoes(),
    }),
  component: BilhetesPage,
  errorComponent: () => <SiteShell><div className="p-12">Erro.</div></SiteShell>,
  notFoundComponent: () => <SiteShell><div className="p-12">Não encontrado.</div></SiteShell>,
});

function BilhetesPage() {
  const fetcher = useServerFn(listAllApresentacoes);
  const { data } = useQuery({ queryKey: ["all-apres"], queryFn: () => fetcher() });
  const pecasMap = useMemo(() => {
    const m: Record<string, (typeof data.pecas)[number]> = {};
    for (const p of data?.pecas ?? []) m[p.id] = p;
    return m;
  }, [data]);

  const futuras = (data?.apresentacoes ?? [])
    .filter((a) => !isPast(a.data) && !a.forcar_sold_out)
    .sort((a, b) => a.data.localeCompare(b.data));
  const passadas = (data?.apresentacoes ?? [])
    .filter((a) => isPast(a.data) || a.forcar_sold_out)
    .sort((a, b) => b.data.localeCompare(a.data));

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        <header className="animate-fade-up">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Agenda</p>
          <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">Bilhetes</h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Próximas apresentações em digressão. Para datas esgotadas, fica o registo de que
            estivemos por lá.
          </p>
        </header>

        <div className="mt-16">
          <h2 className="font-display text-2xl">Próximas apresentações</h2>
          <div className="mt-6">
            {futuras.length === 0 ? (
              <p className="rounded-md border border-dashed border-border bg-secondary/30 px-6 py-8 text-sm text-muted-foreground">
                Não há apresentações agendadas neste momento.
              </p>
            ) : (
              futuras.map((a) => (
                <ApresentacaoRow key={a.id} apres={a} peca={pecasMap[a.peca_id]} />
              ))
            )}
          </div>
        </div>

        {passadas.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl">Apresentações passadas</h2>
            <div className="mt-6 opacity-90">
              {passadas.map((a) => (
                <ApresentacaoRow key={a.id} apres={a} peca={pecasMap[a.peca_id]} />
              ))}
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}