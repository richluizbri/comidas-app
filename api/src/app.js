const express = require('express');
const cors = require('cors');
const { conectar } = require('./db');
const comidas = require('./routes/comidas');

const app = express();
const api = express.Router();

app.use(cors());
app.use(express.json());

api.get('/health', (req, res) => res.json({ status: 'ok' }));

api.use(async (req, res, next) => {
  try {
    await conectar();
    next();
  } catch (e) {
    next(e);
  }
});

api.use('/comidas', comidas);

app.use('/api', api);
app.use('/', api);

app.use((req, res) => res.status(404).json({ erro: 'rota não encontrada', rota: req.originalUrl }));

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido' });
  if (err.name === 'ValidationError') return res.status(400).json({ erro: Object.values(err.errors).map(e => e.message).join('; ') });
  if (err.name === 'CastError') return res.status(400).json({ erro: `valor inválido para ${err.path}` });
  console.error(err);
  res.status(500).json({ erro: 'erro interno do servidor' });
});

module.exports = app;