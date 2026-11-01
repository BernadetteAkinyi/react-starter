# Week 10 — Capstone sprint 2: build, test, ship, present

> **Goal:** Finish StudySync, prove it works, deploy it, and present it with
> confidence.

**Time:** 9–12 hours · **Project:** StudySync capstone ·
**Assignment:** [Week 10](../assignments/week-10/README.md)

---

## 1. The finish line

By the end of this week, StudySync must:

- Do everything in [`final-project/requirements.md`](../final-project/requirements.md).
- Pass `npm run lint`, `npm test`, and `npm run build`.
- Work on a phone and with a keyboard.
- Be deployed at a public URL.
- Have a README with screenshots and setup steps.
- Be demonstrated in five minutes using
  [`final-project/presentation.md`](../final-project/presentation.md).

Anything not on that list is optional. Protect the core.

---

## 2. A five-day plan

### Day 1 — Subjects and sessions CRUD

- Subject form: name, colour, weekly target.
- Subject list with edit and delete.
- Session form: subject, title, date, minutes, notes, completed.
- Validation: required fields, minutes between 1 and 600, date not in the far
  future.
- Delete confirmation (a simple `window.confirm` is acceptable; a custom dialog
  is better).

### Day 2 — List, search, filter, detail

- Sessions list sorted by date, newest first.
- Search by title.
- Filter by subject and completion status.
- Empty states for "no sessions" and "no matches."
- Session detail with edit and delete.
- Subject deletion guard: block if sessions exist, or reassign.

### Day 3 — Dashboard and derived stats

- This week's total and completed minutes.
- Sessions completed vs. planned.
- Per-subject progress against the weekly target.
- Recent five sessions.
- A simple bar or progress indicator per subject.

All derived from state; no duplicated totals in storage.

### Day 4 — Tests, accessibility, edge cases

- Reducer tests for every action.
- Form test: valid submit, invalid submit, reset.
- Test the subject-delete guard.
- Keyboard pass; focus after route change.
- Labels on every input; `aria-pressed` on filters.
- `role="alert"` for errors, `role="status"` for saves.
- Empty states and 404.
- Responsive at 375 px.
- Error boundary.

### Day 5 — Deploy, document, demo

- Production build and smoke test.
- Deploy.
- README with screenshots.
- Record the demo.
- Submit.

If you are behind, cut stretch goals. Do not cut tests, accessibility, or
deployment.

---

## 3. Forms that behave

A reusable field component keeps forms consistent:

```jsx
export default function Field({ label, error, children, hint }) {
  const id = useId()

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': error ? `${id}-error` : undefined })}
      {hint && <p className="hint">{hint}</p>}
      {error && (
        <p className="error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
```

Usage:

```jsx
<Field label="Session title" error={errors.title}>
  {(props) => <input {...props} value={title} onChange={...} />}
</Field>
```

If the render-prop pattern feels advanced, write the label and error markup
directly in each form. Consistency matters more than abstraction.

### Validation rules

```js
function validateSession(values) {
  const errors = {}

  if (!values.title.trim()) errors.title = 'Give the session a title.'

  if (!values.subjectId) errors.subjectId = 'Choose a subject.'

  const minutes = Number(values.minutes)
  if (!Number.isFinite(minutes) || minutes < 1 || minutes > 600) {
    errors.minutes = 'Enter a duration between 1 and 600 minutes.'
  }

  if (!values.date) errors.date = 'Choose a date.'

  return errors
}
```

Validate on submit. Optionally validate on blur after the first submit attempt.
Do not show errors before the user has interacted.

---

## 4. Deleting a subject safely

Sessions reference `subjectId`. If you delete a subject, its sessions become
orphans.

Pick one policy:

### Policy A — Block deletion

```js
function deleteSubject(id) {
  const hasSessions = sessions.some((session) => session.subjectId === id)

  if (hasSessions) {
    setError('Move or delete this subject’s sessions first.')
    return
  }

  subjectsDispatch({ type: 'deleted', id })
}
```

Show the message next to the subject and announce it with `role="alert"`.

### Policy B — Reassign to "Unsorted"

Create a permanent subject:

```js
const UNSORTED = { id: 'sub-unsorted', name: 'Unsorted', color: '#8a8175' }
```

On delete:

```js
sessionsDispatch({ type: 'reassigned', from: id, to: UNSORTED.id })
subjectsDispatch({ type: 'deleted', id })
```

Either is fine. Write the choice in the README and test it.

---

## 5. Dates without timezone bugs

`new Date('2026-11-03')` is parsed as **UTC midnight**. In a negative timezone,
local formatting can show the previous day.

Helper:

```js
// src/lib/date.js
export function parseDateOnly(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toDateInputValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function startOfWeek(date = new Date()) {
  const copy = new Date(date)
  const day = copy.getDay() // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day // Monday start
  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}
```

Use `parseDateOnly` whenever you compare or format a session date.

---

## 6. Tests that protect the capstone

Minimum:

```text
sessionsReducer.test.js
  ✓ adds a session
  ✓ updates a session
  ✓ deletes a session
  ✓ toggles completion
  ✓ ignores unknown actions

subjectsReducer.test.js
  ✓ adds, updates, deletes
  ✓ blocks deletion when sessions exist (if policy A)

SessionForm.test.jsx
  ✓ shows validation errors for an empty submit
  ✓ calls onSubmit with the correct values
  ✓ resets after a valid submit
```

Add a test for your duration formatter:

```js
expect(formatDuration(0)).toBe('0m')
expect(formatDuration(45)).toBe('45m')
expect(formatDuration(60)).toBe('1h')
expect(formatDuration(125)).toBe('2h 5m')
```

Test behaviour, not implementation. If you rename a CSS class, tests should not
break.

---

## 7. Deploy checklist

- [ ] `npm run build` passes.
- [ ] `npm run preview` smoke test passes.
- [ ] SPA rewrite is configured (`vercel.json` or `public/_redirects`).
- [ ] Environment variables set in the host (if any).
- [ ] `/sessions`, `/subjects`, and a detail URL work on refresh.
- [ ] `localStorage` works in a fresh browser profile.
- [ ] Tested on a phone.
- [ ] No console errors.
- [ ] README links to the live URL.
- [ ] Repository is public or shared with the instructor.
- [ ] Screenshots compressed and committed.

---

## 8. Present

Use the script in
[`final-project/presentation.md`](../final-project/presentation.md).

```text
0:00–0:30  Problem and user
0:30–1:00  Data model and routes (one slide)
1:00–3:30  Live demo of the three core flows
3:30–4:15  One technical decision + one trade-off
4:15–4:45  What broke and how you fixed it
4:45–5:00  Next steps
```

Have a backup recording. Live demos fail at the worst time.

---

## 9. Retrospective

Write four short answers in the PR or a `RETRO.md`:

1. What is the hardest thing you built, and why?
2. What would you refactor if you had another day?
3. Which React concept finally clicked?
4. What will you learn next?

This is part of the assignment. Reflection is how experience turns into skill.

---

## Common mistakes

| Mistake | Symptom | Fix |
| --- | --- | --- |
| Adding features after the freeze | Nothing is finished | Freeze scope on Day 4 |
| No deployment until the last hour | Broken links, panic | Deploy on Day 3 |
| Testing only the happy path | Crashes on empty input | Test invalid states |
| Storing totals in state | Numbers drift | Derive from sessions |
| Orphaned sessions | Blank subject names | Guard or reassign |
| Timezone date bugs | Sessions appear on the wrong day | Parse `YYYY-MM-DD` locally |
| Demoing localhost | Dead demo | Use the deployed URL |
| No README | Reviewer cannot run it | Write it before the demo |

---

## Assignment

[`assignments/week-10/README.md`](../assignments/week-10/README.md)

Submit the final repository, live URL, README, tests, demo recording, and
retrospective. The capstone rubric is in
[`final-project/rubric.md`](../final-project/rubric.md).

---

## Recap

- Protect the core; stretch goals are optional.
- Derive statistics; never store them twice.
- Validate forms on submit and announce errors.
- Decide what happens to related data before deleting.
- Treat dates as date-only values, not UTC timestamps.
- Deploy before the last day.
- A five-minute demo is a story with a problem, a demo, and a trade-off.

### Check yourself

1. What happens to sessions when a subject is deleted in your app?
2. Which values on your dashboard are derived?
3. What did you test, and what did you deliberately not test?
4. What would you build next, and why?

---

## Resources

- [React: `<form>`](https://react.dev/reference/react-dom/components/form)
- [React: `useId`](https://react.dev/reference/react/useId)
- [MDN: Constraint validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation)
- [web.dev: Accessible forms](https://web.dev/learn/forms)
- [Vercel: Environment variables](https://vercel.com/docs/environment-variables)
