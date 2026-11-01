# Week 3 — Effects, persistence, and derived state

> **Goal:** Make tasks survive a refresh, add search and filters, and learn when
> you actually need `useEffect` (and when you do not).

**Time:** 7–9 hours · **Project:** Persistent, searchable TaskFlow ·
**Assignment:** [Week 3](../assignments/week-03/README.md)

---

## New concepts

| Concept | Meaning |
| --- | --- |
| Side effect | Work outside rendering: storage, network, subscriptions, DOM APIs |
| `useEffect` | Run a side effect after a render, and optionally clean it up |
| Dependency array | Controls when an effect re-runs |
| Lazy initial state | Computing initial state only on the first render |
| Serialization | Converting data to a string (`JSON.stringify`) and back |
| Derived state | Values computed from existing state — not stored separately |
| Controlled filter | Filter/search values that drive the visible list |

---

## 1. What is a side effect?

Rendering should be pure: same props and state → same JSX. Anything else is a
side effect:

- reading or writing `localStorage`
- calling `fetch`
- setting `document.title`
- adding an event listener
- starting a timer

`useEffect` lets you run that work **after** React has updated the screen.

```jsx
import { useEffect } from 'react'

useEffect(() => {
  document.title = `${openCount} open · TaskFlow`
}, [openCount])
```

The function runs after render. The array lists the values the effect depends on.

### The dependency array

```jsx
useEffect(() => { ... })           // after every render — rare
useEffect(() => { ... }, [])       // once after mount — rare
useEffect(() => { ... }, [tasks])  // when tasks changes
useEffect(() => { ... }, [a, b])   // when either changes
```

Omitting a dependency that the effect reads causes **stale values**. Adding an
object or array created during render causes the effect to run every render.
React's lint rules catch most of these mistakes — keep them enabled.

### Cleanup

Some effects need cleanup when the component unmounts or before the effect runs
again:

```jsx
useEffect(() => {
  const controller = new AbortController()

  fetch('/api/tasks', { signal: controller.signal })
    .then((response) => response.json())
    .then(setTasks)

  return () => controller.abort()
}, [])
```

```jsx
useEffect(() => {
  function handleKeyDown(event) {
    if (event.key === 'Escape') setQuery('')
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

Cleanup prevents memory leaks, duplicate listeners, and updates to unmounted
components.

---

## 2. Persist tasks with localStorage

### Step 1 — Choose a key

Create `src/lib/storage.js`:

```js
export const STORAGE_KEY = 'taskflow.tasks.v1'
```

Version the key (`v1`) so a future data-shape change can start fresh instead of
crashing on old data.

### Step 2 — Read once, lazily

```jsx
import { useState } from 'react'
import { seedTasks } from './data/seedTasks.js'
import { STORAGE_KEY } from './lib/storage.js'

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return seedTasks

    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) return seedTasks

    return parsed
  } catch (error) {
    console.warn('Could not read saved tasks', error)
    return seedTasks
  }
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks)
  // ...
}
```

Pass the **function**, not the result:

```jsx
useState(loadTasks)      // ✅ called only on the first render
useState(loadTasks())    // ❌ called on every render (wasted work)
```

### Step 3 — Save when tasks change

```jsx
import { useEffect } from 'react'

useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}, [tasks])
```

Now:

1. Add a task.
2. Refresh the page.
3. The task is still there.

### Why this works

- `useState` initializes from storage on the first render.
- Every change to `tasks` triggers the effect, which writes the new array.
- `JSON.stringify` converts the array to a string; `JSON.parse` restores it.

### What not to do

```jsx
// ❌ Storing a filtered list loses tasks that were hidden
localStorage.setItem(KEY, JSON.stringify(visibleTasks))

// ❌ Writing on every render without a dependency array
useEffect(() => {
  localStorage.setItem(KEY, JSON.stringify(tasks))
})
```

---

## 3. Search and filters

Add two pieces of UI state:

```jsx
const [query, setQuery] = useState('')
const [filter, setFilter] = useState('all') // all | open | done
```

Compute the visible list during render:

```jsx
const visibleTasks = tasks.filter((task) => {
  const matchesQuery = task.title
    .toLowerCase()
    .includes(query.toLowerCase())

  const matchesFilter =
    filter === 'all' ||
    (filter === 'open' && !task.completed) ||
    (filter === 'done' && task.completed)

  return matchesQuery && matchesFilter
})
```

Render `visibleTasks`, but keep saving `tasks`.

### Derived state rule

If a value can be computed from props or state, **compute it during render**.
Do not put it in state and try to keep it in sync.

```jsx
// ❌ two sources of truth
const [visibleTasks, setVisibleTasks] = useState(tasks)
useEffect(() => {
  setVisibleTasks(tasks.filter(...))
}, [tasks, query, filter])

// ✅ one source of truth
const visibleTasks = tasks.filter(...)
```

The second version is shorter, faster, and cannot drift.

### Counts and empty states

```jsx
const openCount = tasks.filter((task) => !task.completed).length
const doneCount = tasks.length - openCount
const isFiltering = query !== '' || filter !== 'all'
```

Show different empty messages:

```jsx
{visibleTasks.length === 0 ? (
  <p className="empty-state">
    {isFiltering
      ? 'No tasks match your search.'
      : 'Nothing here yet. Add your first task.'}
  </p>
) : (
  <TaskList ... />
)}
```

This is a small detail that makes an app feel finished.

---

## 4. Document title with cleanup

```jsx
useEffect(() => {
  const previousTitle = document.title
  document.title = `${openCount} open · TaskFlow`

  return () => {
    document.title = previousTitle
  }
}, [openCount])
```

The cleanup runs before the next effect and on unmount. Here it prevents the
title from being permanently overwritten if the component disappears.

---

## 5. Effects you do **not** need

A common beginner habit is to use an effect for everything. Avoid these:

```jsx
// ❌ Derived value in state via effect
useEffect(() => {
  setOpenCount(tasks.filter((task) => !task.completed).length)
}, [tasks])

// ✅ Just calculate it
const openCount = tasks.filter((task) => !task.completed).length
```

```jsx
// ❌ Synchronizing a prop to state
useEffect(() => {
  setQuery(initialQuery)
}, [initialQuery])

// ✅ Use the prop directly, or key the component
```

```jsx
// ❌ Responding to a click with an effect
useEffect(() => {
  if (submitted) addTask()
}, [submitted])

// ✅ Do it in the event handler
function handleSubmit() {
  addTask()
}
```

Use effects only to synchronize with something **outside React** — storage,
network, browser APIs, subscriptions.

---

## 6. Project step

Add to TaskFlow:

1. `src/lib/storage.js` with the versioned key.
2. Lazy `useState` initialization from `localStorage`.
3. A `useEffect` that saves tasks whenever they change.
4. A search input bound to `query`.
5. Filter buttons: **All**, **Open**, **Done**.
6. `visibleTasks` computed during render.
7. A "Clear completed" button.
8. An empty state that changes when a filter is active.
9. Update the summary counts to use `tasks`, not `visibleTasks`.

Test the full flow:

- Add three tasks.
- Complete one.
- Refresh — state survives.
- Search for part of a title.
- Switch filters.
- Clear completed.
- Refresh again.

---

## Common mistakes

| Mistake | Symptom | Fix |
| --- | --- | --- |
| `useState(loadTasks())` | Runs on every render | Pass `loadTasks` |
| Missing dependency | Effect uses stale data | Add the value; follow the lint rule |
| Object/array dependency created in render | Effect loops | Depend on a primitive or memoize |
| Storing derived data | List goes out of sync | Compute during render |
| Saving filtered data | Tasks disappear after refresh | Save the full `tasks` array |
| No `try/catch` around `JSON.parse` | White screen after corrupt storage | Guard and fall back |
| Writing to storage on every render | Performance problems | Add `[tasks]` |
| Forgetting cleanup for listeners | Duplicate handlers | Return a cleanup function |

---

## Assignment

[`assignments/week-03/README.md`](../assignments/week-03/README.md)

Add persistence, search, filters, clear-completed, and a dynamic title. The
assignment checks that you did **not** store derived state.

**Stretch:** debounce the search input by 300 ms and explain the cleanup.

---

## Recap

- Effects synchronize React with the outside world.
- The dependency array controls when an effect runs.
- Clean up subscriptions, timers, and requests.
- Initialize state lazily from storage.
- Derive filtered lists and counts during render.
- Keep one source of truth.

### Check yourself

1. Why is `useState(loadTasks)` different from `useState(loadTasks())`?
2. When does a `useEffect` cleanup function run?
3. Why should you not save the filtered list to localStorage?
4. Which of these needs an effect: setting the title, filtering a list,
   subscribing to `resize`?

---

## Resources

- [React: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React: `useEffect`](https://react.dev/reference/react/useEffect)
- [MDN: `localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN: `JSON`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
