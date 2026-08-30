import { createFileRoute } from "@tanstack/react-router";
import { LegalBlock, LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/termos-e-condicoes")({
  head: () => ({
    meta: [
      { title: "Termos e Condições — Libélula Teatro" },
      {
        name: "description",
        content:
          "Condições de utilização do site da Libélula Teatro, direitos de autor e regras aplicáveis à compra de bilhetes.",
      },
      { property: "og:title", content: "Termos e Condições — Libélula Teatro" },
      {
        property: "og:description",
        content: "Condições de utilização do site da Libélula Teatro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LegalPage numero="07" etiqueta="Legal" titulo="Termos e" destaque="condições.">
      <LegalBlock titulo="Aceitação">
        <p>
          A utilização deste site implica a aceitação integral das presentes condições. Se não
          concordar com alguma delas, deverá abster-se de utilizar o site.
        </p>
      </LegalBlock>
      <LegalBlock titulo="Conteúdos e propriedade intelectual">
        <p>
          Todos os textos, imagens, vídeos, marcas e materiais gráficos apresentados são
          propriedade da Libélula Teatro ou dos respetivos autores, estando protegidos por
          direitos de autor. A reprodução total ou parcial requer autorização prévia por
          escrito.
        </p>
      </LegalBlock>
      <LegalBlock titulo="Programação e espetáculos">
        <p>
          As informações sobre datas, locais e elencos são publicadas de boa-fé e podem ser
          alteradas por motivos artísticos, técnicos ou de força maior. Recomendamos a
          confirmação junto do espaço de acolhimento antes de cada sessão.
        </p>
      </LegalBlock>
      <LegalBlock titulo="Bilhetes">
        <p>
          A venda de bilhetes é efetuada por bilheteiras externas ou pelos espaços de
          acolhimento. As condições de compra, trocas e reembolsos são as definidas por essas
          entidades.
        </p>
      </LegalBlock>
      <LegalBlock titulo="Limitação de responsabilidade">
        <p>
          A Libélula Teatro não se responsabiliza por eventuais interrupções técnicas do site
          nem pelos conteúdos de sites de terceiros acessíveis através de links aqui
          disponibilizados.
        </p>
      </LegalBlock>
      <LegalBlock titulo="Lei aplicável">
        <p>
          Estas condições regem-se pela lei portuguesa, sendo competentes os tribunais
          portugueses para a resolução de qualquer litígio.
        </p>
      </LegalBlock>
    </LegalPage>
  ),
});
