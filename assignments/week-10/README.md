# Assignment 10 — Capstone final

**Week 10** · **Time:** 9–12 hours · **Due:** end of Week 10

> Finish StudySync, prove it works, deploy it, and present it.

Read [`final-project/requirements.md`](../../final-project/requirements.md),
[`final-project/rubric.md`](../../final-project/rubric.md), and
[`final-project/presentation.md`](../../final-project/presentation.md) before
starting.

---

## Learning objectives

- Deliver a complete app against a written brief.
- Manage scope and time.
- Test the critical paths.
- Deploy and document independently.
- Present technical decisions and trade-offs.

---

## Tasks

### 1. Finish the core features

From `requirements.md`:

- [ ] Subjects: create, edit, delete with a documented policy for related
      sessions.
- [ ] Sessions: create, edit, delete, toggle complete.
- [ ] Dashboard: weekly stats, per-subject progress, recent sessions.
- [ ] Sessions list: search, filter by subject/status, sort.
- [ ] Session detail: view, edit, delete.
- [ ] Empty states for no data and no matches.
- [ ] Form validation with accessible error messages.
- [ ] 404 route.
- [ ] Persistence in `localStorage`.

### 2. Test

- [ ] Reducer tests for subjects and sessions (all actions).
- [ ] Form test: invalid submit, valid submit, reset.
- [ ] Subject deletion guard test (or reassignment test).
- [ ] A date/duration helper test.
- [ ] `npm test` green.

### 3. Accessibility and responsive pass

- [ ] Keyboard only: complete every core task.
- [ ] Labels on every field.
- [ ] Visible focus.
- [ ] `aria-pressed` on filters.
- [ ] `role="alert"` for errors, `role="status"` for saves.
- [ ] Headings and landmarks.
- [ ] 375 px width and 200% zoom.
- [ ] Contrast.
- [ ] No motion that ignores `prefers-reduced-motion`.
- [ ] Error boundary.

### 4. Quality pass

- [ ] No `console.log`, dead code, or unused files.
- [ ] Clear component and variable names.
- [ ] No duplicated derived state.
- [ ] No prop drilling that context should solve.
- [ ] No secrets in the repo.
- [ ] `npm run lint`, `npm test`, `npm run build` pass.
- [ ] CI green.

### 5. Deploy

- [ ] Production build smoke-tested.
- [ ] Deployed to Vercel or Netlify.
- [ ] SPA rewrites configured.
- [ ] Refresh works on `/sessions`, `/subjects`, and a detail URL.
- [ ] Works on a phone.
- [ ] Environment variables set (if any).

### 6. Document

`README.md` must include:

- [ ] Project name and description.
- [ ] Live URL.
- [ ] Screenshots (desktop + mobile).
- [ ] Feature list.
- [ ] Tech stack.
- [ ] Setup and scripts.
- [ ] Data model summary.
- [ ] Decisions: subject deletion policy, date handling, storage keys.
- [ ] What you would build next.
- [ ] Acknowledgements.

### 7. Demo

Record a **5-minute** demo following
[`presentation.md`](../../final-project/presentation.md).

- [ ] Problem and target user.
- [ ] Data model and routes (brief).
- [ ] Core flows: create subject, log session, view dashboard, filter, delete.
- [ ] One technical decision.
- [ ] One bug and the fix.
- [ ] Next steps.
- [ ] Backup recording.

### 8. Retrospective

Add `RETRO.md`:

```markdown
## Scope
What did you cut, and why?

## Hardest bug
What happened, how did you debug it, what did you learn?

## Architecture
What would you change if you started again?

## Next
What will you learn or build next?
```

---

## Acceptance criteria

- [ ] Every required feature in `requirements.md` works.
- [ ] Subject deletion is safe and documented.
- [ ] All stats are derived.
- [ ] At least 8 meaningful tests pass.
- [ ] Accessibility checklist passes.
- [ ] App is deployed and works on refresh.
- [ ] README is complete with screenshots.
- [ ] 5-minute demo is linked.
- [ ] `RETRO.md` is committed.
- [ ] Lint, tests, and build pass.
- [ ] Lint, tests, and build pass (CI green if enabled).

---

## Grading

The capstone is marked out of **100** using
[`final-project/rubric.md`](../../final-project/rubric.md). It is **40%** of the
course grade.

A quick summary:

| Area | Points |
| --- | --- |
| Core features | 30 |
| Architecture and state | 15 |
| Data handling and persistence | 15 |
| UX, accessibility, responsive | 15 |
| Testing | 10 |
| Deployment and documentation | 10 |
| Demo and communication | 5 |

---

## Submission

```bash
git add .
git commit -m "feat: complete StudySync capstone"
git push
```

Submit:

1. Repository URL.
2. Live URL.
3. Demo video URL.
4. README link.
5. Test output.
6. `RETRO.md`.
7. Any known limitations.

---

## Final checklist

Before you submit, ask yourself:

- [ ] Can a stranger clone this and run it in under five minutes?
- [ ] Does every button do something?
- [ ] Does every empty state make sense?
- [ ] Does it work after a refresh, on a phone, and with a keyboard?
- [ ] Can I explain every file in `src/`?
- [ ] Am I proud to show this?

If any answer is no, fix that before adding another feature.

---

## Hints

<details>
<summary>I am behind and cannot finish everything</summary>

Prioritise in this order:

1. Sessions CRUD + persistence
2. Subjects + relation guard
3. Dashboard stats
4. Search/filter
5. Tests + accessibility
6. Deployment + README + demo

Cut stretch goals first, then sorting, then charts. Do not cut deployment or the
demo; they are graded.

</details>

<details>
<summary>My app is slow</summary>

Measure with React DevTools Profiler. Common causes: filtering a huge list on
every keystroke without memoisation, re-rendering the whole provider on every
form keystroke, or huge images. Fix the measured cause, not a guess.

</details>

<details>
<summary>I cannot get the demo under five minutes</summary>

Write the script in `presentation.md`, rehearse twice with a timer, and cut
explanation rather than the live demo. Keep one backup recording.

</details>

<details>
<summary>Deployment breaks at the last minute</summary>

Redeploy the last known good commit. Check the build log, env vars, output
directory, and rewrite rules. Demo from the backup recording if needed, and fix
afterwards.

</details>
