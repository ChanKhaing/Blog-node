require('dotenv').config();

const app = require('./app');

const port = process.env.PORT || 3000;

// Vercel imports the Express app directly; locally we start a listener.
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Inkwell running on http://localhost:${port}`);
  });
}

module.exports = app;
