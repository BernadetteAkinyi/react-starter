# Assignment 2 — State, events, and forms

**Week 2** · **Time:** 5–7 hours · **Due:** end of Week 2

> Turn the static TaskFlow UI into a working task manager that adds, completes,
> deletes, and clears tasks in memory.

Read [`docs/week-02.md`](../../docs/week-02.md) before starting.

---

## Learning objectives

- Use `useState` for a list and a form.
- Update arrays immutably.
- Handle submit, change, and click events.
- Derive counts instead of storing them.
- Render an empty state.

---

## Tasks

### 1. Branch

```bash
git switch main
git pull
git switch -c week-02/your-name
```

### 2. Move tasks into state

In `App.jsx`:

```jsx
const [tasks, setTasks] = useState(seedTasks)
```

Replace every use of `seedTasks` in the rendered output with `tasks`. Counts must
be derived from `tasks`.

### 3. Build the add form

Create `src/components/TaskForm.jsx`.

Requirements:

- A controlled text input for the title.
- A controlled `<select>` for priority (`high`, `medium`, `low`).
- A submit button labelled **Add task**.
- The button is disabled when the trimmed title is empty.
- Submitting calls `onAdd(title, priority)` and resets both fields.
- `event.preventDefault()` is called.
- The input has a real label (visually hidden is fine).
- The form does not add whitespace-only tasks.

### 4. Add tasks

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

New tasks appear at the top.

### 5. Toggle and delete

- `TaskItem` receives `onToggle` and `onDelete` props.
- The checkbox calls `onToggle(task.id)`.
- The delete button calls `onDelete(task.id)`.
- `App` updates state immutably.
- The checkbox is controlled with `checked` **and** `onChange`.
- Delete is a `<button type="button">`, not a clickable `<div>`.
- Both controls have accessible names.

### 6. Clear completed

Add a **Clear completed** button that removes every completed task. Disable it
when there are none.

### 7. Counts and empty state

- Total, open, and done counts come from `tasks`, not `seedTasks`.
- When there are no tasks, show a friendly empty state instead of an empty list.
- When there are tasks, show the list.

### 8. Validate by hand

Test these cases:

- [ ] Add a normal task.
- [ ] Try to add an empty task (button disabled).
- [ ] Try to add only spaces.
- [ ] Add a high-priority task and change the priority select.
- [ ] Toggle a task on and off.
- [ ] Delete the middle task.
- [ ] Delete all tasks; the empty state appears.
- [ ] Add more tasks after deleting all.
- [ ] Clear completed with zero, one, and several completed tasks.

Refresh the page. Tasks reset to the seed data. **This is expected** — persistence
is Week 3.

### 9. Self-review

- [ ] No direct mutation of `tasks` anywhere.
- [ ] No `key={index}`.
- [ ] No state update during render.
- [ ] No console warnings about controlled inputs.
- [ ] Lint, tests, and build pass.

---

## Acceptance criteria

- [ ] Tasks live in `useState`.
- [ ] A controlled form adds tasks with a title and priority.
- [ ] Empty and whitespace-only titles are rejected.
- [ ] New tasks appear at the top of the list.
- [ ] Checkbox toggles completion.
- [ ] Delete removes the correct task.
- [ ] Clear completed removes only completed tasks.
- [ ] Counts are derived from state and update immediately.
- [ ] Empty state appears when there are no tasks.
- [ ] At least 6 tasks exist after your manual test.
- [ ] Lint, tests, and build pass.

---

## Stretch goals (optional)

- Inline editing: click **Edit**, change the title, press Enter or click Save.
- Sort by priority, then by completion.
- Add a "mark all complete" / "mark all open" action.
- Show the number of characters left in the title input (max 80).
- Add tests for `tasksReducer` early, if you created one.

---

## Rubric (20 points)

| Criterion | Points | Full marks |
| --- | --- | --- |
| Functionality | 8 | Add, toggle, delete, clear, validation, counts, empty state all work |
| Code quality | 5 | Immutable updates, updater functions, no dead code or index keys |
| UX and accessibility | 4 | Labels, button types, disabled states, keyboard usable |
| Process and reflection | 3 | Checks pass; PR explains the flow and edge cases tested |

---

## Submission

```bash
git add .
git commit -m "week 02: add task form, toggle, delete, and clear completed"
git push -u origin week-02/your-name
```

PR title: **`Week 02 — State, events, and forms`**.

Answer in the description:

1. Why does `tasks.push()` not update the screen?
2. Where does the draft input value live, and why there?
3. Which edge case surprised you?

---

## Hints

<details>
<summary>The input will not let me type</summary>

You probably passed `value` without `onChange`. Add
`onChange={(event) => setTitle(event.target.value)}`.

</details>

<details>
<summary>Deleting removes the wrong task</summary>

You may be using the array index as the key or passing the wrong id. Log the id
inside the click handler and compare it with the task you clicked.

</details>

<details>
<summary>The form reloads the page</summary>

Call `event.preventDefault()` at the top of `handleSubmit`.

</details>

<details>
<summary>The checkbox warns about `checked` without `onChange`</summary>

Add `onChange={() => onToggle(task.id)}` or `readOnly` if it truly cannot change.
In TaskFlow it can change, so use `onChange`.

</details>

<details>
<summary>Counts do not update</summary>

If you stored counts in state, remove that state and compute them from `tasks`
during render.

</details>
