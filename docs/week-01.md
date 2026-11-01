# Week 1 — Think in components

> **Goal:** Understand how React turns data into UI, and split a page into
> reusable components that receive data through props.

**Time:** 6–8 hours · **Project:** Static TaskFlow UI · **Assignment:**
[Week 1](../assignments/week-01/README.md)

---

## New concepts

| Concept | Meaning |
| --- | --- |
| React | A library for building user interfaces from small, reusable pieces |
| Component | A JavaScript function that returns JSX |
| JSX | HTML-like syntax that compiles to JavaScript function calls |
| Props | Read-only data passed from a parent component to a child |
| Composition | Building a page by nesting components inside each other |
| Rendering | React calling your components and updating the DOM to match |
| `key` | A stable identity for each item in a rendered list |

---

## 1. How React thinks

A React app is a tree of components.

```text
App
├── Header
└── main
    ├── Hero
    └── TaskList
        ├── TaskItem
        ├── TaskItem
        └── TaskItem
```

Each component is a function. It receives **props** and returns **JSX**. React
calls the function, compares the result with the previous result, and updates
only the parts of the page that changed.

You do not manually create DOM nodes or call `appendChild`. You describe what the
UI should look like for the current data, and React handles the DOM.

### The mental model

```text
UI = f(state)
```

Right now TaskFlow has no state, so the UI is fixed. From Week 2 onward, the same
components will render different output as state changes. Everything you learn
this week is the foundation for that.

---

## 2. Run the starter

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. You should see:

- A header with the TaskFlow brand
- The headline "Make room for what matters."
- Three summary numbers
- Four sample tasks

Open `src/App.jsx`. Find this line:

```jsx
<TaskList tasks={seedTasks} />
```

`TaskList` is a component. `tasks` is a prop. `seedTasks` is the value passed to
it. Follow the data into `src/components/TaskList.jsx`:

```jsx
export default function TaskList({ tasks }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}
```

Then into `TaskItem.jsx`, which receives one `task`:

```jsx
export default function TaskItem({ task }) {
  return <li>{task.title}</li>
}
```

**Data flows down.** `App` → `TaskList` → `TaskItem`. A child never reaches up
and changes its parent's data.

---

## 3. JSX rules

JSX looks like HTML, but it is JavaScript. Five rules cover 95% of beginner
errors.

### Rule 1: Return one parent element

```jsx
// ❌ Two siblings at the top level
return (
  <h1>Hello</h1>
  <p>Welcome</p>
)

// ✅ Wrap them
return (
  <div>
    <h1>Hello</h1>
    <p>Welcome</p>
  </div>
)

// ✅ Or use a fragment when you do not need a wrapper element
return (
  <>
    <h1>Hello</h1>
    <p>Welcome</p>
  </>
)
```

### Rule 2: Close every tag

```jsx
<img src="/logo.png" alt="TaskFlow" />
<input type="text" />
<br />
```

### Rule 3: Use `className`, not `class`

```jsx
<p className="lede">...</p>
```

### Rule 4: Put JavaScript in curly braces

```jsx
const name = 'Amara'

return (
  <div>
    <h1>Hello, {name}</h1>
    <p>You have {3 + 2} tasks.</p>
    <img src={user.avatar} alt="" />
  </div>
)
```

### Rule 5: Attributes use camelCase

```jsx
<button onClick={handleClick} tabIndex={-1}>
  Save
</button>
```

---

## 4. Components and props

Create a file `src/components/Greeting.jsx`:

```jsx
export default function Greeting({ name, role }) {
  return (
    <div className="greeting">
      <h2>Hello, {name}</h2>
      <p>{role}</p>
    </div>
  )
}
```

Use it in `App.jsx`:

```jsx
import Greeting from './components/Greeting.jsx'

// inside the returned JSX:
<Greeting name="Amara" role="Frontend learner" />
```

Props are **read-only**. This is a mistake:

```jsx
function Greeting({ name }) {
  name = name.toUpperCase() // ❌ never mutate props
  return <h2>{name}</h2>
}
```

Create a new value instead:

```jsx
function Greeting({ name }) {
  const displayName = name.toUpperCase() // ✅
  return <h2>{displayName}</h2>
}
```

### Default props

```jsx
function Badge({ label = 'New' }) {
  return <span className="pill">{label}</span>
}
```

### The `children` prop

Anything between a component's opening and closing tags arrives as `children`:

```jsx
function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

// usage
<Panel title="Today">
  <TaskList tasks={seedTasks} />
</Panel>
```

This is **composition**, and it is how you avoid giant components.

---

## 5. Lists and keys

```jsx
<ul>
  {tasks.map((task) => (
    <TaskItem key={task.id} task={task} />
  ))}
</ul>
```

The `key` must be:

- **unique** among siblings
- **stable** across renders

Use a database id or `crypto.randomUUID()`. Do **not** use the array index when
items can be added, removed, or reordered — React will associate the wrong state
with the wrong row.

---

## 6. Guided build: extract the stats

`App.jsx` currently renders the stats markup inline. Extract it into a
component so `App` stays readable.

### Step 1 — Create `src/components/Stats.jsx`

```jsx
export default function Stats({ total, open, done }) {
  return (
    <div className="stats" aria-label="Task summary">
      <div className="stat">
        <strong>{total}</strong>
        <span>total</span>
      </div>
      <div className="stat">
        <strong>{open}</strong>
        <span>open</span>
      </div>
      <div className="stat">
        <strong>{done}</strong>
        <span>done</span>
      </div>
    </div>
  )
}
```

### Step 2 — Import it in `App.jsx`

```jsx
import Stats from './components/Stats.jsx'
```

### Step 3 — Replace the inline `<div className="stats">...</div>` block

```jsx
<Stats
  total={seedTasks.length}
  open={openCount}
  done={doneCount}
/>
```

### Step 4 — Check the browser

The page should look identical. That is the point: you changed the structure
without changing the output.

### Step 5 — Inspect it in React DevTools

Open the **Components** tab. Select `Stats`. You should see:

```text
props
  total: 4
  open: 3
  done: 1
```

Change one of the seed tasks to `completed: true` and watch the numbers update.
This is React rendering data.

---

## 7. Project step

Complete the guided build, then do these small tasks in TaskFlow:

1. Change the hero headline to something you like. Keep it short.
2. Add `id="about"` to the footer so the header's "About" link scrolls there.
3. Add a fifth seed task about your own goal for this course.
4. In `TaskItem`, render the priority with a capital first letter. A small helper
   is enough:

```jsx
const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
```

5. Read every file in `src/` once. Write one sentence in your own words about
   what each file does.

---

## Common mistakes

| Mistake | Symptom | Fix |
| --- | --- | --- |
| Using `class` | Console warning, no styles | Use `className` |
| Returning two top-level elements | "Adjacent JSX elements must be wrapped" | Wrap in `<>...</>` |
| Forgetting to export | "Module has no default export" | Add `export default` |
| Import path typo | "Failed to resolve import" | Check `./`, file name, and extension |
| Mutating props | UI does not update / warning | Create a new value |
| `key={index}` on reorderable lists | Wrong task toggles | Use `task.id` |
| Calling a component as a function | Hooks and rendering break later | Use `<Component />`, not `{Component()}` |

---

## Assignment

[`assignments/week-01/README.md`](../assignments/week-01/README.md)

Build a `ProfileCard`, extract `Footer`, pass props, and add two tasks. The
assignment is graded on component structure and whether the page still passes
lint, tests, and build.

**Stretch:** create a reusable `Badge` component and use it for both priority and
task count.

---

## Recap

You learned:

- React is a tree of functions that return JSX.
- Props pass data **down**; they are read-only.
- JSX has rules: one parent, closed tags, `className`, braces, camelCase.
- Lists need stable keys.
- Composition with `children` keeps components flexible.

### Check yourself

Without looking:

1. What is the difference between a component and a prop?
2. Why is `key={index}` risky?
3. How does data get from `App` to `TaskItem`?
4. What does `children` contain?

If you can answer all four, you are ready for state.

---

## Resources

- [React: Describing the UI](https://react.dev/learn/describing-the-ui)
- [React: Your First Component](https://react.dev/learn/your-first-component)
- [React: Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React: Rendering Lists](https://react.dev/learn/rendering-lists)
- [MDN: JSX](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/JSX)
