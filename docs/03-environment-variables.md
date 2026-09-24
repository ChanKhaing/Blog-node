# 3. Environment variables

Environment variables are settings that live **outside** your code, so secrets never end up
on GitHub.

## Creating the `.env` file

```bash
cd blog-app
cp .env.example .env
```

Then open `.env` and fill it in:

```env
MONGODB_URI=mongodb+srv://inkwell_app:SuperSecret123@cluster0.abcde.mongodb.net/inkwell?retryWrites=true&w=majority
SESSION_SECRET=6f1c0a...a-long-random-string
PORT=3000
NODE_ENV=development
```

## What each variable does

| Variable         | Required | Purpose                                                                      |
| ---------------- | -------- | ---------------------------------------------------------------------------- |
| `MONGODB_URI`    | Yes      | Tells the app which Atlas database to connect to.                             |
| `SESSION_SECRET` | Yes      | Signs the session cookie so nobody can forge a login.                         |
| `PORT`           | No       | Local port. Defaults to `3000`. Vercel sets this for you.                     |
| `NODE_ENV`       | No       | `production` turns on secure (HTTPS-only) cookies.                            |

## Generating a strong session secret

```bash
openssl rand -hex 32
```

On Windows PowerShell:

```powershell
-join ((1..64) | ForEach-Object { '{0:x}' -f (Get-Random -Max 16) })
```

Paste the result as `SESSION_SECRET`.

## Rules to follow

- **Never commit `.env`.** It is already listed in `.gitignore`.
- **Do commit `.env.example`** with placeholder values so teammates know what is needed.
- Use a *different* `SESSION_SECRET` in production than in development.
- If a secret ever leaks, rotate it: change the Atlas password and generate a new secret.

## How the app reads them

`require('dotenv').config()` at the top of `src/app.js` loads `.env` into `process.env`.
After that any file can read `process.env.MONGODB_URI`. On Vercel there is no `.env` file —
the platform injects the variables directly (see guide 7).
