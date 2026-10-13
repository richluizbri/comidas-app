require('dotenv').config();
const { conectar, desconectar } = require('./src/db');
const Comida = require('./src/models/Comida');

const comidas = [
  { marca: 'Nestlé', nome: 'Leite Ninho Integral 400g', preco: 22.9, foto: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600' },
  { marca: 'Sadia', nome: 'Lasanha à Bolonhesa 600g', preco: 19.9, foto: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600' },
  { marca: 'Bauducco', nome: 'Panettone Gotas de Chocolate 500g', preco: 29.9, foto: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600' },
  { marca: 'Seara', nome: 'Pizza Calabresa 460g', preco: 17.49, foto: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600' },
  { marca: 'Camil', nome: 'Arroz Branco Tipo 1 5kg', preco: 27.5, foto: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600' },
  { marca: 'Kopenhagen', nome: 'Língua de Gato 136g', preco: 54.9, foto: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600' }
];

(async () => {
  await conectar();
  await Comida.deleteMany({});
  const criadas = await Comida.insertMany(comidas);
  console.log(`${criadas.length} comidas inseridas`);
  await desconectar();
})().catch(e => {
  console.error(e.message);
  process.exit(1);
});
