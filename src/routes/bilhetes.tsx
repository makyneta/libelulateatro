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
    type P = NonNullable<typeof data>["pecas"][number];
    const m: Record<string, P> = {};
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
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
        <header className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4">
              <span className="font-display text-lg italic text-muted-foreground/70">03</span>
              <span className="h-px w-8 bg-border" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">Agenda</span>
            </div>
            <div className="mt-6 h-px w-12 bg-accent" />
          </div>
          <div className="lg:col-span-8">
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Bilhetes <span className="italic">& datas</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Próximas apresentações em digressão. Para datas esgotadas, fica o registo de que
              estivemos por lá.
            </p>
          </div>
        </header>

        <div className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border/60 pb-6">
            <h2 className="font-display text-3xl italic tracking-tight sm:text-4xl">
              Próximas apresentações
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {futuras.length} {futuras.length === 1 ? "data" : "datas"}
            </span>
          </div>
          {futuras.length === 0 ? (
            <p className="mt-16 text-center text-sm italic text-muted-foreground">
              Sem apresentações agendadas neste momento.
            </p>
          ) : (
            <>
              <div className="mt-6 hidden gap-x-6 border-b border-border/40 pb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/70 md:grid md:grid-cols-[10rem_1fr_1fr_auto]">
                <span>Data</span>
                <span>Espectáculo</span>
                <span>Local</span>
                <span className="text-right">Bilhetes</span>
              </div>
              <div>
                {futuras.map((a) => (
                  <ApresentacaoRow key={a.id} apres={a} peca={pecasMap[a.peca_id]} />
                ))}
              </div>
            </>
          )}
        </div>

        {passadas.length > 0 && (
          <div className="mt-24">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border/60 pb-6">
              <h2 className="font-display text-3xl italic tracking-tight sm:text-4xl">
                Arquivo de apresentações
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {passadas.length} {passadas.length === 1 ? "registo" : "registos"}
              </span>
            </div>
            <div className="mt-6 hidden gap-x-6 border-b border-border/40 pb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/70 md:grid md:grid-cols-[10rem_1fr_1fr_auto]">
              <span>Data</span>
              <span>Espectáculo</span>
              <span>Local</span>
              <span className="text-right">Estado</span>
            </div>
            <div>
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