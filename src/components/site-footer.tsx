import { Facebook, Instagram, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";

const SOCIAL = [
  {
    href: "mailto:libelula.t@gmail.com",
    label: "E-mail",
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
    label: "Instagram",
    Icon: Instagram,
    external: true,
  },
];

const LEGAL = [
  { to: "/politica-de-privacidade", label: "Política de Privacidade" },
  { to: "/politica-de-cookies", label: "Política de Cookies" },
  { to: "/termos-e-condicoes", label: "Termos e Condições" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-28 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-center gap-6 py-10 sm:flex-row sm:justify-between">
          <nav aria-label="Informação legal">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {LEGAL.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="nav-underline text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex items-center gap-3">
            {SOCIAL.map(({ href, label, Icon, external }) => (
              <li key={href}>
                <a
                  href={href}
                  aria-label={label}
                  title={label}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent/60 hover:bg-accent/10 hover:text-accent"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border/60 py-8">
          <div className="space-y-1 text-center text-[11px] leading-relaxed text-muted-foreground">
            <p>Copyright © {year} Libélula Teatro.</p>
            <p>
              Website por{" "}
              <a
                href="https://makyneta.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                Makyneta Unipessoal, Lda.
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
