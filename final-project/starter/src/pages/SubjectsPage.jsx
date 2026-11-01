import { Link } from 'react-router-dom'
import { seedSubjects } from '../data/seed.js'

export default function SubjectsPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">Subjects</p>
          <h1>Your subjects</h1>
          <p className="lede">
            Starter list. Add create, edit, and a safe delete policy.
          </p>
        </div>
      </div>

      <ul className="subject-grid">
        {seedSubjects.map((subject) => (
          <li key={subject.id} className="subject-card panel">
            <span
              className="subject-dot"
              style={{ backgroundColor: subject.color }}
              aria-hidden="true"
            />
            <h2>{subject.name}</h2>
            <p>Target: {subject.targetMinutesPerWeek} min/week</p>
            <p className="session-meta">
              {subject.targetMinutesPerWeek > 0
                ? 'Progress will appear here'
                : 'No weekly target'}
            </p>
          </li>
        ))}
      </ul>

      <p className="actions">
        <Link className="button" to="/sessions/new">
          Log a session
        </Link>
      </p>
    </>
  )
}
