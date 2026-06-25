import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Facebook, Instagram, Mail, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { ApresentacaoRow } from "@/components/apresentacao-row";
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
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["homepage"],
      queryFn: () => listHomepageData(),
    }),
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
  const fetcher = useServerFn(listHomepageData);
  const { data } = useQuery({ queryKey: ["homepage"], queryFn: () => fetcher() });
  const proximas = data?.proximas ?? [];
  const pecasMap = data?.pecasMap ?? {};
  const ultimas = data?.ultimasPecas ?? [];
  const settings = data?.settings;
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
      {/* HERO */}
      <HeroSection title={heroTitle} subtitle={heroSubtitle} images={heroImages} />

      {/* SOBRE */}
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Sobre</p>
        <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">{sobreTitulo}</h2>
        <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-muted-foreground sm:text-lg">
          {sobreTexto}
        </p>
      </section>

      {/* PRÓXIMAS APRESENTAÇÕES */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeader
          eyebrow="Em palco"
          title="Próximas apresentações"
          link={{ to: "/bilhetes", label: "Ver todas" }}
        />
        <div className="mt-10">
          {proximas.length === 0 ? (
            <EmptyState text="Não há apresentações agendadas neste momento." />
          ) : (
            <div>
              {proximas.map((a) => (
                <ApresentacaoRow key={a.id} apres={a} peca={pecasMap[a.peca_id]} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ÚLTIMAS PEÇAS */}
      <section className="bg-secondary/40 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeader
            eyebrow="Repertório"
            title="Últimas peças"
            link={{ to: "/pecas", label: "Todas as peças" }}
          />
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {ultimas.map((p) => (
              <Link
                key={p.id}
                to="/pecas/$slug"
                params={{ slug: p.slug }}
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
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
                <h3 className="mt-5 font-display text-2xl text-foreground transition-colors group-hover:text-accent">
                  {p.nome}
                </h3>
                <p className="mt-1 text-sm uppercase tracking-widest text-muted-foreground">{p.ano}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Contacto</p>
            <h2 className="mt-4 font-display text-4xl tracking-tight">Fale connosco.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Programação, residências, parcerias ou apenas para deixar uma palavra —
              estamos a um clique de distância.
            </p>
          </div>
          <ul className="flex flex-col gap-4 text-base">
            <li>
              <a href="mailto:libelula.t@gmail.com" className="inline-flex items-center gap-3 hover:text-accent">
                <Mail className="h-5 w-5" /> libelula.t@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/libelulateatro.t"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 hover:text-accent"
              >
                <Facebook className="h-5 w-5" /> Facebook
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/libelula.teatro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 hover:text-accent"
              >
                <Instagram className="h-5 w-5" /> @libelula.teatro
              </a>
            </li>
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}

function SectionHeader({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: { to: "/bilhetes" | "/pecas"; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {link && (
        <Link
          to={link.to}
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-accent"
        >
          {link.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
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

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-secondary/30 px-6 py-10 text-center text-sm text-muted-foreground">
      {text}
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
    <section className="relative isolate overflow-hidden">
      {/* Slideshow */}
      <div className="absolute inset-0 -z-20 bg-foreground">
        {hasImages ? (
          images.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary" />
        )}
      </div>
      {/* Legibility overlay */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 ${
          hasImages
            ? "bg-gradient-to-b from-black/70 via-black/55 to-black/75 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/55 sm:to-black/20"
            : ""
        }`}
      />

      <div className="mx-auto flex min-h-[78vh] max-w-6xl items-center px-5 pb-20 pt-24 sm:min-h-[80vh] sm:px-8 sm:pt-32 md:min-h-[88vh]">
        <div className="max-w-3xl animate-fade-up">
          <p
            className={`text-xs font-medium uppercase tracking-[0.3em] ${
              hasImages ? "text-accent-foreground/90" : "text-accent"
            }`}
            style={hasImages ? { color: "hsl(var(--accent) / 1)" } : undefined}
          >
            Leiria · Portugal
          </p>
          <h1
            className={`mt-6 font-display text-5xl leading-[1.05] tracking-tight drop-shadow-sm sm:text-6xl md:text-7xl ${
              hasImages ? "text-white" : "text-foreground"
            }`}
          >
            {title}
          </h1>
          <p
            className={`mt-8 max-w-xl text-base leading-relaxed sm:text-lg ${
              hasImages ? "text-white/90" : "text-muted-foreground"
            }`}
          >
            {subtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/bilhetes"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-widest text-accent-foreground transition hover:opacity-90"
            >
              Ver bilhetes <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pecas"
              className={`inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline ${
                hasImages ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              Todas as peças
            </Link>
          </div>
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
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}