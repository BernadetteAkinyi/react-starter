# StudySync — optional mock API

The capstone can store everything in `localStorage`. If you want to practise
server data, use the included mock API. It is **optional** and not graded
separately.

Base URL: `http://localhost:4000`

---

## Run it

```bash
cd final-project/mock-api
npx json-server@0.17.4 db.json --port 4000
```

Then set:

```bash
# .env.local
VITE_API_URL=http://localhost:4000
```

Restart the dev server after changing the env file.

> `json-server` is a development tool. Never use it in production.

---

## Resources

### `GET /subjects`

```json
[
  {
    "id": "sub-react",
    "name": "React",
    "color": "#d9572f",
    "targetMinutesPerWeek": 300
  }
]
```

### `GET /subjects/:id`

Returns one subject or `404`.

### `POST /subjects`

```json
{
  "name": "Biology",
  "color": "#3f7d58",
  "targetMinutesPerWeek": 240
}
```

Returns the created subject with an `id`.

### `PATCH /subjects/:id`

Send only the fields to change.

### `DELETE /subjects/:id`

Returns `{}` on success.

> The mock API does **not** enforce the deletion rule. Your app must still block
> or reassign. If you use the API, implement the rule on the client before
> calling `DELETE`.

---

### `GET /sessions`

```json
[
  {
    "id": "ses-1",
    "subjectId": "sub-react",
    "title": "Hooks practice",
    "date": "2026-11-03",
    "minutes": 50,
    "notes": "useReducer and context",
    "completed": true,
    "createdAt": "2026-11-03T10:00:00.000Z"
  }
]
```

### Filtering

`json-server` supports simple query parameters:

```text
GET /sessions?subjectId=sub-react
GET /sessions?completed=true
GET /sessions?q=hooks
```

For combined search, subject, status, and sort, it is usually simpler to fetch
all sessions and filter in the client. Document which approach you chose.

### `GET /sessions/:id`

Returns one session or `404`.

### `POST /sessions`

```json
{
  "subjectId": "sub-react",
  "title": "Context refactor",
  "date": "2026-11-04",
  "minutes": 45,
  "notes": "",
  "completed": false,
  "createdAt": "2026-11-04T09:00:00.000Z"
}
```

### `PATCH /sessions/:id`

Send only the fields to change.

### `DELETE /sessions/:id`

Returns `{}` on success.

---

## Error contract

| Status | Meaning | UI behaviour |
| --- | --- | --- |
| `200` | OK | Render data |
| `201` | Created | Close form, show success |
| `400` | Bad request | Show validation message |
| `404` | Not found | Show not-found state |
| `500` | Server error | Show retry message |

Always check `response.ok`. `fetch` does not reject on `4xx`/`5xx`.

---

## Data rules

- `id` is a string.
- `date` is `YYYY-MM-DD`.
- `minutes` is an integer.
- `completed` is a boolean.
- `targetMinutesPerWeek` is an integer.
- `createdAt` is an ISO 8601 timestamp.
- A session's `subjectId` must exist in `/subjects`.

Validate on the client. The mock API accepts almost anything, so it will not
protect your UI from bad data.

---

## If you use the API instead of localStorage

You still need:

- Loading, error, and empty states.
- Optimistic updates or refetching after mutations.
- Deduplication or correct ids.
- Tests that mock `fetch`.
- A README note that the demo requires the mock API, **or** a fallback to local
  storage so the deployed app works without it.

For a deployed capstone, local storage is simpler and more reliable. Use the API
only if you can keep the deployment usable.
