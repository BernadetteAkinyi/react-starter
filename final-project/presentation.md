# StudySync — 5-minute demo script

Rehearse twice with a timer. Record a backup.

---

## Before you start

- [ ] Deployed app open in a clean browser profile (or with known seed data).
- [ ] Localhost tab closed. Demo the deployment.
- [ ] A backup recording exists.
- [ ] Notifications silenced.
- [ ] Browser zoom at 100%, window at a readable size.
- [ ] Test data ready: 3 subjects, at least 5 sessions.
- [ ] Slide with the route table and data model (optional).

---

## 0:00–0:30 — Problem and user

> "Students study across several subjects but cannot see where their time goes.
> StudySync is a study planner for a student taking four courses. It tracks
> subjects and sessions, then shows a weekly picture of progress."

Do not start with your tech stack.

---

## 0:30–1:00 — Shape of the app

Show the route table or click through the nav quickly:

> "There are five screens: a dashboard, a sessions list, a create form, a detail
> page, and subject management. Sessions belong to subjects; deleting a subject is
> blocked while sessions still use it."

Keep this under 30 seconds.

---

## 1:00–3:30 — Core flows

### Flow 1: Create a subject (20 seconds)

- Go to Subjects.
- Add "Biology", pick a colour, set a weekly target.
- Show it in the list.

### Flow 2: Log a session (40 seconds)

- Go to Sessions → New.
- Choose Biology, title "Cell biology review", today's date, 50 minutes.
- Submit.
- Show the success message and the new row.

### Flow 3: Dashboard (30 seconds)

- Go to Dashboard.
- Point out weekly total, completed vs. total, Biology progress, recent sessions.
- Say: "These are derived from sessions, not stored separately."

### Flow 4: Filter and detail (30 seconds)

- Go to Sessions.
- Search "cell", filter by Biology, sort by duration.
- Open the session detail.
- Toggle it complete.
- Go back; the dashboard total updated.

### Flow 5: Edit and delete (20 seconds)

- Edit the session's duration to 60 minutes.
- Delete a different session, confirming the dialog.
- Mention the empty state if you can show it safely.

---

## 3:30–4:15 — One decision and one trade-off

Pick one:

> "I stored sessions with a `subjectId`, not a copy of the subject. That keeps
> names and colours consistent after an edit. The trade-off is that deleting a
> subject needs a guard, so I block deletion while sessions exist."

or:

> "I used two reducers and one data provider. That keeps subject and session
> transitions testable, but it means a single screen can trigger two dispatches.
> I kept the provider thin and documented the order."

Do not list every library.

---

## 4:15–4:45 — One bug and the fix

> "Sessions appeared one day early. `new Date('2026-11-03')` parses as UTC
> midnight, and my timezone is behind UTC. I wrote a `parseDateOnly` helper that
> splits the string and builds a local date. I added a test for it."

Explain the cause, not only the symptom.

---

## 4:45–5:00 — Next steps

> "Next I would add a weekly chart and import from a calendar. The core is
> deployed and tested; the README has the data model and setup."

Stop talking at five minutes.

---

## Questions to prepare for

1. Why did you choose Context instead of props?
2. How do you prevent duplicate subjects?
3. What happens to sessions when a subject is deleted?
4. Where are totals calculated?
5. How would you add a real backend?
6. What was the hardest bug?
7. What would you refactor?
8. Which requirement did you cut, and why?
9. How do you know the app works?
10. What did you learn that you will use again?

---

## Recording checklist

- [ ] Screen and microphone recorded.
- [ ] Browser notifications off.
- [ ] No secrets, tokens, or personal data on screen.
- [ ] Video length ≤ 5:30.
- [ ] Link is viewable by the instructor (unlisted is fine).
- [ ] Link added to the README and the submission.
