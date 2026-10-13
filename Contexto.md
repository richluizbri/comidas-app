# Contexto — Sistema Cardápio

## Estado atual
**Concluído (13/13).** API testada (18/18 testes), frontend testado ponta a ponta no navegador (listar, criar, editar, validar, buscar, excluir, sem erros de JS), documentação completa em `api.md`.

## Resumo
Mini sistema de produtos alimentícios. Cada comida tem `marca`, `nome`, `preco` e `foto` (URL). Backend Node + Express + Mongoose pronto para Vercel; frontend estático em HTML/CSS/JS consumindo a API.

## Decisões
- Tema Comida aplicado em dados, visual (paleta tomate/mostarda/manjericão, tipografia Fraunces + DM Sans) e documentação.
- CommonJS em todo o backend.
- `src/app.js` exporta o Express sem `listen`; `server.js` roda local; `api/index.js` é a função serverless da Vercel.
- Conexão Mongoose cacheada em `global.__mongoose` para reaproveitar entre invocações serverless.
- `/api/health` não depende do banco.
- `PUT` é parcial e roda validadores.
- Busca usa regex com escape de caracteres especiais.
- Frontend usa `<dialog>` para o formulário, preview da foto e imagem substituta quando a URL falha.
- Testes usam `MONGODB_URI_TEST` se definida; senão `mongodb-memory-server`.

## Estrutura
```
comida-app/
├── PROMPT.md · Roadmap.md · Contexto.md · api.md
├── api/
│   ├── api/index.js · server.js · seed.js · vercel.json
│   ├── src/app.js · src/db.js
│   ├── src/models/Comida.js · src/routes/comidas.js
│   ├── tests/comidas.test.js
│   └── .env.example · .gitignore · package.json
└── frontend/
    └── index.html · style.css · script.js
```

## Como rodar localmente (Windows / PowerShell)
```powershell
cd api
npm install
Copy-Item .env.example .env
npm test
npm run seed
npm run dev
```
Edite `MONGODB_URI` no `.env` com a string do Atlas. Depois abra `frontend/index.html` com a extensão Live Server do VS Code.

## Deploy na Vercel
1. No Atlas: Network Access → liberar `0.0.0.0/0` (a Vercel usa IPs dinâmicos).
2. Suba o projeto para o GitHub.
3. Na Vercel: New Project → importe o repositório → **Root Directory = `api`** → Framework Preset = Other.
4. Em Environment Variables adicione `MONGODB_URI`.
5. Deploy. Teste `https://SEU-PROJETO.vercel.app/api/health`.
6. No `frontend/script.js`, troque `API_URL` para `https://SEU-PROJETO.vercel.app/api`.
7. O frontend pode ir em outro projeto da Vercel (Root Directory = `frontend`) ou no GitHub Pages.

## Próximos passos possíveis
Paginação, upload de imagem, autenticação para escrita.
