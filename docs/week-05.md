# Week 5 — Async data and APIs

> **Goal:** Fetch real data, show loading and error states, cancel requests, and
> merge API data into TaskFlow without duplicates.

**Time:** 7–9 hours · **Project:** TaskFlow with API import ·
**Assignment:** [Week 5](../assignments/week-05/README.md)

---

## New concepts

| Concept | Meaning |
| --- | --- |
| Synchronous vs. asynchronous | Code that finishes now vs. code that finishes later |
| Promise | A placeholder for a future value |
| `async` / `await` | Syntax for writing asynchronous code readably |
| `fetch` | The browser API for HTTP requests |
| HTTP status | `200` OK, `404` not found, `500` server error, etc. |
| Loading / error / empty state | The three UI states beyond "data" |
| `AbortController` | Cancels a request when it is no longer needed |
| Environment variable | Configuration injected at build time (`VITE_...`) |

---

## 1. Asynchronous JavaScript in one page

```js
async function getTodos() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos')
  const data = await response.json()
  return data
}
```

`await` pauses **this function**, not the whole browser. Other code keeps
running. `getTodos()` returns a Promise immediately.

Handle failure with `try/catch`:

```js
async function getTodos() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos')

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}
```

`fetch` only rejects on network failure. A `404` or `500` still resolves, so you
must check `response.ok` yourself.

### Three states, always

Any asynchronous UI has at least:

```text
idle → loading → success
              ↘ error
```

Design all four. A spinner with no error message is not finished.

---

## 2. Put the API in its own module

Create `src/lib/api.js`:

```js
const API_URL =
  import.meta.env.VITE_API_URL ?? 'https://jsonplaceholder.typicode.com'

export async function fetchTodos({ signal } = {}) {
  const response = await fetch(`${API_URL}/todos?_limit=12`, { signal })

  if (!response.ok) {
    throw new Error(`Could not load tasks (${response.status})`)
  }

  return response.json()
}
```

Why a module?

- Components stay about UI.
- The endpoint is defined once.
- Tests can mock the module.
- You can change the API without touching components.

Create `.env.example`:

```bash
# Copy to .env.local for local overrides.
VITE_API_URL=https://jsonplaceholder.typicode.com
```

Only variables starting with `VITE_` are exposed to the browser. **Never put a
secret in a `VITE_` variable** — it is shipped to every visitor.

---

## 3. Fetch on user action

```jsx
import { useState } from 'react'
import { fetchTodos } from '../lib/api.js'
import { useTasks } from '../context/TasksContext.js'

export default function ImportTasksButton() {
  const { importTasks } = useTasks()
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState(null)

  async function handleImport() {
    setStatus('loading')
    setError(null)

    try {
      const todos = await fetchTodos()

      const imported = todos.map((todo) => ({
        id: `api-${todo.id}`,
        title: todo.title,
        completed: todo.completed,
        priority: 'medium',
        due: 'Imported',
      }))

      importTasks(imported)
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="import">
      <button
        type="button"
        onClick={handleImport}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Importing…' : 'Import from API'}
      </button>

      {status === 'success' && (
        <p role="status">Tasks imported. Scroll down to see them.</p>
      )}

      {status === 'error' && (
        <p role="alert" className="error">
          {error}{' '}
          <button type="button" onClick={handleImport}>
            Try again
          </button>
        </p>
      )}
    </div>
  )
}
```

Key details:

- Disable the button while loading to prevent double clicks.
- `role="status"` announces success; `role="alert"` announces errors.
- Keep the previous tasks visible; import is additive.

The API's todos look like this:

```json
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
```

Map it into your own shape at the boundary. Do not let an external API's shape
leak through the whole app.

---

## 4. Deduplicate in the reducer

Clicking import twice should not create duplicates. The reducer already handles
this with a `Set`:

```js
case 'imported': {
  const existingIds = new Set(state.map((task) => task.id))
  const fresh = action.tasks.filter((task) => !existingIds.has(task.id))
  return [...fresh, ...state]
}
```

If you need to update existing API tasks instead, use a `Map`:

```js
const byId = new Map(state.map((task) => [task.id, task]))
for (const incoming of action.tasks) {
  byId.set(incoming.id, { ...byId.get(incoming.id), ...incoming })
}
return [...byId.values()]
```

Choose one policy and write it down.

---

## 5. Fetch inside `useEffect` (and cancel it)

Sometimes data should load when a page mounts — for example, a stats page that
loads a quote or a public summary.

```jsx
import { useEffect, useState } from 'react'
import { fetchTodos } from '../lib/api.js'

export default function ApiStatus() {
  const [state, setState] = useState({ status: 'idle', data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setState({ status: 'loading', data: null, error: null })

      try {
        const data = await fetchTodos({ signal: controller.signal })
        setState({ status: 'success', data, error: null })
      } catch (error) {
        if (error.name === 'AbortError') return
        setState({ status: 'error', data: null, error: error.message })
      }
    }

    load()

    return () => controller.abort()
  }, [])

  // render based on state.status
}
```

### Why `AbortController`?

- The user navigates away before the request finishes.
- React Strict Mode mounts, unmounts, and remounts components in development.
- A newer request supersedes an older one.

Without cancellation, a late response can call `setState` on an unmounted
component or overwrite fresher data.

---

## 6. Loading UI that does not jump

A centered "Loading…" is acceptable, but a skeleton preserves layout:

```jsx
function TaskSkeleton() {
  return (
    <ul className="task-list" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <li key={item} className="task skeleton">
          <span className="skeleton-circle" />
          <span className="skeleton-line" />
        </li>
      ))}
    </ul>
  )
}
```

Also announce loading for screen readers:

```jsx
<p role="status" className="sr-only">
  Loading tasks…
</p>
```

A visual spinner is not announced by default.

---

## 7. Error messages people can act on

Bad:

```text
Something went wrong.
```

Better:

```text
Could not load tasks (503). The service may be busy. Try again.
```

Best: a short message, a retry button, and a fallback path that still lets the
user use the app. TaskFlow keeps local tasks even when the API fails — that is
graceful degradation.

---

## 8. Project step

Add an **Import from API** panel to TaskFlow:

1. Create `src/lib/api.js` and `.env.example`.
2. Add the `imported` action to `tasksReducer` (if not done in Week 4).
3. Build `ImportTasksButton` with loading, success, and error states.
4. Import only incomplete todos (`?completed=false`), or filter after fetching.
5. Show how many tasks were imported.
6. Click import twice and confirm there are no duplicates.
7. Turn off your Wi-Fi, click import, and confirm the error is readable.
8. Confirm local add/toggle/delete still work while the API is unavailable.

---

## Common mistakes

| Mistake | Symptom | Fix |
| --- | --- | --- |
| Not checking `response.ok` | JSON parse error on a 404 page | Throw on `!response.ok` |
| Forgetting `await response.json()` | `data` is a Promise | Await it |
| Using `useEffect` for a click | Fires at the wrong time | Fetch in the event handler |
| No loading state | Double imports, no feedback | Disable and show progress |
| No error state | Silent failure | `try/catch` + `role="alert"` |
| Missing cleanup | State update after unmount | `AbortController` |
| Secrets in `VITE_` | Leaked in the bundle | Server-side proxy only |
| Trusting the API shape | Crashes when a field is missing | Validate/map at the boundary |
| Import duplicates | Repeated rows | Deduplicate by id in the reducer |

---

## Assignment

[`assignments/week-05/README.md`](../assignments/week-05/README.md)

Build the API import with loading, error, retry, deduplication, and a completed-
only import mode. The API module must be separate from the UI.

**Stretch:** mock `fetch` in a test and assert the success, error, and abort
paths.

---

## Recap

- `async`/`await` makes asynchronous code readable.
- `fetch` resolves on HTTP errors; check `response.ok`.
- Every async UI needs idle, loading, success, and error states.
- Keep API calls in a dedicated module.
- Cancel requests you no longer need.
- Map external data into your own shape and deduplicate on import.
- Environment variables prefixed with `VITE_` are public.

### Check yourself

1. Why does `fetch` not throw on a `404`?
2. When does the `AbortController` cleanup run?
3. Where should the API base URL live?
4. What are the four states of an async request?
5. Why map API data before storing it?

---

## Resources

- [MDN: Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect#fetching-data)
- [Vite: Env Variables and Modes](https://vite.dev/guide/env-and-mode)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
