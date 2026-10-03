# Libélula Teatro Site

Quero que construas um website institucional completo, profissional e 100% responsivo (mobile-first, com excelente adaptação também a desktop/tablet) para a companhia de teatro portuguesa "Libélula Teatro".

1. Visão geral e tom visual


Site institucional/artístico, com identidade visual elegante, cultural e contemporânea — nada de templates genéricos de "corporate SaaS".
A companhia já tem um logótipo oficial (círculo cinzento com a silhueta de uma asa de libélula estilizada, em branco e cinza-escuro, com o nome "libélula teatro" em tipografia minúscula cinzenta) — esse logótipo vai ser carregado via admin (ver secção 4). A paleta de cores do site deve ser construída a partir desta identidade monocromática: tons de cinza (claro a grafite/quase-preto) como base, branco/off-white de fundo, e uma única cor de destaque bem escolhida para CTAs e acentos (sugestão: um vermelho/bordô discreto ou um dourado/âmbar suave, usado com moderação) — para o site não ficar todo em escala de cinzentos sem nenhum ponto de contraste, mas também sem fugir do tom sóbrio e elegante do logótipo.
Tipografia com par editorial: um título serifado com carácter (ex: Playfair Display, Fraunces ou similar) + um corpo de texto sans-serif limpo (ex: Inter, Work Sans).
Micro-animações subtis em scroll e hover (fade-in, transições suaves) — sem exageros que comprometam performance.
Site totalmente em Português de Portugal (pt-PT).
Acessível (bom contraste, tamanhos de fonte legíveis, navegação por teclado funcional).


2. Estrutura de navegação (header)

Header fixo/sticky com menu:


Início
Peças
Bilhetes
Contactos


Logótipo "Libélula Teatro" à esquerda (o logótipo oficial é carregado via admin — ver secção 4 — e deve aparecer com bom contraste sobre o fundo do header; se o header tiver fundo claro, garantir que o logótipo, que é em tons de cinza, mantém boa legibilidade). Menu hamburger animado em mobile, com overlay fullscreen.


Importante: a página de administração (ver secção 4) não aparece neste menu — é apenas acessível diretamente pelo URL /admin.



3. Páginas do site

3.1 Homepage (/)


Hero section: imagem/visual de impacto (espaço para foto de uma peça em palco), nome "Libélula Teatro", uma frase de identidade/missão da companhia (ex: tagline curta sobre teatro, arte e comunidade — podes sugerir uma frase elegante já que ainda não tenho uma definida).
Secção "Próximas Apresentações": lista/cards com a(s) próxima(s) data(s) de apresentações futuras (peça, data, hora, local), com botão "Comprar Bilhetes" quando houver link disponível, ou "Saber mais" a apontar para a página da peça.
Secção "Últimas Peças": destaque visual (cards/grid) com as 2 peças mais recentes realizadas pela companhia (cartaz/imagem + nome + ano).
Secção de Contacto rápido: ícones/links para Facebook, Instagram e e-mail (ver secção 5).
Footer com os mesmos contactos, e crédito de desenvolvimento, no final, com o texto "Makyneta Unipessoal, Lda." a funcionar como link, a abrir em nova aba, a apontar para https://makyneta.github.io (sem texto adicional como "site desenvolvido por" — apenas o nome, estilizado de forma discreta, típico de um crédito de rodapé).


3.2 Página "Peças" (/pecas)


Grid/lista com todas as peças de teatro já realizadas pela companhia, ordenadas da mais recente para a mais antiga.
Cada peça mostra: imagem/cartaz, nome da peça, ano/período, e uma breve descrição/sinopse.
Cada card da peça é clicável e leva à página individual dessa peça (ver secção 3.3 abaixo) — não um modal, mas uma página própria com URL dedicado.
Layout responsivo: grid de 3 colunas em desktop, 2 em tablet, 1 em mobile.


3.3 Página individual de cada Peça (/pecas/[slug])


Eu escolho o URL/slug de cada peça — cada peça de teatro tem a sua própria página, com um URL definido manualmente por mim no painel de administração (campo de texto livre, ex: /pecas/a-floresta-encantada). O sistema pode sugerir um slug automático a partir do nome da peça, mas a escolha final do URL é sempre minha: devo poder escrever/alterar livremente esse campo antes de gravar, e o URL gerado nunca deve ficar fixo ou bloqueado a partir do nome.
Conteúdo da página:

Imagem/cartaz da peça em destaque (maior do que no grid).
Nome da peça e ano/período.
Descrição completa (texto mais longo do que a breve descrição usada no grid de /pecas).
Ficha técnica opcional (encenação, elenco, duração, etc., apenas se preenchida no admin).
Secção "Apresentações desta peça": lista apenas das datas de apresentação associadas a esta peça específica (não todas as datas do site) — aplicando a mesma regra da secção 3.4: data futura → botão "Comprar Bilhetes"; data passada → etiqueta "SOLD OUT".
Botão/link para voltar a "Todas as Peças".



Se alguém visitar um slug que não existe, mostrar uma página 404 simples e elegante (consistente com o resto do site) com link de volta a /pecas.


3.4 Página "Bilhetes" (/bilhetes)


Lista cronológica de todas as datas de apresentações de todas as peças (passadas e futuras), da mais próxima/futura no topo.
Para cada data: nome da peça (com link para a página individual dessa peça), data, hora, local.
Regra de negócio importante:

Se a data da apresentação ainda não ocorreu → mostrar botão/link "Comprar Bilhetes" (apontando para o link de venda configurado para essa data — campo editável no admin).
Se a data já ocorreu → não mostrar botão de compra; mostrar em vez disso a etiqueta "SOLD OUT" em destaque visual (badge/tag), de forma clara mas elegante (não like um erro, mas como um selo).
Esta lógica deve ser automática, comparando a data da apresentação com a data atual — não deve depender de marcação manual extra (ainda que o admin possa também sobrepor manualmente se necessário).
Esta é a mesma lógica usada na secção "Apresentações desta peça" dentro da página individual de cada peça (3.3) — só que aqui aparecem todas as peças juntas, e lá aparecem só as datas dessa peça.





3.5 Página "Contactos" (/contactos)


Página profissional de contacto com:

Formulário de contacto simples (nome, e-mail, mensagem) — pode usar serviço de envio de e-mail simples/gratuito compatível com o Lovable, ou indicar claramente "mailto:" como fallback se não houver backend de envio configurado.
Bloco com os contactos diretos: Facebook, Instagram, E-mail (ver secção 5).
Mapa ou texto de localização (Marinha Grande, Portugal) — opcional, mas seria um bom toque.





4. Página de Administração (/admin) — NÃO aparece no header

Funcionalidades:


Primeiro acesso / definição de password:

Quando o /admin é acedido por a primeira vez (ainda não existe password definida), o sistema deve apresentar um formulário de "Definir password de administrador" (definir password + confirmar password).
Depois de definida, essa password fica guardada (de forma seguramente encriptada/hashed, não em texto simples) e passa a ser exigida em todos os acessos seguintes através de um ecrã de login simples (campo de password).
Não deve haver nenhuma password pré-definida nem visível no código fonte.



Painel de administração (após login), com:

Identidade visual: campo para carregar o logótipo oficial da companhia (upload de imagem), que deve depois ser usado automaticamente: no header/navegação, no footer, como favicon do site, e em qualquer outro local onde o logótipo apareça (ex: ecrã de login do admin, meta tags de partilha em redes sociais/Open Graph). Deve haver também a possibilidade de carregar uma versão alternativa do logótipo (ex: versão a negativo/branco) caso seja necessário para fundos escuros — campo opcional.
Gestão de Peças: listar, adicionar, editar e remover peças de teatro. Campos por peça:

Nome da peça
URL/slug da página individual — campo de texto editável por mim (ex: a-floresta-encantada), usado para gerar o link /pecas/a-floresta-encantada. O sistema deve sugerir um slug automático a partir do nome, mas permitir-me sempre editar/escolher o slug manualmente, e avisar-me se eu tentar gravar um slug que já está a ser usado por outra peça.
Ano/período
Descrição breve (usada no grid de /pecas e nos cards da homepage)
Descrição completa (usada na página individual da peça — opcional, se vazia usa a breve)
Imagem/cartaz: campo para indicar a imagem da peça (upload de ficheiro, se o Lovable suportar armazenamento de imagens; caso contrário, campo de URL de imagem como alternativa)
Ficha técnica (opcional: encenação, elenco, duração)



Gestão de Datas de Apresentação: para cada peça, adicionar/editar/remover datas de apresentação (data, hora, local, link de bilhetes). O sistema deve calcular automaticamente se a data já passou (→ mostra "SOLD OUT" no site público) ou está por vir (→ mostra botão de compra). Estas datas aparecem tanto na página geral de Bilhetes como na secção "Apresentações desta peça" dentro da página individual da peça correspondente.
Interface simples, clara, sem necessidade de conhecimentos técnicos — pensa nisto como um mini-CMS interno para a companhia gerir o site sem precisar de programador depois de entregue.
Botão de logout.



Esta página deve estar excluída de qualquer menu de navegação visível e idealmente também marcada com noindex para motores de busca (não deve aparecer indexada no Google).


5. Informação de contacto (usar em todo o site)


Facebook: https://www.facebook.com/libelulateatro.t
Instagram: @libelula.teatro
E-mail: libelula.t@gmail.com


Usar ícones reconhecíveis (Facebook, Instagram, Mail) ligados diretamente a estes destinos, tanto no header/footer como na página de contactos.

6. Requisitos técnicos e de qualidade


Site 100% funcional e responsivo em mobile e desktop — testar visualmente os principais breakpoints (mobile ~375px, tablet ~768px, desktop ~1440px).
Performance: imagens otimizadas/lazy-loaded, sem bibliotecas pesadas inúteis.
SEO básico: title e meta description por página, estrutura semântica HTML5 (header, main, section, footer), favicon gerado a partir do logótipo carregado no admin (com fallback temporário simples enquanto o logótipo não é carregado).
Todos os links externos (Facebook, Instagram) devem abrir em nova aba (target="_blank", rel="noopener noreferrer").
Formulário de contacto com validação básica de campos (nome, e-mail válido, mensagem obrigatória).
Estados vazios tratados com elegância (ex: "Não há apresentações agendadas neste momento" se a lista estiver vazia).
Sem conteúdo placeholder do tipo "Lorem Ipsum" no resultado final visível — usar antes textos de exemplo coerentes em português, conforme indicado na secção 8.


7. Estrutura de dados sugerida (para o admin/backend)

Peça {
  id
  nome
  slug                 // URL escolhido manualmente no admin, ex: "a-floresta-encantada" → /pecas/a-floresta-encantada
  ano (ou período)
  descricao_breve      // usada no grid de /pecas e nos cards da homepage
  descricao_completa   // usada na página individual da peça (opcional; se vazia, usa descricao_breve)
  imagem_url
  ficha_tecnica (opcional: encenação, elenco, duração)
}

Apresentacao {
  id
  peca_id (referência à Peça)
  data
  hora
  local
  link_bilhetes (opcional)
  // estado "SOLD OUT" vs "comprar bilhetes" calculado automaticamente
  // comparando `data` com a data atual do sistema
  // aparece tanto na lista geral de /bilhetes como na página individual da peça correspondente
}


8. Sobre o conteúdo (peças, datas, imagens)


Tentei recolher automaticamente os nomes, datas e descrições das peças na página de Facebook da companhia (facebook.com/libelulateatro.t), mas o Facebook bloqueia o acesso automático a esse conteúdo para qualquer ferramenta externa — por isso não foi possível extrair os dados reais.



Como o site vai ter um painel de administração funcional (secção 4), não é necessário preencher o conteúdo das peças aqui no prompt: o Lovable deve construir o site com 2 ou 3 peças de exemplo coerentes em português (nomes, descrições e datas fictícias mas plausíveis, claramente substituíveis), apenas para o site não ficar vazio nem com "Lorem Ipsum" enquanto eu não insiro o conteúdo real. Depois de o site estar construído, eu próprio vou ao /admin e:


Adiciono cada peça real (nome, slug/URL, ano, descrição breve, descrição completa, imagem, ficha técnica);
Adiciono as respetivas datas de apresentação (passadas e futuras, com local e link de bilhetes quando aplicável);
O site deve depois refletir automaticamente esse conteúdo em todas as páginas relevantes (homepage, /pecas, página individual de cada peça, e /bilhetes), sem necessitar de nova intervenção no código.


Texto institucional (opcional)

Frase/tagline para o Hero da homepage: ___________________________
Texto "Sobre a companhia" (se quiseres uma secção "Quem Somos"): ___________________________


Resumo final para o Lovable: constrói o site completo conforme as secções 1 a 7 acima, incluindo as páginas individuais de cada peça com slug editável no admin, e usa apenas conteúdo de exemplo plausível em português (conforme secção 8) até eu inserir o conteúdo real através do painel /admin.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://libelulateatro.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/72e57df7-eca0-4ef1-8b66-47bc2a0078f6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
