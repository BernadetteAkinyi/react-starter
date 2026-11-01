# FAQ and debugging

---

## Setup

### `node` or `npm` is not found

Close and reopen the terminal. If that fails, reinstall Node 20.19+ (24
recommended) and ensure "Add to PATH" is selected. On Windows, restart after
installing.

### `npm install` fails with permission errors

Do not use `sudo npm install`. Fix npm's prefix or use `nvm`. On macOS/Linux:

```bash
npm config get prefix
# If it points to /usr/local, switch to nvm or set a user-owned prefix.
```

### The dev server starts but the page is blank

Open the browser console and the terminal. Read the **first** error. Common
causes: a failed import, a missing export, or a component returning `undefined`.

### Port 5173 is already in use

```bash
npm run dev -- --port 5174
```

Or stop the other process:

```bash
# macOS/Linux
lsof -i :5173
kill <PID>
```

### Changes do not appear

- Save the file (check the tab dot).
- Check the terminal for a compile error.
- Hard refresh (`Ctrl/Cmd + Shift + R`).
- Restart the dev server.

### `Module not found: Can't resolve ...`

- Check the relative path (`./`, `../`).
- Check the filename and extension.
- Check case: `TaskItem.jsx` ≠ `taskitem.jsx` on Linux CI.
- Confirm the file is inside `src/`.

---

## React basics

### Why does changing a variable not update the screen?

Only state changes trigger renders. Use `useState` and its setter.

```jsx
let count = 0
count = 1 // ❌ no render

const [count, setCount] = useState(0)
setCount(1) // ✅
```

### Why does `array.push()` not update the list?

You mutated the existing array; React compares references. Create a new one:

```jsx
setTasks((current) => [...current, newTask])
```

### Why does my input not let me type?

You passed `value` without `onChange`. Add:

```jsx
onChange={(event) => setTitle(event.target.value)}
```

### Why does the form reload the page?

Call `event.preventDefault()` at the start of the submit handler.

### Why is my state one step behind?

Use the updater form:

```jsx
setCount((current) => current + 1)
```

### "Too many re-renders"

You are calling a setter during render. Move it into an event handler or an
effect with correct dependencies.

### "Rendered more hooks than during the previous render"

A hook is inside a condition, loop, or early return. Move all hooks to the top
level of the component.

---

## Effects

### My effect runs twice in development

React Strict Mode mounts, unmounts, and remounts components in development to
surface missing cleanup. It does not happen in production. Write a cleanup
function; do not remove Strict Mode.

### My effect runs forever

You are setting state inside the effect, or depending on a new object/array
created during render. Depend on primitives, or memoize.

### "React Hook useEffect has a missing dependency"

Add the dependency. If that causes a loop, restructure the code instead of
disabling the rule.

### Can I use an effect for filtering a list?

No. Filter during render:

```jsx
const visible = tasks.filter(...)
```

Effects are for synchronizing with things outside React.

---

## Routing

### "useRoutes may be used only in the context of a Router"

`<Routes>` is outside `<BrowserRouter>`. Wrap the app in `main.jsx`.

### My links reload the page

Use `Link` or `NavLink` from `react-router-dom`, not `<a href>`.

### Refreshing a route gives 404 in production

Add an SPA rewrite:

- Vercel: `vercel.json`
- Netlify: `public/_redirects`

See [`docs/week-08.md`](week-08.md).

### `useParams` returns `undefined`

The parameter name must match the route:

```jsx
<Route path="tasks/:taskId" element={<Detail />} />
const { taskId } = useParams()
```

### The detail page crashes after deleting a task

Handle the missing case:

```jsx
const task = tasks.find((item) => item.id === taskId)
if (!task) return <NotFound />
```

---

## Data and APIs

### `fetch` succeeds on a 404

`fetch` only rejects on network failure. Check `response.ok`.

### CORS error

The server must allow your origin. You cannot fix CORS from the client. Use an API
that permits browser requests, or a server proxy.

### `response.json is not a function`

You forgot `await fetch(...)`, or you are calling `.json()` on already-parsed
data.

### My API key is visible in the bundle

Anything in a `VITE_` variable is public. Use a server endpoint or a proxy. Never
ship secrets to the browser.

### `localStorage` is empty after refresh

- Same key on read and write?
- Is the write effect running? Log after adding a task.
- Are you in a private window that clears storage on close?
- Is storage blocked by the browser?

### `JSON.parse` crashes the app

Wrap it:

```js
try {
  return JSON.parse(value)
} catch {
  return fallback
}
```

### Dates are off by one day

`new Date('2026-11-03')` parses as UTC midnight. For date-only values, split the
string and construct a local date:

```js
const [y, m, d] = value.split('-').map(Number)
return new Date(y, m - 1, d)
```

---

## Testing

### "Not wrapped in act(...)"

An update happened after the test finished. `await` every `userEvent` call and use
`findBy...` for async UI.

### `getByLabelText` cannot find my input

`htmlFor` must match the input's `id`. A wrapping `<label>` also works. A
placeholder is not a label.

### Tests pass alone but fail together

Shared state. Clear storage and reset mocks:

```js
beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})
```

### My context component test fails

Wrap it in the provider, or use a `renderWithProviders` helper.

### The test cannot find text that appears after a click

Use `await screen.findByText(...)` instead of `getByText`.

---

## Deployment

### Blank page after deploy

- Check the build log.
- Check the output directory (`dist`).
- Check the base path.
- Open the console for asset 404s.
- Confirm the deployed commit is the one you expect.

### Environment variable is `undefined` in production

Set it in the hosting dashboard, not only in `.env.local`. Redeploy; Vite bakes it
in at build time.

### Routes work locally but 404 on refresh

Missing SPA rewrite. Add `vercel.json` or `public/_redirects`, then redeploy.

### Deploy shows an old version

Check the deployment commit and the branch. Hard refresh. Purge the CDN cache if
your host requires it.

---

## Git and GitHub

### I committed to `main` by mistake

If not pushed:

```bash
git switch -c week-XX/your-name
git switch main
git reset --hard origin/main
git switch week-XX/your-name
```

If pushed, tell the instructor; do not force-push shared branches.

### I need to undo my last commit but keep the changes

```bash
git reset --soft HEAD~1
```

### I need to discard local changes

```bash
git restore .
```

This is destructive. Make sure you mean it.

### Merge conflict

```bash
git switch main
git pull
git switch week-XX/your-name
git merge main
# resolve conflicts in the editor
git add <files>
git commit
```

Ask for help if the conflict is in code you do not understand.

### Authentication failed

GitHub does not accept account passwords over HTTPS. Use `gh auth login`, an SSH
key, or a personal access token.

---

## Getting help

Post:

```text
Week:
Goal:
Expected:
Actual:
Error (exact text):
File and line:
What I tried:
Branch/PR link:
```

The smaller the reproduction, the faster the help.

---

## Still stuck?

1. Re-read the week's "Common mistakes" section.
2. Search the exact error text.
3. Ask in the cohort channel with the template above.
4. Bring it to office hours.
5. If it is blocking you for more than a day, tell the instructor — do not
   disappear for a week.
