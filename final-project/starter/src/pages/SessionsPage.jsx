import { Link } from 'react-router-dom'
import { seedSessions, seedSubjects, subjectName } from '../data/seed.js'

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest}m`
  if (rest === 0) return `${hours}h`
  return `${hours}h ${rest}m`
}

export default function SessionsPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">Sessions</p>
          <h1>All study sessions</h1>
          <p className="lede">
            Starter list. Add search, filters, sorting, and a real empty state.
          </p>
        </div>
        <Link className="button" to="/sessions/new">
          Log a session
        </Link>
      </div>

      <ul className="session-list panel">
        {seedSessions.map((session) => (
          <li key={session.id} className="session">
            <div>
              <Link to={`/sessions/${session.id}`} className="session-title">
                {session.title}
              </Link>
              <p className="session-meta">
                {subjectName(seedSubjects, session.subjectId)} · {session.date}{' '}
                · {formatDuration(session.minutes)}
              </p>
            </div>
            <span className={session.completed ? 'done' : 'open'}>
              {session.completed ? 'Done' : 'Open'}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
