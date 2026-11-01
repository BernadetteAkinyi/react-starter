# Assignment 3 — Persistence, search, and filters

**Week 3** · **Time:** 5–7 hours · **Due:** end of Week 3

> Make tasks survive a refresh, add search and filters, and keep exactly one
> source of truth.

Read [`docs/week-03.md`](../../docs/week-03.md) before starting.

---

## Learning objectives

- Use `useEffect` correctly.
- Initialize state lazily from `localStorage`.
- Handle corrupted storage without a white screen.
- Derive filtered lists instead of storing them.
- Clean up an effect.

---

## Tasks

### 1. Branch

```bash
git switch main
git pull
git switch -c week-03/your-name
```

### 2. Storage module

Create `src/lib/storage.js`:

```js
export const STORAGE_KEY = 'taskflow.tasks.v1'
```

Use a versioned key.

### 3. Lazy load from storage

In `App.jsx` (or your provider, if you refactored early):

- Read `localStorage` in a `useState` initializer.
- If there is no value, return `seedTasks`.
- If `JSON.parse` throws, catch it, log a warning, and return `seedTasks`.
- If the parsed value is not an array, return `seedTasks`.
- Pass the function to `useState`, not the result.

### 4. Save on change

- Add a `useEffect` with `[tasks]` that writes the array to storage.
- Wrap the write in `try/catch` (storage can be full or blocked).
- Verify that adding, toggling, deleting, and clearing all persist.

### 5. Broken storage test

In the browser console:

```js
localStorage.setItem('taskflow.tasks.v1', 'not json')
```

Refresh. The app must still load with seed data, not a white screen. Then remove
the key and refresh again.

### 6. Search

- Add a controlled search input.
- Match case-insensitively against the task title.
- Show a clear button (or support `Escape`) to reset the query.
- Announce the result count (`role="status"` or a visible line).

### 7. Filters

- Add **All**, **Open**, **Done** buttons.
- The active filter is visually distinct **and** exposed with `aria-pressed`.
- Filtering combines with search (both apply).
- Counts in the summary always reflect **all** tasks, not the visible ones.

### 8. Derived list

Compute `visibleTasks` during render:

```jsx
const visibleTasks = tasks.filter((task) => {
  const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase())
  const matchesFilter =
    filter === 'all' ||
    (filter === 'open' && !task.completed) ||
    (filter === 'done' && task.completed)
  return matchesQuery && matchesFilter
})
```

Do **not** put `visibleTasks` in state. Do **not** save it to storage.

### 9. Empty states

Show two different messages:

- No tasks at all: "Nothing here yet. Add your first task."
- Tasks exist but none match: "No tasks match your search or filter."

### 10. Dynamic title and cleanup

- Set `document.title` to include the open count.
- Restore the previous title in the cleanup function.
- Explain in your PR when the cleanup runs.

### 11. Self-review

- [ ] Storage contains the full `tasks` array, never the filtered list.
- [ ] Search + filter + delete + refresh all work together.
- [ ] No derived value is stored in state.
- [ ] The effect dependency array is correct.
- [ ] Lint, tests, and build pass.

---

## Acceptance criteria

- [ ] Tasks persist across a refresh.
- [ ] A missing storage value falls back to seed data.
- [ ] Corrupted storage falls back without crashing.
- [ ] Search is case-insensitive and controlled.
- [ ] All/Open/Done filters work and combine with search.
- [ ] The active filter has `aria-pressed="true"`.
- [ ] Counts reflect all tasks.
- [ ] Two distinct empty states exist.
- [ ] `visibleTasks` is derived, not stored.
- [ ] The document title updates and has a cleanup.
- [ ] Lint, tests, and build pass.

---

## Stretch goals (optional)

- Debounce the search by 300 ms. Clean up the timer.
- Add a "last saved" timestamp that does not cause an infinite loop.
- Add sorting by priority or due date, stored in the URL? (URL is Week 6; for now,
  local state is fine.)
- Add a "Reset data" button with a confirmation.

---

## Rubric (20 points)

| Criterion | Points | Full marks |
| --- | --- | --- |
| Functionality | 8 | Persistence, search, filters, clear, empty states all work |
| Code quality | 5 | Single source of truth, correct deps, safe parsing, no derived state |
| UX and accessibility | 4 | Clear search, active filter state, announced counts, labels |
| Process and reflection | 3 | Checks pass; PR explains the effect lifecycle and edge cases |

---

## Submission

```bash
git add .
git commit -m "week 03: persist tasks and add search and filters"
git push -u origin week-03/your-name
```

PR title: **`Week 03 — Persistence, search, and filters`**.

Answer:

1. Why is `useState(loadTasks)` better than `useState(loadTasks())`?
2. Why do you save `tasks` instead of `visibleTasks`?
3. What happens when storage contains invalid JSON?

---

## Hints

<details>
<summary>Tasks reset on every refresh</summary>

Check the storage key in both the read and the write. Log
`localStorage.getItem('taskflow.tasks.v1')` after adding a task. If it is `null`,
the write effect is not running or is failing.

</details>

<details>
<summary>The effect runs forever</summary>

You may be setting state inside the effect or depending on a new array/object
created during render. The save effect should only write to storage, not update
React state.

</details>

<details>
<summary>Search resets when I type</summary>

The input is probably uncontrolled, or its value is not coming from state. Use
`value={query}` and `onChange`.

</details>

<details>
<summary>Filtering hides completed tasks from storage</summary>

You are saving the filtered array. Save `tasks`; render `visibleTasks`.

</details>

<details>
<summary>JSON.parse crashes the app</summary>

Wrap it in `try/catch`, validate that the result is an array, and fall back to
`seedTasks`.

</details>
