import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Facebook, Instagram, Mail, MapPin, Send } from "lucide-react";
import { z } from "zod";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/contactos")({
  head: () => ({
    meta: [
      { title: "Contactos — Libélula Teatro" },
      {
        name: "description",
        content: "Fale com a Libélula Teatro — Leiria, Portugal.",
      },
      { property: "og:title", content: "Contactos — Libélula Teatro" },
      { property: "og:description", content: "Leiria, Portugal." },
    ],
  }),
  component: ContactosPage,
});

const schema = z.object({
  nome: z.string().trim().min(1, "Indique o seu nome.").max(100),
  email: z.string().trim().email("E-mail inválido.").max(255),
  mensagem: z.string().trim().min(1, "A mensagem é obrigatória.").max(2000),
});

function ContactosPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      nome: fd.get("nome"),
      email: fd.get("email"),
      mensagem: fd.get("mensagem"),
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0]) errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    const subject = encodeURIComponent(`Contacto via site — ${parsed.data.nome}`);
    const body = encodeURIComponent(
      `Nome: ${parsed.data.nome}\nE-mail: ${parsed.data.email}\n\n${parsed.data.mensagem}`,
    );
    window.location.href = `mailto:libelula.t@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pt-28">
        <header className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4">
              <span className="font-display text-lg italic text-muted-foreground/70">04</span>
              <span className="h-px w-8 bg-border" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">
                Contacto
              </span>
            </div>
            <div className="mt-6 h-px w-12 bg-accent" />
          </div>
          <div className="lg:col-span-8">
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Fale <span className="italic">connosco.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Programação, residências, parcerias ou um simples olá — escreva-nos.
            </p>
          </div>
        </header>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto grid max-w-6xl gap-16 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-12">
          <form onSubmit={onSubmit} className="space-y-6 lg:col-span-7" noValidate>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Formulário
            </p>
            <div className="h-px w-12 bg-accent" />
            <div className="space-y-5 pt-2">
              <Field label="Nome" name="nome" error={errors.nome} />
              <Field label="E-mail" name="email" type="email" error={errors.email} />
              <Field label="Mensagem" name="mensagem" error={errors.mensagem} multiline />
            </div>
            <button
              type="submit"
              className="group mt-4 inline-flex items-center gap-3 bg-accent px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Enviar mensagem
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            {sent && (
              <p className="text-sm italic text-muted-foreground">
                Abrimos o seu cliente de e-mail para enviar a mensagem.
              </p>
            )}
          </form>

          <aside className="lg:col-span-4 lg:col-start-9">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Direto
            </p>
            <div className="mt-4 h-px w-12 bg-accent" />
            <ul className="mt-8 space-y-5 text-base">
              <li>
                <a
                  href="mailto:libelula.t@gmail.com"
                  className="group inline-flex items-center gap-3 hover:text-accent"
                >
                  <Mail className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
                  <span className="font-display text-lg italic">libelula.t@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/libelula.teatro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 hover:text-accent"
                >
                  <Instagram className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
                  <span>@libelula.teatro</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/libelulateatro.t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 hover:text-accent"
                >
                  <Facebook className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
                  <span>Facebook</span>
                </a>
              </li>
            </ul>
            <div className="mt-10 border-t border-border/60 pt-6">
              <p className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4" />
                <span>
                  Leiria
                  <br />
                  Portugal
                </span>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  multiline = false,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  multiline?: boolean;
  error?: string;
}) {
  const common =
    "block w-full border-0 border-b border-border/60 bg-transparent px-0 py-3 text-base text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-accent";
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
      {multiline ? (
        <textarea name={name} rows={5} className={common} />
      ) : (
        <input name={name} type={type} className={common} />
      )}
      {error && <span className="mt-2 block text-xs italic text-destructive">{error}</span>}
    </label>
  );
}