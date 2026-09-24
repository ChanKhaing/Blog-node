require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const connectDB = require('./config/db');
const attachLocals = require('./middleware/locals');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// --- Views (the "V" in MVC) ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Static files (compiled Tailwind CSS lives here) ---
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- Request parsing ---
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // lets HTML forms send PUT and DELETE

// --- Sessions stored in MongoDB so logins survive restarts ---
app.use(
  session({
    name: 'inkwell.sid',
    secret: process.env.SESSION_SECRET || 'dev-only-insecure-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
      ttl: 60 * 60 * 24 * 7, // 7 days
    }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(attachLocals);

// --- Make sure the database is connected before handling a request ---
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// --- Routes (the "C" in MVC points at controllers) ---
app.use('/', postRoutes);
app.use('/', authRoutes);

// --- 404 ---
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page not found' });
});

// --- Error handler ---
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('500', { title: 'Something went wrong' });
});

module.exports = app;
