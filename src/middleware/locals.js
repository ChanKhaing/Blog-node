/**
 * Makes the current user and one-time flash message available to every view,
 * so templates can use `currentUser` and `flash` without extra wiring.
 */
function attachLocals(req, res, next) {
  res.locals.currentUser = req.session && req.session.userId
    ? { id: req.session.userId, email: req.session.userEmail }
    : null;

  res.locals.flash = (req.session && req.session.flash) || null;
  if (req.session) delete req.session.flash;

  res.locals.currentPath = req.path;
  return next();
}

module.exports = attachLocals;
