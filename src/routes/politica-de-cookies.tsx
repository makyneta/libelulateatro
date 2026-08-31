import { createFileRoute } from "@tanstack/react-router";
import { LegalBlock, LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/politica-de-cookies")({
  head: () => ({
    meta: [
      { title: "Política de Cookies — Libélula Teatro" },
      {
        name: "description",
        content:
          "Que cookies e tecnologias semelhantes são utilizados no site da Libélula Teatro e como os pode controlar.",
      },
      { property: "og:title", content: "Política de Cookies — Libélula Teatro" },
      {
        property: "og:description",
        content: "Utilização de cookies no site da Libélula Teatro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://libelulateatro.lovable.app/politica-de-cookies" },
    ],
    links: [{ rel: "canonical", href: "https://libelulateatro.lovable.app/politica-de-cookies" }],
  }),
  component: () => (
    <LegalPage numero="06" etiqueta="Legal" titulo="Política de" destaque="cookies.">
      <LegalBlock titulo="O que são cookies">
        <p>
          Cookies são pequenos ficheiros de texto guardados no seu dispositivo quando visita um
          site. Permitem, entre outras coisas, memorizar preferências e assegurar o
          funcionamento correto das páginas.
        </p>
      </LegalBlock>
      <LegalBlock titulo="Cookies que utilizamos">
        <p>
          Este site utiliza apenas cookies e armazenamento local estritamente necessários ao seu
          funcionamento, designadamente para manter a sessão da área de administração de
          conteúdos. Não utilizamos cookies publicitários nem de perfilagem.
        </p>
      </LegalBlock>
      <LegalBlock titulo="Serviços de terceiros">
        <p>
          Os links para bilheteiras externas e para as redes sociais conduzem a plataformas com
          políticas próprias de cookies, sobre as quais não temos controlo. Recomendamos a
          consulta das respetivas políticas.
        </p>
      </LegalBlock>
      <LegalBlock titulo="Como controlar">
        <p>
          Pode bloquear ou eliminar cookies nas definições do seu navegador. Note que a
          desativação de cookies necessários pode afetar o funcionamento de algumas áreas do
          site.
        </p>
      </LegalBlock>
      <LegalBlock titulo="Contacto">
        <p>
          Para esclarecimentos sobre esta política, escreva-nos para libelula.t@gmail.com.
        </p>
      </LegalBlock>
    </LegalPage>
  ),
});
