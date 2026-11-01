# StudySync — capstone rubric

**Total: 100 points** · 40% of the course grade

A project that does not run from a clean clone receives **0** until fixed.

---

## 1. Core features — 30 points

| Feature | Points | Full marks |
| --- | --- | --- |
| Subject CRUD | 6 | Create, edit, delete with confirmation; unique names; safe deletion policy |
| Session CRUD | 9 | Create, edit, delete, toggle; all fields; validation; persisted |
| Dashboard | 6 | Weekly totals, completed vs. total, per-subject progress, recent sessions, zero state |
| Search, filter, sort | 5 | Combined correctly; empty states; result count |
| Session detail | 2 | Renders by id; not-found state; back link |
| Routing and 404 | 2 | All required routes; active nav; 404 |
| **Subtotal** | **30** | |

Deductions:

- A required feature missing: full points for that row.
- A feature present but broken for a common case: half points for that row.
- Orphaned sessions after subject deletion: −3.
- Stored totals that drift from sessions: −3.

---

## 2. Architecture and state — 15 points

| Criterion | Points | Full marks |
| --- | --- | --- |
| Component structure | 4 | Small, focused components; pages compose; clear folders |
| State placement | 4 | Minimal state; local where possible; context only where shared |
| Reducers | 4 | Pure, exhaustive, tested; no mutation; unknown action handled |
| Custom hooks and context | 3 | Focused hooks; guarded context; memoized provider value |
| **Subtotal** | **15** | |

Deductions:

- Prop drilling that context was meant to solve: −2.
- Derived data in state: −2.
- A giant component over ~200 lines doing several jobs: −2.
- Context value recreated on every render causing broad re-renders: −1.

---

## 3. Data handling and persistence — 15 points

| Criterion | Points | Full marks |
| --- | --- | --- |
| Persistence | 4 | Versioned keys; read/write; survives refresh |
| Safe storage | 3 | `try/catch`; corrupt data falls back; no white screen |
| Data shapes | 3 | Correct types; ids stable; dates as `YYYY-MM-DD`; numbers not strings |
| Relationships | 3 | Sessions reference subjects; deletion is safe |
| Derived statistics | 2 | Correct week range; completed rules; no NaN |
| **Subtotal** | **15** | |

Deductions:

- Data lost on refresh: −4.
- App crashes on invalid stored JSON: −3.
- Timezone off-by-one on session dates: −2.
- "NaN" or `Infinity` displayed: −2.

---

## 4. UX, accessibility, and responsive design — 15 points

| Criterion | Points | Full marks |
| --- | --- | --- |
| Accessibility | 6 | Labels, keyboard, focus, announcements, contrast, landmarks |
| Responsive | 4 | 375 / 768 / 1280; no horizontal scroll; usable forms |
| Empty, loading, error states | 3 | Every list/form has a sensible state |
| Visual clarity | 2 | Hierarchy, spacing, readable typography, consistent components |
| **Subtotal** | **15** | |

Deductions:

- A core action is mouse-only: −3.
- Missing labels on inputs: −2.
- Filter state conveyed by colour only: −1.
- Broken layout at 375 px: −2.
- No empty state: −1.

---

## 5. Testing — 10 points

| Criterion | Points | Full marks |
| --- | --- | --- |
| Reducer coverage | 4 | Every action, including guards and unknown actions |
| Form/component tests | 3 | Invalid + valid submit; user interactions |
| Test quality | 3 | Behaviour-focused queries; independent; no snapshots of implementation |
| **Subtotal** | **10** | |

Deductions:

- Fewer than 8 meaningful tests: −1 per missing test (minimum 0).
- Tests that pass while the feature is broken: −3.
- Tests that depend on execution order: −2.
- Only trivial assertions: −3.

---

## 6. Deployment and documentation — 10 points

| Criterion | Points | Full marks |
| --- | --- | --- |
| Deployment | 4 | Live URL; routes refresh; mobile works |
| README | 4 | Setup, features, screenshots, data model, deletion policy, limitations |
| Repository hygiene | 2 | No secrets, `node_modules`, `dist`; clear commits; checks/CI |
| **Subtotal** | **10** | |

Deductions:

- Live URL missing: −4.
- Refresh 404 on a route: −2.
- README missing setup steps: −2.
- Secrets committed: −10 and a required rotation.
- `node_modules` committed: −2.

---

## 7. Demo and communication — 5 points

| Criterion | Points | Full marks |
| --- | --- | --- |
| Demo | 3 | Five minutes; core flows; deployed app; within time |
| Explanation | 2 | One decision and one trade-off explained clearly |
| **Subtotal** | **5** | |

Deductions:

- Over 6 minutes: −1.
- Reads code line by line: −1.
- Cannot explain a design decision: −2.
- Demos localhost or a broken build: −2.

---

## Score bands

| Score | Grade | Meaning |
| --- | --- | --- |
| 90–100 | Excellent | Complete, polished, tested, explainable |
| 80–89 | Good | Complete with minor gaps |
| 70–79 | Satisfactory | Core works; quality or edge cases weak |
| 60–69 | Developing | Important features missing or unstable |
| 50–59 | Needs work | Multiple required features missing |
| 0–49 | Not yet | Does not meet the brief or does not run |

---

## Required-feature gate

Regardless of points, all of these must work to pass:

- [ ] App runs from a clean clone.
- [ ] Session create + list + persist.
- [ ] Subject create + list.
- [ ] Session delete and toggle.
- [ ] Dashboard totals.
- [ ] One filter and search.
- [ ] Deployed URL.
- [ ] 8+ tests.
- [ ] README.

Missing two or more of these caps the score at **59**.

---

## Feedback template

```text
Score: __ / 100

Core features: __ / 30
Architecture: __ / 15
Data: __ / 15
UX/a11y/responsive: __ / 15
Testing: __ / 10
Deployment/docs: __ / 10
Demo: __ / 5

What works well:
-
-

What to fix next:
-
-

One thing to learn:
-
```
