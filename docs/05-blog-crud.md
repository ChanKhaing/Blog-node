# 5. Blog CRUD & post ownership

CRUD = **C**reate, **R**ead, **U**pdate, **D**elete. Here is how each one works in Inkwell.

## The routes

| Action | Method & URL | Who can do it | Controller function |
| --- | --- | --- | --- |
| List all posts | `GET /posts` | Everyone | `index` |
| Read one post | `GET /posts/:id` | Everyone | `show` |
| Show "new post" form | `GET /posts/new` | Logged-in users | `showCreate` |
| Create a post | `POST /posts` | Logged-in users | `create` |
| Your posts | `GET /dashboard` | Logged-in users | `dashboard` |
| Show edit form | `GET /posts/:id/edit` | The author only | `showEdit` |
| Update a post | `PUT /posts/:id` | The author only | `update` |
| Delete a post | `DELETE /posts/:id` | The author only | `destroy` |

Routes live in `src/routes/postRoutes.js`. Logic lives in `src/controllers/postController.js`.

## Step by step

1. **Create** – the form in `views/posts/form.ejs` posts `title` and `content`. The controller saves
   a new `Post` with `author: req.session.userId`. The author is taken from the session, never from the form,
   so nobody can post as someone else.
2. **Read** – `Post.find().populate('author', 'email').sort({ createdAt: -1 })` loads posts newest first,
   with the author's email attached.
3. **Update** – HTML forms only support GET and POST. The `method-override` package reads `?_method=PUT`
   and turns the request into a PUT.
4. **Delete** – same trick with `?_method=DELETE`. The browser asks "Are you sure?" first.

## How ownership is enforced

Before editing, updating or deleting, the controller loads the post and compares:

```js
if (post.author.toString() !== req.session.userId) {
  return res.status(403).render('403', { title: 'Not allowed' });
}
```

Hiding the Edit button is only cosmetic — this server-side check is the real protection.
Even if someone types the URL by hand, they get the **403 Not allowed** page.

## Validation

- Title and content are required; the title is at most 140 characters (see `models/Post.js`).
- If validation fails, the form is shown again with error messages and your text kept.
- An invalid or unknown post id shows the 404 page.
