# Week 4 — Architecture: custom hooks, Context, and reducers

> **Goal:** Refactor TaskFlow so state logic lives in one place, components stay
> small, and no one has to pass props through five layers.

**Time:** 7–9 hours · **Project:** Refactored TaskFlow with theme support ·
**Assignment:** [Week 4](../assignments/week-04/README.md)

---

## New concepts

| Concept | Meaning |
| --- | --- |
| Lifting state | Moving shared state to the closest common parent |
| Prop drilling | Passing props through components that do not use them |
| Custom hook | A function starting with `use` that reuses stateful logic |
| Context | A way to share a value with a subtree without prop drilling |
| Provider | A component that supplies a context value |
| Reducer | A pure function `(state, action) => nextState` |
| `useReducer` | A hook for state that changes through named actions |
| Derived provider value | Memoizing the object passed to a provider |

---

## 1. The problem with prop drilling

Right now `App` owns tasks and passes callbacks down:

```text
App
└── TaskList          (receives tasks, onToggle, onDelete)
    └── TaskItem      (receives task, onToggle, onDelete)
```

This is fine at two levels. But add routing, a stats page, and a detail page, and
every new screen needs the same props. Components in the middle become couriers
for data they never use.

There are three tools:

1. **Lift state** to the closest common parent. (Already done.)
2. **Compose** with `children` to avoid intermediate components.
3. **Context** when many distant components need the same data.

Context is not a replacement for props. Use props for local, explicit data. Use
context for app-wide concerns: current user, theme, task store, notifications.

---

## 2. Custom hooks

A custom hook is just a function that calls other hooks. It lets you extract and
reuse logic without changing the component tree.

### `useLocalStorage`

Create `src/hooks/useLocalStorage.js`:

```js
import { useEffect, useState } from 'react'

function readValue(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    if (stored === null) {
      return typeof fallback === 'function' ? fallback() : fallback
    }
    return JSON.parse(stored)
  } catch (error) {
    console.warn(`Could not read "${key}" from localStorage`, error)
    return typeof fallback === 'function' ? fallback() : fallback
  }
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue))

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Could not save "${key}" to localStorage`, error)
    }
  }, [key, value])

  return [value, setValue]
}
```

Use it for the theme:

```jsx
const [theme, setTheme] = useLocalStorage('taskflow.theme', 'light')
```

Rules for custom hooks:

- The name must start with `use`.
- Call hooks at the top level, never inside conditions or loops.
- Return what the caller needs — a value, a setter, or an object.
- Keep it focused. `useLocalStorage` should not also fetch data.

---

## 3. Reducers

When state has several related transitions, a reducer makes them explicit.

```js
// src/state/tasksReducer.js
export function tasksReducer(state, action) {
  switch (action.type) {
    case 'added':
      return [action.task, ...state]

    case 'toggled':
      return state.map((task) =>
        task.id === action.id
          ? { ...task, completed: !task.completed }
          : task,
      )

    case 'deleted':
      return state.filter((task) => task.id !== action.id)

    case 'cleared':
      return state.filter((task) => !task.completed)

    case 'imported': {
      const existingIds = new Set(state.map((task) => task.id))
      const fresh = action.tasks.filter((task) => !existingIds.has(task.id))
      return [...fresh, ...state]
    }

    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}
```

The reducer is a **pure function**:

- same input → same output
- no `fetch`, no `localStorage`, no `Date.now()` inside
- never mutate `state`
- always return a new array/object when something changes

Actions are plain objects:

```js
dispatch({ type: 'added', task: newTask })
dispatch({ type: 'toggled', id: task.id })
dispatch({ type: 'deleted', id: task.id })
dispatch({ type: 'cleared' })
```

### `useReducer` vs `useState`

Use `useState` for one or two independent values. Use `useReducer` when:

- several actions change the same state
- the next state depends on the previous state in complex ways
- you want to test state transitions without rendering
- you want the UI to dispatch events instead of computing updates

You can use both in one app. TaskFlow uses `useReducer` for tasks and
`useState`/`useLocalStorage` for UI settings.

### A reducer that persists

Create `src/hooks/useLocalStorageReducer.js`:

```js
import { useEffect, useReducer } from 'react'

function readValue(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored === null ? fallback : JSON.parse(stored)
  } catch (error) {
    console.warn(`Could not read "${key}" from localStorage`, error)
    return fallback
  }
}

export function useLocalStorageReducer(key, reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState, (fallback) =>
    readValue(key, fallback),
  )

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      console.warn(`Could not save "${key}" to localStorage`, error)
    }
  }, [key, state])

  return [state, dispatch]
}
```

This combines the two ideas: a reducer owns transitions; the hook persists the
result.

---

## 4. Context

Context has three parts:

1. `createContext` — creates the channel.
2. A provider — supplies a value to its subtree.
3. `useContext` — reads the nearest value above.

### Create the context

`src/context/TasksContext.js`:

```js
import { createContext, useContext } from 'react'

export const TasksContext = createContext(null)

export function useTasks() {
  const value = useContext(TasksContext)

  if (value === null) {
    throw new Error('useTasks must be used inside <TasksProvider>')
  }

  return value
}
```

The guard turns a confusing `undefined` error into a clear message.

### Create the provider

`src/context/TasksProvider.jsx`:

```jsx
import { useMemo } from 'react'
import { TasksContext } from './TasksContext.js'
import { useLocalStorageReducer } from '../hooks/useLocalStorageReducer.js'
import { tasksReducer } from '../state/tasksReducer.js'
import { seedTasks } from '../data/seedTasks.js'

const STORAGE_KEY = 'taskflow.tasks.v1'

export default function TasksProvider({ children }) {
  const [tasks, dispatch] = useLocalStorageReducer(
    STORAGE_KEY,
    tasksReducer,
    seedTasks,
  )

  const value = useMemo(
    () => ({
      tasks,
      addTask(title, priority) {
        const trimmed = title.trim()
        if (!trimmed) return

        dispatch({
          type: 'added',
          task: {
            id: crypto.randomUUID(),
            title: trimmed,
            completed: false,
            priority,
            due: 'Today',
          },
        })
      },
      toggleTask(id) {
        dispatch({ type: 'toggled', id })
      },
      deleteTask(id) {
        dispatch({ type: 'deleted', id })
      },
      clearCompleted() {
        dispatch({ type: 'cleared' })
      },
      importTasks(tasks) {
        dispatch({ type: 'imported', tasks })
      },
    }),
    [tasks],
  )

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  )
}
```

Why `useMemo`? Without it, `value` is a new object on every provider render,
which makes every consumer re-render even when `tasks` did not change. The
provider only re-renders when its own state or parent changes, so this is a small
optimisation — but it is a good habit.

### Consume the context

```jsx
import { useTasks } from '../context/TasksContext.js'

export default function TaskList() {
  const { tasks, toggleTask, deleteTask } = useTasks()
  // ...
}
```

No more `tasks`, `onToggle`, and `onDelete` props. Components ask for what they
need.

### Provider composition

`src/App.jsx` becomes:

```jsx
import TasksProvider from './context/TasksProvider.jsx'
import ThemeProvider from './context/ThemeProvider.jsx'
import Layout from './components/Layout.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <Layout />
      </TasksProvider>
    </ThemeProvider>
  )
}
```

Order matters only if one provider needs the other. Theme and tasks are
independent here.

---

## 5. Theme context

`src/context/ThemeContext.js`:

```js
import { createContext, useContext } from 'react'

export const ThemeContext = createContext(null)

export function useTheme() {
  const value = useContext(ThemeContext)
  if (value === null) {
    throw new Error('useTheme must be used inside <ThemeProvider>')
  }
  return value
}
```

`src/context/ThemeProvider.jsx`:

```jsx
import { useEffect } from 'react'
import { ThemeContext } from './ThemeContext.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('taskflow.theme', 'light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

Add dark tokens to `src/styles.css`:

```css
:root[data-theme='dark'] {
  --paper: #171512;
  --paper-deep: #211e19;
  --card: #211e19;
  --ink: #f3ede2;
  --muted: #b5aa99;
  --line: #3a342b;
  --accent: #f07a52;
  --accent-soft: #42251c;
  --shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
}
```

The rest of the CSS already uses variables, so the theme switches without
rewriting components. This is the payoff of a design-token system.

---

## 6. Keyboard shortcut with a ref

Give the search input an `id` or a ref, then listen for `/`:

```jsx
import { useEffect, useRef } from 'react'

export default function SearchBar() {
  const inputRef = useRef(null)

  useEffect(() => {
    function handleKeyDown(event) {
      const isTyping =
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement

      if (event.key === '/' && !isTyping) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return <input ref={inputRef} type="search" aria-label="Search tasks" />
}
```

`useRef` gives you a stable reference to a DOM node without causing re-renders.
The `isTyping` check prevents the shortcut from stealing a `/` typed in a field.

---

## 7. Project step

Refactor TaskFlow:

1. Add `useLocalStorage`.
2. Add `tasksReducer` and `useLocalStorageReducer`.
3. Add `TasksContext`, `TasksProvider`, and `useTasks`.
4. Remove task props from `TaskList` and `TaskItem`; read from context.
5. Add `ThemeProvider` and a working theme button in the header.
6. Persist the theme choice.
7. Add the `/` search shortcut and `Escape` to clear the search.
8. Keep `TaskForm` receiving `onAdd` as a prop — it is local to the page and does
   not need context.

The UI should look the same, but the architecture is now ready for routing and
API data.

---

## Common mistakes

| Mistake | Symptom | Fix |
| --- | --- | --- |
| Calling `useContext` outside the provider | `useTasks must be used inside...` | Move the component inside the provider |
| Provider value is a new object every render | Unnecessary re-renders | `useMemo` the value |
| Mutating state in a reducer | UI does not update | Return new arrays/objects |
| Side effects inside a reducer | Hard-to-reproduce bugs | Keep reducers pure |
| Using context for everything | Components become hard to reuse | Prefer props for local data |
| Forgetting `return` in a reducer case | State becomes `undefined` | Return in every branch |
| Adding a hook inside an `if` | "Rendered fewer hooks than expected" | Hooks at the top level |
| Using `useRef` for visible data | UI does not update | Use state for rendered values |

---

## Assignment

[`assignments/week-04/README.md`](../assignments/week-04/README.md)

Refactor to Context + reducer, persist the theme, add the keyboard shortcut, and
prove there is no task prop drilling left.

**Stretch:** write unit tests for `tasksReducer` — every action, including the
default error case.

---

## Recap

- Custom hooks extract reusable stateful logic.
- Context shares a value with a subtree and removes prop drilling.
- Reducers make state transitions explicit and testable.
- Provider values should be stable when consumers depend on them.
- Theme switching is easy when styles use CSS variables.
- Refs access DOM nodes without causing renders.

### Check yourself

1. When is context the right tool, and when is a prop better?
2. Why must a reducer be pure?
3. What does `useMemo` around a provider value prevent?
4. What happens if a component calls `useTasks` outside `TasksProvider`?

---

## Resources

- [React: Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React: Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React: Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)
- [React: `useReducer`](https://react.dev/reference/react/useReducer)
- [React: Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)
