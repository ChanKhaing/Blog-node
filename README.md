# Inkwell — a beginner-friendly blogging platform

A full CRUD blogging app built with **Node.js**, **Express**, **MongoDB**, **EJS** and
**Tailwind CSS v4**, organised with the **MVC** pattern.  
Runs locally with a single `docker compose` command — no cloud database required.

---

## Features

- Email + password registration and login (sessions, hashed passwords)
- Create, read, update and delete blog posts
- Every post belongs to its author; only the author can edit or delete it
- Public reading: anyone can browse the post list and read a single post
- Modern, responsive UI with reusable components (navbar, hero, blog card, forms, empty states, footer)

---

## Running with Docker Compose (recommended)

### Prerequisites

| Tool | Minimum version |
|------|-----------------|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) / Docker Engine | 24+ |
| Docker Compose | v2 (bundled with Docker Desktop) |

### 1 — Clone the repository

```bash
git clone https://github.com/<your-username>/blog-app.git
cd blog-app
```

### 2 — Create your environment file

```bash
cp .env.example .env
```

Open `.env` and set a strong `SESSION_SECRET`:

```bash
# Generate a cryptographically secure secret
openssl rand -hex 32
```

Paste the output as the value of `SESSION_SECRET` in `.env`.  
`MONGODB_URI` is already pre-configured for the Docker Compose setup — **leave it as-is**.

### 3 — Build images and start all services

```bash
docker compose up -d --build
```

This command:
- Builds the `web` image from the [`Dockerfile`](./Dockerfile) using `node:20-alpine`
- Pulls the official `mongo:7` image
- Creates the persistent `mongo_data` named volume
- Starts both containers in detached (background) mode

> **First run note:** Docker will download the base images and install npm dependencies.  
> This typically takes 1–3 minutes depending on your internet connection.

### 4 — Verify the running containers

```bash
docker compose ps
```

You should see output similar to:

```
NAME              IMAGE              COMMAND                  SERVICE    CREATED         STATUS                   PORTS
inkwell_mongo     mongo:7            "docker-entrypoint.s…"   mongo_db   2 minutes ago   Up 2 minutes (healthy)   0.0.0.0:27017->27017/tcp
inkwell_web       blog-app-web       "docker-entrypoint.s…"   web        2 minutes ago   Up 2 minutes             0.0.0.0:3000->3000/tcp
```

Both services should show **Up** status. The `mongo_db` service will additionally show **(healthy)** once its health-check passes.

### 5 — Open the app

Visit **http://localhost:3000** in your browser.

---

## Useful Docker commands

| Task | Command |
|------|---------|
| View live logs (all services) | `docker compose logs -f` |
| View logs for one service | `docker compose logs -f web` |
| Stop all services (keep volumes) | `docker compose down` |
| Stop and **delete** data volume | `docker compose down -v` |
| Rebuild after code changes | `docker compose up -d --build` |
| Open a shell in the web container | `docker compose exec web sh` |
| Connect to MongoDB shell | `docker compose exec mongo_db mongosh blog_db` |

---

## Running locally without Docker

```bash
npm install
cp .env.example .env   # set MONGODB_URI to your Atlas URI and fill in SESSION_SECRET
npm run dev            # starts Express server + Tailwind CSS watcher
```

Open **http://localhost:3000**

---

## Documentation

Step-by-step guides live in [`docs/`](./docs):

1. [Project structure & MVC](./docs/01-project-structure.md)
2. [MongoDB Atlas setup](./docs/02-mongodb-atlas.md)
3. [Environment variables](./docs/03-environment-variables.md)
4. [Authentication explained](./docs/04-authentication.md)
5. [Blog CRUD & post ownership](./docs/05-blog-crud.md)
6. [Frontend structure & components](./docs/06-frontend-structure.md)
7. [Deploying to Vercel](./docs/07-deploy-vercel.md)
8. [Git workflow & Commitizen](./docs/08-git-and-commitizen.md)
