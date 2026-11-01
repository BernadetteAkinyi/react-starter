# Week 6 — Routing and multi-page UX

> **Goal:** Turn TaskFlow from one screen into a real multi-page app with URLs
> you can share, bookmark, and refresh.

**Time:** 7–9 hours · **Project:** Routed TaskFlow ·
**Assignment:** [Week 6](../assignments/week-06/README.md)

---

## New concepts

| Concept | Meaning |
| --- | --- |
| Client-side routing | Changing views without a full page reload |
| `BrowserRouter` | Keeps the URL and UI in sync using the History API |
| `Routes` / `Route` | Maps URL patterns to components |
| `Link` / `NavLink` | Navigation without a page reload; `NavLink` exposes active state |
| Layout route | A shared shell rendered around child routes |
| `Outlet` | The place where a child route renders |
| Dynamic segment | `:taskId` — a variable part of the URL |
| Search params | The `?filter=open&q=react` part of the URL |
| 404 route | A catch-all `*` route for unknown URLs |

---

## 1. Install and wrap the app

React Router is already in `package.json`. Confirm:

```bash
npm install
```

In `src/main.jsx`:

```jsx
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

`BrowserRouter` listens to the URL. `App` decides which page to render.

---

## 2. Define routes

Create a `Layout` that renders the header, the page, and the footer:

```jsx
// src/components/Layout.jsx
import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

export default function Layout() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

Then replace the contents of `App.jsx`:

```jsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import TaskDetailPage from './pages/TaskDetailPage.jsx'
import StatsPage from './pages/StatsPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import TasksProvider from './context/TasksProvider.jsx'
import ThemeProvider from './context/ThemeProvider.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="tasks/:taskId" element={<TaskDetailPage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </TasksProvider>
    </ThemeProvider>
  )
}
```

Route notes:

- `index` matches `/`.
- `tasks/:taskId` matches `/tasks/task-1` and exposes `taskId`.
- `*` catches everything else. Put it last.
- The layout route has no `path`, so it wraps all children.
- Providers live **above** `Routes` so every page can use them.

### Page components

A page is just a component. `HomePage` owns the task form and list:

```jsx
// src/pages/HomePage.jsx
import TaskForm from '../components/TaskForm.jsx'
import TaskList from '../components/TaskList.jsx'
import SearchBar from '../components/SearchBar.jsx'
import FilterBar from '../components/FilterBar.jsx'

export default function HomePage() {
  return (
    <>
      <section className="hero">...</section>
      <section className="panel">...</section>
    </>
  )
}
```

Keep pages thin: compose components, do not reimplement them.

---

## 3. Link, do not reload

```jsx
import { Link } from 'react-router-dom'

<Link to="/stats">View stats</Link>
```

Do **not** use `<a href="/stats">` for internal navigation. A plain anchor asks
the server for a new document, which throws away React state and reloads the
bundle.

`NavLink` adds an `isActive` flag:

```jsx
import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')

<nav>
  <NavLink to="/" end className={linkClass}>Tasks</NavLink>
  <NavLink to="/stats" className={linkClass}>Stats</NavLink>
  <NavLink to="/about" className={linkClass}>About</NavLink>
</nav>
```

`end` prevents the home link from being active on every nested route.

---

## 4. Dynamic routes

```jsx
import { Link, useParams } from 'react-router-dom'
import { useTasks } from '../context/TasksContext.js'

export default function TaskDetailPage() {
  const { taskId } = useParams()
  const { tasks } = useTasks()
  const task = tasks.find((item) => item.id === taskId)

  if (!task) {
    return (
      <section>
        <h1>Task not found</h1>
        <p>It may have been deleted.</p>
        <Link to="/">Back to tasks</Link>
      </section>
    )
  }

  return (
    <article>
      <p className="eyebrow">Task detail</p>
      <h1>{task.title}</h1>
      <p>Status: {task.completed ? 'Done' : 'Open'}</p>
      <p>Priority: {task.priority}</p>
      <Link to="/">← Back to all tasks</Link>
    </article>
  )
}
```

`useParams` values are always strings, even if the id looks numeric.

Link each row from `TaskItem`:

```jsx
<Link to={`/tasks/${task.id}`} className="task-title-link">
  {task.title}
</Link>
```

---

## 5. Put UI state in the URL

Search and filter currently live in `useState`. Move them to search params so a
filtered view can be bookmarked and shared.

```jsx
import { useSearchParams } from 'react-router-dom'

export default function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') ?? 'all'
  const query = searchParams.get('q') ?? ''

  function updateParam(key, value, { replace = false } = {}) {
    const next = new URLSearchParams(searchParams)

    if (value) next.set(key, value)
    else next.delete(key)

    setSearchParams(next, { replace })
  }

  return (
    <>
      <input
        type="search"
        value={query}
        onChange={(event) =>
          // Replace, so each keystroke does not create a history entry.
          updateParam('q', event.target.value, { replace: true })
        }
        aria-label="Search tasks"
      />

      <div role="group" aria-label="Filter tasks">
        {['all', 'open', 'done'].map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => updateParam('filter', value === 'all' ? '' : value)}
          >
            {value}
          </button>
        ))}
      </div>
    </>
  )
}
```

Now `/tasks?filter=open&q=react` is a real, shareable state. The back button
works as users expect.

### When to use URL state vs. component state

| Use the URL | Use component state |
| --- | --- |
| Filters, search, sort | Draft form input before submit |
| Pagination | Hover/focus UI |
| Selected tab that should survive refresh | Transient loading flags |
| Anything you would want to share | Modal open/closed |

---

## 6. Stats page

```jsx
import { useTasks } from '../context/TasksContext.js'

export default function StatsPage() {
  const { tasks } = useTasks()
  const done = tasks.filter((task) => task.completed).length
  const open = tasks.length - done
  const percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100)

  return (
    <section>
      <h1>Your progress</h1>
      <p>{done} of {tasks.length} tasks complete</p>
      <progress value={done} max={tasks.length || 1}>
        {percent}%
      </progress>
      <p>{open} tasks left. You are {percent}% there.</p>
    </section>
  )
}
```

`<progress>` is semantic and accessible. Do not build a progress bar from
`<div>`s unless you add the ARIA roles and values yourself.

---

## 7. 404 and redirects

```jsx
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section>
      <p className="eyebrow">404</p>
      <h1>This page wandered off.</h1>
      <p>The link may be old, or the task may have been deleted.</p>
      <Link to="/">Take me back to TaskFlow</Link>
    </section>
  )
}
```

To redirect:

```jsx
import { Navigate } from 'react-router-dom'

<Route path="home" element={<Navigate to="/" replace />} />
```

`replace` keeps the back button from returning to the redirecting URL.

---

## 8. Deploying a SPA (important)

With client-side routing, `/stats` only exists in the browser. If you refresh
there, the server looks for a file at `/stats` and returns 404.

You must configure a **rewrite** so every path returns `index.html`:

- **Vercel:** `vercel.json` (already included):

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

- **Netlify:** `public/_redirects` (already included):

```text
/*    /index.html   200
```

- **GitHub Pages:** does not support rewrites. Use a `404.html` copy of
  `index.html`, or deploy to Vercel/Netlify instead.

Test after deploying: open `/stats` directly and refresh. If it 404s, the rewrite
is missing.

---

## 9. Project step

Restructure TaskFlow:

1. Create `src/pages/` with `HomePage`, `TaskDetailPage`, `StatsPage`,
   `AboutPage`, and `NotFoundPage`.
2. Create `Layout` with `Header`, `Outlet`, and `Footer`.
3. Add routes and wrap the app in `BrowserRouter`.
4. Replace internal `<a>` tags with `Link` or `NavLink`.
5. Move search and filter into `useSearchParams`.
6. Make each task title link to `/tasks/:taskId`.
7. Add a "Back to tasks" link on the detail page.
8. Check the 404 page by visiting `/nonsense`.
9. Run `npm run build` and `npm run preview`, then refresh `/stats`.

---

## Common mistakes

| Mistake | Symptom | Fix |
| --- | --- | --- |
| `<a href="/stats">` | Full reload, lost state | Use `<Link>` / `<NavLink>` |
| Route outside `<BrowserRouter>` | "useRoutes may be used only in... " | Wrap the app |
| Provider inside `Routes` | Some pages cannot access context | Put providers above |
| `path="/tasks/:id"` but read `id` as `taskId` | `undefined` | Match the param name |
| Refresh on `/stats` gives 404 in production | Server has no rewrite | Add `vercel.json` or `_redirects` |
| `*` route above specific routes | Everything is 404 | Put `*` last |
| `NavLink to="/"` active everywhere | Wrong `end` prop | Add `end` |
| Local state for filters | Back button loses filters | Move to search params |

---

## Assignment

[`assignments/week-06/README.md`](../assignments/week-06/README.md)

Build the route tree, detail page, stats page, 404, active navigation, and
URL-driven filters. Verify production refresh behaviour with `npm run preview`.

**Stretch:** add a `/tasks` index route with a list layout, or a redirect from
`/home` to `/`.

---

## Recap

- Client-side routing keeps the app fast and stateful.
- Layout routes share a shell; `Outlet` renders the child.
- Dynamic params and search params make views shareable.
- Use `Link`/`NavLink`, never plain anchors for internal routes.
- Providers belong above the route tree.
- SPA deployments need rewrite rules.

### Check yourself

1. What is the difference between `Link` and an `<a>` tag?
2. How does `Outlet` know which page to render?
3. Why should filters live in the URL?
4. What breaks on refresh without a rewrite rule?

---

## Resources

- [React Router: Installation](https://reactrouter.com/start/declarative/installation)
- [React Router: Routes](https://reactrouter.com/start/declarative/routing)
- [React Router: `useSearchParams`](https://reactrouter.com/api/hooks/useSearchParams)
- [React Router: `NavLink`](https://reactrouter.com/api/components/NavLink)
- [Vercel: Rewrites](https://vercel.com/docs/rewrites)
