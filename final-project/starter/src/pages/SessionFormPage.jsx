import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { seedSubjects } from '../data/seed.js'

/**
 * Static form shell. Week 9/10: make it controlled, validate it, and wire it to
 * your sessions reducer. The fields and labels are already here.
 */
export default function SessionFormPage() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">New session</p>
          <h1>Log a study session</h1>
        </div>
        <Link to="/sessions">Cancel</Link>
      </div>

      {submitted && (
        <p role="status" className="notice">
          Form shell only — nothing was saved. Wire this to your reducer.
        </p>
      )}

      <form className="form panel" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="session-title">Title</label>
          <input id="session-title" name="title" placeholder="Hooks practice" />
        </div>

        <div className="field">
          <label htmlFor="session-subject">Subject</label>
          <select id="session-subject" name="subjectId" defaultValue="">
            <option value="" disabled>
              Choose a subject
            </option>
            {seedSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="session-date">Date</label>
            <input id="session-date" name="date" type="date" />
          </div>
          <div className="field">
            <label htmlFor="session-minutes">Minutes</label>
            <input
              id="session-minutes"
              name="minutes"
              type="number"
              min="1"
              max="600"
              placeholder="50"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="session-notes">Notes (optional)</label>
          <textarea id="session-notes" name="notes" rows="3" />
        </div>

        <div className="form-actions">
          <button className="button" type="submit">
            Save session
          </button>
          <button
            className="button button-ghost"
            type="button"
            onClick={() => navigate('/sessions')}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}
