# Assignment 5 — API import

**Week 5** · **Time:** 6–8 hours · **Due:** end of Week 5

> Import tasks from a public API with proper loading, error, retry, and
> deduplication behaviour.

Read [`docs/week-05.md`](../../docs/week-05.md) before starting.

Use [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos) — no key, no
signup.

---

## Learning objectives

- Call an API with `fetch` and `async`/`await`.
- Model idle, loading, success, and error states.
- Check `response.ok` and handle failure.
- Map external data into your own shape.
- Deduplicate imported records.
- Configure an API URL with an environment variable.

---

## Tasks

### 1. Branch

```bash
git switch main
git pull
git switch -c week-05/your-name
```

### 2. API module

Create `src/lib/api.js`:

- Export `fetchTodos({ signal } = {})`.
- Build the URL from `import.meta.env.VITE_API_URL`, falling back to
  `https://jsonplaceholder.typicode.com`.
- Request `/todos?_limit=12` (or `?completed=false`).
- Throw a useful error when `!response.ok`.
- Return parsed JSON.

Create `.env.example`:

```bash
VITE_API_URL=https://jsonplaceholder.typicode.com
```

Do not commit `.env.local`.

### 3. Import panel

Create `src/components/ImportTasksButton.jsx` (or similar).

Requirements:

- A button labelled **Import from API**.
- While loading: disabled, label changes to **Importing…**.
- On success: a `role="status"` message with the number imported.
- On error: a `role="alert"` message with the reason and a **Try again** button.
- Clicking twice does not create duplicates.
- Imported tasks appear in the list and persist after refresh.
- Imported tasks have ids prefixed with `api-` and a `due` label of `Imported`.
- Their priority is `medium` unless you choose a mapping.

### 4. Reducer support

Ensure the `imported` action:

- Removes incoming tasks whose ids already exist.
- Adds the rest at the front.
- Does not mutate the current state.

### 5. Completed-only mode

Add a checkbox or toggle: **Only completed tasks**.

- When on, request only completed todos, or filter the response.
- When off, import all.
- The UI explains which mode is active.
- The mode does not corrupt existing tasks.

### 6. Failure test

Test the error path without editing code permanently:

1. Stop your Wi-Fi / set the browser to offline.
2. Click import.
3. Confirm the error message is readable and a retry is available.
4. Turn the network back on and retry.

Optional: temporarily set `VITE_API_URL` to an invalid host, restart the dev
server, and test. Revert afterwards.

### 7. Abort on unmount

If you also fetch on mount anywhere (for example, a demo panel), use an
`AbortController` and abort in cleanup. Explain why in the PR.

For the import button, the request starts from a click, so an abort controller is
optional — but if you add one, wire it correctly.

### 8. Local-first behaviour

With the network offline:

- [ ] Add a task.
- [ ] Toggle it.
- [ ] Delete it.
- [ ] Search and filter.
- [ ] Refresh; changes persist.

The app must remain usable without the API.

---

## Acceptance criteria

- [ ] `src/lib/api.js` exists and is the only place that knows the endpoint.
- [ ] The API URL comes from `VITE_API_URL` with a working fallback.
- [ ] `.env.example` is committed; `.env.local` is not.
- [ ] Loading state disables the button and changes its label.
- [ ] Success is announced with `role="status"` and includes a count.
- [ ] Errors are announced with `role="alert"` and offer a retry.
- [ ] Importing twice does not create duplicates.
- [ ] Imported tasks persist and can be toggled/deleted.
- [ ] Completed-only mode works.
- [ ] The app remains usable offline.
- [ ] Lint, tests, and build pass.

---

## Stretch goals (optional)

- Mock `fetch` in a test and assert success, HTTP error, and network error.
- Add a skeleton list while importing.
- Add an "undo import" action that removes the last batch.
- Show the source URL in a small tooltip or details element.

---

## Rubric (20 points)

| Criterion | Points | Full marks |
| --- | --- | --- |
| Functionality | 8 | Import, loading, error, retry, dedupe, completed-only, persistence |
| Code quality | 5 | API isolated, data mapped, reducer pure, no secrets |
| UX and accessibility | 4 | Clear progress, announced status/errors, app usable offline |
| Process and reflection | 3 | Checks pass; PR explains mapping and failure handling |

---

## Submission

```bash
git add .
git commit -m "week 05: import tasks from the API with error handling"
git push -u origin week-05/your-name
```

PR title: **`Week 05 — API import`**.

Answer:

1. Why does `fetch` not throw on a 404?
2. What are the four request states, and what does the UI show for each?
3. How do you prevent duplicates?
4. What did you do to keep the app usable offline?

---

## Hints

<details>
<summary>`response.json is not a function`</summary>

You may have forgotten `await fetch(...)` or you are calling `.json()` on the
already-parsed data. Check each step.

</details>

<details>
<summary>Import adds duplicates every click</summary>

Deduplicate by id in the reducer, and make sure the imported ids are stable.
`api-${todo.id}` is stable; a new `crypto.randomUUID()` each import is not.

</details>

<details>
<summary>I get a CORS error</summary>

JSONPlaceholder allows browser requests. Check the exact URL, and make sure you
are not calling a different domain. A CORS error cannot be fixed from the client
alone.

</details>

<details>
<summary>Environment variable is undefined</summary>

It must start with `VITE_`. Restart `npm run dev` after changing `.env.local`.
In production, set it in the hosting dashboard and redeploy.

</details>

<details>
<summary>The error message says "Failed to fetch"</summary>

That is the browser's network error. Show a friendlier message such as "Could not
reach the task service. Check your connection and try again."

</details>
