# Inkwell — a beginner-friendly blogging platform

A full CRUD blogging app built with **Node.js**, **Express**, **MongoDB Atlas**, **EJS** and
**Tailwind CSS v4**, organised with the **MVC** pattern and deployable to **Vercel**.

## Features

- Email + password registration and login (sessions, hashed passwords)
- Create, read, update and delete blog posts
- Every post belongs to its author; only the author can edit or delete it
- Public reading: anyone can browse the post list and read a single post
- Modern, responsive UI with reusable components (navbar, hero, blog card, forms, empty states, footer)

## Quick start

```bash
cd blog-app
npm install
cp .env.example .env     # then fill in MONGODB_URI and SESSION_SECRET
npm run dev              # starts the server + Tailwind watcher
```

Open http://localhost:3000

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
