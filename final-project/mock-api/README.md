# Mock API

A ready-to-run fake REST API for StudySync, powered by `json-server`.

## Run

```bash
cd final-project/mock-api
npx json-server@0.17.4 db.json --port 4000
```

Endpoints:

- `http://localhost:4000/subjects`
- `http://localhost:4000/sessions`

The full contract and response examples are in
[`../api-contract.md`](../api-contract.md).

## Notes

- Data resets when you stop the server (unless you edit `db.json`).
- Dates in `db.json` are examples. Update them to the current week if you want the
  dashboard to show data.
- This is a development tool only. Do not deploy it.
- The client must still enforce the subject-deletion rule.
