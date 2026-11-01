# Glossary

Terms used throughout the course.

---

**Accessibility (a11y)** — Building interfaces usable by people with disabilities,
including keyboard, screen reader, zoom, and reduced-motion users.

**Action** — A plain object describing a state change, dispatched to a reducer.

**API** — An interface for one program to talk to another. In this course, usually
an HTTP JSON API.

**Async / await** — Syntax for working with Promises without long `.then()`
chains.

**Bundler** — A tool that combines modules into files a browser can load. Vite is
the bundler here.

**Children** — The content between a component's opening and closing tags,
available as the `children` prop.

**Client-side routing** — Changing views in the browser without a full page
request.

**Component** — A function that returns JSX. The building block of a React UI.

**Context** — A React feature for sharing a value with a subtree without passing
props at every level.

**Controlled input** — A form field whose value comes from React state and is
updated through `onChange`.

**Custom hook** — A function starting with `use` that calls other hooks to reuse
stateful logic.

**Derived state** — A value computed from existing state during render, rather
than stored separately.

**Effect** — Work that synchronizes React with an external system, run with
`useEffect` after rendering.

**Error boundary** — A component that catches render errors in its subtree and
shows a fallback.

**Event handler** — A function that runs in response to a user action.

**Immutable update** — Creating a new array or object instead of changing the
existing one.

**JSX** — HTML-like syntax that compiles to JavaScript function calls.

**Key** — A stable, unique identifier for an item in a rendered list.

**Lazy loading** — Loading code only when it is needed, usually per route.

**Lifting state** — Moving state to the closest common parent so multiple
children can share it.

**localStorage** — A browser API for storing string data persistently per origin.

**Memoization** — Caching a computed value or component render to avoid repeated
work. Use after measuring.

**Mock** — A fake function or module used in tests.

**Mutation** — Changing an existing object or array in place. Avoid for React
state.

**Prop** — Read-only data passed from a parent component to a child.

**Prop drilling** — Passing props through intermediate components that do not use
them.

**Provider** — A component that supplies a context value to its descendants.

**Pure function** — A function whose output depends only on its inputs and which
has no side effects.

**Reducer** — A pure function `(state, action) => nextState`.

**Ref** — A mutable reference that does not trigger a render, often used for DOM
nodes.

**Render** — React calling a component to produce a description of the UI.

**Route** — A mapping from a URL pattern to a page component.

**Search params** — The query string of a URL (`?q=react&filter=open`).

**Side effect** — Work outside rendering: storage, network, timers,
subscriptions.

**SPA (single-page application)** — An app that loads one HTML document and
updates the view with JavaScript.

**State** — Data owned by a component that can change and trigger re-renders.

**Strict Mode** — A development-only wrapper that surfaces unsafe patterns by
double-invoking some functions.

**Testing Library** — A set of helpers that query and interact with the DOM the way
a user would.

**Unit test** — A test of one small unit, usually a pure function.

**Vite** — A fast development server and production bundler for modern web apps.

**Vitest** — A test runner that integrates with Vite.

**XSS (cross-site scripting)** — Injecting executable code through user input.
React escapes text by default; `dangerouslySetInnerHTML` bypasses this and must be
used carefully.
