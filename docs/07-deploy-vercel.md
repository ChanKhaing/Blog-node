# 7. Deploying to Vercel

## Before you start

- Your code is pushed to a GitHub repository.
- You have a MongoDB Atlas connection string (see guide 2).
- In Atlas → **Network Access**, allow `0.0.0.0/0` (Vercel's IP addresses change).

## Step 1 – Create the project

1. Go to https://vercel.com and sign in with GitHub.
2. Click **Add New… → Project** and import your repository.
3. If the app is inside a folder, set **Root Directory** to `blog-app`.
4. Leave Framework Preset as **Other**. `vercel.json` already sets the build command
   (`npm run build`, which compiles Tailwind) and routes every request to `src/server.js`.

## Step 2 – Add environment variables

In the import screen (or later in **Settings → Environment Variables**) add:

| Name | Value |
| --- | --- |
| `MONGODB_URI` | Your Atlas connection string, including the database name, e.g. `.../inkwell?retryWrites=true&w=majority` |
| `SESSION_SECRET` | A long random string. Generate one: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `NODE_ENV` | `production` |

`NODE_ENV=production` makes the login cookie `secure` (HTTPS only), which Vercel provides.
Never commit `.env` — it is in `.gitignore`.

## Step 3 – Deploy

Click **Deploy**. After about a minute you get a URL like `https://inkwell-xyz.vercel.app`.
Every later push to your main branch redeploys automatically.

## Changing variables later

Edit them in **Settings → Environment Variables**, then go to **Deployments → ⋯ → Redeploy**.
Variables only apply to new deployments.

## Troubleshooting

- **500 error on every page** – check **Deployments → Logs**. Usually `MONGODB_URI` is missing or wrong.
- **Timeout connecting to MongoDB** – Atlas Network Access does not allow `0.0.0.0/0`.
- **Page has no styling** – the build step didn't run; confirm `npm run build` works locally.
- **Logged out right after logging in** – `SESSION_SECRET` missing, or site opened over plain HTTP.
