import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { LibelulaLogo } from "./libelula-logo";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/pecas", label: "Peças" },
  { to: "/sobre", label: "Sobre" },
  { to: "/bilhetes", label: "Bilhetes" },
  { to: "/contactos", label: "Contactos" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const originalBody = document.body.style.overflow;
    const originalHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = originalBody;
      document.documentElement.style.overflow = originalHtml;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const mobileMenu = open
    ? createPortal(
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          className="mobile-menu-overlay fixed inset-0 flex h-dvh w-screen flex-col overflow-hidden md:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 px-5 sm:px-8">
            <Link to="/" onClick={() => setOpen(false)} aria-label="Libélula Teatro — início">
              <LibelulaLogo size={32} />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-foreground shadow-sm transition hover:border-foreground hover:text-accent"
            >
              <span>Fechar</span>
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Navegação móvel" className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
            <ul className="mx-auto flex w-full max-w-lg flex-col">
              {NAV.map((item, i) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{ className: "text-accent" }}
                    className="group flex items-baseline gap-5 border-b border-border/60 py-4 font-display text-3xl text-foreground transition-colors hover:text-accent sm:text-4xl"
                  >
                    <span className="w-8 shrink-0 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="italic">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-border/60 px-8 py-6 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Libélula Teatro · Leiria · Portugal
            </p>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center" aria-label="Libélula Teatro — início">
            <LibelulaLogo size={36} />
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition hover:text-accent md:hidden"
          >
            <span aria-hidden="true" className="flex flex-col items-end gap-[5px]">
              <span className="block h-px w-6 bg-current" />
              <span className="block h-px w-4 bg-current" />
            </span>
            <span>Menu</span>
          </button>
        </div>
      </header>

      {mobileMenu}
    </>
  );
}