# Assignment 8 — Deploy, document, review, and demo

**Week 8** · **Time:** 5–7 hours · **Due:** end of Week 8

> Ship TaskFlow to a public URL, write a README a stranger can follow, review a
> peer, and demo your work in three minutes.

Read [`docs/week-08.md`](../../docs/week-08.md) before starting.

---

## Learning objectives

- Produce and smoke-test a production build.
- Deploy a single-page app with correct rewrites.
- Write project documentation.
- Give a useful code review.
- Present technical work clearly and on time.

---

## Tasks

### 1. Branch

```bash
git switch main
git pull
git switch -c week-08/your-name
```

### 2. Clean up

- [ ] Remove `console.log` and commented-out code.
- [ ] Remove unused files and imports.
- [ ] Check `git status` for `node_modules`, `dist`, `.env*`.
- [ ] Confirm no secrets are committed.
- [ ] Run `npm run lint`, `npm test`, `npm run build`.

### 3. Production smoke test

```bash
npm run build
npm run preview
```

Walk through:

- [ ] Add, toggle, delete, clear completed.
- [ ] Search, filter, refresh.
- [ ] Detail page and stats page.
- [ ] 404.
- [ ] API import (success and offline error).
- [ ] Theme toggle and refresh.
- [ ] Keyboard only: tab, `/`, `Escape`, Enter, Space.
- [ ] 375 px width.
- [ ] No console errors or warnings.

Fix anything that fails before deploying.

### 4. Deploy

Choose Vercel (recommended) or Netlify.

- [ ] Connect the GitHub repository.
- [ ] Build command: `npm run build`.
- [ ] Output directory: `dist`.
- [ ] Add `VITE_API_URL` if your app reads it.
- [ ] Confirm the SPA rewrite is in place.
- [ ] Deploy.
- [ ] Run the smoke test on the live URL.
- [ ] Test on a phone.
- [ ] Refresh `/stats` and a detail URL.

Optional: enable a preview deployment for pull requests.

### 5. README

Replace the course README in your deployed project with a project README that
includes:

- [ ] Project name and one-sentence description.
- [ ] Live demo URL.
- [ ] Feature list.
- [ ] Tech stack.
- [ ] Setup commands (`git clone`, `npm install`, `npm run dev`).
- [ ] Scripts table.
- [ ] Environment variables.
- [ ] Screenshots (desktop + mobile).
- [ ] What you learned / what is next.
- [ ] Credits or acknowledgements.

Add screenshots to `docs/` and compress them.

### 6. Demo recording

Record a **3-minute** walkthrough:

```text
0:00–0:20  What TaskFlow is and who it is for
0:20–1:45  Live demo: add, complete, search, filter, refresh, import
1:45–2:20  One technical decision and why
2:20–2:45  One bug you fixed
2:45–3:00  What you would build next
```

Upload it to Loom, YouTube (unlisted), or Google Drive. Put the link in the PR.
Have a backup recording.

### 7. Peer review

Review a classmate's pull request using the checklist in
[`docs/week-08.md`](../../docs/week-08.md#6-code-review).

Requirements:

- At least two specific comments.
- At least one positive comment about something that works well.
- At least one actionable suggestion, or a question about a trade-off.
- Do not comment only on formatting.
- Be kind and precise.

Paste the link to your review in the PR.

### 8. Retrospective

Add `RETRO.md` to the repository:

```markdown
## What was hardest

## What I would refactor

## What finally clicked

## What I will learn next
```

Four short paragraphs. Be honest.

---

## Acceptance criteria

- [ ] The app is deployed at a public URL.
- [ ] All routes work on refresh on the deployed host.
- [ ] The live app passes the smoke test.
- [ ] The README follows the template and includes screenshots.
- [ ] A 3-minute demo video is linked.
- [ ] A peer review is completed and linked.
- [ ] `RETRO.md` is committed.
- [ ] Lint, tests, and build pass on `main` (CI green if enabled).
- [ ] No secrets, `node_modules`, or `dist` are committed.
- [ ] Lint, tests, and build pass.

---

## Stretch goals (optional)

- Add a status badge to the README.
- Configure a custom domain.
- Add a `docs/` screenshot folder with a short GIF.
- Add a "last deployed" note with the commit hash.

---

## Rubric (20 points)

| Criterion | Points | Full marks |
| --- | --- | --- |
| Functionality | 8 | Live app passes the full smoke test, including refresh and offline |
| Code quality | 5 | Clean production build, no debug code or secrets |
| UX and accessibility | 4 | Mobile and keyboard pass; README and screenshots are clear |
| Process and reflection | 3 | Peer review, demo, retro; checks and CI green |

---

## Submission

```bash
git add .
git commit -m "week 08: deploy, document, and demo TaskFlow"
git push -u origin week-08/your-name
```

PR title: **`Week 08 — Deploy, document, review, and demo`**.

Include:

- Live URL
- Repository URL
- Demo video URL
- Peer review URL
- Screenshots
- Smoke test checklist
- Retrospective highlights

---

## Hints

<details>
<summary>Blank page after deploying</summary>

Open the browser console. Common causes: wrong output directory, wrong base path,
or the build did not run. Check the deployment log and the commit hash.

</details>

<details>
<summary>Routes 404 on refresh</summary>

Add the rewrite. See `vercel.json` and `public/_redirects` in the starter.
Redeploy after adding them.

</details>

<details>
<summary>Environment variable is missing in production</summary>

Set it in the host's dashboard (not only `.env.local`), then redeploy. Vite bakes
env values in at build time.

</details>

<details>
<summary>My demo is too long</summary>

Rehearse with a timer. Cut the setup explanation, not the demo. Three minutes is
short; one core flow, one decision, one bug.

</details>

<details>
<summary>I cannot find a peer's PR</summary>

Ask in the cohort channel for a reviewer/reviewee pair, or review the person
above you in the assignment list. Coordinate before the due date.
</details>
