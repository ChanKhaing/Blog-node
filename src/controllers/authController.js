const User = require('../models/User');

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email || '');
}

exports.showRegister = (req, res) => {
  res.render('auth/register', { title: 'Create your account', errors: [], values: {} });
};

exports.register = async (req, res, next) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const { password, confirmPassword } = req.body;
  const errors = [];

  if (!isValidEmail(email)) errors.push('Please enter a valid email address.');
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters long.');
  if (password !== confirmPassword) errors.push('The two passwords do not match.');

  try {
    if (errors.length === 0) {
      const existing = await User.findOne({ email });
      if (existing) errors.push('An account with this email already exists. Try logging in.');
    }

    if (errors.length > 0) {
      return res.status(400).render('auth/register', {
        title: 'Create your account',
        errors,
        values: { email },
      });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ email, passwordHash });

    req.session.userId = user._id.toString();
    req.session.userEmail = user.email;
    req.session.flash = { type: 'success', message: 'Welcome to Inkwell! Your account is ready.' };
    return res.redirect('/dashboard');
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).render('auth/register', {
        title: 'Create your account',
        errors: ['An account with this email already exists. Try logging in.'],
        values: { email },
      });
    }
    return next(err);
  }
};

exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Log in', errors: [], values: {} });
};

exports.login = async (req, res, next) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const { password } = req.body;
  const errors = [];

  if (!email) errors.push('Please enter your email address.');
  if (!password) errors.push('Please enter your password.');

  try {
    if (errors.length === 0) {
      const user = await User.findOne({ email });
      const passwordOk = user ? await user.verifyPassword(password) : false;

      if (!user || !passwordOk) {
        // Same message for both cases so we never reveal which emails exist.
        errors.push('Email or password is incorrect. Please try again.');
      } else {
        req.session.userId = user._id.toString();
        req.session.userEmail = user.email;
        req.session.flash = { type: 'success', message: 'Logged in successfully.' };
        return res.redirect('/dashboard');
      }
    }

    return res.status(401).render('auth/login', { title: 'Log in', errors, values: { email } });
  } catch (err) {
    return next(err);
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('inkwell.sid');
    return res.redirect('/login');
  });
};
