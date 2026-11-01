# Assignment 1 — Components and props

**Week 1** · **Time:** 4–5 hours · **Due:** end of Week 1

> Build the static TaskFlow UI from small components, and prove you can pass data
> with props.

---

## Learning objectives

- Split a page into components.
- Pass data with props and use `children` for composition.
- Render lists with stable keys.
- Keep a React project passing lint, tests, and build.

Read [`docs/week-01.md`](../../docs/week-01.md) before starting.

---

## Tasks

### 1. Set up your branch

```bash
git switch main
git pull
git switch -c week-01/your-name
npm install
npm run dev
```

Confirm the starter renders and `npm test` passes.

### 2. Extract `Footer`

The footer is currently inline in `App.jsx`.

- Create `src/components/Footer.jsx`.
- Move the footer markup into it.
- Accept a `year` prop and render it, for example:
  `© {year} TaskFlow`.
- Render `<Footer year={new Date().getFullYear()} />` in `App`.

### 3. Extract `Stats`

Follow the guided build in `docs/week-01.md`.

- Create `src/components/Stats.jsx`.
- Accept `total`, `open`, and `done` props.
- Replace the inline stats markup in `App`.
- Verify with React DevTools that the props are correct.

### 4. Build `ProfileCard`

Create `src/components/ProfileCard.jsx`.

It must accept these props:

| Prop | Type | Example |
| --- | --- | --- |
| `name` | string | `"Amara Okoye"` |
| `role` | string | `"Frontend learner"` |
| `goal` | string | `"Ship a React app by December"` |
| `initials` | string | `"AO"` |

Render a card with:

- An avatar circle showing `initials`.
- The name in a heading.
- The role.
- The goal, with a visible "My goal" label.
- At least one element using `children` (for example, a footer note or a badge).

Add it to the page in a sensible place. It should not break the layout at mobile
width.

> **Hint:** the requirement to use `children` means `ProfileCard` should render
> `{children}` somewhere. Pass a `<span>` or `<p>` in `App`.

### 5. Make the data yours

In `src/data/seedTasks.js`:

- Add **two** new tasks.
- Make one of them completed.
- Give them realistic priorities and due labels.

The starter test asserts there are exactly **4** list items. Your change will
make it fail. That is expected: update the test to match the new data, or make it
assert the new task titles instead of a hard-coded count.

### 6. Priority labels

In `TaskItem`, display the priority with a capital first letter:

```text
high   → High
medium → Medium
low    → Low
```

Do this with a small helper or inline expression. Do not add a dependency.

### 7. Fix the About link

The header links to `#about`, but no element has that id. Add `id="about"` to the
footer (or create an About section). Clicking the link should scroll there.

### 8. Self-review

- [ ] `npm run lint` passes.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] No console errors.
- [ ] Page works at 375 px width.
- [ ] Every component has one clear job.

---

## Acceptance criteria

- [ ] `Stats`, `Footer`, and `ProfileCard` exist as separate components.
- [ ] `Stats` receives `total`, `open`, and `done` as props.
- [ ] `ProfileCard` receives `name`, `role`, `goal`, and `initials` as props and
      renders them.
- [ ] `ProfileCard` uses `children`.
- [ ] `Footer` receives a `year` prop.
- [ ] Two new seed tasks exist, one completed.
- [ ] Priority displays with a capital first letter.
- [ ] The About link scrolls to its target.
- [ ] Lists use stable keys (not the array index).
- [ ] Lint, tests, and build pass.
- [ ] Pull request includes desktop and mobile screenshots.

---

## Stretch goals (optional)

- Create a reusable `Badge` component and use it for priority and the open count.
- Add an `Avatar` component used by `ProfileCard`.
- Add a `Button` component with `variant` props and use it for the theme button.
- Add a test that `ProfileCard` renders the name and initials.

---

## Rubric (20 points)

| Criterion | Points | Full marks |
| --- | --- | --- |
| Functionality | 8 | All components render correct data; tasks and About link work |
| Code quality | 5 | Small components, clear props, no duplication, stable keys |
| UX and accessibility | 4 | Layout intact at mobile width; semantic headings and labels |
| Process and reflection | 3 | Checks pass; PR explains choices; screenshots included |

---

## Submission

```bash
git add .
git commit -m "week 01: split UI into components and add profile card"
git push -u origin week-01/your-name
```

Open a pull request titled **`Week 01 — Components and props`**.

In the description, answer:

1. Which component was hardest to extract, and why?
2. What did you learn about props that you did not know before?
3. Which stretch goal did you attempt, if any?

---

## Hints

<details>
<summary>My list renders but the console says "Each child in a list should have a unique key"</summary>

You are rendering an array without a `key` prop, or the key is not unique. Use
`key={task.id}` on the element returned by `map`.

</details>

<details>
<summary>My component renders nothing</summary>

Check that you `return` the JSX and that you imported the component with the
correct path and default/named import.

</details>

<details>
<summary>Props are undefined</summary>

Compare the prop name in the parent with the name in the child. They are
case-sensitive. Also check that you passed the value, not just the name:
`<Stats total={4} />`, not `<Stats total />`.

</details>

<details>
<summary>The test fails after I add tasks</summary>

The starter test counts list items. Update it to expect your new total, or assert
specific task titles. Tests should describe the data you actually ship.

</details>
