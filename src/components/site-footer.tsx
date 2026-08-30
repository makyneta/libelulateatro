import { Facebook, Instagram, Mail } from "lucide-react";

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

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-28 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {SOCIAL.map(({ href, label, Icon, external }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-accent"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="space-y-1 text-center text-[11px] leading-relaxed text-muted-foreground sm:text-right">
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
