import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail } from "lucide-react";
import { LibelulaLogo } from "./libelula-logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <LibelulaLogo size={42} />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Companhia de teatro sediada na Marinha Grande. Criamos espectáculos
              que cruzam memória, território e comunidade.
            </p>
          </div>
          <div>
            <h3 className="font-display text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Navegação
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="hover:text-accent">Início</Link></li>
              <li><Link to="/pecas" className="hover:text-accent">Peças</Link></li>
              <li><Link to="/bilhetes" className="hover:text-accent">Bilhetes</Link></li>
              <li><Link to="/contactos" className="hover:text-accent">Contactos</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
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
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Libélula Teatro</p>
          <a
            href="https://makyneta.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display italic tracking-wide text-muted-foreground/80 hover:text-accent"
          >
            Makyneta Unipessoal, Lda.
          </a>
        </div>
      </div>
    </footer>
  );
}