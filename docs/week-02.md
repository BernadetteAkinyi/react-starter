# Week 2 — State, events, and forms

> **Goal:** Make TaskFlow interactive: add tasks, complete tasks, delete tasks,
> and keep the UI in sync with state.

**Time:** 7–9 hours · **Project:** Working in-memory task manager ·
**Assignment:** [Week 2](../assignments/week-02/README.md)

---

## New concepts

| Concept | Meaning |
| --- | --- |
| State | Data that belongs to a component and can change over time |
| `useState` | The hook that gives a component state |
| Event handler | A function that runs in response to a user action |
| Controlled input | An input whose value comes from state |
| Immutable update | Creating a new array/object instead of mutating the old one |
| Derived value | A value calculated from state instead of stored separately |
| Conditional rendering | Showing different UI for different states |

---

## 1. Why state?

Props come from the parent. **State** belongs to the component and can change.
When state changes, React re-renders the component with the new value.

```jsx
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}
```

`useState(0)` returns an array with two items:

1. the current value (`count`)
2. a setter function (`setCount`)

Never assign to state directly:

```jsx
count = count + 1        // ❌ nothing re-renders
setCount(count + 1)      // ✅ React schedules a re-render
```

---

## 2. Event handlers

```jsx
function handleClick() {
  console.log('clicked')
}

<button onClick={handleClick}>Save</button>       // ✅ pass the function
<button onClick={handleClick()}>Save</button>     // ❌ calls it immediately
<button onClick={() => handleClick()}>Save</button> // ✅ arrow wrapper
```

Use an arrow wrapper when you need to pass an argument:

```jsx
<button onClick={() => deleteTask(task.id)}>Delete</button>
```

### The event object

```jsx
function handleChange(event) {
  console.log(event.target.value)
}

<input onChange={handleChange} />
```

For forms, prevent the browser's default full-page reload:

```jsx
function handleSubmit(event) {
  event.preventDefault()
  // handle the form
}
```

---

## 3. Move tasks into state

Open `src/App.jsx`. Replace the static import usage with state.

```jsx
import { useState } from 'react'
import { seedTasks } from './data/seedTasks.js'

export default function App() {
  const [tasks, setTasks] = useState(seedTasks)

  // ...
}
```

`seedTasks` is now only the **initial** value. After the first render, `tasks` is
controlled by `setTasks`.

Keep the import: in Week 3, `seedTasks` becomes the fallback when there is
nothing saved in `localStorage` yet.

---

## 4. Adding a task

### Immutable updates

Never push into state:

```jsx
tasks.push(newTask)      // ❌ React does not see a new array
setTasks(tasks)          // ❌ same reference
```

Create a new array:

```jsx
setTasks((current) => [...current, newTask]) // ✅
```

The updater function form is safer when the next state depends on the previous
state.

### The add function

```jsx
function addTask(title, priority) {
  const trimmed = title.trim()

  if (!trimmed) return

  const newTask = {
    id: crypto.randomUUID(),
    title: trimmed,
    completed: false,
    priority,
    due: 'Today',
  }

  setTasks((current) => [newTask, ...current])
}
```

`crypto.randomUUID()` is available in all modern browsers and in Node 19+.

---

## 5. The controlled form

Create `src/components/TaskForm.jsx`:

```jsx
import { useState } from 'react'

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')

  function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim()) return

    onAdd(title, priority)
    setTitle('')
    setPriority('medium')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="task-title">
        Task title
      </label>
      <input
        id="task-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs doing?"
        autoComplete="off"
      />

      <label className="sr-only" htmlFor="task-priority">
        Priority
      </label>
      <select
        id="task-priority"
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <button type="submit" disabled={!title.trim()}>
        Add task
      </button>
    </form>
  )
}
```

Why both `value` and `onChange`? Because it is a **controlled input**: React is
the single source of truth. If you provide `value` without `onChange`, the input
becomes read-only and React warns.

In `App.jsx`:

```jsx
import TaskForm from './components/TaskForm.jsx'

<TaskForm onAdd={addTask} />
```

`TaskForm` owns the draft text. `App` owns the tasks. Each piece of state lives
where it is needed. That is called **lifting state up** — but only as far as
necessary.

---

## 6. Toggling and deleting

Pass callbacks down to `TaskItem` through `TaskList`:

```jsx
// App.jsx
function toggleTask(id) {
  setTasks((current) =>
    current.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    ),
  )
}

function deleteTask(id) {
  setTasks((current) => current.filter((task) => task.id !== id))
}
```

```jsx
// App.jsx
<TaskList
  tasks={tasks}
  onToggle={toggleTask}
  onDelete={deleteTask}
/>
```

```jsx
// TaskList.jsx
export default function TaskList({ tasks, onToggle, onDelete }) {
  // ...
  <TaskItem
    key={task.id}
    task={task}
    onToggle={onToggle}
    onDelete={onDelete}
  />
}
```

```jsx
// TaskItem.jsx
export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={task.completed ? 'task is-done' : 'task'}>
      <input
        className="task-check"
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.title}" as ${
          task.completed ? 'open' : 'done'
        }`}
      />

      {/* ...task text... */}

      <button
        className="icon-button"
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete "${task.title}"`}
      >
        ×
      </button>
    </li>
  )
}
```

Note: `checked` with `onChange` is fine. `checked` without `onChange` or
`readOnly` produces a React warning.

### Removing vs. keeping

```jsx
// remove completely
setTasks((current) => current.filter((task) => task.id !== id))

// keep the item but mark it deleted
setTasks((current) =>
  current.map((task) =>
    task.id === id ? { ...task, deleted: true } : task,
  ),
)
```

For TaskFlow, remove completely.

---

## 7. Derived values

Do not store the counts in state. Calculate them:

```jsx
const openCount = tasks.filter((task) => !task.completed).length
const doneCount = tasks.length - openCount
```

State should be the **minimum** data needed. Counts, filtered lists, and
percentages can always be computed from `tasks`. Storing them creates two sources
of truth that can drift apart.

---

## 8. Conditional rendering

```jsx
{tasks.length === 0 ? (
  <p className="empty-state">Nothing here yet. Add your first task.</p>
) : (
  <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
)}
```

Other patterns:

```jsx
{isLoading && <Spinner />}
{error && <p role="alert">{error}</p>}
{user ? <Dashboard /> : <Login />}
```

`0 && <p>` renders `0`. Use `count > 0 &&` when the left side can be `0`.

---

## 9. Project step

Wire everything into TaskFlow:

1. Move `tasks` into `useState`.
2. Add `TaskForm` with a controlled title and priority.
3. Add `addTask`, `toggleTask`, and `deleteTask`.
4. Pass callbacks through `TaskList` to `TaskItem`.
5. Show the empty state when there are no tasks.
6. Recalculate the stats from state instead of `seedTasks`.
7. Add a "Clear completed" button.

```jsx
function clearCompleted() {
  setTasks((current) => current.filter((task) => !task.completed))
}
```

Do not add localStorage yet. That is Week 3. Refresh the page and confirm the
tasks reset — that is expected for now.

---

## Common mistakes

| Mistake | Symptom | Fix |
| --- | --- | --- |
| Mutating state | UI does not update | Spread into a new array/object |
| `onClick={handleClick()}` | Runs on render, not click | Pass `handleClick` or wrap in an arrow |
| `value` without `onChange` | Input is read-only, warning | Add `onChange` |
| `checked` without `onChange`/`readOnly` | React warning | Add `onChange` or `readOnly` |
| `key={index}` | Toggling the wrong row | Use `task.id` |
| State set in render | Infinite loop | Call setters in event handlers/effects |
| Storing counts in state | Numbers drift out of sync | Derive them from `tasks` |
| Form reloads the page | State resets | `event.preventDefault()` |
| Stale state in async code | Wrong values | Use the updater form |

---

## Assignment

[`assignments/week-02/README.md`](../assignments/week-02/README.md)

Build full in-memory CRUD, validation, counts, empty state, and clear-completed.
No persistence yet.

**Stretch:** inline editing with an "Edit" button, or sorting by priority.

---

## Recap

- State belongs to a component; props come from the parent.
- Setters trigger re-renders; direct mutation does not.
- Update arrays and objects immutably.
- Controlled inputs need `value` and `onChange`.
- Derive values instead of storing duplicates.
- Pass callbacks down so children can request changes.

### Check yourself

1. Why does `tasks.push()` not update the screen?
2. What does the updater form `setTasks(current => ...)` protect against?
3. Where should the draft input value live, and why?
4. How does `TaskItem` delete a task without owning the task list?

---

## Resources

- [React: State — A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [React: Adding Interactivity](https://react.dev/learn/adding-interactivity)
- [React: Updating Objects in State](https://react.dev/learn/updating-objects-in-state)
- [React: Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)
- [React: Responding to Events](https://react.dev/learn/responding-to-events)
- [React: `useState`](https://react.dev/reference/react/useState)
