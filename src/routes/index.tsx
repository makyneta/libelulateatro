import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Facebook, Instagram, Mail, ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { listHomepageData } from "@/lib/public-data.functions";

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
  const proximas = data.proximas;
  const pecasMap = data.pecasMap;
  const ultimas = data.ultimasPecas;
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

      {/* AGENDA — tabular list */}
      <section className="border-t border-border/60 bg-secondary/30">
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

          {proximas.length === 0 ? (
            <p className="mt-16 text-center text-sm italic text-muted-foreground">
              Sem apresentações agendadas neste momento.
            </p>
          ) : (
            <div className="mt-6 hidden grid-cols-[0.35em_1fr] gap-x-6 border-b border-border/40 pb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/70 md:grid md:grid-cols-[10rem_1fr_1fr_auto]">
              <span>Data</span>
              <span>Espectáculo</span>
              <span>Local</span>
              <span className="text-right">Bilhetes</span>
            </div>
          )}

          <ul className="divide-y divide-border/50">
            {proximas.map((a) => {
              const peca = pecasMap[a.peca_id];
              const d = new Date(a.data + "T00:00:00");
              const soldOut = a.forcar_sold_out || d.getTime() < Date.now();
              const dia = String(d.getUTCDate()).padStart(2, "0");
              const mes = d.toLocaleDateString("pt-PT", { month: "short", timeZone: "UTC" }).replace(".", "");
              const ano = d.getUTCFullYear();
              return (
                <li key={a.id} className="group grid grid-cols-1 gap-3 py-8 md:grid-cols-[10rem_1fr_1fr_auto] md:items-center md:gap-6">
                  <div className="font-display text-xl italic text-accent">
                    <span className="tabular-nums">{dia}</span> {mes}{" "}
                    <span className="text-muted-foreground/70">{ano}</span>
                    {a.hora && <span className="ml-2 text-sm not-italic text-muted-foreground">· {a.hora.slice(0, 5)}</span>}
                  </div>
                  <div>
                    {peca ? (
                      <Link to="/pecas/$slug" params={{ slug: peca.slug }} className="font-display text-2xl leading-snug transition-colors hover:text-accent">
                        {peca.nome}
                      </Link>
                    ) : (
                      <span className="font-display text-2xl">—</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{a.local ?? "—"}</div>
                  <div className="md:text-right">
                    {soldOut ? (
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">Esgotado</span>
                    ) : a.link_bilhetes ? (
                      <a
                        href={a.link_bilhetes}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent hover:underline"
                      >
                        Reservar <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Em breve</span>
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

          <div className="mt-10 grid gap-px border border-border/60 bg-border/60 sm:grid-cols-2">
            {ultimas.map((p, i) => (
              <Link
                key={p.id}
                to="/pecas/$slug"
                params={{ slug: p.slug }}
                className="group block bg-background p-6 transition-colors hover:bg-secondary/40 sm:p-8"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
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
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Nº {String(i + 1).padStart(2, "0")} · {p.ano ?? "—"}
                    </p>
                    <h3 className="mt-2 font-display text-2xl italic transition-colors group-hover:text-accent sm:text-3xl">
                      {p.nome}
                    </h3>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="border-t-2 border-accent/80 bg-foreground text-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionMarker n="04" label="Contacto" tone="inverse" />
            <h2 className="mt-6 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
              Fale connosco sobre <span className="italic text-accent-foreground/90">programação, residências e parcerias.</span>
            </h2>
            <a
              href="mailto:libelula.t@gmail.com"
              className="mt-10 inline-block break-words border-b border-background/40 pb-2 font-display text-2xl italic transition-colors hover:border-background sm:text-4xl"
            >
              libelula.t@gmail.com
            </a>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-background/50">Redes</p>
            <ul className="mt-6 space-y-4 text-base">
              <li>
                <a href="https://instagram.com/libelula.teatro" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-background/80 hover:text-background">
                  <Instagram className="h-4 w-4" /> @libelula.teatro
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/libelulateatro.t" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-background/80 hover:text-background">
                  <Facebook className="h-4 w-4" /> Facebook
                </a>
              </li>
              <li>
                <a href="mailto:libelula.t@gmail.com" className="inline-flex items-center gap-3 text-background/80 hover:text-background">
                  <Mail className="h-4 w-4" /> Email direto
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
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
    <section className="relative isolate overflow-hidden bg-foreground text-background">
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1614] via-foreground to-[#2b1618]" />
        )}
      </div>
      {/* Legibility overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/80 sm:bg-gradient-to-r sm:from-black/85 sm:via-black/55 sm:to-black/30"
      />

      <div className="mx-auto grid min-h-[86vh] max-w-6xl grid-cols-1 items-end gap-12 px-5 pb-20 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-12 lg:items-end lg:gap-16 lg:pb-24">
        <div className="lg:col-span-8 animate-fade-up">
          <div className="flex items-center gap-4">
            <span className="font-display text-lg italic text-background/60">01</span>
            <span className="h-px w-8 bg-background/40" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-background/80">Temporada 2026</span>
          </div>
          <h1 className="mt-8 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl md:text-[6.5rem]">
            {title}
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-background/85 sm:text-lg">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-col gap-6 lg:col-span-4 lg:items-end">
          <Link
            to="/bilhetes"
            className="group inline-flex items-center gap-3 bg-accent px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            Ver bilhetes
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/pecas"
            className="inline-flex items-center gap-2 border-b border-background/40 pb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-background/80 transition-colors hover:border-background hover:text-background"
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
              className={`h-[2px] transition-all ${i === idx ? "w-10 bg-background" : "w-5 bg-background/40 hover:bg-background/70"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}