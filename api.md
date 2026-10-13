# API Cardápio — Documentação

## Base URL

| Ambiente | URL |
|----------|-----|
| Local    | `http://localhost:3000/api` |
| Vercel   | `https://SEU-PROJETO.vercel.app/api` |

Todas as requisições e respostas usam JSON. CORS liberado para qualquer origem.

## Modelo `Comida`

| Campo     | Tipo   | Regras                              |
|-----------|--------|-------------------------------------|
| `_id`     | String | gerado pelo MongoDB                 |
| `marca`   | String | obrigatório, 2–60 caracteres        |
| `nome`    | String | obrigatório, 2–80 caracteres        |
| `preco`   | Number | obrigatório, `>= 0`                 |
| `foto`    | String | obrigatório, URL `http(s)://`       |
| `createdAt` / `updatedAt` | Date | automáticos         |

```json
{
  "_id": "6ace8bfeee887ff429ecc971",
  "marca": "Seara",
  "nome": "Pizza Calabresa 460g",
  "preco": 17.49,
  "foto": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
  "createdAt": "2026-10-13T19:52:30.121Z",
  "updatedAt": "2026-10-13T19:52:30.121Z"
}
```

## Erros

Formato: `{ "erro": "mensagem" }`

| Status | Quando |
|--------|--------|
| 400 | validação falhou, id inválido ou JSON malformado |
| 404 | comida ou rota não encontrada |
| 500 | erro interno (ex.: banco indisponível) |

---

## Endpoints

### `GET /health`
Verifica se a API está no ar (não consulta o banco).

```bash
curl http://localhost:3000/api/health
```
```powershell
Invoke-RestMethod http://localhost:3000/api/health
```
Resposta `200`: `{ "status": "ok" }`

### `GET /comidas`
Lista todas, da mais recente para a mais antiga.

| Query  | Descrição |
|--------|-----------|
| `marca`| marca exata, sem diferenciar maiúsculas (`?marca=nestlé`) |
| `q`    | busca parcial em nome ou marca (`?q=pizza`) |

```bash
curl "http://localhost:3000/api/comidas?q=pizza"
```
```powershell
Invoke-RestMethod "http://localhost:3000/api/comidas?q=pizza"
```
Resposta `200`: array de comidas.

### `GET /comidas/:id`

```bash
curl http://localhost:3000/api/comidas/6ace8bfeee887ff429ecc971
```
```powershell
Invoke-RestMethod http://localhost:3000/api/comidas/6ace8bfeee887ff429ecc971
```
`200` comida · `400` id inválido · `404` não encontrada

### `POST /comidas`

```bash
curl -X POST http://localhost:3000/api/comidas \
  -H "Content-Type: application/json" \
  -d '{"marca":"Garoto","nome":"Bombom Serenata de Amor 20g","preco":2.5,"foto":"https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600"}'
```
```powershell
$body = @{ marca = "Garoto"; nome = "Bombom Serenata de Amor 20g"; preco = 2.5; foto = "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/comidas -ContentType "application/json" -Body $body
```
`201` comida criada · `400` validação

Exemplo de `400`:
```json
{ "erro": "foto deve ser uma URL http(s) válida" }
```

### `PUT /comidas/:id`
Atualização parcial: envie só os campos que mudam. As validações continuam valendo.

```bash
curl -X PUT http://localhost:3000/api/comidas/ID_AQUI \
  -H "Content-Type: application/json" \
  -d '{"preco":3.25}'
```
```powershell
Invoke-RestMethod -Method Put -Uri http://localhost:3000/api/comidas/ID_AQUI -ContentType "application/json" -Body '{"preco":3.25}'
```
`200` comida atualizada · `400` validação/id · `404` não encontrada

### `DELETE /comidas/:id`

```bash
curl -X DELETE http://localhost:3000/api/comidas/ID_AQUI
```
```powershell
Invoke-RestMethod -Method Delete -Uri http://localhost:3000/api/comidas/ID_AQUI
```
`200` `{ "mensagem": "comida removida", "id": "..." }` · `400` id inválido · `404` não encontrada

---

## Testes automatizados

```bash
cd api
npm install
npm test
```

Usa `mongodb-memory-server` (banco em memória). Para usar outro Mongo: defina `MONGODB_URI_TEST`.

Cobertura: health, criação válida, campos faltando, preço negativo, foto inválida, JSON malformado, listagem, filtro por marca, busca, busca por id, id inválido, id inexistente, atualização, validação na atualização, 404 em update/delete, remoção e rota desconhecida (18 testes).
