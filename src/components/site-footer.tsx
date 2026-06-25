import { Facebook, Instagram, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-10 sm:px-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
          <li>
            <a
              href="mailto:libelula.t@gmail.com"
              className="inline-flex items-center gap-2 hover:text-accent"
            >
              <Mail className="h-4 w-4" /> libelula.t@gmail.com
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/libelulateatro.t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-accent"
            >
              <Facebook className="h-4 w-4" /> Facebook
            </a>
          </li>
          <li>
            <a
              href="https://instagram.com/libelula.teatro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-accent"
            >
              <Instagram className="h-4 w-4" /> @libelula.teatro
            </a>
          </li>
        </ul>
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
      </div>
    </footer>
  );
}