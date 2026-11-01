# React cheat sheet

One page for the concepts used in this course.

---

## Commands

```bash
npm install              # install dependencies
npm run dev              # dev server (http://localhost:5173)
npm test                 # run tests once
npm run test:watch       # watch tests
npm run lint             # lint
npm run build            # production build to dist/
npm run preview          # preview the production build
```

---

## Components and JSX

```jsx
// A component is a function returning JSX
export default function TaskItem({ task, onToggle, children }) {
  const label = task.completed ? 'Done' : 'Open'

  return (
    <li className={task.completed ? 'task is-done' : 'task'}>
      <h2>{task.title}</h2>
      <p>{label}</p>
      {children}
    </li>
  )
}
```

```jsx
// Composition
<Panel title="Today">
  <TaskList />
</Panel>
```

Rules: one parent, close tags, `className`, `{expressions}`, camelCase props.

---

## State

```jsx
const [count, setCount] = useState(0)

setCount(count + 1)              // fine for simple updates
setCount((current) => current + 1) // safe when depending on previous state
```

```jsx
// Array updates
setItems((current) => [...current, item])              // add
setItems((current) => current.filter((x) => x.id !== id)) // remove
setItems((current) =>
  current.map((x) => (x.id === id ? { ...x, done: true } : x)),
)                                                       // update
```

Never mutate:

```jsx
items.push(item)          // ❌
item.done = true          // ❌
```

---

## Events and forms

```jsx
function handleSubmit(event) {
  event.preventDefault()
  if (!title.trim()) return
  onAdd(title)
  setTitle('')
}

<form onSubmit={handleSubmit}>
  <label htmlFor="title">Title</label>
  <input
    id="title"
    value={title}
    onChange={(event) => setTitle(event.target.value)}
  />
  <button type="submit" disabled={!title.trim()}>
    Add
  </button>
</form>
```

```jsx
<button onClick={handleClick}>Run</button>        // pass the function
<button onClick={() => remove(id)}>Delete</button> // pass an argument
```

---

## Lists and conditions

```jsx
{tasks.map((task) => (
  <TaskItem key={task.id} task={task} />
))}

{tasks.length === 0 ? (
  <EmptyState />
) : (
  <TaskList tasks={tasks} />
)}

{isLoading && <Spinner />}
{error && <p role="alert">{error}</p>}
{count > 0 && <Badge>{count}</Badge>}
```

Keys must be unique and stable. Avoid the array index for reorderable lists.

---

## Effects

```jsx
useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}, [tasks])
```

```jsx
useEffect(() => {
  const controller = new AbortController()

  fetch('/api/tasks', { signal: controller.signal })
    .then((response) => response.json())
    .then(setTasks)
    .catch((error) => {
      if (error.name !== 'AbortError') setError(error.message)
    })

  return () => controller.abort()
}, [])
```

```jsx
useEffect(() => {
  document.title = `${openCount} open · TaskFlow`
}, [openCount])
```

Use effects for external systems only. Derive values during render.

---

## Custom hooks

```js
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored === null ? initialValue : JSON.parse(stored)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn('Storage write failed', error)
    }
  }, [key, value])

  return [value, setValue]
}
```

Rules: start with `use`, call at top level, keep focused.

---

## Reducer

```js
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
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}
```

```jsx
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

dispatch({ type: 'added', task: newTask })
```

Pure: no mutation, no side effects, always return the next state.

---

## Context

```jsx
// TasksContext.js
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

```jsx
// TasksProvider.jsx
const value = useMemo(() => ({ tasks, addTask, toggleTask }), [tasks])

return (
  <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
)
```

Use context for shared, app-wide concerns. Prefer props for local data.

---

## Router

```jsx
// main.jsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

```jsx
<Routes>
  <Route element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="tasks/:taskId" element={<TaskDetailPage />} />
    <Route path="stats" element={<StatsPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
</Routes>
```

```jsx
<Link to="/stats">Stats</Link>
<NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
  Home
</NavLink>
```

```jsx
const { taskId } = useParams()
const [searchParams, setSearchParams] = useSearchParams()
const filter = searchParams.get('filter') ?? 'all'
```

Deploying? Add an SPA rewrite to `index.html`.

---

## Fetch

```js
export async function fetchTasks({ signal } = {}) {
  const response = await fetch('/api/tasks', { signal })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return response.json()
}
```

```jsx
const [status, setStatus] = useState('idle')
const [error, setError] = useState(null)

async function load() {
  setStatus('loading')
  try {
    const data = await fetchTasks()
    setTasks(data)
    setStatus('success')
  } catch (err) {
    setError(err.message)
    setStatus('error')
  }
}
```

States: idle, loading, success, error. `fetch` does not throw on 404/500.

---

## Accessible UI

```jsx
<label htmlFor="search">Search tasks</label>
<input id="search" type="search" value={query} onChange={...} />
```

```jsx
<button type="button" aria-label={`Delete ${task.title}`}>
  ×
</button>
```

```jsx
<button aria-pressed={filter === 'open'} onClick={() => setFilter('open')}>
  Open
</button>
```

```jsx
<p role="status">{count} tasks left</p>
<p role="alert">{error}</p>
```

```jsx
<a className="skip-link" href="#main">Skip to content</a>
<main id="main" tabIndex={-1}>...</main>
```

---

## Testing

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'

it('adds a task', async () => {
  const user = userEvent.setup()
  const onAdd = vi.fn()

  render(<TaskForm onAdd={onAdd} />)

  await user.type(screen.getByLabelText(/task title/i), 'Write tests')
  await user.click(screen.getByRole('button', { name: /add task/i }))

  expect(onAdd).toHaveBeenCalledWith('Write tests', 'medium')
})
```

Query order: role → label → placeholder → text → test id.

---

## Git workflow

```bash
git switch main
git pull
git switch -c week-03/your-name

git add .
git commit -m "week 03: persist tasks"
git push -u origin week-03/your-name
```

Before every PR:

```bash
npm run lint && npm test && npm run build
```

---

## Debugging order

1. Read the first error, not the last.
2. Check the file path and the export/import name.
3. `console.log` the props/state, then remove the log.
4. React DevTools → Components → inspect props and hooks.
5. Comment out the newest change; reintroduce it slowly.
6. Restart the dev server.
7. Ask for help with the exact error and a minimal reproduction.
