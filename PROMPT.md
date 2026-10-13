# Prompt do Agente — Sistema "Cardápio" (Tema Comida)

Você é um agente de desenvolvimento full-stack. Sua missão é construir, testar e documentar um mini sistema de gerenciamento de **produtos alimentícios**, seguindo rigorosamente as regras abaixo.

## 1. Objetivo

Criar um CRUD de comidas com os campos:

| Campo | Tipo   | Regras                                   |
|-------|--------|------------------------------------------|
| marca | String | obrigatório, trim, 2–60 caracteres       |
| nome  | String | obrigatório, trim, 2–80 caracteres       |
| preco | Number | obrigatório, >= 0                        |
| foto  | String | obrigatório, URL http(s) válida          |

Timestamps automáticos (`createdAt`, `updatedAt`).

## 2. Stack obrigatória

- **Backend:** Node.js + Express + Mongoose (MongoDB Atlas), pronto para deploy como Serverless Function na **Vercel**.
- **Frontend:** HTML, CSS e JavaScript puros, em pasta separada, consumindo a API via `fetch`.
- **Testes:** Jest + Supertest + mongodb-memory-server (banco em memória, sem depender do Atlas).

## 3. Estrutura de pastas

```
comida-app/
├── PROMPT.md
├── Roadmap.md
├── Contexto.md
├── api.md
├── api/
│   ├── api/index.js          # entrada serverless da Vercel
│   ├── src/app.js            # Express app (sem listen)
│   ├── src/db.js             # conexão Mongoose com cache
│   ├── src/models/Comida.js
│   ├── src/routes/comidas.js
│   ├── server.js             # execução local (listen)
│   ├── tests/comidas.test.js
│   ├── seed.js
│   ├── vercel.json
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## 4. Endpoints

| Método | Rota              | Descrição                 |
|--------|-------------------|---------------------------|
| GET    | /api/health       | status da API             |
| GET    | /api/comidas      | lista (filtros `?marca=`, `?q=`) |
| GET    | /api/comidas/:id  | busca por id              |
| POST   | /api/comidas      | cria                      |
| PUT    | /api/comidas/:id  | atualiza                  |
| DELETE | /api/comidas/:id  | remove                    |

Respostas de erro em JSON `{ "erro": "mensagem" }` com status adequado (400 validação/id inválido, 404 não encontrado, 500 interno). CORS habilitado.

## 5. Frontend

- Listar as comidas em cards (foto, nome, marca, preço em BRL).
- Campo de busca e formulário para cadastrar, editar e excluir.
- Variável `API_URL` no topo de `script.js` para apontar para local ou Vercel.
- Visual com identidade de comida (cores quentes, tipografia acolhedora), responsivo.

## 6. Arquivos de controle (obrigatórios)

1. **Roadmap.md** — criado ANTES de qualquer código. Lista todas as etapas numeradas com checkbox `- [ ]`. Ao concluir cada etapa, marque `- [x]`.
2. **Contexto.md** — resumo vivo do projeto. Atualize ao final de CADA etapa: estado atual, decisões tomadas, arquivos criados, próximos passos.
3. **api.md** — documentação para usar e testar a API: base URL, modelo, cada endpoint com exemplo de requisição (curl e PowerShell `Invoke-RestMethod`) e resposta, códigos de erro.

## 7. Regras de trabalho

- Siga o Roadmap em ordem; nunca pule etapas.
- Após cada etapa: marcar Roadmap, atualizar Contexto.md.
- Código limpo, sem comentários, ES Modules ou CommonJS de forma consistente.
- Nunca commitar credenciais: use `.env` (`MONGODB_URI`) e forneça `.env.example`.
- A conexão Mongo deve ser reutilizada entre invocações serverless (cache global).
- Testes devem cobrir: criação válida, validação inválida, listagem, busca por id, id inválido, atualização, remoção e 404.
- Só considere o projeto pronto quando `npm test` passar 100% e a API rodar localmente respondendo ao frontend.

## 8. Entrega final

- Todos os testes verdes.
- Roadmap 100% marcado.
- Contexto.md com o estado final e instruções de deploy na Vercel.
- api.md completo.
