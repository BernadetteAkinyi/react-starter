# Assessment

How the course is graded, and what each component means.

---

## Weights

| Component | Weight | Details |
| --- | --- | --- |
| Weekly assignments | 50% | 10 assignments, 5% each |
| Capstone project | 40% | 100-point rubric |
| Participation and review | 10% | Sessions, peer review, demo, reflection |

### Why assignments are 5% each

Each weekly assignment is marked out of 20 and converted to 5% of the final
grade. All ten count equally. Weeks 9 and 10 are the capstone milestones; the
capstone rubric is applied separately at the end, so those weeks serve as
checkpoints rather than double-counting the full project.

If your programme requires a different split, keep the rubrics and change the
weights in your gradebook. The assignments are designed to be equally weighted.

---

## Weekly assignment grade (20 points)

| Criterion | Points |
| --- | --- |
| Functionality | 8 |
| Code quality | 5 |
| UX and accessibility | 4 |
| Process and reflection | 3 |

### Functionality (8)

- All acceptance criteria work.
- Edge cases are handled: empty input, refresh, no data, deleted item.
- The app runs from a clean clone.

### Code quality (5)

- Clear names and small components.
- No dead code, commented-out blocks, or `console.log`.
- State is minimal; derived values are computed.
- The structure matches the week's lesson.

### UX and accessibility (4)

- Empty and error states.
- Labels, keyboard access, visible focus.
- Responsive at mobile width.
- Clear feedback for actions.

### Process and reflection (3)

- Lint, tests, and build pass.
- The pull request is clear and includes screenshots.
- The reflection answers the questions honestly.
- The learner can explain their code.

---

## Capstone grade (100 points)

See [`final-project/rubric.md`](../final-project/rubric.md).

| Area | Points |
| --- | --- |
| Core features | 30 |
| Architecture and state | 15 |
| Data and persistence | 15 |
| UX, accessibility, responsive | 15 |
| Testing | 10 |
| Deployment and documentation | 10 |
| Demo and communication | 5 |

### Required-feature gate

Missing two or more of the following caps the capstone at **59**:

- Clean clone runs
- Session create + list + persist
- Subject create + list
- Session delete + toggle
- Dashboard totals
- Search + one filter
- Deployed URL
- 8+ tests
- README

---

## Participation (10 points)

| Item | Points |
| --- | --- |
| Attends or watches at least 8 of 10 sessions | 3 |
| Completes one peer review (Week 8) | 2 |
| Presents the TaskFlow demo (Week 8) | 2 |
| Presents the capstone demo (Week 10) | 2 |
| Submits the retrospective | 1 |

"Watches" means watched the recording and posted one question or takeaway. Passive
attendance without engagement does not count.

---

## Grade bands

| Final % | Band |
| --- | --- |
| 90–100 | Distinction |
| 80–89 | Merit |
| 70–79 | Pass with credit |
| 60–69 | Pass |
| 50–59 | Referred / resubmit |
| 0–49 | Fail |

Your institution may map these differently. Publish the mapping at the start.

---

## Late policy

| Delay | Penalty |
| --- | --- |
| Up to 48 hours | −10% of the assignment score |
| 3–7 days | −25% |
| More than 7 days | Grade capped at 50% |
| Capstone more than 7 days late | Requires an approved extension |

Extensions must be requested **before** the deadline, with a plan. Technical
problems are not automatic extensions; push early.

---

## Resubmissions

- Assignments scoring below 12/20 may be resubmitted once within 7 days.
- The resubmitted score is capped at 16/20.
- The capstone may be revised once within 7 days of feedback; the new score is
  capped at 75/100.
- A project that does not run receives 0 until it runs; fixing it is not a
  "resubmission" for cap purposes.

---

## Feedback timeline

| Event | Target |
| --- | --- |
| Weekly PR review | Within 2 working days |
| Assignment grade | Within 3 working days |
| Capstone feedback | Within 5 working days |
| Response to a direct question | Within 1 working day |

If the instructor is unavailable, a holding comment with a date is required.

---

## Academic integrity

Allowed:

- Documentation, tutorials, and AI for explanations.
- Discussing concepts with peers.
- Small snippets you understand and can attribute.

Not allowed:

- Copying a classmate's code.
- Submitting a tutorial project as your own.
- Code you cannot explain.
- Hiding generated code without understanding it.

The instructor may ask you to walk through any file. Failure to explain your
submission may result in a grade of 0 for that component.

---

## Calculating the final grade

```text
weekly = average(10 assignment scores / 20) × 50
capstone = (capstone score / 100) × 40
participation = (participation points / 10) × 10

final = weekly + capstone + participation
```

Example:

```text
Assignments: 17, 18, 16, 19, 15, 18, 17, 20, 16, 18
Average: 17.4 / 20 = 87%
Weekly: 87 × 0.50 = 43.5

Capstone: 84 / 100
Capstone contribution: 84 × 0.40 = 33.6

Participation: 9 / 10
Contribution: 9 × 0.10 = 0.9

Final: 43.5 + 33.6 + 0.9 = 78.0 → Merit
```

---

## Record keeping

Keep for each learner:

- Assignment scores and feedback links.
- Capstone score and rubric.
- Participation notes.
- Extension agreements.
- Integrity concerns and conversations.

Do not publish scores in a public channel. Use a private gradebook or direct
message.
