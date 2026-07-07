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
      className={`group grid grid-cols-1 gap-3 border-b border-border/50 py-8 last:border-b-0 md:grid-cols-[10rem_1fr_1fr_auto] md:items-center md:gap-6 ${
        past ? "opacity-70" : ""
      }`}
    >
      <div className="font-display text-xl italic text-accent">
        <span className="tabular-nums">{date.dia}</span> {date.mes}{" "}
        <span className="text-muted-foreground/70">{date.ano}</span>
        {apres.hora && (
          <span className="ml-2 text-sm not-italic text-muted-foreground">
            · {apres.hora.slice(0, 5)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        {peca && withPecaLink ? (
          <Link
            to="/pecas/$slug"
            params={{ slug: peca.slug }}
            className="font-display text-2xl leading-snug transition-colors hover:text-accent"
          >
            {peca.nome}
          </Link>
        ) : peca ? (
          <span className="font-display text-2xl leading-snug">{peca.nome}</span>
        ) : (
          <span className="font-display text-2xl">—</span>
        )}
      </div>
      <div className="text-sm text-muted-foreground">{apres.local ?? "—"}</div>
      <div className="md:text-right">
        {past ? (
          <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {apres.forcar_sold_out ? "Esgotado" : "Passado"}
          </span>
        ) : apres.link_bilhetes ? (
          <a
            href={apres.link_bilhetes}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent hover:underline"
          >
            Reservar <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Em breve
          </span>
        )}
      </div>
    </article>
  );
}