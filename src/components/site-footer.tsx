import { Facebook, Instagram, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const SOCIAL = [
  {
    href: "mailto:libelula.t@gmail.com",
    label: "libelula.t@gmail.com",
    Icon: Mail,
    external: false,
  },
  {
    href: "https://www.facebook.com/libelulateatro.t",
    label: "Facebook",
    Icon: Facebook,
    external: true,
  },
  {
    href: "https://instagram.com/libelula.teatro",
    label: "@libelula.teatro",
    Icon: Instagram,
    external: true,
  },
];

const QUICK_NAV = [
  { to: "/pecas", label: "Peças" },
  { to: "/bilhetes", label: "Bilhetes" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contactos", label: "Contactos" },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative mt-28 overflow-hidden border-t border-border/60 bg-card/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Fale connosco
            </p>
            <a
              href="mailto:libelula.t@gmail.com"
              className="group mt-5 inline-flex flex-wrap items-center gap-3 font-display text-3xl italic leading-tight transition-colors hover:text-accent sm:text-4xl"
            >
              libelula.t@gmail.com
              <ArrowUpRight className="h-6 w-6 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Libélula Teatro · Leiria, Portugal — programação, residências e parcerias.
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Navegar
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {QUICK_NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="nav-underline inline-block text-foreground/80 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Redes
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {SOCIAL.map(({ href, label, Icon, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2 text-xs text-foreground/80 transition-colors hover:border-accent/60 hover:bg-accent/10 hover:text-accent"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            ©{" "}
            <a
              href="https://makyneta.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display italic tracking-wide hover:text-accent"
            >
              Makyneta Unipessoal, Lda.
            </a>
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
            Libélula Teatro · Temporada 2026
          </p>
        </div>
      </div>
    </footer>
  );
}