import { Link } from 'react-router-dom'
import { seedSessions, seedSubjects, subjectName } from '../data/seed.js'

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest}m`
  if (rest === 0) return `${hours}h`
  return `${hours}h ${rest}m`
}

// TODO Week 9: compute this from the current week, not all seed data.
const completed = seedSessions.filter((session) => session.completed)
const totalMinutes = completed.reduce(
  (sum, session) => sum + session.minutes,
  0,
)

export default function DashboardPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">This week</p>
        <h1>See where your study time goes.</h1>
        <p className="lede">
          Starter scaffold. Wire real state, persistence, and weekly
          calculations in Week 9. The numbers below use seed data.
        </p>
      </section>

      <section className="stats" aria-label="Weekly summary">
        <div className="stat">
          <strong>{formatDuration(totalMinutes)}</strong>
          <span>studied</span>
        </div>
        <div className="stat">
          <strong>{completed.length}</strong>
          <span>completed</span>
        </div>
        <div className="stat">
          <strong>{seedSessions.length - completed.length}</strong>
          <span>open</span>
        </div>
      </section>

      <section className="panel" aria-labelledby="recent-heading">
        <div className="panel-head">
          <h2 id="recent-heading">Recent sessions</h2>
          <Link to="/sessions">View all</Link>
        </div>

        <ul className="session-list">
          {seedSessions
            .slice(-4)
            .reverse()
            .map((session) => (
              <li key={session.id} className="session">
                <div>
                  <Link
                    to={`/sessions/${session.id}`}
                    className="session-title"
                  >
                    {session.title}
                  </Link>
                  <p className="session-meta">
                    {subjectName(seedSubjects, session.subjectId)} ·{' '}
                    {session.date}
                  </p>
                </div>
                <div className="session-side">
                  <span>{formatDuration(session.minutes)}</span>
                  <span className={session.completed ? 'done' : 'open'}>
                    {session.completed ? 'Done' : 'Open'}
                  </span>
                </div>
              </li>
            ))}
        </ul>
      </section>

      <p className="actions">
        <Link className="button" to="/sessions/new">
          Log a session
        </Link>
      </p>
    </>
  )
}
