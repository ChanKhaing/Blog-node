# 4. How authentication works

This project uses the simplest approach that is still safe: **email + password with server
sessions**. No OAuth, no magic links, no tokens to manage.

## Password hashing, explained simply

A **hash** is a one-way scramble. Feeding `hunter2` into bcrypt produces something like:

```text
$2a$12$Xk9pQ.../GfLrM0c3lHkzO1yRr6Xn1ZJm7q9K2d
```

You cannot turn that back into `hunter2`. To check a login, bcrypt hashes the typed password
the same way and compares the results. This means:

- The database never stores a readable password.
- If the database leaks, the passwords are still protected.

The `12` in the hash is the **cost factor** — how much work bcrypt does. Higher is slower and
safer. In `src/models/User.js`:

```js
userSchema.statics.hashPassword = function (plainPassword) {
  return bcrypt.hash(plainPassword, 12);
};

userSchema.methods.verifyPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};
```

Bcrypt also adds a random **salt** to every hash automatically, so two people with the same
password get different hashes.

## Registration flow

1. The visitor submits email, password and confirm password to `POST /register`.
2. `authController.register` validates:
   - email looks like an email
   - password is at least 8 characters
   - both passwords match
   - no existing user has that email
3. If anything fails, the form re-renders with a friendly list of messages and the email kept.
4. Otherwise the password is hashed, the user is saved, and they are logged in immediately.

Duplicate emails are blocked twice: once with a lookup, and once by the `unique: true` index
on the `email` field (which also protects against two people registering at the same instant).

## Login flow

1. `POST /login` receives email and password.
2. The app finds the user by email and calls `verifyPassword`.
3. If either the user or the password is wrong, the same message is shown:
   *"Email or password is incorrect."* Using one message for both cases means an attacker
   cannot discover which emails are registered.
4. On success, the user's id is written into the session.

## What a session is

A session is a small record on the server that says "this browser is user X".

```text
Browser cookie:  inkwell.sid = s%3AabC123...(signed)
Sessions store:  { _id: "abC123", userId: "66f0...", userEmail: "a@b.com" }
```

- The cookie holds only a random id, never your email or password.
- The id is **signed** with `SESSION_SECRET`, so a tampered cookie is rejected.
- Sessions are saved in MongoDB (`connect-mongo`), so logins survive a server restart and work
  across multiple serverless instances on Vercel.
- Cookie settings: `httpOnly` (JavaScript cannot read it), `sameSite: 'lax'` (blocks most CSRF),
  `secure` in production (HTTPS only), and a 7-day lifetime.

## Logout

`POST /logout` destroys the session record and clears the cookie, then redirects to `/login`.
It is a POST, not a link, so another website cannot log you out by embedding an image.

## Protected routes

`src/middleware/auth.js` has two small guards:

```js
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  req.session.flash = { type: 'error', message: 'Please log in to continue.' };
  return res.redirect('/login');
}
```

`requireAuth` is attached to the write routes in `src/routes/postRoutes.js`:

```js
router.get('/posts/new', requireAuth, postController.showCreate);
router.post('/posts', requireAuth, postController.create);
router.get('/dashboard', requireAuth, postController.dashboard);
router.get('/posts/:id/edit', requireAuth, postController.showEdit);
router.put('/posts/:id', requireAuth, postController.update);
router.delete('/posts/:id', requireAuth, postController.destroy);
```

`redirectIfAuthenticated` does the opposite: a logged-in user visiting `/login` is sent to the
dashboard.

## Who the current user is, in every page

`src/middleware/locals.js` copies the session user onto `res.locals.currentUser`, so any EJS
template can write `<% if (currentUser) { %>` without the controller passing it along.

## Being logged in is not the same as being the owner

`requireAuth` only proves *someone* is logged in. The controller separately checks that the
post belongs to that person before editing or deleting — see the next guide.
