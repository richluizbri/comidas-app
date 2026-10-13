const request = require('supertest');
const app = require('../src/app');
const { conectar, desconectar } = require('../src/db');
const Comida = require('../src/models/Comida');

let memoria;

const valida = { marca: 'Nestlé', nome: 'Chocolate Classic 90g', preco: 6.49, foto: 'https://exemplo.com/chocolate.jpg' };

beforeAll(async () => {
  let uri = process.env.MONGODB_URI_TEST;
  if (!uri) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoria = await MongoMemoryServer.create();
    uri = memoria.getUri('cardapio_teste');
  }
  process.env.MONGODB_URI = uri;
  await conectar(uri);
});

afterEach(() => Comida.deleteMany({}));

afterAll(async () => {
  await desconectar();
  if (memoria) await memoria.stop();
});

describe('GET /api/health', () => {
  it('retorna ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('POST /api/comidas', () => {
  it('cria comida válida', async () => {
    const res = await request(app).post('/api/comidas').send(valida);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(valida);
    expect(res.body._id).toBeDefined();
  });

  it('rejeita campos faltando', async () => {
    const res = await request(app).post('/api/comidas').send({ marca: 'X' });
    expect(res.status).toBe(400);
    expect(res.body.erro).toMatch(/nome é obrigatório/);
  });

  it('rejeita preço negativo', async () => {
    const res = await request(app).post('/api/comidas').send({ ...valida, preco: -1 });
    expect(res.status).toBe(400);
    expect(res.body.erro).toMatch(/negativo/);
  });

  it('rejeita foto inválida', async () => {
    const res = await request(app).post('/api/comidas').send({ ...valida, foto: 'nao-e-url' });
    expect(res.status).toBe(400);
    expect(res.body.erro).toMatch(/URL/);
  });

  it('rejeita JSON malformado', async () => {
    const res = await request(app).post('/api/comidas').set('Content-Type', 'application/json').send('{ruim');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/comidas', () => {
  beforeEach(async () => {
    await Comida.create([
      valida,
      { marca: 'Sadia', nome: 'Lasanha Bolonhesa 600g', preco: 19.9, foto: 'https://exemplo.com/lasanha.jpg' },
      { marca: 'Nestlé', nome: 'Leite Ninho 400g', preco: 22.5, foto: 'https://exemplo.com/ninho.jpg' }
    ]);
  });

  it('lista todas', async () => {
    const res = await request(app).get('/api/comidas');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  it('filtra por marca', async () => {
    const res = await request(app).get('/api/comidas?marca=nestlé');
    expect(res.body).toHaveLength(2);
  });

  it('busca por texto', async () => {
    const res = await request(app).get('/api/comidas?q=lasanha');
    expect(res.body).toHaveLength(1);
    expect(res.body[0].marca).toBe('Sadia');
  });
});

describe('GET /api/comidas/:id', () => {
  it('retorna por id', async () => {
    const c = await Comida.create(valida);
    const res = await request(app).get(`/api/comidas/${c._id}`);
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe(valida.nome);
  });

  it('400 para id inválido', async () => {
    const res = await request(app).get('/api/comidas/123');
    expect(res.status).toBe(400);
  });

  it('404 para id inexistente', async () => {
    const res = await request(app).get('/api/comidas/64b7f0c2a1b2c3d4e5f60789');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/comidas/:id', () => {
  it('atualiza', async () => {
    const c = await Comida.create(valida);
    const res = await request(app).put(`/api/comidas/${c._id}`).send({ preco: 7.99 });
    expect(res.status).toBe(200);
    expect(res.body.preco).toBe(7.99);
    expect(res.body.nome).toBe(valida.nome);
  });

  it('valida na atualização', async () => {
    const c = await Comida.create(valida);
    const res = await request(app).put(`/api/comidas/${c._id}`).send({ preco: -5 });
    expect(res.status).toBe(400);
  });

  it('404 ao atualizar inexistente', async () => {
    const res = await request(app).put('/api/comidas/64b7f0c2a1b2c3d4e5f60789').send({ preco: 1 });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/comidas/:id', () => {
  it('remove', async () => {
    const c = await Comida.create(valida);
    const res = await request(app).delete(`/api/comidas/${c._id}`);
    expect(res.status).toBe(200);
    expect(await Comida.countDocuments()).toBe(0);
  });

  it('404 ao remover inexistente', async () => {
    const res = await request(app).delete('/api/comidas/64b7f0c2a1b2c3d4e5f60789');
    expect(res.status).toBe(404);
  });
});

describe('rotas desconhecidas', () => {
  it('404 em JSON', async () => {
    const res = await request(app).get('/api/nada');
    expect(res.status).toBe(404);
    expect(res.body.erro).toBeDefined();
  });
});
