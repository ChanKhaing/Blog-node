# 1. Project structure & the MVC pattern

## What MVC means (in plain words)

MVC splits an app into three jobs so no single file does everything:

| Part           | Job                                                  | In this project        |
| -------------- | ---------------------------------------------------- | ---------------------- |
| **Model**      | Describes the data and talks to the database          | `src/models/`          |
| **View**       | Decides what the page looks like (HTML)               | `src/views/` (EJS)     |
| **Controller** | Receives a request, uses models, picks a view         | `src/controllers/`     |

A **router** sits in front of the controller and maps a URL to a controller function.

## Request flow, step by step

```text
Browser  ->  Route         ->  Middleware     ->  Controller      ->  Model     ->  MongoDB
GET /posts   postRoutes.js     (session, auth)    postController      Post.js       Atlas
                                                       |
                                                       v
                                              View (posts/index.ejs)  ->  HTML back to browser
```

## Folder map

```text
blog-app/
├── docs/                       # the guides you are reading
├── public/
│   └── css/style.css           # compiled Tailwind output (generated, not committed)
├── src/
│   ├── app.js                  # builds the Express app: views, sessions, routes, errors
│   ├── server.js               # starts the server locally / exports the app for Vercel
│   ├── config/
│   │   └── db.js               # connects to MongoDB Atlas (connection is reused)
│   ├── models/
│   │   ├── User.js             # email + password hash, hashing helpers
│   │   └── Post.js             # title, content, author, createdAt, updatedAt
│   ├── controllers/
│   │   ├── authController.js   # register, login, logout
│   │   └── postController.js   # home, list, show, create, update, delete
│   ├── middleware/
│   │   ├── auth.js             # requireAuth / redirectIfAuthenticated
│   │   └── locals.js           # exposes currentUser + flash to every view
│   ├── routes/
│   │   ├── authRoutes.js       # /register, /login, /logout
│   │   └── postRoutes.js       # /, /posts, /posts/new, /posts/:id, /dashboard
│   ├── styles/input.css        # Tailwind v4 source + design tokens
│   └── views/                  # EJS templates
│       ├── partials/           # navbar, footer, blog-card, blog-list, empty-state, flash, errors
│       ├── auth/               # login.ejs, register.ejs
│       ├── posts/              # index, show, form, dashboard
│       ├── home.ejs            # hero + latest posts
│       └── 404 / 403 / 500.ejs
├── .env.example
├── commitlint.config.cjs
├── vercel.json
└── package.json
```

## Why `app.js` and `server.js` are separate

`app.js` only *builds* the Express app. `server.js` *starts* it. Vercel needs the built app
without a `listen()` call, so keeping them apart lets the same code run locally and in the cloud.

## All routes at a glance

| Method | Path              | Who can use it | What it does              |
| ------ | ----------------- | -------------- | ------------------------- |
| GET    | `/`               | Everyone       | Homepage + latest posts   |
| GET    | `/posts`          | Everyone       | List all posts            |
| GET    | `/posts/:id`      | Everyone       | Read one post             |
| GET    | `/register`       | Guests         | Registration form         |
| POST   | `/register`       | Guests         | Create the account        |
| GET    | `/login`          | Guests         | Login form                |
| POST   | `/login`          | Guests         | Check credentials         |
| POST   | `/logout`         | Logged in      | End the session           |
| GET    | `/dashboard`      | Logged in      | Your own posts            |
| GET    | `/posts/new`      | Logged in      | New post form             |
| POST   | `/posts`          | Logged in      | Create a post             |
| GET    | `/posts/:id/edit` | Owner only     | Edit form                 |
| PUT    | `/posts/:id`      | Owner only     | Save changes              |
| DELETE | `/posts/:id`      | Owner only     | Delete the post           |

> Browsers can only send GET and POST from a form. `method-override` lets a form add
> `?_method=PUT` or `?_method=DELETE` so Express treats it as the right method.
