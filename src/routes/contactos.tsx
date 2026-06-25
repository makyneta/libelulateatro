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
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        <header className="max-w-2xl animate-fade-up">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Contacto</p>
          <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">Fale connosco.</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Programação, residências, parcerias ou um simples olá — escreva-nos.
          </p>
        </header>

        <div className="mt-16 grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <Field label="Nome" name="nome" error={errors.nome} />
            <Field label="E-mail" name="email" type="email" error={errors.email} />
            <Field
              label="Mensagem"
              name="mensagem"
              error={errors.mensagem}
              multiline
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-widest text-accent-foreground transition hover:opacity-90"
            >
              Enviar <Send className="h-4 w-4" />
            </button>
            {sent && (
              <p className="text-sm text-muted-foreground">
                Abrimos o seu cliente de e-mail para enviar a mensagem.
              </p>
            )}
          </form>

          <aside className="space-y-6">
            <h2 className="font-display text-2xl">Contactos diretos</h2>
            <ul className="space-y-4 text-base">
              <li>
                <a href="mailto:libelula.t@gmail.com" className="inline-flex items-center gap-3 hover:text-accent">
                  <Mail className="h-5 w-5" /> libelula.t@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/libelulateatro.t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 hover:text-accent"
                >
                  <Facebook className="h-5 w-5" /> Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/libelula.teatro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 hover:text-accent"
                >
                  <Instagram className="h-5 w-5" /> @libelula.teatro
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="mt-0.5 h-5 w-5" />
                <span>Leiria<br />Portugal</span>
              </li>
            </ul>
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
    "block w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {multiline ? (
        <textarea name={name} rows={6} className={common} />
      ) : (
        <input name={name} type={type} className={common} />
      )}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}