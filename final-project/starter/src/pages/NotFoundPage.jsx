import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section>
      <p className="eyebrow">404</p>
      <h1>This page wandered off.</h1>
      <p className="lede">The link may be old, or the page may have moved.</p>
      <Link className="button" to="/">
        Back to the dashboard
      </Link>
    </section>
  )
}
