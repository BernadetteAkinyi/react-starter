# Week 9 — Capstone sprint 1: plan and scaffold StudySync

> **Goal:** Turn requirements into a plan, create the project, and ship a routed
> shell with real data flowing from `localStorage`.

**Time:** 7–9 hours · **Project:** StudySync capstone ·
**Assignment:** [Week 9](../assignments/week-09/README.md)

---

## 1. Read the brief

Before writing code:

1. [`final-project/README.md`](../final-project/README.md)
2. [`final-project/requirements.md`](../final-project/requirements.md)
3. [`final-project/proposal.md`](../final-project/proposal.md)
4. [`final-project/rubric.md`](../final-project/rubric.md)

StudySync is a study planner. Users track **subjects** and **study sessions**,
see weekly progress, and filter their history. It is smaller than a production
product but larger than TaskFlow: two related entities, derived statistics,
routing, persistence, tests, and a deployment.

### Required features at a glance

- Dashboard with weekly stats and recent sessions
- Subjects: create, edit, delete (with guard rails)
- Sessions: create, edit, delete, mark complete
- Search, filter by subject/status, sort
- Sessions persisted in `localStorage`
- Three or more routes plus a 404
- Form validation and empty/error states
- Responsive and keyboard accessible
- Tests for the reducer and at least one form
- Deployed, with a README and demo

Read `requirements.md` for the exact, graded list.

---

## 2. Write the proposal

Fill in `final-project/proposal.md`:

- Problem statement in two sentences.
- Target user.
- Three user stories.
- Screen list and route table.
- Data model.
- Component tree.
- Storage keys.
- Stretch goals (max two).
- What you will **not** build.

The last item matters. A focused app that works beats an ambitious app that does
not.

### Example user stories

```text
As a student, I want to log a study session for a subject so that I can see
where my time went.

As a student, I want to see this week's total study time so that I know whether
I am on track.

As a student, I want to filter sessions by subject so that I can review one
course before an exam.
```

### Route table

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Dashboard | Weekly stats, recent sessions, quick add |
| `/sessions` | Sessions | Full list, search, filter, sort |
| `/sessions/new` | Session form | Create a session |
| `/sessions/:sessionId` | Session detail | View, edit, delete |
| `/subjects` | Subjects | Manage subjects |
| `*` | Not found | 404 |

You may choose different routes, but write them down before coding.

### Data model

```js
// Subject
{
  id: 'sub-1',
  name: 'React',
  color: '#d9572f',
  targetMinutesPerWeek: 300
}

// Study session
{
  id: 'ses-1',
  subjectId: 'sub-1',
  title: 'Hooks practice',
  date: '2026-11-03',        // ISO date, no timezone surprises
  minutes: 50,
  notes: '',
  completed: true,
  createdAt: '2026-11-03T10:00:00.000Z'
}
```

Rules:

- Store dates as `YYYY-MM-DD` strings for session dates.
- Store durations as integer minutes.
- Never store a subject object inside a session; store `subjectId`.
- Deleting a subject must not orphan sessions silently. Either block deletion
  when sessions exist, or reassign them. Pick one and implement it.

### Storage keys

```js
const STORAGE_KEYS = {
  subjects: 'studysync.subjects.v1',
  sessions: 'studysync.sessions.v1',
  theme: 'studysync.theme.v1',
}
```

---

## 3. Wireframe on paper

Sketch five screens on paper or in Figma:

1. Dashboard
2. Sessions list
3. Session form
4. Subjects
5. Session detail

For each, write:

- The primary action.
- What is visible above the fold.
- The empty state.
- The mobile layout.

You do not need high fidelity. You need decisions before CSS.

### Dashboard sketch example

```text
┌──────────────────────────────────────────┐
│ StudySync            [Subjects] [Theme] │
├──────────────────────────────────────────┤
│ This week                                │
│  4h 20m studied    2h 10m average/day    │
│  [progress bar]    3 of 5 sessions done  │
│                                          │
│ Recent sessions              [View all]  │
│  React · Hooks practice      50m  ✓      │
│  Math · Past paper           45m         │
│                                          │
│ [+ Log a session]                        │
└──────────────────────────────────────────┘
```

---

## 4. Create the project

### Option A — Start from the course starter

```bash
cp -r final-project/starter studysync-your-name
cd studysync-your-name
npm install
npm run dev
```

Then create a **new GitHub repository** and connect it:

```bash
git init
git add .
git commit -m "chore: scaffold StudySync"
git branch -M main
git remote add origin https://github.com/YOU/studysync-your-name.git
git push -u origin main
```

### Option B — Start from Vite

```bash
npm create vite@latest studysync-your-name -- --template react
cd studysync-your-name
npm install
npm install react-router-dom
npm run dev
```

Then add ESLint, Vitest, and Testing Library following the course setup, or copy
the relevant config from the starter.

### Folder structure

```text
src/
├── components/       # Reusable UI (Button, Field, EmptyState, Layout)
├── context/          # SessionsProvider, ThemeProvider
├── hooks/            # useLocalStorage, useLocalStorageReducer
├── lib/              # date, storage, validation helpers
├── pages/            # Dashboard, Sessions, SessionForm, Subjects, NotFound
├── state/            # sessionsReducer, subjectsReducer
├── test/             # setup and helpers
├── App.jsx
├── main.jsx
└── styles.css
```

Keep TaskFlow open in another window. Reuse patterns, not code you cannot
explain.

---

## 5. Build the shell

### Step 1 — Providers above routes

```jsx
<ThemeProvider>
  <DataProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </DataProvider>
</ThemeProvider>
```

`BrowserRouter` can be inside or outside the data providers; it only needs to be
above the routes.

### Step 2 — Layout and routes

```jsx
<Routes>
  <Route element={<Layout />}>
    <Route index element={<DashboardPage />} />
    <Route path="sessions" element={<SessionsPage />} />
    <Route path="sessions/new" element={<SessionFormPage />} />
    <Route path="sessions/:sessionId" element={<SessionDetailPage />} />
    <Route path="subjects" element={<SubjectsPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
</Routes>
```

### Step 3 — Two reducers or one?

Two entities, two reducers is fine:

```js
const [subjects, subjectsDispatch] = useLocalStorageReducer(
  STORAGE_KEYS.subjects,
  subjectsReducer,
  seedSubjects,
)

const [sessions, sessionsDispatch] = useLocalStorageReducer(
  STORAGE_KEYS.sessions,
  sessionsReducer,
  seedSessions,
)
```

Put both in a `DataProvider` with memoized action helpers. Keep the provider
small; it coordinates, it does not compute stats.

### Step 4 — Seed data

Seed 3 subjects and 5 sessions so the UI is never empty on first run:

```js
export const seedSubjects = [
  { id: 'sub-react', name: 'React', color: '#d9572f', targetMinutesPerWeek: 300 },
  { id: 'sub-math', name: 'Math', color: '#3f7d58', targetMinutesPerWeek: 240 },
  { id: 'sub-writing', name: 'Writing', color: '#a56a12', targetMinutesPerWeek: 180 },
]
```

Use dates relative to today so the dashboard always has data:

```js
import { formatISO, subDays } from 'date-fns'
// or write a small helper with Date
```

You may install `date-fns` or write 20 lines yourself. Either is acceptable; be
able to explain the choice.

### Step 5 — Dashboard stats

Compute, do not store:

```js
const startOfWeek = getStartOfWeek(new Date())
const weekSessions = sessions.filter(
  (session) => new Date(session.date) >= startOfWeek,
)
const totalMinutes = weekSessions
  .filter((session) => session.completed)
  .reduce((sum, session) => sum + session.minutes, 0)
```

Format for display:

```js
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest}m`
  if (rest === 0) return `${hours}h`
  return `${hours}h ${rest}m`
}
```

---

## 6. Week 9 milestone

By the end of this week, the app should:

- [ ] Run with `npm run dev` and build with `npm run build`.
- [ ] Have a layout, header, footer, and working navigation.
- [ ] Have all required routes, including 404.
- [ ] Read subjects and sessions from `localStorage`.
- [ ] Show seeded data on the dashboard and sessions list.
- [ ] Show a static session detail page for a valid id.
- [ ] Have a proposal approved by the instructor.
- [ ] Be pushed to a new repository.

It does **not** need create/edit/delete yet. That is Week 10.

---

## Common mistakes

| Mistake | Symptom | Fix |
| --- | --- | --- |
| Starting with CSS | Spending hours on a shell with no data | Build structure and data first |
| Too many entities | Unfinished app | Ship subjects + sessions only |
| Storing subject objects in sessions | Stale names after editing a subject | Store `subjectId` |
| Using `new Date('2026-11-03')` in local time | Off-by-one-day bugs | Parse `YYYY-MM-DD` as local or use a helper |
| One giant provider | Everything re-renders | Split by concern |
| Forgetting the 404 route | Blank page on a bad URL | Add `path="*"` |
| Copying TaskFlow without understanding | Cannot explain the code in review | Rewrite the parts you need |

---

## Assignment

[`assignments/week-09/README.md`](../assignments/week-09/README.md)

Submit the proposal, wireframes, data model, repository link, and the working
shell. The instructor will review your plan before you build the CRUD features.

**Stretch:** add one read-only chart of minutes per subject for the current week.

---

## Recap

- Requirements first, code second.
- A route table and data model prevent expensive rewrites.
- Two related entities are enough for a meaningful capstone.
- Store ids, not duplicated objects.
- Compute statistics from sessions.
- Ship a shell before adding mutations.

### Check yourself

1. Why store `subjectId` instead of the subject object?
2. Which values on the dashboard are derived, and from what?
3. What happens to sessions when a subject is deleted? What did you decide?
4. Which route renders when the URL is unknown?

---

## Resources

- [React Router: Route objects](https://reactrouter.com/start/declarative/routing)
- [MDN: `<input type="date">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)
- [MDN: `Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
- [date-fns documentation](https://date-fns.org/docs/Getting-Started)
