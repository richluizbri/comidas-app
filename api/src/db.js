const mongoose = require('mongoose');

let cached = global.__mongoose || { conn: null, promise: null };
global.__mongoose = cached;

async function conectar(uri = process.env.MONGODB_URI) {
  if (!uri) throw new Error('MONGODB_URI não definida');
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 }).then(m => m);
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

async function desconectar() {
  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
}

module.exports = { conectar, desconectar };
