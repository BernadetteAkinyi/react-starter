# Assignments

Ten weekly assignments. Each one is graded, and each builds on the last.

| Week | Assignment | Due | Weight |
| --- | --- | --- | --- |
| 1 | [Components and props](week-01/README.md) | End of Week 1 | 1/10 of weekly grade |
| 2 | [State, events, and forms](week-02/README.md) | End of Week 2 | 1/10 |
| 3 | [Persistence, search, and filters](week-03/README.md) | End of Week 3 | 1/10 |
| 4 | [Architecture refactor](week-04/README.md) | End of Week 4 | 1/10 |
| 5 | [API import](week-05/README.md) | End of Week 5 | 1/10 |
| 6 | [Routing](week-06/README.md) | End of Week 6 | 1/10 |
| 7 | [Testing and accessibility](week-07/README.md) | End of Week 7 | 1/10 |
| 8 | [Deploy and review](week-08/README.md) | End of Week 8 | 1/10 |
| 9 | [Capstone plan and shell](week-09/README.md) | End of Week 9 | 1/10 |
| 10 | [Capstone final](week-10/README.md) | End of Week 10 | 1/10 |

Weekly assignments are **50%** of the overall course grade. The capstone is
**40%**, and participation/review/demo is **10%**. See
[`docs/assessment.md`](../docs/assessment.md).

---

## How to submit

1. Create a branch from the latest `main`:

```bash
git switch main
git pull
git switch -c week-03/your-name
```

2. Do the work, committing in small steps.
3. Run the checks:

```bash
npm run lint
npm test
npm run build
```

4. Push and open a pull request:

```bash
git push -u origin week-03/your-name
```

5. Title the pull request:

```text
Week 03 — Search, filters, and persistence
```

6. Fill in the pull request template completely. Include:
   - What you built.
   - How to test it.
   - Screenshots (desktop and mobile).
   - What was difficult.
   - The acceptance checklist, ticked.

7. Request a review from the instructor. Do not merge until approved.

---

## What every submission must include

- [ ] A branch named `week-XX/your-name`
- [ ] A pull request with the correct title
- [ ] All acceptance criteria met or explicitly noted
- [ ] `npm run lint`, `npm test`, and `npm run build` passing
- [ ] Screenshots
- [ ] No `node_modules/`, `dist/`, or secrets committed
- [ ] A short reflection: what was hard, what you would change

---

## Grading scale

Each assignment is marked out of **20 points**:

| Criterion | Points | What earns full marks |
| --- | --- | --- |
| Functionality | 8 | Every acceptance criterion works, including edge cases |
| Code quality | 5 | Clear names, small components, no dead code, sensible structure |
| UX and accessibility | 4 | Empty/error states, keyboard access, labels, responsive |
| Process and reflection | 3 | Checks pass, PR is clear, self-review is honest |

### Bands

| Score | Meaning |
| --- | --- |
| 18–20 | Excellent — meets the brief and shows understanding |
| 15–17 | Good — works, with minor gaps |
| 12–14 | Developing — core works, quality or edge cases are weak |
| 8–11 | Needs work — incomplete or significant bugs |
| 0–7 | Not submitted or does not run |

A submission that does not run from a clean `npm install && npm run dev` is
returned without a grade until fixed.

---

## Late policy

- Up to 48 hours late: −10%.
- Three to seven days late: −25%.
- More than seven days: submit anyway; feedback still matters, but the grade is
  capped at 50%.
- Extensions: ask **before** the due date, not after.

The capstone cannot be submitted more than seven days late without an approved
extension.

---

## Getting help

- Ask in the cohort channel with the error text, file, and what you tried.
- Bring one specific blocker to the weekly session.
- Do not copy another learner's code. Discuss ideas, write your own code.
- You may use documentation, MDN, React docs, and AI assistants for explanations,
  but you must be able to explain every line you submit.

---

## Academic honesty

You may:

- Read documentation and tutorials.
- Ask peers conceptual questions.
- Use AI to explain an error or a concept.
- Use small snippets you understand and can attribute.

You may not:

- Submit code you cannot explain.
- Copy a classmate's solution.
- Copy a complete tutorial project.
- Hide generated code without understanding it.

The instructor may ask you to walk through any part of your submission. If you
cannot, it is not your work yet.
