# StudySync — requirements

These requirements are the grading contract. **Must** items are required.
**Should** items are expected unless you document why they are missing.
**Stretch** items are optional and never compensate for missing Must items.

---

## 1. Subjects

### Must

- Create a subject with:
  - `name`: 1–40 characters, trimmed, unique case-insensitively.
  - `color`: a valid hex colour (used in the UI).
  - `targetMinutesPerWeek`: integer 0–1000 (0 means no target).
- List all subjects with name, colour, target, and session count.
- Edit a subject's name, colour, and target.
- Delete a subject.
- Deleting a subject must not leave sessions with an unknown subject. Choose one:
  - **Block** deletion while sessions reference it, with a clear message; or
  - **Reassign** its sessions to an "Unsorted" subject before deleting.
- Document the chosen policy in the README.
- Show a confirmation before deleting.

### Should

- Prevent duplicate names with an inline error.
- Show the weekly target progress on the subjects page.

---

## 2. Study sessions

### Must

- Create a session with:
  - `subjectId`: an existing subject.
  - `title`: 1–80 characters, trimmed.
  - `date`: `YYYY-MM-DD`; not more than 30 days in the future.
  - `minutes`: integer 1–600.
  - `notes`: optional, maximum 500 characters.
  - `completed`: boolean, default `false`.
- List sessions, newest first by default.
- Show subject name, title, date, duration, and completion status.
- Toggle a session's completed status.
- Edit every field of a session.
- Delete a session with confirmation.
- Persist all changes in `localStorage`.
- Reject invalid input with visible, accessible errors.

### Should

- Show a character count for notes.
- Preserve the form values when validation fails.
- Show a success message after create/update/delete (`role="status"`).
- Support a "duplicate session" action (optional convenience).

---

## 3. Dashboard

### Must

- Show the current week's total **completed** study minutes.
- Show completed sessions vs. total sessions for the week.
- Show progress per subject for the current week:
  - minutes studied
  - target (if any)
  - a visual indicator with a text equivalent.
- Show the five most recent sessions with links to detail.
- Handle the zero-data case without dividing by zero or showing "NaN".
- All values derived from sessions/subjects. Do not store computed totals.

### Should

- Show current streak (consecutive days with a completed session).
- Show a "Log a session" primary action.
- Use the current week starting Monday.

### Stretch

- A bar chart of minutes per day.
- A comparison with last week.

---

## 4. Sessions list

### Must

- Search by title (case-insensitive).
- Filter by subject (all + each subject).
- Filter by status (all / open / completed).
- Sort by date (newest/oldest) and duration (longest/shortest).
- Combine search, subject, status, and sort.
- Show an empty state for no sessions and a different one for no matches.
- Show the number of matching sessions.

### Should

- Keep filter state in the URL (`useSearchParams`) so views are shareable.
- Add a "clear filters" action.
- Group sessions by date.

---

## 5. Session detail

### Must

- Render a session by id.
- Show all fields, including notes and subject.
- Provide Edit and Delete actions.
- Show a friendly not-found state for a deleted or invalid id, with a link back.
- Back link to the list.

### Should

- Show created/updated timestamps.
- Edit in a modal or a dedicated route (your choice).

---

## 6. Routing

### Must

- Routes:
  - `/`
  - `/sessions`
  - `/sessions/new`
  - `/sessions/:sessionId`
  - `/subjects`
  - `*` (404)
- Layout with header, nav, main, footer.
- Active navigation state.
- Internal links use `Link`/`NavLink`.
- Providers are above the routes.
- Production refresh works on every route (SPA rewrite).

### Should

- Edit route `/sessions/:sessionId/edit` instead of inline editing.
- Scroll to top or move focus on route change.

---

## 7. Data and state

### Must

- Versioned `localStorage` keys, for example:
  - `studysync.subjects.v1`
  - `studysync.sessions.v1`
- Safe read: `try/catch`, shape validation, fallback to seed data.
- Safe write: `try/catch`; the app does not crash when storage is full.
- Reducers are pure and tested.
- No duplicated derived state.
- No mutation of props or state.
- Stable ids (`crypto.randomUUID()` or stable seed ids).
- Deleting a subject protects referential integrity.

### Should

- One provider coordinating both collections.
- A custom `useLocalStorage`/`useLocalStorageReducer`.
- Action helpers are memoized.
- A schema version comment in the README.

---

## 8. Forms and validation

### Must

- Controlled inputs.
- `event.preventDefault()` on submit.
- Labels for every field.
- Inline error messages linked with `aria-describedby`.
- `aria-invalid` on invalid fields.
- Focus moves to the first invalid field on submit.
- Disable submit while saving (if async) or when required fields are empty.
- Trim text values.
- Numeric values are numbers, not strings, before storing.

### Should

- Validate on blur after the first submit attempt.
- Show a summary error with `role="alert"`.

---

## 9. Accessibility

### Must

- Semantic landmarks: `header`, `nav`, `main`, `footer`.
- One `<h1>` per page; no skipped heading levels.
- Visible focus indicators.
- Full keyboard access to every action.
- No keyboard trap.
- `aria-pressed` on filter toggles.
- `role="status"` for save/update messages.
- `role="alert"` for errors.
- Colour is never the only indicator.
- Contrast: 4.5:1 body text, 3:1 large text.
- `prefers-reduced-motion` respected.
- Skip link to main content.
- Route changes move focus to the main heading or main region.

### Should

- Screen-reader test of the core flow.
- 200% zoom test.

---

## 10. Responsive design

### Must

- Usable at 375 px, 768 px, and 1280 px.
- No horizontal scrolling at 375 px.
- Tap targets at least 44×44 px.
- Forms usable on a phone.
- Navigation usable on a phone.

---

## 11. Testing

### Must

- At least **8 meaningful tests**, covering:
  - every sessions reducer action
  - every subjects reducer action
  - the subject deletion guard/reassignment
  - one form: invalid submit + valid submit
  - one helper (duration or date formatting)
- Tests use roles, labels, and visible text.
- Tests are independent and clear storage between cases.

### Should

- Test the sessions list filters.
- Test the not-found detail state.
- Test an import/export helper, if built.

### Stretch

- Component test for the dashboard stats.
- Mocked API tests.

---

## 12. Deployment and documentation

### Must

- Deployed to a public URL (Vercel or Netlify).
- Production build passes.
- SPA rewrites configured; every route works on refresh.
- README contains:
  - project description and live URL
  - screenshots (desktop + mobile)
  - feature list
  - setup commands and scripts
  - data model and storage keys
  - subject deletion policy
  - known limitations
- 5-minute demo video.
- `RETRO.md`.
- No secrets or generated folders committed.

### Should

- CI workflow running lint, test, and build (or the same checks run locally and
  documented).
- Environment variables documented.

---

## 13. Code quality

### Must

- Clear folder structure.
- Small components with one responsibility.
- No dead code, commented-out blocks, or `console.log`.
- Consistent naming.
- No unused dependencies.
- No copy-pasted blocks that should be a component or helper.
- The app can be explained file by file.

### Should

- Reusable form field and button components.
- Pure helpers in `src/lib/`.
- Comments only where the reason is not obvious.

---

## Non-goals

Do not build these unless you have finished everything above:

- Authentication, user accounts, or a real backend
- Payments or subscriptions
- Email or push notifications
- A native mobile app
- Multi-user collaboration
- Calendar sync
- AI features

They are good ideas for later. They are not this project.

---

## Acceptance checklist

Use this before submitting:

### Subjects

- [ ] Create, edit, delete
- [ ] Unique name validation
- [ ] Colour and target
- [ ] Safe deletion policy
- [ ] Confirmation

### Sessions

- [ ] Create, edit, delete, toggle
- [ ] All fields validated
- [ ] Persisted
- [ ] Sorted
- [ ] Detail page

### Dashboard

- [ ] Weekly total
- [ ] Completed vs. total
- [ ] Per-subject progress
- [ ] Recent sessions
- [ ] Zero state
- [ ] Derived values

### List

- [ ] Search
- [ ] Subject filter
- [ ] Status filter
- [ ] Sort
- [ ] Combined
- [ ] Empty states
- [ ] Result count

### Quality

- [ ] Routes + 404
- [ ] Keyboard pass
- [ ] Responsive
- [ ] 8+ tests
- [ ] Error boundary
- [ ] Deployed
- [ ] README
- [ ] Demo
- [ ] Retro
- [ ] Lint/test/build
