# StudySync — project proposal

Fill this in during Week 9. Get it approved before building the full app.

**Name:**
**Repository:**
**Draft deployment:**

---

## 1. Problem

In two sentences, what problem does this app solve?

> Example: Students study across several subjects but cannot see where their time
> goes. StudySync turns logged sessions into a weekly picture of progress.

---

## 2. Target user

Who is this for? Be specific.

> Example: A university student taking four courses who wants to prepare for
> exams without guessing which subject needs attention.

---

## 3. User stories

Write three. Use the format "As a …, I want …, so that …".

1.
2.
3.

---

## 4. Scope

### In scope

- [ ] Subject CRUD
- [ ] Session CRUD
- [ ] Dashboard weekly stats
- [ ] Search, filter, sort
- [ ] Session detail
- [ ] Persistence
- [ ] Tests
- [ ] Deployment
- [ ] README + demo

### Out of scope

List at least three things you will **not** build. This protects your time.

1.
2.
3.

---

## 5. Routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` |  |  |
| `/sessions` |  |  |
| `/sessions/new` |  |  |
| `/sessions/:sessionId` |  |  |
| `/subjects` |  |  |
| `*` |  |  |

---

## 6. Data model

```js
// Subject
{
  id: '',
  name: '',
  color: '#000000',
  targetMinutesPerWeek: 0
}

// Session
{
  id: '',
  subjectId: '',
  title: '',
  date: 'YYYY-MM-DD',
  minutes: 0,
  notes: '',
  completed: false,
  createdAt: ''
}
```

### Relationships

- One subject has many sessions.
- A session belongs to exactly one subject.
- When a subject is deleted, sessions are: **blocked / reassigned** (choose one).

### Storage keys

```js
studysync.subjects.v1
studysync.sessions.v1
studysync.theme.v1 // if you add a theme
```

---

## 7. Component tree

```text
App
├── ThemeProvider (optional)
├── DataProvider
├── BrowserRouter
│   └── Routes
│       └── Layout
│           ├── Header
│           ├── Outlet
│           │   ├── DashboardPage
│           │   ├── SessionsPage
│           │   ├── SessionFormPage
│           │   ├── SessionDetailPage
│           │   ├── SubjectsPage
│           │   └── NotFoundPage
│           └── Footer
```

Add the components you expect under each page.

---

## 8. Weekly stats rules

Define exactly how you calculate:

- Start of week: **Monday / Sunday** (choose)
- Total studied: completed sessions only? **Yes / No**
- Sessions completed vs. total: which date range?
- Per-subject progress: target or no target?
- Recent sessions: how many, sorted how?

Write the rules down so the implementation and tests agree.

---

## 9. Stretch goals (max two)

1.
2.

Only start these after every Must requirement is complete.

---

## 10. Risks

What could stop you? What is your fallback?

| Risk | Likelihood | Plan |
| --- | --- | --- |
|  |  |  |
|  |  |  |

---

## 11. Definition of done

- [ ] All Must requirements in `requirements.md`
- [ ] 8+ meaningful tests
- [ ] Keyboard and mobile pass
- [ ] Deployed and refresh-safe
- [ ] README + screenshots
- [ ] 5-minute demo
- [ ] Retrospective

---

## Instructor approval

- [ ] Approved
- [ ] Approved with changes (see comments)
- [ ] Revise and resubmit

**Reviewer:**  
**Date:**  
**Notes:**
