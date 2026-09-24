# 8. Git workflow & Commitizen

## Conventional Commits

Every commit message follows this shape:

```text
type(optional scope): short description
```

Examples: `feat(posts): add edit page`, `fix(auth): show error on wrong password`, `docs: update deploy guide`.

Allowed types (see `commitlint.config.cjs`):
`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## Daily workflow

```bash
git checkout -b feat/post-tags   # 1. make a branch for your change
# ...edit files...
git add .                        # 2. stage your changes
npm run commit                   # 3. Commitizen asks questions and writes the message
git push -u origin feat/post-tags  # 4. push, then open a Pull Request on GitHub
```

After the Pull Request is merged into `main`, Vercel deploys it automatically.

## Using Commitizen

`npm run commit` runs `cz`, which asks:

1. **Type of change** – pick with arrow keys (e.g. `feat`).
2. **Scope** – optional area, e.g. `posts` or `auth`.
3. **Short description** – imperative, lowercase: "add delete button".
4. **Longer description** – optional.
5. **Breaking changes?** – usually No.
6. **Issues closed?** – optional, e.g. `#12`.

It then creates a correctly formatted commit for you. The setup lives in `.czrc` and the
`config.commitizen` block of `package.json`.

## Checking messages with commitlint (optional hook)

`commitlint` can reject badly formatted messages. To run it on every commit:

```bash
npm install --save-dev husky
npx husky init
echo 'npx --no -- commitlint --edit "$1"' > .husky/commit-msg
```

Now `git commit -m "stuff"` fails, while `git commit -m "chore: tidy styles"` passes.
