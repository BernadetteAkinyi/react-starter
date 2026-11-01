# Week 7 — Testing, accessibility, and performance

> **Goal:** Prove TaskFlow works, make it usable with a keyboard and screen
> reader, and keep it fast as it grows.

**Time:** 7–9 hours · **Project:** Tested, accessible TaskFlow ·
**Assignment:** [Week 7](../assignments/week-07/README.md)

---

## New concepts

| Concept | Meaning |
| --- | --- |
| Unit test | Tests one pure function or small unit |
| Component test | Renders a component and interacts with it like a user |
| Testing Library | Queries the DOM the way a user would |
| `userEvent` | Simulates real typing, clicking, and tabbing |
| Mock | A fake function or module used to isolate a test |
| Accessibility (a11y) | Building UI usable by keyboard, screen reader, and assistive tech |
| Error boundary | Catches render errors in a subtree and shows a fallback |
| Code splitting | Loading route code only when it is needed |
| Profiler | React DevTools tool for finding slow renders |

---

## 1. What to test

Test **behaviour**, not implementation details.

Good tests:

- "Adding a task shows it in the list."
- "Clicking the checkbox marks the task done."
- "An empty title does not create a task."
- "The reducer ignores an unknown action by throwing."

Fragile tests:

- "The component has a `div` with class `task-list`."
- "`setTasks` was called exactly twice."
- "The internal state equals this object."

If you refactor the component and the behaviour is unchanged, the test should
still pass.

### The testing pyramid for this course

```text
        few end-to-end tests (manual or Playwright later)
      some component tests (React Testing Library)
  many unit tests (reducers, formatters, storage helpers)
```

---

## 2. Unit-test the reducer

`src/state/tasksReducer.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { tasksReducer } from './tasksReducer.js'

const task = {
  id: '1',
  title: 'Write tests',
  completed: false,
  priority: 'high',
  due: 'Today',
}

describe('tasksReducer', () => {
  it('adds a task to the front', () => {
    const next = tasksReducer([], { type: 'added', task })

    expect(next).toEqual([task])
    expect(next).not.toBe([]) // a new array, not a mutation
  })

  it('toggles the matching task only', () => {
    const other = { ...task, id: '2', completed: true }
    const next = tasksReducer([task, other], { type: 'toggled', id: '1' })

    expect(next[0].completed).toBe(true)
    expect(next[1].completed).toBe(true)
    expect(next[0]).not.toBe(task) // immutable update
  })

  it('deletes by id', () => {
    const next = tasksReducer([task], { type: 'deleted', id: '1' })
    expect(next).toEqual([])
  })

  it('clears only completed tasks', () => {
    const done = { ...task, id: '2', completed: true }
    const next = tasksReducer([task, done], { type: 'cleared' })
    expect(next).toEqual([task])
  })

  it('imports without duplicates', () => {
    const next = tasksReducer([task], {
      type: 'imported',
      tasks: [task, { ...task, id: '2' }],
    })

    expect(next.map((item) => item.id)).toEqual(['2', '1'])
  })

  it('throws on an unknown action', () => {
    expect(() => tasksReducer([], { type: 'nope' })).toThrow(
      /unknown action/i,
    )
  })
})
```

Run it:

```bash
npm test
```

### Why test the reducer first?

It is pure, fast, and covers the rules of your app. A reducer test needs no
browser, no mocking, and no waiting.

---

## 3. Component tests

`src/components/TaskForm.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TaskForm from './TaskForm.jsx'

describe('TaskForm', () => {
  it('submits the title and priority, then resets', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()

    render(<TaskForm onAdd={onAdd} />)

    const title = screen.getByLabelText(/task title/i)
    const priority = screen.getByLabelText(/priority/i)

    await user.type(title, '  Review pull request  ')
    await user.selectOptions(priority, 'high')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(onAdd).toHaveBeenCalledWith('  Review pull request  ', 'high')
    expect(title).toHaveValue('')
    expect(priority).toHaveValue('medium')
  })

  it('does not submit an empty title', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()

    render(<TaskForm onAdd={onAdd} />)

    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(onAdd).not.toHaveBeenCalled()
  })
})
```

If `TaskForm` trims before calling `onAdd`, adjust the expectation. Test the
behaviour you actually built; do not bend the component to the test.

### Query priority

Use queries in this order:

1. `getByRole` — buttons, headings, links, checkboxes
2. `getByLabelText` — form fields
3. `getByPlaceholderText` — only when there is no label
4. `getByText` — static text
5. `getByTestId` — last resort

Accessible queries force you to build accessible markup. That is the point.

### `getBy`, `queryBy`, `findBy`

| Query | Use when |
| --- | --- |
| `getBy...` | The element must exist now; throws if missing |
| `queryBy...` | The element may be absent; returns `null` |
| `findBy...` | The element appears asynchronously; returns a Promise |

```jsx
expect(screen.queryByText(/no tasks match/i)).not.toBeInTheDocument()
```

---

## 4. Test user interactions in a list

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import TaskItem from './TaskItem.jsx'

it('requests a toggle when the checkbox changes', async () => {
  const user = userEvent.setup()
  const onToggle = vi.fn()
  const onDelete = vi.fn()

  render(
    <TaskItem
      task={{
        id: '1',
        title: 'Write tests',
        completed: false,
        priority: 'high',
        due: 'Today',
      }}
      onToggle={onToggle}
      onDelete={onDelete}
    />,
  )

  await user.click(screen.getByRole('checkbox', { name: /mark "write tests" as done/i }))

  expect(onToggle).toHaveBeenCalledWith('1')
  expect(onDelete).not.toHaveBeenCalled()
})
```

### Testing context

Wrap the component in the provider, or create a test helper:

```jsx
// src/test/renderWithProviders.jsx
import { render } from '@testing-library/react'
import TasksProvider from '../context/TasksProvider.jsx'
import ThemeProvider from '../context/ThemeProvider.jsx'

export function renderWithProviders(ui) {
  return render(
    <ThemeProvider>
      <TasksProvider>{ui}</TasksProvider>
    </ThemeProvider>,
  )
}
```

Be careful: the real provider reads and writes `localStorage`. Clear it between
tests:

```js
beforeEach(() => {
  localStorage.clear()
})
```

---

## 5. Accessibility is not a checklist at the end

### Start with semantic HTML

```jsx
// ✅ A real button: focusable, keyboard-activated, announced
<button type="button" onClick={deleteTask}>Delete</button>

// ❌ A div pretending to be a button
<div onClick={deleteTask}>Delete</div>
```

If you must use a non-semantic element, add `role`, `tabIndex`, and key handlers —
then ask why you are not using the real element.

### Label every input

```jsx
<label htmlFor="search">Search tasks</label>
<input id="search" type="search" />
```

If the label is visually hidden, use `.sr-only` — not `display: none`.

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Announce dynamic changes

```jsx
<p role="status">{openCount} tasks left</p>
<p role="alert">{error}</p>
```

`role="status"` is polite; `role="alert"` interrupts. Use alerts for errors, not
for every change.

### Use `aria-pressed` for toggles

```jsx
<button aria-pressed={filter === 'open'} onClick={() => setFilter('open')}>
  Open
</button>
```

A screen reader then announces "Open, toggle button, pressed."

### Keyboard checklist

- [ ] Every interactive element is reachable with `Tab`.
- [ ] Focus is always visible (`:focus-visible`).
- [ ] The tab order follows the visual order.
- [ ] `Enter` and `Space` activate buttons.
- [ ] `Escape` closes modals and clears search.
- [ ] No keyboard trap.
- [ ] A "Skip to content" link is the first focusable element.

```jsx
<a className="skip-link" href="#main">
  Skip to content
</a>
```

### Colour and motion

- Body text contrast: at least **4.5:1**.
- Large text: at least **3:1**.
- Never use colour alone to convey status (add text or an icon with a label).
- Respect `prefers-reduced-motion` (the starter CSS already does).

### Focus on route change

In a single-page app, navigating does not move focus. Move it to the main heading:

```jsx
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()
  const mainRef = useRef(null)

  useEffect(() => {
    mainRef.current?.focus()
  }, [location.pathname])

  return (
    <main ref={mainRef} tabIndex={-1} id="main">
      <Outlet />
    </main>
  )
}
```

`tabIndex={-1}` makes the element programmatically focusable without adding it
to the tab order.

---

## 6. Error boundaries

A render error in one component can blank the whole app. Catch it:

```jsx
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Render error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section role="alert">
          <h1>Something broke.</h1>
          <p>Your saved tasks are safe. Reload the page to continue.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </section>
      )
    }

    return this.props.children
  }
}
```

Wrap the layout or each route:

```jsx
<ErrorBoundary>
  <Outlet />
</ErrorBoundary>
```

Error boundaries catch errors during rendering, lifecycle methods, and
constructors. They do **not** catch errors in event handlers, async code, or
server-side code. Handle those with `try/catch` and state.

---

## 7. Code splitting

Load the stats page only when the user visits it:

```jsx
import { lazy, Suspense } from 'react'

const StatsPage = lazy(() => import('./pages/StatsPage.jsx'))

<Suspense fallback={<p role="status">Loading…</p>}>
  <Route path="stats" element={<StatsPage />} />
</Suspense>
```

Check the result:

```bash
npm run build
```

Vite prints one chunk per lazy route. If every route is in one big chunk, lazy
loading is not working.

Do not lazy-load everything. The home page is needed immediately; the stats page
is not.

---

## 8. Performance: measure before optimising

React is fast by default. Most "slow" apps are slow because of:

1. Too much state in one component, causing large re-renders.
2. Expensive work during render (filtering 10,000 items on every keystroke).
3. Large images or bundles.
4. Effects that run on every render.

Use the **Profiler** in React DevTools:

1. Open the Profiler tab.
2. Click record.
3. Add a task, toggle one, search.
4. Stop.
5. Look for components that re-render often or take more than a few milliseconds.

Only then consider:

```jsx
const visibleTasks = useMemo(
  () => tasks.filter((task) => task.title.includes(query)),
  [tasks, query],
)
```

or `React.memo` for an expensive list row. Memoisation has a cost; do not apply
it everywhere by default.

### Bundle check

```bash
npm run build
```

Aim for a main bundle under ~200 kB gzipped for an app this size. If it is much
larger, check what you imported.

---

## 9. Project step

Add quality to TaskFlow:

1. Write reducer tests for add, toggle, delete, clear, import, and the error case.
2. Write component tests for `TaskForm` and `TaskItem`.
3. Add `localStorage.clear()` between tests.
4. Add a skip link and a focus-visible style.
5. Add `role="status"` to counts and `role="alert"` to errors.
6. Add `aria-pressed` to filter buttons.
7. Add an `ErrorBoundary` around the routes.
8. Lazy-load `StatsPage` and `AboutPage`.
9. Run Lighthouse (Chrome DevTools → Lighthouse) on the production build.
10. Fix every critical accessibility issue it reports.

Do not chase a perfect score. Fix real problems: missing labels, low contrast,
unusable keyboard flow.

---

## Common mistakes

| Mistake | Symptom | Fix |
| --- | --- | --- |
| Testing class names | Tests break on every refactor | Test roles and text |
| Using `getByTestId` everywhere | Tests pass while the UI is inaccessible | Prefer `getByRole`/`getByLabelText` |
| Not awaiting `userEvent` | Act warnings, flaky tests | `await user.click(...)` |
| Shared state between tests | Order-dependent failures | `beforeEach(() => localStorage.clear())` |
| `div` with `onClick` | Keyboard users cannot use it | Use `<button>` |
| Icon-only button without a name | Screen reader says "button" | Add `aria-label` |
| `aria-label` on a visible label | Duplicate/conflicting announcement | Use a real `<label>` |
| Lazy-loading the home page | Slower first paint | Lazy-load secondary routes only |
| `useMemo` everywhere | More complexity, no gain | Measure first |

---

## Assignment

[`assignments/week-07/README.md`](../assignments/week-07/README.md)

Ship at least 10 meaningful tests, an accessibility pass, an error boundary, and
lazy-loaded secondary routes. Include Lighthouse before/after notes.

**Stretch:** add a test for the API error path with a mocked `fetch`.

---

## Recap

- Test behaviour through roles, labels, and visible text.
- Unit-test reducers; component-test forms and interactions.
- Semantic HTML is the foundation of accessibility.
- Announce dynamic status and errors.
- Move focus on route changes and provide a skip link.
- Error boundaries catch render errors, not event handlers.
- Lazy-load secondary routes and measure performance before optimising.

### Check yourself

1. Why is `getByRole` better than `getByTestId`?
2. What does `role="status"` announce, and when?
3. What errors does an error boundary not catch?
4. When is `useMemo` justified?

---

## Resources

- [React: Testing](https://react.dev/learn/testing)
- [Testing Library: Queries](https://testing-library.com/docs/queries/about)
- [Vitest: Guide](https://vitest.dev/guide/)
- [web.dev: Learn Accessibility](https://web.dev/learn/accessibility)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React: `lazy`](https://react.dev/reference/react/lazy)
- [React: Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
