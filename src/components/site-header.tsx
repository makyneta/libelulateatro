import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
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
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
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

      <div
        id="mobile-nav"
        className={`fixed inset-0 z-50 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          className={`absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-background shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-border/60 px-5">
            <Link to="/" onClick={() => setOpen(false)} aria-label="Libélula Teatro — início">
              <LibelulaLogo size={32} />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
            >
              <span>Fechar</span>
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-6 pt-8">
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Navegação
            </span>
          </div>

          <nav className="flex flex-1 flex-col px-6 pt-4" aria-label="Navegação móvel">
            <ul className="flex flex-col divide-y divide-border/60">
              {NAV.map((item, i) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{ className: "text-accent" }}
                    className="group flex items-baseline gap-4 py-5 font-display text-2xl text-foreground transition-colors hover:text-accent"
                  >
                    <span className="w-8 text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="italic">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-border/60 px-6 py-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Libélula Teatro
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Leiria · Portugal</p>
          </div>
        </aside>
      </div>
    </header>
  );
}