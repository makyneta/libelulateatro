import { createFileRoute } from "@tanstack/react-router";
import { LegalBlock, LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Libélula Teatro" },
      {
        name: "description",
        content:
          "Como a Libélula Teatro recolhe, utiliza e protege os dados pessoais dos visitantes do site.",
      },
      { property: "og:title", content: "Política de Privacidade — Libélula Teatro" },
      {
        property: "og:description",
        content: "Tratamento de dados pessoais na Libélula Teatro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LegalPage
      numero="05"
      etiqueta="Legal"
      titulo="Política de"
      destaque="privacidade."
    >
      <LegalBlock titulo="Responsável pelo tratamento">
        <p>
          A Libélula Teatro, com sede em Leiria, Portugal, é responsável pelo tratamento dos
          dados pessoais recolhidos através deste site. Para qualquer questão relacionada com
          privacidade, contacte-nos em libelula.t@gmail.com.
        </p>
      </LegalBlock>
      <LegalBlock titulo="Dados recolhidos">
        <p>
          Recolhemos apenas os dados que nos fornece voluntariamente através do formulário de
          contacto — nome, endereço de e-mail e o conteúdo da mensagem. Não recolhemos dados
          sensíveis nem realizamos perfis comerciais dos visitantes.
        </p>
      </LegalBlock>
      <LegalBlock titulo="Finalidade e fundamento">
        <p>
          Os dados são utilizados exclusivamente para responder ao seu pedido de contacto e,
          quando aplicável, para gerir reservas ou parcerias artísticas. O fundamento do
          tratamento é o seu consentimento e o interesse legítimo na comunicação com o público.
        </p>
      </LegalBlock>
      <LegalBlock titulo="Conservação">
        <p>
          Os dados são conservados apenas durante o período necessário à finalidade que motivou
          a sua recolha, salvo obrigação legal de conservação por período superior.
        </p>
      </LegalBlock>
      <LegalBlock titulo="Os seus direitos">
        <p>
          Pode a qualquer momento solicitar o acesso, a retificação, o apagamento, a limitação
          ou a portabilidade dos seus dados, bem como opor-se ao tratamento, escrevendo para
          libelula.t@gmail.com. Tem também o direito de apresentar reclamação à Comissão
          Nacional de Proteção de Dados.
        </p>
      </LegalBlock>
      <LegalBlock titulo="Alterações">
        <p>
          Esta política pode ser atualizada para refletir mudanças na nossa atividade ou na
          legislação aplicável. A versão em vigor é sempre a publicada nesta página.
        </p>
      </LegalBlock>
    </LegalPage>
  ),
});
