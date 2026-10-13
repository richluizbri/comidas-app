const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const Comida = require('../models/Comida');

const router = Router();
const CAMPOS = ['marca', 'nome', 'preco', 'foto'];

const escapar = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pegarCampos = body => Object.fromEntries(CAMPOS.filter(c => body[c] !== undefined).map(c => [c, body[c]]));

router.param('id', (req, res, next, id) => {
  if (!isValidObjectId(id)) return res.status(400).json({ erro: 'id inválido' });
  next();
});

router.get('/', async (req, res, next) => {
  try {
    const filtro = {};
    if (req.query.marca) filtro.marca = new RegExp(`^${escapar(req.query.marca)}$`, 'i');
    if (req.query.q) {
      const r = new RegExp(escapar(req.query.q), 'i');
      filtro.$or = [{ nome: r }, { marca: r }];
    }
    res.json(await Comida.find(filtro).sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const comida = await Comida.findById(req.params.id);
    if (!comida) return res.status(404).json({ erro: 'comida não encontrada' });
    res.json(comida);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.status(201).json(await Comida.create(pegarCampos(req.body || {})));
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const comida = await Comida.findByIdAndUpdate(req.params.id, pegarCampos(req.body || {}), { returnDocument: 'after', runValidators: true });
    if (!comida) return res.status(404).json({ erro: 'comida não encontrada' });
    res.json(comida);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const comida = await Comida.findByIdAndDelete(req.params.id);
    if (!comida) return res.status(404).json({ erro: 'comida não encontrada' });
    res.json({ mensagem: 'comida removida', id: comida._id });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
