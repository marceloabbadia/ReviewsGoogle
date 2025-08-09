Reviews Dashboard da Google

Aplicação simples para buscar e exibir reviews do Google Places com análise de sentimento básica.  
Possui API em Node.js e frontend em HTML/Bootstrap.

Funcionalidades
- Buscar Place ID pelo nome ou endereço (`/placeid`)
- Obter reviews e nota geral do local (`/reviews/api`) - Infelizmente a google so permite trazer 5, mas consegui trazer as últimas, mais recentes pelo menos.
- Exibir resultados em tabela com autor, nota, texto, data, origem e sentimento (configurada por palavras chaves)
- Link direto para o local no Google Maps (Como uma confirmação do local pesquisado)
- Visualização dos dados em JSON

Endpoints da API
GET /placeid?query=... → Retorna Place ID e dados básicos do local
GET /reviews/api?place_id=... → Retorna reviews e nota geral

ATENÇÃO 
Obs: Necessário ter uma chave válida da Google Places API.
Crie o .env na raiz do projeto e cadastre sua GOOGLE_API_KEY=sua_chave_api

No link do projeto foi ajustado para meu porfotlio em React e adicionado algumas melhorias visuais apenas, mas baseada em cima desse projeto inicial.


