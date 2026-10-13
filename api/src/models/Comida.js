const { Schema, model, models } = require('mongoose');

const comidaSchema = new Schema(
  {
    marca: { type: String, required: [true, 'marca é obrigatória'], trim: true, minlength: [2, 'marca deve ter ao menos 2 caracteres'], maxlength: [60, 'marca deve ter no máximo 60 caracteres'] },
    nome: { type: String, required: [true, 'nome é obrigatório'], trim: true, minlength: [2, 'nome deve ter ao menos 2 caracteres'], maxlength: [80, 'nome deve ter no máximo 80 caracteres'] },
    preco: { type: Number, required: [true, 'preco é obrigatório'], min: [0, 'preco não pode ser negativo'] },
    foto: { type: String, required: [true, 'foto é obrigatória'], trim: true, match: [/^https?:\/\/\S+$/i, 'foto deve ser uma URL http(s) válida'] }
  },
  { timestamps: true, versionKey: false }
);

module.exports = models.Comida || model('Comida', comidaSchema);
