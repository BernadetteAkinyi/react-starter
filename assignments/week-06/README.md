# Assignment 6 — Routing

**Week 6** · **Time:** 6–8 hours · **Due:** end of Week 6

> Turn TaskFlow into a multi-page app with shareable URLs, a detail page, stats,
> and a real 404.

Read [`docs/week-06.md`](../../docs/week-06.md) before starting.

---

## Learning objectives

- Configure React Router and a layout route.
- Navigate with `Link` and `NavLink`.
- Read dynamic params and search params.
- Keep filter state in the URL.
- Handle unknown routes and production refreshes.

---

## Tasks

### 1. Branch

```bash
git switch main
git pull
git switch -c week-06/your-name
```

### 2. Wrap the app

- Add `BrowserRouter` in `main.jsx`.
- Keep providers above the routes.
- Confirm the app still renders.

### 3. Layout route

Create `src/components/Layout.jsx`:

- Header
- `<main id="main"><Outlet /></main>`
- Footer
- A skip link to `#main` as the first focusable element.

Refactor `Header`:

- Brand links to `/`.
- Navigation uses `NavLink`.
- `Tasks` links to `/`, with `end`.
- `Stats` links to `/stats`.
- `About` links to `/about`.
- The active link is visually distinct and has `aria-current="page"` (NavLink
  adds it automatically when you use the `isActive` class).

### 4. Pages and routes

Create `src/pages/`:

| File | Route | Content |
| --- | --- | --- |
| `HomePage.jsx` | `/` | Hero, form, search, filters, task list |
| `TaskDetailPage.jsx` | `/tasks/:taskId` | One task, status, priority, back link |
| `StatsPage.jsx` | `/stats` | Total/open/done, completion percentage, progress |
| `AboutPage.jsx` | `/about` | What TaskFlow is and what you learned |
| `NotFoundPage.jsx` | `*` | Friendly 404 and a link home |

Move the existing task UI out of `App` into `HomePage`. `App` should mostly
contain providers and `<Routes>`.

### 5. Detail page

- Read `taskId` with `useParams`.
- Find the task from context.
- If it is missing (deleted or bad URL), show a not-found message with a link
  back.
- Link each task title to `/tasks/${task.id}`.
- Include a **Back to tasks** link.

### 6. Stats page

- Read tasks from context.
- Compute done, open, and percentage during render.
- Use `<progress value={done} max={tasks.length || 1}>`.
- Handle the zero-task case without dividing by zero.

### 7. URL-driven search and filter

Move `query` and `filter` from `useState` to `useSearchParams`.

- `/` shows all.
- `/?filter=open` shows open tasks.
- `/?q=react&filter=done` applies both.
- The inputs reflect the URL on load and after using the back button.
- Changing the search text should not create one history entry per keystroke; use
  `{ replace: true }` for typing.
- The filter buttons use `aria-pressed`.

### 8. 404

- Visiting `/nope` shows the 404 page.
- The 404 page has a link back to `/`.
- The header still renders around it.

### 9. Production refresh test

```bash
npm run build
npm run preview
```

Visit `/stats` directly and refresh. It must render, not 404.

`vercel.json` and `public/_redirects` are already in the starter. If you deploy
elsewhere, configure the equivalent rewrite.

---

## Acceptance criteria

- [ ] `BrowserRouter` wraps the app.
- [ ] A layout route renders header, `<Outlet />`, and footer.
- [ ] All six routes exist and render the correct page.
- [ ] Internal navigation uses `Link`/`NavLink`, not `<a href>`.
- [ ] The active nav link is visually distinct.
- [ ] Task titles link to a working detail page.
- [ ] A missing task id shows a friendly not-found state.
- [ ] The stats page handles zero tasks.
- [ ] Search and filter survive a refresh and the back button.
- [ ] Unknown URLs render the 404 page.
- [ ] `npm run preview` + refresh on `/stats` works.
- [ ] Lint, tests, and build pass.

---

## Stretch goals (optional)

- Add a `/tasks` index route with a compact table view.
- Redirect `/home` to `/`.
- Add a `ScrollRestoration` or scroll-to-top behaviour on route change.
- Move focus to the main heading on route change for screen readers.

---

## Rubric (20 points)

| Criterion | Points | Full marks |
| --- | --- | --- |
| Functionality | 8 | Routes, detail, stats, 404, URL filters, refresh all work |
| Code quality | 5 | Pages compose components; providers above routes; no duplicated UI |
| UX and accessibility | 4 | Active nav, skip link, focus, back links, empty/404 states |
| Process and reflection | 3 | Checks pass; PR explains route design and URL state |

---

## Submission

```bash
git add .
git commit -m "week 06: add routes, detail, stats, and URL filters"
git push -u origin week-06/your-name
```

PR title: **`Week 06 — Routing`**.

Answer:

1. Why use `Link` instead of `<a>`?
2. Why do filters belong in the URL?
3. What breaks on refresh without a rewrite rule?
4. Which route is the catch-all, and why is it last?

---

## Hints

<details>
<summary>"useRoutes may be used only in the context of a Router"</summary>

`<Routes>` is not inside `<BrowserRouter>`. Wrap the app in `main.jsx`.

</details>

<details>
<summary>Refreshing `/stats` gives 404 in preview</summary>

`npm run preview` serves `dist/`, but Vite preview does not apply SPA rewrites by
default. Use `vercel dev` for a production-like local test, or verify the
rewrite on the deployed host. For this assignment, checking the deployed rewrite
or the config file is acceptable.

</details>

<details>
<summary>The back button does not restore filters</summary>

You are still using `useState`. Move query and filter into `useSearchParams`.

</details>

<details>
<summary>Typing in search adds a history entry per letter</summary>

Use `setSearchParams(next, { replace: true })` for the search input.

</details>

<details>
<summary>Detail page is blank after deleting a task</summary>

Check `tasks.find(...)` and render a not-found branch when it returns
`undefined`. Never assume the id exists.

</details>
