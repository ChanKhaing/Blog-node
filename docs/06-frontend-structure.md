# 6. Frontend structure & reusable components

Views are **EJS** templates (HTML with small bits of JavaScript) styled with **Tailwind CSS v4**.

## Folders

```text
src/views/
  home.ejs            Landing page (hero + latest posts)
  403.ejs 404.ejs 500.ejs   Error pages
  auth/               login.ejs, register.ejs
  posts/              index (all posts), show (one post), form (create/edit), dashboard
  partials/           Reusable components
```

## Reusable components (partials)

| Partial | What it is |
| --- | --- |
| `head.ejs` | `<head>`, fonts, CSS link, opens `<body>` |
| `navbar.ejs` | Top navigation; changes when logged in |
| `flash.ejs` | One-time success/error message |
| `errors.ejs` | List of form validation errors |
| `blog-card.ejs` | One post preview card (optional Edit/Delete buttons) |
| `blog-list.ejs` | Grid of cards, or the empty state when there are none |
| `empty-state.ejs` | Friendly "nothing here yet" box with a button |
| `footer.ejs` | Footer and closing `</body></html>` |

Use one with: `<%- include('../partials/blog-card', { post: post }) %>`

## Styling with Tailwind v4

- Source file: `src/styles/input.css`. It starts with `@import "tailwindcss";`.
- Design tokens (colours, fonts) are defined in the `@theme` block, e.g. `--color-brand`, `--color-ink-950`.
  These become classes like `bg-brand` and `text-ink-950`.
- Shared component classes (`.btn`, `.btn-primary`, `.card`, `.field`, `.label`, `.eyebrow`) are defined
  once with `@layer components` so every page looks consistent.
- `npm run dev` watches and rebuilds `public/css/style.css`; `npm run build` makes a minified version.

## Design direction

Following the frontend-design guideline, Inkwell commits to one clear look: an editorial, paper-and-ink
style with a serif display font for headings, a warm off-white background, one strong brand colour and
subtle grain texture — instead of a generic template.
