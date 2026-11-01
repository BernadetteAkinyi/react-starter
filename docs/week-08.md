# Week 8 — Deploy, review, and demo

> **Goal:** Put TaskFlow on the internet, write a README someone can follow, give
> and receive a useful code review, and demo your work in three minutes.

**Time:** 6–8 hours · **Project:** Live TaskFlow ·
**Assignment:** [Week 8](../assignments/week-08/README.md)

---

## New concepts

| Concept | Meaning |
| --- | --- |
| Production build | Optimised static files in `dist/` |
| Environment variable | Build-time configuration (`VITE_API_URL`) |
| Static hosting | Serving the build from a CDN |
| SPA rewrite | Sending all paths to `index.html` |
| Preview deployment | A temporary URL for a branch or pull request |
| Code review | Reading code for correctness, clarity, and maintainability |
| Smoke test | A short manual pass over the critical paths after deploy |

---

## 1. Build and preview locally

Always test the production build, not only the dev server:

```bash
npm run lint
npm test
npm run build
npm run preview
```

Open the preview URL (usually `http://localhost:4173`).

### What is different in production?

- Code is minified and bundled.
- `console.log` may still be there (remove it yourself).
- Environment variables are baked in at build time.
- React runs without development warnings.
- Routes need rewrite rules.
- `localStorage` starts empty in a new browser profile.

### Smoke test

- [ ] Home page loads.
- [ ] Add a task.
- [ ] Toggle it complete.
- [ ] Delete it.
- [ ] Search and filter.
- [ ] Refresh — tasks persist.
- [ ] Visit `/stats` and refresh.
- [ ] Visit a task detail URL and refresh.
- [ ] Import from the API.
- [ ] Toggle the theme and refresh.
- [ ] 404 page works.
- [ ] No console errors.
- [ ] Works at 375 px width.

---

## 2. Deploy to Vercel

1. Push your branch and merge it into `main`.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository.
4. Configure:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install`
5. Add environment variables if needed:
   - `VITE_API_URL=https://jsonplaceholder.typicode.com`
6. Click **Deploy**.
7. Open the URL and run the smoke test.

`vercel.json` already rewrites all paths to `index.html`.

Every pull request now gets a **preview URL**. Use it during code review.

### Update after changes

Push to `main`; Vercel redeploys automatically. That is continuous deployment.

---

## 3. Deploy to Netlify (alternative)

1. Go to [app.netlify.com](https://app.netlify.com).
2. **Add new site → Import an existing project**.
3. Choose GitHub and your repository.
4. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Add `VITE_API_URL` under **Site configuration → Environment variables**.
6. Deploy.

`public/_redirects` is copied into `dist/` and handles SPA routing:

```text
/*    /index.html   200
```

### GitHub Pages (not recommended here)

Pages does not support server rewrites, and the app lives under
`/<repo-name>/`, so you must set Vite's `base` and add a `404.html` fallback.
Use Vercel or Netlify for this course.

---

## 4. Common deployment failures

| Symptom | Cause | Fix |
| --- | --- | --- |
| Blank page, console 404 for assets | Wrong `base` path | Set `base: '/'` (Vercel/Netlify root) |
| Refresh `/stats` → 404 | No SPA rewrite | Add `vercel.json` or `_redirects` |
| Build works locally, fails in CI | Different Node version | Add `.nvmrc` and `engines` (already included) |
| Env var is `undefined` | Not prefixed with `VITE_` or not set in host | Rename and redeploy |
| API blocked by CORS | API does not allow your origin | Use an API that permits CORS, or a proxy |
| Old version still shows | CDN cache or wrong branch | Hard refresh; check the deployment commit |
| Tests pass, build fails | Import path case mismatch (Linux is case-sensitive) | Match the filename exactly |

### Check the deployment commit

Open the deployment details in Vercel/Netlify and confirm the commit hash matches
your latest commit. Deploying the wrong branch is a classic mistake.

---

## 5. Write a README people can use

Replace the course README in your **deployed project** with a project README.
Keep the course README in the learning repo if you are working in a fork.

Template:

````markdown
# TaskFlow

A task manager built with React, Vite, and React Router.

## Live demo

https://your-app.vercel.app

## Features

- Add, complete, edit, and delete tasks
- Search and filter
- Persists to localStorage
- Import from a public API
- Light/dark theme
- Responsive and keyboard accessible

## Tech stack

React 19, Vite, React Router, Vitest, Testing Library, CSS.

## Run locally

```bash
git clone https://github.com/you/taskflow.git
cd taskflow
npm install
npm run dev
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm test` | Run tests |
| `npm run lint` | Lint |
| `npm run build` | Production build |

## What I learned

Two or three honest sentences about the hardest part and what you would do next.

## Screenshots

![TaskFlow home](./docs/screenshot.png)
````

Add one desktop screenshot and one mobile screenshot. Compress them.

---

## 6. Code review

### Receiving review

A review is about the code, not you. When you get a comment:

1. Read it fully.
2. If it is unclear, ask a question.
3. Fix it or explain your reasoning.
4. Reply with what you changed or why you disagree.
5. Push the fix; do not resolve the comment silently.

### Giving review

Review the **pull request**, not the person. Use this order:

1. **Correctness** — does it do what the assignment asks?
2. **Edge cases** — empty input, refresh, slow network, deleted task.
3. **Readability** — names, component size, dead code.
4. **Accessibility** — labels, keyboard, focus.
5. **Tests** — do they test behaviour?
6. **Style** — only after the above.

Useful comments:

```text
This works, but the empty state only appears when tasks.length === 0.
When a filter is active, the list is empty but the message says
"Nothing here yet." Could we show a different message? See Week 3.
```

```text
Nice refactor. One question: why is `visibleTasks` in state? It can be
derived from `tasks` and `filter`, so it can drift. Was there a reason?
```

Avoid:

```text
This is wrong.
```

and

```text
Nit: I would have named this differently.
```

unless it is genuinely a nit and labelled as optional.

### Review checklist

- [ ] The app runs from a clean clone.
- [ ] The acceptance criteria are met.
- [ ] `lint`, `test`, and `build` pass.
- [ ] No secrets, `node_modules`, or `dist` committed.
- [ ] No `console.log` left behind.
- [ ] State is minimal; derived values are computed.
- [ ] Keys are stable.
- [ ] Effects have correct dependencies and cleanup.
- [ ] Errors and empty states are handled.
- [ ] Keyboard navigation works.
- [ ] The PR description explains how to test.

---

## 7. Demo in three minutes

Use this structure:

```text
0:00–0:20  Who I am and what TaskFlow does
0:20–1:45  Live demo: add, complete, delete, search, filter, refresh
1:45–2:15  One technical decision I am proud of
2:15–2:35  One thing that broke and how I fixed it
2:35–3:00  What I would build next
```

Rules:

- Show the deployed app, not localhost.
- Have a backup screen recording.
- Do not read the code line by line.
- Do not apologise for unfinished stretch goals.
- End on time.

---

## 8. Project step

Ship TaskFlow:

1. Remove `console.log` and commented-out code.
2. Run the smoke test on a production build.
3. Deploy to Vercel or Netlify.
4. Test the live URL on your phone.
5. Replace the README with the project README above.
6. Add screenshots.
7. Request a review from a peer using the checklist.
8. Review someone else's PR with at least two specific, kind comments.
9. Record a three-minute demo.
10. Write a short retrospective: what was hardest, what you would redo, what is
    next.

---

## Assignment

[`assignments/week-08/README.md`](../assignments/week-08/README.md)

Submit the live URL, the repository, the README, the demo recording, and your
review of a peer's work.

**Stretch:** add a GitHub Actions status badge to the README, or set up a custom
domain.

---

## Recap

- Always test the production build before deploying.
- SPA routing needs a rewrite rule.
- Environment variables are set in the hosting dashboard and need a redeploy.
- A good README lets a stranger run your project.
- Code review is about behaviour, clarity, and kindness.
- A demo is a story, not a code tour.

### Check yourself

1. Why can `/stats` work locally but 404 in production?
2. Where do you set `VITE_API_URL` in Vercel?
3. What should a reviewer check before style preferences?
4. What are the three parts of a good demo?

---

## Resources

- [Vite: Building for Production](https://vite.dev/guide/build)
- [Vercel: Deploying Vite](https://vercel.com/docs/frameworks/vite)
- [Netlify: Deploy a Vite app](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/)
- [Google: Web.dev — Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)
- [GitHub: About pull request reviews](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests)
