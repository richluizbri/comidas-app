require('dotenv').config();
const app = require('./src/app');

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
}

module.exports = app;