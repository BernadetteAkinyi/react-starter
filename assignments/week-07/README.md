# Assignment 7 — Testing, accessibility, and resilience

**Week 7** · **Time:** 6–8 hours · **Due:** end of Week 7

> Prove TaskFlow works, make it usable without a mouse, and stop one broken
> component from blanking the page.

Read [`docs/week-07.md`](../../docs/week-07.md) before starting.

---

## Learning objectives

- Write unit tests for pure logic.
- Write component tests with Testing Library and `userEvent`.
- Audit and fix accessibility issues.
- Add an error boundary.
- Code-split secondary routes.

---

## Tasks

### 1. Branch

```bash
git switch main
git pull
git switch -c week-07/your-name
```

### 2. Reducer tests

Write tests for every `tasksReducer` action:

- `added`
- `toggled`
- `deleted`
- `cleared`
- `imported` (including the duplicate case)
- unknown action throws

Assert **behaviour**, not implementation:

- The right task changes.
- Other tasks are untouched.
- New arrays are returned (no mutation).
- Duplicate ids are filtered.

### 3. Component tests

Test at least:

- `TaskForm`: valid submit, empty submit, field reset.
- `TaskItem`: checkbox calls `onToggle` with the id, delete calls `onDelete`.
- `TaskList`: empty state and rendered tasks.
- One route or page: detail not-found, or stats zero case.

Use:

- `getByRole`, `getByLabelText`, `getByText`.
- `await userEvent.setup()` and `await user.click/type/selectOptions`.
- `vi.fn()` for callbacks.
- `localStorage.clear()` in `beforeEach`.

### 4. Ten meaningful tests

The suite must contain **at least 10 test cases** that would catch real bugs.
Do not pad with trivial assertions such as `expect(true).toBe(true)`.

Run:

```bash
npm test
```

All green.

### 5. Accessibility pass

Fix each item or document why it is not applicable:

- [ ] Every input has a visible or `.sr-only` label.
- [ ] Every icon-only button has an accessible name.
- [ ] One `<h1>` per page; heading levels do not skip.
- [ ] Landmarks: `header`, `nav`, `main`, `footer`.
- [ ] Skip link to `#main`.
- [ ] Visible focus style that is not removed.
- [ ] Tab through the entire app without a mouse; order is logical.
- [ ] No keyboard trap.
- [ ] `Escape` clears search, `/` focuses it.
- [ ] Filter state uses `aria-pressed`.
- [ ] Dynamic status uses `role="status"`; errors use `role="alert"`.
- [ ] Colour contrast: body text ≥ 4.5:1; large text ≥ 3:1.
- [ ] Status is not conveyed by colour alone.
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] Images have `alt` (decorative images use `alt=""`).
- [ ] Focus moves sensibly on route change.
- [ ] Zoom to 200% does not break the layout.

### 6. Error boundary

- Create `src/components/ErrorBoundary.jsx`.
- Wrap the route outlet (or each page).
- Show a friendly fallback with a reload button.
- Log the error in `componentDidCatch`.
- Prove it works: temporarily throw in a component, confirm the fallback, then
  remove the throw.

### 7. Lazy routes

- Lazy-load `StatsPage` and `AboutPage` with `React.lazy` and `Suspense`.
- The fallback is announced (`role="status"`).
- `npm run build` shows separate chunks.

### 8. Lighthouse report

Run Lighthouse on the **production build**:

```bash
npm run build
npm run preview
```

Chrome DevTools → Lighthouse → Analyze page load.

Record:

- Accessibility score.
- Performance score.
- The top three issues.
- What you fixed.
- What you consciously left and why.

Do not chase 100. Fix real barriers.

---

## Acceptance criteria

- [ ] At least 10 meaningful tests pass.
- [ ] Reducer actions are all covered.
- [ ] `TaskForm` and `TaskItem` have interaction tests.
- [ ] Tests clear storage between cases.
- [ ] Every accessibility checklist item is fixed or documented.
- [ ] Error boundary exists and was tested.
- [ ] Stats and About are lazy-loaded.
- [ ] Build output shows separate chunks.
- [ ] Lighthouse report is included in the PR.
- [ ] Lint, tests, and build pass.

---

## Stretch goals (optional)

- Add a test for the API error path with a mocked `fetch`.
- Add a custom `renderWithProviders` helper and use it in component tests.
- Add `@testing-library/jest-dom` matchers if not already configured.
- Add a test for the 404 route.
- Add a `prefers-reduced-motion` test? (Hard; document manual verification
  instead.)

---

## Rubric (20 points)

| Criterion | Points | Full marks |
| --- | --- | --- |
| Functionality | 8 | Tests meaningful and green; a11y barriers fixed; boundary and lazy routes work |
| Code quality | 5 | Behaviour-focused tests, no implementation coupling, clear helpers |
| UX and accessibility | 4 | Keyboard pass, labels, focus, contrast, announcements |
| Process and reflection | 3 | Lighthouse notes, honest report, checks pass |

---

## Submission

```bash
git add .
git commit -m "week 07: add tests, a11y fixes, and error boundary"
git push -u origin week-07/your-name
```

PR title: **`Week 07 — Testing, accessibility, and resilience`**.

Include:

1. Test summary output (`npm test`).
2. Lighthouse screenshots or scores.
3. Three accessibility issues you found and how you fixed them.
4. One issue you left, and why.

---

## Hints

<details>
<summary>"Not wrapped in act(...)"</summary>

Usually an update happened after the test finished. Await every `userEvent`
call, and use `findBy...` for asynchronous UI.

</details>

<details>
<summary>`getByLabelText` cannot find my input</summary>

The label's `htmlFor` must match the input's `id`. A wrapping `<label>` also
works. Placeholder text is not a label.

</details>

<details>
<summary>My context component test fails</summary>

Wrap the component in the provider, or use the shared `renderWithProviders`
helper. Clear `localStorage` before each test.

</details>

<details>
<summary>The error boundary does not catch my error</summary>

It catches errors during render, not in event handlers, effects, or async code.
For those, use `try/catch` and state.

</details>

<details>
<summary>Lazy loading does not create chunks</summary>

Use a dynamic import: `lazy(() => import('./pages/StatsPage.jsx'))`. A static
import is not split. Check the build output.

</details>
