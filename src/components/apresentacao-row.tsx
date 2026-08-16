import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Apresentacao, Peca } from "@/lib/public-data.functions";

const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export function formatData(d: string) {
  const dt = new Date(d + "T00:00:00");
  return {
    dia: dt.getDate().toString().padStart(2, "0"),
    mes: MESES[dt.getMonth()],
    ano: dt.getFullYear().toString(),
  };
}

export function isPast(d: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(d + "T00:00:00") < today;
}

export function ApresentacaoRow({
  apres,
  peca,
  withPecaLink = true,
}: {
  apres: Apresentacao;
  peca?: Peca;
  withPecaLink?: boolean;
}) {
  const past = isPast(apres.data) || apres.forcar_sold_out;
  const date = formatData(apres.data);
  return (
    <article
      className={`group grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-2xl border border-border bg-card/60 p-5 transition-all hover:border-accent/50 hover:bg-card sm:gap-6 sm:p-6 md:grid-cols-[6rem_minmax(0,1fr)_auto] md:items-center ${
        past ? "opacity-60" : ""
      }`}
    >
      <div className="flex w-[4.5rem] shrink-0 flex-col items-center rounded-xl border border-border/70 bg-background/60 px-3 py-3 sm:w-24">
        <span className="font-display text-3xl leading-none tabular-nums">{date.dia}</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
          {date.mes}
        </span>
        <span className="mt-0.5 text-[10px] tabular-nums text-muted-foreground">{date.ano}</span>
      </div>
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <StatusBadge past={past} soldOut={apres.forcar_sold_out} hasLink={!!apres.link_bilhetes} />
          {apres.hora && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {apres.hora.slice(0, 5)}
            </span>
          )}
        </div>
        {peca && withPecaLink ? (
          <Link
            to="/pecas/$slug"
            params={{ slug: peca.slug }}
            className="font-display text-2xl leading-snug transition-colors hover:text-accent sm:text-3xl"
          >
            {peca.nome}
          </Link>
        ) : peca ? (
          <span className="font-display text-2xl leading-snug sm:text-3xl">{peca.nome}</span>
        ) : (
          <span className="font-display text-2xl">—</span>
        )}
        <p className="mt-2 text-sm text-muted-foreground">{apres.local ?? "—"}</p>
      </div>
      <div className="col-span-2 md:col-span-1 md:text-right">
        {!past && apres.link_bilhetes ? (
          <a
            href={apres.link_bilhetes}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-accent-foreground transition-all hover:brightness-110 md:w-auto"
          >
            Reservar <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function StatusBadge({
  past,
  soldOut,
  hasLink,
}: {
  past: boolean;
  soldOut?: boolean | null;
  hasLink: boolean;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.24em]";
  if (soldOut) {
    return <span className={`${base} border-border text-muted-foreground`}>Esgotado</span>;
  }
  if (past) {
    return <span className={`${base} border-border text-muted-foreground`}>Passado</span>;
  }
  if (hasLink) {
    return (
      <span className={`${base} border-accent/50 bg-accent/10 text-accent`}>
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
        Bilhetes à venda
      </span>
    );
  }
  return <span className={`${base} border-border/80 text-foreground/70`}>Brevemente</span>;
}