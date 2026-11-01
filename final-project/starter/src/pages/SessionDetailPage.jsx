import { Link, useParams } from 'react-router-dom'
import { seedSessions, seedSubjects, subjectName } from '../data/seed.js'

export default function SessionDetailPage() {
  const { sessionId } = useParams()
  const session = seedSessions.find((item) => item.id === sessionId)

  if (!session) {
    return (
      <section>
        <p className="eyebrow">Not found</p>
        <h1>This session does not exist.</h1>
        <p className="lede">
          It may have been deleted, or the link may be old.
        </p>
        <Link className="button" to="/sessions">
          Back to sessions
        </Link>
      </section>
    )
  }

  return (
    <>
      <p className="eyebrow">
        {subjectName(seedSubjects, session.subjectId)} · {session.date}
      </p>
      <h1>{session.title}</h1>
      <p className="lede">
        {session.minutes} minutes · {session.completed ? 'Completed' : 'Open'}
      </p>

      {session.notes && (
        <section className="panel">
          <h2>Notes</h2>
          <p>{session.notes}</p>
        </section>
      )}

      <p className="actions">
        <Link to="/sessions">← Back to sessions</Link>
      </p>

      {/* TODO Week 10: Edit and Delete actions. */}
    </>
  )
}
