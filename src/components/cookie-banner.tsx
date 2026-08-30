import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "libelula-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function decide(value: "accepted" | "essential") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="animate-fade-up mx-auto flex max-w-4xl flex-col gap-5 rounded-2xl border border-border bg-card/95 p-5 shadow-[var(--shadow-elegant)] backdrop-blur sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">
            Utilizamos cookies essenciais para o funcionamento do site. Saiba mais na{" "}
            <Link
              to="/politica-de-cookies"
              className="text-foreground underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent"
            >
              Política de Cookies
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:ml-auto">
          <button
            type="button"
            onClick={() => decide("essential")}
            className="rounded-full border border-border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
          >
            Só essenciais
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-full bg-accent px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-foreground transition-all hover:brightness-110"
          >
            Aceitar
          </button>
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => decide("essential")}
            className="text-muted-foreground transition-colors hover:text-accent sm:hidden"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
