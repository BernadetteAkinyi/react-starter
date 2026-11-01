# Assignment 4 — Architecture refactor

**Week 4** · **Time:** 6–8 hours · **Due:** end of Week 4

> Refactor TaskFlow to use a reducer, Context, and custom hooks, then add a
> persistent light/dark theme and a keyboard shortcut.

Read [`docs/week-04.md`](../../docs/week-04.md) before starting.

---

## Learning objectives

- Extract reusable stateful logic into custom hooks.
- Model task transitions with a reducer.
- Share state with Context instead of prop drilling.
- Persist a UI preference.
- Use a ref to focus an input.

---

## Tasks

### 1. Branch

```bash
git switch main
git pull
git switch -c week-04/your-name
```

### 2. Custom hooks

Create:

- `src/hooks/useLocalStorage.js` — generic persisted state.
- `src/hooks/useLocalStorageReducer.js` — reducer + persistence.

Both must:

- Read safely with `try/catch`.
- Fall back to the provided initial value.
- Write in an effect.
- Handle write failures without crashing.

### 3. Task reducer

Create `src/state/tasksReducer.js` with these actions:

| Action | Payload | Result |
| --- | --- | --- |
| `added` | `task` | New task at the front |
| `toggled` | `id` | Flip `completed` for that id |
| `deleted` | `id` | Remove that task |
| `cleared` | — | Remove all completed tasks |
| `imported` | `tasks` | Add new ids at the front, deduplicated |

Requirements:

- Pure function: no storage, no fetch, no `Date.now()`.
- Never mutate the input state.
- Throw on an unknown action.
- Every branch returns a value.

### 4. Context

Create:

- `src/context/TasksContext.js` — context + `useTasks` hook with a guard.
- `src/context/TasksProvider.jsx` — reducer, persistence, action helpers,
  memoized value.

The provider exposes:

```js
{
  tasks,
  addTask(title, priority),
  toggleTask(id),
  deleteTask(id),
  clearCompleted(),
  importTasks(tasks)
}
```

### 5. Remove prop drilling

- `TaskList` reads `tasks` from `useTasks`.
- `TaskItem` reads `toggleTask` and `deleteTask` from `useTasks`.
- No `tasks`, `onToggle`, or `onDelete` props remain on those components.
- `TaskForm` may keep `onAdd` as a prop (it is local and explicit).

### 6. Theme

Create:

- `src/context/ThemeContext.js`
- `src/context/ThemeProvider.jsx`
- Dark tokens in `src/styles.css` under `:root[data-theme='dark']`.

Requirements:

- The header theme button is enabled and toggles light/dark.
- The choice persists after refresh.
- The effect sets `document.documentElement.dataset.theme`.
- The button has an accessible name that reflects the action ("Switch to dark
  theme" / "Switch to light theme").
- Text remains readable in both themes (contrast).

### 7. Keyboard shortcuts

- Pressing `/` focuses the search input, unless the user is already typing in an
  input or textarea.
- Pressing `Escape` clears the search query.
- The listener is added in an effect and removed in cleanup.
- No shortcut fires while typing in a field (except Escape clearing the search).

### 8. Prove the refactor

- [ ] The app behaves exactly as it did after Week 3.
- [ ] React DevTools shows `TasksProvider` and `ThemeProvider`.
- [ ] No task props are passed through `TaskList`.
- [ ] Theme survives a refresh.
- [ ] `/` and `Escape` work.
- [ ] Lint, tests, and build pass.

---

## Acceptance criteria

- [ ] `useLocalStorage` and `useLocalStorageReducer` exist and are used.
- [ ] `tasksReducer` handles all five actions and throws on unknown actions.
- [ ] `TasksProvider` supplies the task API; `useTasks` guards against a missing
      provider.
- [ ] `TaskList` and `TaskItem` do not receive task data through props.
- [ ] The provider value is memoized.
- [ ] Theme toggles, persists, and is exposed through context.
- [ ] Dark mode is readable.
- [ ] `/` focuses search; `Escape` clears it; both clean up.
- [ ] No regressions in add/toggle/delete/search/filter/persistence.
- [ ] Lint, tests, and build pass.

---

## Stretch goals (optional)

- Write unit tests for every reducer action, including the unknown-action error.
- Add a `useKeyboardShortcut` hook and use it for both shortcuts.
- Add a third theme ("system") that follows `prefers-color-scheme`.
- Split task actions into a separate `useTaskActions` hook.

---

## Rubric (20 points)

| Criterion | Points | Full marks |
| --- | --- | --- |
| Functionality | 8 | Refactor is behaviour-preserving; theme and shortcuts work |
| Code quality | 5 | Pure reducer, focused hooks, memoized context, no prop drilling |
| UX and accessibility | 4 | Theme contrast, labelled toggle, shortcuts do not hijack typing |
| Process and reflection | 3 | Checks pass; PR explains the architecture and trade-offs |

---

## Submission

```bash
git add .
git commit -m "week 04: refactor to context and reducer, add theme"
git push -u origin week-04/your-name
```

PR title: **`Week 04 — Architecture refactor`**.

Answer:

1. Why is context better than props for tasks here? When would props be better?
2. Why must a reducer be pure?
3. What does `useMemo` around the provider value prevent?
4. What was the hardest part of the refactor?

---

## Hints

<details>
<summary>`useTasks must be used inside <TasksProvider>`</summary>

The component calling the hook is outside the provider. Check `App.jsx`: the
provider must wrap the component that renders the task UI.

</details>

<details>
<summary>The reducer works, but the UI does not update</summary>

You may be mutating state (`state.push`, `task.completed = ...`). Return new
arrays and objects. Also make sure every case returns.

</details>

<details>
<summary>Theme resets on refresh</summary>

The `useLocalStorage` key is probably different between read and write, or the
effect never runs. Log the stored value.

</details>

<details>
<summary>The `/` shortcut fires while I type</summary>

Check `event.target` against `HTMLInputElement` and `HTMLTextAreaElement`, and do
not prevent default in those cases.

</details>

<details>
<summary>Everything re-renders when I type in the form</summary>

That may be expected if the form state lives high up. Move draft form state into
`TaskForm`. Context consumers re-render when the context value changes; memoize
the value.

</details>
