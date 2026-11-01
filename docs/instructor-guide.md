# Instructor guide

How to run React From Zero to Projects as a 10-week cohort, a 6-week intensive,
or a self-paced course.

---

## Design principles

1. **One project, many concepts.** Every lesson changes TaskFlow. Learners see
   the consequence of a concept immediately.
2. **Type, do not copy.** Guided builds are short enough to type. Copy-paste
   hides understanding.
3. **Behaviour over trivia.** Assessments ask for working features and
   explanations, not definitions.
4. **Review is teaching.** A good PR comment is worth a lecture.
5. **Ship early.** Deployment is Week 8, not the last hour of Week 10.
6. **Accessibility is normal.** It is part of every review, not a special topic.

---

## Before the cohort

- [ ] Create a private repository from this course (or use it directly).
- [ ] Add learners as collaborators, or have them fork it.
- [ ] Protect `main`: require a pull request and one approval.
- [ ] Enable Issues and Projects if you want a cohort board.
- [ ] Enable CI: copy `docs/ci.yml` to `.github/workflows/ci.yml` (requires the
      `workflow` token scope). Otherwise, run the three checks locally.
- [ ] Create a cohort channel (Slack, Discord, WhatsApp).
- [ ] Schedule a 90-minute weekly session and a 30-minute office hour.
- [ ] Prepare a demo deployment (Vercel/Netlify) to show in Week 8.
- [ ] Decide the submission deadline (for example, Sunday 23:59 local time).
- [ ] Share [`docs/setup.md`](../docs/setup.md) one week before the start.

### Cohort kickoff (60 minutes)

1. Show the finished TaskFlow demo, not the starter.
2. Show the capstone brief and one example demo.
3. Walk through the repo map and the weekly loop.
4. Do setup together: Node, `npm install`, `npm run dev`.
5. Explain the PR workflow and the first assignment.
6. Set expectations: 6–8 hours per week, asking for help after 20 minutes.

---

## The weekly 90-minute session

| Time | Segment | What happens |
| --- | --- | --- |
| 0–10 | Recap | Learners explain last week's concept in one sentence each |
| 10–30 | Concept | Teach this week's idea with a small, focused example |
| 30–55 | Live build | Code the guided project step slowly; narrate decisions |
| 55–80 | Lab | Learners apply it to their own branch; you circulate |
| 80–90 | Review | Show one PR, ask what is good and what to change |

Rules for the live build:

- Keep the editor font large.
- Narrate **why**, not only **what**.
- Make one deliberate mistake and debug it aloud.
- Stop before the assignment. The assignment is for the learner.
- Never paste a full file without explaining it.

---

## Week-by-week teaching notes

### Week 1 — Components and props

**Teach:** UI as a function of data, JSX rules, props down, composition.

**Demo:** Trace `seedTasks → TaskList → TaskItem` in React DevTools.

**Common mistakes:** `class` vs `className`, adjacent JSX, prop name mismatch,
index keys.

**Review focus:** Is the page split into sensible components? Are props named
clearly? Does the mobile layout hold?

**Checkpoint:** The learner can explain why `TaskItem` cannot change `tasks`.

---

### Week 2 — State, events, forms

**Teach:** `useState`, events, controlled inputs, immutable updates, derived
values.

**Demo:** Add a task, show the state in DevTools, then mutate the array and show
that nothing updates. Then fix it.

**Common mistakes:** `tasks.push`, `onClick={handler()}`, `value` without
`onChange`, storing counts, form reload.

**Review focus:** No mutation; stable keys; callbacks passed correctly; empty
state.

**Checkpoint:** The learner can add, toggle, delete, and clear tasks.

---

### Week 3 — Effects and persistence

**Teach:** Effects synchronize with the outside world; derived state is computed;
cleanup.

**Demo:** Add localStorage in three lines, refresh, then break the stored JSON and
show the fallback.

**Common mistakes:** `useState(load())` instead of `useState(load)`, missing
dependencies, storing filtered data, infinite loops.

**Review focus:** One source of truth; safe parse; correct dependency arrays;
search/filter combined.

**Checkpoint:** Tasks survive refresh; corrupt storage does not white-screen.

---

### Week 4 — Hooks, Context, reducer

**Teach:** Custom hooks, context, pure reducers, memoized provider value.

**Demo:** Show prop drilling in DevTools, then remove it with context. Show a
reducer action in the DevTools timeline.

**Common mistakes:** Provider outside/inside the wrong place, mutating reducer
state, missing `return`, recreating context value, hooks in conditions.

**Review focus:** Behaviour preserved; reducer purity; no task props remaining;
theme persisted; keyboard shortcut does not hijack typing.

**Checkpoint:** The learner can explain when to use props, context, and a reducer.

---

### Week 5 — Async data

**Teach:** Promises, `fetch`, `response.ok`, loading/error, abort, mapping,
deduplication.

**Demo:** Import tasks, then go offline and show the error and retry. Use the
Network tab to show the request.

**Common mistakes:** Forgetting `await`, not checking `response.ok`, no loading
state, duplicates, secrets in `VITE_`.

**Review focus:** Four UI states; API isolated; dedupe; app still works offline.

**Checkpoint:** The learner can describe every state of the import button.

---

### Week 6 — Routing

**Teach:** Client-side routing, layout routes, params, search params, SPA
rewrites.

**Demo:** Navigate, refresh, and show the 404. Explain why `/stats` breaks without
a rewrite.

**Common mistakes:** `<a href>`, missing router, `*` route order, param name
mismatch, filters in local state.

**Review focus:** Route table; detail not-found; URL state; refresh in production.

**Checkpoint:** The learner can share a filtered URL and explain why it works.

---

### Week 7 — Testing and accessibility

**Teach:** Behaviour-focused tests, accessible queries, keyboard flow, error
boundaries, lazy routes.

**Demo:** Write one failing test, fix the code, make it pass. Then tab through a
broken form and fix the label.

**Common mistakes:** Testing class names, missing `await`, shared storage between
tests, `div` buttons, no accessible names.

**Review focus:** Test intent; independent tests; keyboard pass; announcements;
Lighthouse notes.

**Checkpoint:** The learner can write a test for a form without being told which
query to use.

---

### Week 8 — Deploy and review

**Teach:** Production build, environment variables, SPA rewrites, README, demo.

**Demo:** Deploy live in the session. Show a failed refresh, add the rewrite, and
redeploy.

**Common mistakes:** Wrong output directory, env var not set, testing localhost,
last-minute deployment.

**Review focus:** Live URL; refresh-safe routes; README; screenshots; peer review
quality.

**Checkpoint:** A stranger can run the project from the README.

---

### Week 9 — Capstone plan and shell

**Teach:** Requirements → routes → data model → shell. Scope control.

**Demo:** Fill in the proposal live for StudySync. Show a bad, vague proposal and
a good, specific one.

**Common mistakes:** Too many entities, no deletion policy, date timezone bugs,
copying TaskFlow wholesale, no non-goals.

**Review focus:** Proposal specificity; route table; data model; storage read;
derived stats; repository setup.

**Checkpoint:** The plan is small enough to finish in Week 10.

**Gate:** Do not approve a proposal with more than two stretch goals or more than
two core entities.

---

### Week 10 — Capstone final

**Teach:** Finishing, testing, deploying, presenting.

**Demo:** A five-minute capstone demo. Point out the problem statement, the core
flow, one decision, and one bug.

**Common mistakes:** Adding features late, no deployment until the end, demos
that read code, no README, orphaned sessions.

**Review focus:** Required-feature gate; tests; accessibility; deployment; demo
timing.

**Checkpoint:** The app runs from a clean clone and the learner can explain every
file.

---

## Reviewing pull requests

### Turnaround

- Review within **two working days**.
- If you cannot, post a holding comment with a date.
- Review the smallest PRs first; they unblock the next week.

### Review order

1. Does it run? Check out the branch and run the app.
2. Do the acceptance criteria work?
3. Run lint, tests, and build.
4. Check edge cases: empty, refresh, slow network, deleted item.
5. Check accessibility with the keyboard.
6. Read the code for clarity and structure.
7. Only then comment on style.

### Comment style

Be specific and teachable:

```text
This works for the happy path. What happens if the title is only spaces?
`title.trim()` before the guard would handle it. See Week 2, section 4.
```

```text
Nice use of the updater form here. It avoids the stale-state bug we saw
in the live build.
```

Avoid:

- "Wrong."
- "Just do X."
- Rewriting the whole solution for them.
- Commenting only on formatting when behaviour is broken.

### Approve when

- Acceptance criteria are met.
- Checks pass.
- The learner can explain the code (ask one question).
- Remaining comments are optional or documented.

Do not approve to be nice. A merge means "this is the baseline for next week."

---

## Grading workflow

1. Use the assignment rubric (20 points).
2. Add a short comment: two strengths, one next step.
3. Record the score in your gradebook.
4. If below 12, offer a 15-minute call before the next assignment.
5. Return within three working days.

The capstone uses the 100-point rubric in
[`final-project/rubric.md`](../final-project/rubric.md).

---

## Pacing alternatives

### Standard — 10 weeks

Use the schedule as written. One lesson and one assignment per week.

### Intensive — 6 weeks

| Week | Content |
| --- | --- |
| 1 | Lessons 1–2: components, state, forms |
| 2 | Lessons 3–4: effects, persistence, architecture |
| 3 | Lessons 5–6: APIs, routing |
| 4 | Lesson 7: testing and accessibility |
| 5 | Lesson 8 + capstone plan: deploy TaskFlow, proposal |
| 6 | Capstone build and demo |

Cut in this order: stretch goals, About page, theme toggle, lazy loading. Keep:
CRUD, persistence, routing, tests, deployment.

### Self-paced — 12 weeks

Add buffer weeks after Week 4 and Week 8. Use the buffer for one-on-one reviews
and catch-up. Keep the same assignments.

---

## Supporting struggling learners

Watch for:

- More than two weeks without a PR.
- Repeated "it doesn't work" messages with no error detail.
- Copying code that cannot be explained.
- Skipping tests and deployment.

Interventions:

1. A 15-minute screen share. Ask them to reproduce the bug.
2. Reduce scope: one acceptance criterion at a time.
3. Pair them with a peer for one session.
4. Revisit Weeks 2–4 fundamentals; they unlock the rest.
5. If life circumstances are the cause, agree on a written extension plan.

Do not silently let someone fall three weeks behind. A short conversation early
is kinder than a failed capstone.

---

## Final showcase

- 5 minutes per learner, hard stop.
- Order: strongest first to set the bar, or volunteer order.
- Projector + backup recordings.
- Invite a guest reviewer if possible.
- Celebrate specific decisions, not only finished features.
- Collect feedback with a short form.

Suggested awards (keep it light):

- Best accessibility
- Cleanest architecture
- Best demo
- Most improved
- Best bug story

---

## Reusing this repository

- **Cohort:** keep one repository and have learners branch per week. Protect
  `main`.
- **Self-paced:** have learners fork the repo and work in their fork.
- **Template:** mark the repository as a template so each learner can generate
  their own copy.
- **Capstone:** learners create a separate repo, so their TaskFlow history stays
  clean and their capstone is portfolio-ready.

---

## Instructor checklist per week

- [ ] Lesson and assignment links work.
- [ ] Starter still passes lint, test, and build.
- [ ] Local lint, test, and build pass (CI green if enabled).
- [ ] Demo prepared (working app, not slides only).
- [ ] Review queue cleared within two days.
- [ ] At-risk learners contacted.
- [ ] Next week's assignment announced with the deadline.
