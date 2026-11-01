# Assignment 9 — Capstone plan and shell

**Week 9** · **Time:** 7–9 hours · **Due:** end of Week 9

> Plan StudySync, create its repository, and ship a routed shell that reads real
> data from `localStorage`.

Read [`final-project/README.md`](../../final-project/README.md),
[`requirements.md`](../../final-project/requirements.md), and
[`docs/week-09.md`](../../docs/week-09.md) before starting.

---

## Learning objectives

- Translate requirements into routes, data, and components.
- Make and document design decisions before coding.
- Scaffold a React app independently.
- Ship a read-only vertical slice.

---

## Tasks

### 1. Complete the proposal

Fill in [`final-project/proposal.md`](../../final-project/proposal.md):

- [ ] Problem statement (two sentences).
- [ ] Target user.
- [ ] Three user stories.
- [ ] Route table.
- [ ] Data model for subjects and sessions.
- [ ] Storage keys.
- [ ] Component tree.
- [ ] Stretch goals (max two).
- [ ] Explicit non-goals.

Submit the proposal to the instructor **before** building the full app. You may
start the scaffold while waiting for approval.

### 2. Wireframes

Sketch five screens (paper or Figma):

- Dashboard
- Sessions list
- Session form
- Subjects
- Session detail

For each, note the primary action, the empty state, and the mobile layout. Commit
photos/exports under `docs/wireframes/`.

### 3. Create the repository

- Create a new GitHub repository named `studysync-your-name`.
- Add a README with the project name and setup commands.
- Add `.gitignore` (copy from the course starter).
- Add ESLint, Prettier, and Vitest configuration, or start from
  `final-project/starter`.
- Make an initial commit.

### 4. Scaffold the app

Set up:

- React + Vite.
- React Router.
- Providers above the routes.
- `ThemeProvider` (optional but recommended).
- Layout with header, nav, main, footer.
- 404 route.
- Folder structure from `docs/week-09.md`.

### 5. Data layer

- Add `useLocalStorage` and `useLocalStorageReducer` (or equivalent).
- Add `subjectsReducer` and `sessionsReducer`.
- Seed 3 subjects and 5 sessions with dates relative to today.
- Read both collections on first render.
- Persist changes even though you have no forms yet (test with a temporary
  button, then remove it).

### 6. Shell pages

Implement:

- [ ] Dashboard: weekly total, completed count, recent sessions, links.
- [ ] Sessions: list seeded sessions with subject name, date, duration, status.
- [ ] Session detail: render a session for a valid id; friendly not-found for an
      invalid id.
- [ ] Subjects: list subjects with colour and weekly target.
- [ ] Session form: static form UI only (no submit yet) or a working create if
      you are ahead.
- [ ] 404.

All statistics must be derived from sessions, not stored.

### 7. Deploy a draft (optional but recommended)

Deploy early. A draft URL now prevents a Week 10 panic. Mark it as a draft in the
README.

### 8. Submit for plan review

Open a pull request in your capstone repository (or the course repo, if your
instructor asks) with:

- Proposal link.
- Wireframes.
- Repository link.
- Draft deployment link (if any).
- Screenshots of every route.
- What you will build next.
- What you are unsure about.

---

## Acceptance criteria

- [ ] Proposal is complete and specific.
- [ ] Route table and data model are documented.
- [ ] Wireframes for five screens exist.
- [ ] New repository exists with a README and `.gitignore`.
- [ ] App runs with `npm run dev` and builds with `npm run build`.
- [ ] Layout and all required routes render.
- [ ] Subjects and sessions are read from `localStorage`.
- [ ] Seed data appears on the dashboard and sessions list.
- [ ] Session detail handles a missing id.
- [ ] 404 route works.
- [ ] Statistics are derived, not stored.
- [ ] No console errors.
- [ ] Lint and build pass.

---

## Stretch goals (optional)

- Add one read-only chart (minutes per subject this week).
- Add sorting by date.
- Add a theme toggle with persistence.
- Deploy the draft and add the URL to the README.

---

## Rubric (20 points)

| Criterion | Points | Full marks |
| --- | --- | --- |
| Functionality | 8 | Shell runs, routes work, storage read, seed data, derived stats |
| Code quality | 5 | Clear structure, pure reducers, no copy-paste from TaskFlow without understanding |
| UX and accessibility | 4 | Layout, navigation, empty states, labels, keyboard access |
| Process and reflection | 3 | Proposal specific, wireframes present, risks identified |

---

## Submission

```bash
git add .
git commit -m "week 09: scaffold StudySync with routes and storage"
git push
```

**Deliverables:**

1. Proposal document (link or file).
2. Wireframes (link or files).
3. Capstone repository URL.
4. Draft deployment URL (if available).
5. A 5-minute Loom walking through the plan and shell (optional but recommended).

---

## Hints

<details>
<summary>I cannot decide what to build</summary>

Build exactly the required features. If you have time left, add one stretch goal.
Incomplete ambitious apps score worse than complete focused ones.

</details>

<details>
<summary>Date parsing is off by one day</summary>

`new Date('2026-11-03')` parses as UTC. Use a `parseDateOnly` helper that splits
the string and constructs a local date.

</details>

<details>
<summary>My sessions show "undefined" for the subject</summary>

The subject id in the session does not match any subject. Log both id lists. Seeded
sessions must reference the seeded subject ids exactly.

</details>

<details>
<summary>Storage works, but stats are wrong</summary>

Filter by completed **and** by date range. Check that you are summing `minutes`
(numbers), not strings. `"50" + "50"` is `"5050"`.

</details>

<details>
<summary>I want to copy TaskFlow code</summary>

Reuse patterns (providers, reducers, storage hooks) and copy small utilities you
understand. Rewrite the domain logic for subjects and sessions. You must be able
to explain every line in the final review.

</details>
