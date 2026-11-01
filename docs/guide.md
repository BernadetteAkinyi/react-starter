# Step-by-step guide

This is the operating manual for the course. Read it once now, then use the
weekly workflow every week.

---

## Part 1 — Before you start

1. Complete [`docs/setup.md`](setup.md). Do not skip the checklist.
2. Read the [course README](../README.md) so you know the destination.
3. Open `docs/week-01.md` and skim the whole lesson before typing code.
4. Make sure you are on `main` and up to date:

```bash
git switch main
git pull
```

### How to use the lesson documents

Every week follows the same rhythm:

| Section | What to do |
| --- | --- |
| **Goal** | Read it. This is the one sentence you should be able to explain afterwards. |
| **New concepts** | Read once, then refer back while coding. Do not memorise. |
| **Guided build** | Type the code yourself. Do not copy-paste. |
| **Project step** | Apply the concept to TaskFlow. |
| **Common mistakes** | Read before you debug; it saves time. |
| **Assignment** | The graded work. Read the full brief before starting. |
| **Recap** | Close the laptop and explain it out loud. If you cannot, reread. |

---

## Part 2 — The weekly loop

Aim for five sessions of 60–90 minutes rather than one long day.

| Day | Activity | Time |
| --- | --- | --- |
| Monday | Read the lesson and run the examples | 60–90 min |
| Tuesday | Guided build in the starter | 90 min |
| Wednesday | Finish the guided build; start the assignment | 90 min |
| Thursday | Finish the assignment; write tests / self-check | 90 min |
| Friday | Run checks, push the branch, open the pull request | 45 min |
| Weekend | Review feedback, fix, merge; optional stretch goal | 60 min |

### Step 1 — Create a branch

Never work directly on `main`.

```bash
git switch main
git pull
git switch -c week-02/your-name
```

Use your real name or GitHub handle: `week-02/amara-okoye`.

### Step 2 — Read, then build

Read `docs/week-XX.md` and type every example. When something works, change one
thing and see what breaks. That is how you learn the rules.

Useful habits:

- Keep the terminal running `npm run dev`.
- Keep the browser console open. Read the **first** error.
- Save the file and watch the browser update.
- Commit small chunks:

```bash
git add src/components/TaskForm.jsx
git commit -m "week 02: add controlled task form"
```

Small commits make it easy to undo a mistake and easy for a reviewer to follow.

### Step 3 — Complete the assignment

Open `assignments/week-XX/README.md`. Read the **acceptance criteria** before you
start coding. Those criteria are the definition of done.

Work through the tasks in order. If you get stuck for more than 20 minutes:

1. Re-read the error message out loud.
2. `console.log` the value you think is wrong.
3. Check the React DevTools state.
4. Search the error text with the word "React".
5. Ask for help with the details listed in `docs/faq.md`.

### Step 4 — Self-check

Run all three checks:

```bash
npm run lint
npm test
npm run build
```

All must pass. Then walk through the acceptance criteria and tick each one
honestly. If a criterion is not met, fix it or write down why in the pull
request.

Also check by hand:

- [ ] Add, complete, and delete a task.
- [ ] Refresh the page — state behaves as the week requires.
- [ ] Resize to a phone width — nothing overlaps.
- [ ] Tab through the page — focus is visible and order makes sense.
- [ ] No errors in the browser console.

### Step 5 — Push and open a pull request

```bash
git add .
git commit -m "week 02: add task form, toggle, and delete"
git push -u origin week-02/your-name
```

GitHub prints a link. Open it, or go to the repository's **Pull requests** tab →
**New pull request**.

Use this title format:

```text
Week 02 — State, events, and forms
```

Fill in the pull request template:

- What you built
- Which assignment it closes
- How to test it manually
- Screenshots (desktop + mobile)
- What you found difficult
- Self-review checklist

### Step 6 — Review and merge

Your instructor will review within two working days. Respond to comments with
the fix or a question — do not resolve a comment without addressing it.

When approved, **squash and merge** your pull request. Then update `main`:

```bash
git switch main
git pull
```

Start the next week from the updated `main`.

---

## Part 3 — Working with the repository

### Folder conventions

```text
src/
├── components/       # Reusable UI. One component per file.
├── hooks/            # Custom hooks (from Week 4)
├── context/          # Context providers (from Week 4)
├── pages/            # Route-level components (from Week 6)
├── lib/ or utils/    # Pure functions, storage, API helpers
├── data/             # Seed data and constants
└── test/             # Test setup and shared test helpers
```

### Naming

- Components: `PascalCase.jsx` — `TaskItem.jsx`
- Hooks: `useSomething.js` — `useLocalStorage.js`
- Everything else: `camelCase.js` — `formatDate.js`
- One component per file; the filename matches the component name.

### Commit messages

Use a short prefix so history is readable:

```text
week 01: split App into components
week 02: add task form and validation
week 03: persist tasks to localStorage
fix: keep completed filter after refresh
docs: add week 04 notes
```

### What not to commit

- `node_modules/`
- `dist/`
- `.env` files or API keys
- Editor-specific settings (unless the cohort agrees)
- Large screenshots or videos (link them instead)

`.gitignore` already covers most of this. Check `git status` before committing.

---

## Part 4 — Getting unstuck

### The 20-minute rule

Try for 20 minutes. Then ask. Struggling is part of learning; silent struggling
for three hours is not.

When you ask, include:

```text
Week: 03
Goal: tasks should survive a refresh
Expected: reload keeps my tasks
Actual: list resets to the seed tasks
Error: "Unexpected token o in JSON at position 1" in src/hooks/useLocalStorage.js:18
Tried: console.log(localStorage.getItem("taskflow.tasks")); checked the key name
Code: <link to the branch or paste the smallest snippet>
```

### Debugging checklist

1. Is the dev server still running?
2. Read the first red error in the terminal **and** the browser console.
3. Check the file path and the named export/import.
4. `console.log` the props and state, then remove the log.
5. Use React DevTools to inspect the component tree and hook values.
6. Comment out the newest change and reintroduce it slowly.
7. Restart the dev server; clear the browser cache if needed.

More in [`docs/faq.md`](faq.md).

---

## Part 5 — The capstone (Weeks 9–10)

1. Read [`final-project/README.md`](../final-project/README.md) and
   [`requirements.md`](../final-project/requirements.md).
2. Fill in [`proposal.md`](../final-project/proposal.md) and get it approved.
3. Create a **new** repository named `studysync-your-name`.
4. Build the Week 9 milestone: routes, layout, static pages, data model, and
   localStorage read.
5. Build the Week 10 milestone: full CRUD, stats, filters, tests, accessibility,
   deployment, README, and demo.
6. Present with the script in
   [`presentation.md`](../final-project/presentation.md).

### Capstone rules

- Build it yourself. You may reuse patterns from TaskFlow, but not copy a
  tutorial project wholesale.
- Every feature must be reachable in the UI.
- No secrets in the repository.
- The app must work after a hard refresh and on a phone.
- The README must explain how to run it.

---

## Part 6 — If you fall behind

Falling behind is normal. Do not skip the assignment; shrink it.

| Situation | Plan |
| --- | --- |
| Missed one week | Do the assignment at half scope, note what you skipped, and catch up on the stretch goal later. |
| Two weeks behind | Talk to the instructor. Prioritise Weeks 2–4 (state, effects, hooks) — they unlock everything else. |
| JavaScript feels weak | Spend 30 minutes a day on array methods and objects while continuing the course. |
| No time for the capstone | Ship the required core features first; stretch goals are optional. A small, complete app beats a large, broken one. |

---

## Part 7 — Weekly checklist (copy this)

```markdown
## Week XX

- [ ] Read docs/week-XX.md
- [ ] Created branch week-XX/my-name
- [ ] Completed the guided build
- [ ] Completed every assignment task
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] Tested at mobile width
- [ ] Tabbed through the page
- [ ] Opened a pull request with screenshots
- [ ] Wrote my reflection in the pull request
```

---

## The one rule

**Build, break, fix, explain.** If you can explain why the code works, you own
it. That is the goal — not finishing fastest.
