import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { CookieBanner } from "@/components/cookie-banner";
import { listHomepageData, type Apresentacao, type Peca } from "@/lib/public-data.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Libélula Teatro — Companhia de teatro · Leiria" },
      {
        name: "description",
        content:
          "Companhia de teatro portuguesa sediada em Leiria. Próximas apresentações, peças em digressão e bilhetes.",
      },
      { property: "og:title", content: "Libélula Teatro" },
      { property: "og:description", content: "Teatro, território e comunidade." },
    ],
  }),
  loader: () => listHomepageData(),
  component: HomePage,
  errorComponent: ErrorComp,
  notFoundComponent: () => <div className="p-8">Não encontrado.</div>,
});

function ErrorComp() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-3xl">Algo correu mal</h1>
        <p className="mt-3 text-muted-foreground">Não foi possível carregar o conteúdo.</p>
      </div>
    </SiteShell>
  );
}

function HomePage() {
  const data = Route.useLoaderData();
  const proximas: Apresentacao[] = data.proximas;
  const pecasMap: Record<string, Peca> = data.pecasMap;
  const ultimas: Peca[] = data.ultimasPecas;
  const settings = data.settings;
  const heroImages = settings?.hero_images ?? [];
  const heroTitle = settings?.hero_title ?? "Libélula Teatro";
  const heroSubtitle =
    settings?.hero_subtitle ??
    "Companhia de teatro que cruza criação contemporânea, território e comunidade — espectáculos pensados como pequenos voos breves e necessários.";
  const sobreTitulo = settings?.sobre_titulo ?? "Sobre a companhia";
  const sobreTexto =
    settings?.sobre_texto ??
    "Sediada em Leiria, a Libélula Teatro dedica-se à criação de espectáculos contemporâneos em diálogo com o território e as comunidades onde se apresenta.";

  return (
    <SiteShell>
      <HeroSection title={heroTitle} subtitle={heroSubtitle} images={heroImages} />

      {/* SOBRE — editorial layout */}
      <section className="border-t border-border/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionMarker n="01" label="Sobre" />
              <div className="mt-6 h-px w-12 bg-accent" />
            </div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-3xl leading-[1.15] tracking-tight sm:text-4xl md:text-5xl">
              {sobreTitulo}
            </h2>
            <div className="mt-10 space-y-6 whitespace-pre-line text-base leading-relaxed text-muted-foreground sm:text-lg">
              {sobreTexto}
            </div>
            <Link
              to="/sobre"
              className="group mt-10 inline-flex items-center gap-3 border-b border-foreground/20 pb-2 text-[11px] font-semibold uppercase tracking-[0.25em] transition-colors hover:border-accent hover:text-accent"
            >
              Conhecer a companhia
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* AGENDA — event cards */}
      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border/60 pb-8">
            <div>
              <SectionMarker n="02" label="Em palco" />
              <h2 className="mt-4 font-display text-4xl italic tracking-tight sm:text-5xl">Agenda</h2>
            </div>
            <Link
              to="/bilhetes"
              className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] hover:text-accent"
            >
              Calendário completo
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {proximas.length === 0 && (
            <p className="mt-16 text-center text-sm italic text-muted-foreground">
              Sem apresentações agendadas neste momento.
            </p>
          )}

          <ul className="mt-10 grid gap-4">
            {proximas.map((a, index) => {
              const peca = pecasMap[a.peca_id];
              const d = new Date(a.data + "T00:00:00");
              const soldOut = a.forcar_sold_out || d.getTime() < Date.now();
              const dia = String(d.getUTCDate()).padStart(2, "0");
              const mes = d.toLocaleDateString("pt-PT", { month: "short", timeZone: "UTC" }).replace(".", "");
              const ano = d.getUTCFullYear();
              return (
                <li
                  key={a.id}
                  className={`group grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-2xl border border-border bg-card/60 p-5 transition-all hover:border-accent/50 hover:bg-card sm:gap-6 sm:p-6 md:grid-cols-[6rem_minmax(0,1fr)_auto] md:items-center ${
                    soldOut ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex w-[4.5rem] shrink-0 flex-col items-center rounded-xl border border-border/70 bg-background/60 px-3 py-3 sm:w-24">
                    <span className="font-display text-3xl leading-none tabular-nums">{dia}</span>
                    <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">{mes}</span>
                    <span className="mt-0.5 text-[10px] tabular-nums text-muted-foreground">{ano}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {soldOut ? (
                        <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Esgotado
                        </span>
                      ) : index === 0 ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-accent">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                          Próximo espectáculo
                        </span>
                      ) : a.link_bilhetes ? (
                        <span className="inline-flex items-center rounded-full border border-border/80 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-foreground/70">
                          Bilhetes à venda
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-border/80 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-foreground/70">
                          Brevemente
                        </span>
                      )}
                      {a.hora && (
                        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          {a.hora.slice(0, 5)}
                        </span>
                      )}
                    </div>
                    {peca ? (
                      <Link to="/pecas/$slug" params={{ slug: peca.slug }} className="font-display text-2xl leading-snug transition-colors hover:text-accent sm:text-3xl">
                        {peca.nome}
                      </Link>
                    ) : (
                      <span className="font-display text-2xl">—</span>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground">{a.local ?? "—"}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1 md:text-right">
                    {!soldOut && a.link_bilhetes && (
                      <a
                        href={a.link_bilhetes}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-accent-foreground transition-all hover:brightness-110 md:w-auto"
                      >
                        Reservar <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ARQUIVO — últimas peças em grelha editorial */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border/60 pb-8">
            <div>
              <SectionMarker n="03" label="Repertório" />
              <h2 className="mt-4 font-display text-4xl italic tracking-tight sm:text-5xl">Últimas peças</h2>
            </div>
            <Link
              to="/pecas"
              className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] hover:text-accent"
            >
              Todas as peças <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {ultimas.map((p, i) => (
              <Link
                key={p.id}
                to="/pecas/$slug"
                params={{ slug: p.slug }}
                className="group relative block overflow-hidden rounded-2xl border border-border bg-card/50 transition-all hover:border-accent/50"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  {p.imagem_url ? (
                    <img
                      src={p.imagem_url}
                      alt={p.nome}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                    />
                  ) : (
                    <PosterPlaceholder text={p.nome} />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90"
                  />
                  <span className="absolute left-5 top-5 inline-flex items-center rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-foreground/80 backdrop-blur">
                    {p.ano ?? "Repertório"}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4 p-6 sm:p-7">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Nº {String(i + 1).padStart(2, "0")} · {p.ano ?? "—"}
                    </p>
                    <h3 className="mt-2 font-display text-2xl italic transition-colors group-hover:text-accent sm:text-3xl">
                      {p.nome}
                    </h3>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CookieBanner />
    </SiteShell>

  );
}

function SectionMarker({ n, label, tone = "default" }: { n: string; label: string; tone?: "default" | "inverse" }) {
  const muted = tone === "inverse" ? "text-background/50" : "text-muted-foreground/70";
  const strong = tone === "inverse" ? "text-background" : "text-foreground";
  return (
    <div className="flex items-center gap-4">
      <span className={`font-display text-lg italic ${muted}`}>{n}</span>
      <span className={`h-px w-8 ${tone === "inverse" ? "bg-background/30" : "bg-border"}`} />
      <span className={`text-[10px] font-semibold uppercase tracking-[0.35em] ${strong}`}>{label}</span>
    </div>
  );
}

export function PosterPlaceholder({ text }: { text: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-secondary p-8 text-center">
      <span className="font-display text-2xl text-muted-foreground/70">{text}</span>
    </div>
  );
}

function HeroSection({
  title,
  subtitle,
  images,
}: {
  title: string;
  subtitle: string;
  images: string[];
}) {
  const [idx, setIdx] = useState(0);
  const hasImages = images.length > 0;

  useEffect(() => {
    if (images.length < 2) return;
    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, 5500);
    return () => window.clearInterval(t);
  }, [images.length]);

  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Slideshow layer — always rendered to keep SSR/CSR structure identical */}
      <div className="absolute inset-0 -z-20">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {!hasImages && (
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_10%,color-mix(in_oklab,var(--color-accent)_16%,transparent),transparent_60%)] bg-background" />
        )}
      </div>
      {/* Cinematic legibility overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/75 via-background/45 to-background sm:bg-gradient-to-r sm:from-background/95 sm:via-background/55 sm:to-background/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent"
      />

      <div className="mx-auto grid min-h-[86vh] max-w-6xl grid-cols-1 items-end gap-12 px-5 pb-20 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-12 lg:items-end lg:gap-16 lg:pb-24">
        <div className="lg:col-span-8">
          <div className="animate-fade-in-soft flex items-center gap-4">
            <span className="font-display text-lg italic text-muted-foreground">01</span>
            <span className="h-px w-8 bg-accent/60" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-accent">Temporada 2026</span>
          </div>
          <h1 className="animate-fade-in-soft animate-delay-200 mt-8 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl md:text-[6.5rem]">
            {title}
          </h1>
          <p className="animate-fade-in-soft animate-delay-300 mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        </div>
        <div className="animate-fade-in-soft animate-delay-500 flex flex-col gap-5 lg:col-span-4 lg:items-end">
          <Link
            to="/bilhetes"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-accent px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-foreground transition-all hover:brightness-110"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            Ver bilhetes
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/pecas"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/80 transition-colors hover:border-accent/60 hover:text-accent"
          >
            Todas as peças
          </Link>
        </div>
      </div>

      {hasImages && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Imagem ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-[2px] transition-all ${i === idx ? "w-10 bg-accent" : "w-5 bg-foreground/30 hover:bg-foreground/60"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}