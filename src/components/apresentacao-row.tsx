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
    <article className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 border-b border-border/60 py-6 last:border-b-0 sm:gap-8">
      <div className="flex w-16 flex-col items-center text-center sm:w-20">
        <span className="font-display text-3xl font-medium text-foreground sm:text-4xl">{date.dia}</span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">{date.mes}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70">{date.ano}</span>
      </div>
      <div className="min-w-0">
        {peca && withPecaLink ? (
          <Link
            to="/pecas/$slug"
            params={{ slug: peca.slug }}
            className="font-display text-lg leading-tight text-foreground transition-colors hover:text-accent sm:text-xl"
          >
            {peca.nome}
          </Link>
        ) : peca ? (
          <p className="font-display text-lg leading-tight text-foreground sm:text-xl">{peca.nome}</p>
        ) : null}
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {apres.hora ? apres.hora.slice(0, 5) : ""}
          {apres.hora && apres.local ? " · " : ""}
          {apres.local ?? ""}
        </p>
      </div>
      <div className="shrink-0">
        {past ? (
          <span className="inline-flex items-center rounded-full border border-foreground/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/70">
            Sold out
          </span>
        ) : apres.link_bilhetes ? (
          <a
            href={apres.link_bilhetes}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-widest text-accent-foreground transition hover:opacity-90"
          >
            Comprar <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : peca ? (
          <Link
            to="/pecas/$slug"
            params={{ slug: peca.slug }}
            className="text-xs font-semibold uppercase tracking-widest text-foreground/80 hover:text-accent"
          >
            Saber mais
          </Link>
        ) : null}
      </div>
    </article>
  );
}