import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";

export function LegalPage({
  numero,
  etiqueta,
  titulo,
  destaque,
  children,
}: {
  numero: string;
  etiqueta: string;
  titulo: string;
  destaque: string;
  children: ReactNode;
}) {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-20 sm:px-8 sm:pt-28">
        <header className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4">
              <span className="font-display text-lg italic text-muted-foreground/70">
                {numero}
              </span>
              <span className="h-px w-8 bg-border" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">
                {etiqueta}
              </span>
            </div>
            <div className="mt-6 h-px w-12 bg-accent" />
          </div>
          <div className="lg:col-span-8">
            <h1 className="font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              {titulo} <span className="italic">{destaque}</span>
            </h1>
          </div>
        </header>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="max-w-3xl space-y-10 lg:ml-auto lg:w-8/12 lg:max-w-none">
            {children}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

export function LegalBlock({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="space-y-3 border-t border-border/60 pt-6 first:border-t-0 first:pt-0">
      <h2 className="font-display text-xl italic sm:text-2xl">{titulo}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {children}
      </div>
    </div>
  );
}
