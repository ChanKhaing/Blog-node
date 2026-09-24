const mongoose = require('mongoose');

let connectionPromise = null;

/**
 * Connects to MongoDB Atlas.
 * The promise is cached so serverless platforms (Vercel) reuse one connection
 * instead of opening a new one on every request.
 */
function connectDB() {
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Add it to your .env file.');
  }

  mongoose.set('strictQuery', true);
  connectionPromise = mongoose
    .connect(uri, { serverSelectionTimeoutMS: 10000 })
    .then((conn) => {
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    })
    .catch((err) => {
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
}

module.exports = connectDB;
