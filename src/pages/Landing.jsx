import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <section className="hero-panel">
      <p className="eyebrow">MCDA 5510 group project</p>
      <h1>Program the block. Track the PRs. Sell the seat.</h1>
      <p className="lede">
        A coach-facing strength and conditioning platform: multi-week plans, calendar
        assignments, performance logs, and a subscription checkout with course-required
        validation.
      </p>
      <div className="actions">
        <Link className="primary" to="/login">
          Sign in to demo
        </Link>
        <Link className="ghost" to="/store">
          View subscriptions
        </Link>
      </div>
      <ul className="feature-grid">
        <li>
          <h2>Workout builder</h2>
          <p>Create weeks, days, and prescribed sets / reps / load for athletes.</p>
        </li>
        <li>
          <h2>Dynamic schedule</h2>
          <p>Drop a plan onto a calendar day for a specific athlete.</p>
        </li>
        <li>
          <h2>PR tracker</h2>
          <p>Lifetime max load per lift, derived from performance logs.</p>
        </li>
      </ul>
    </section>
  )
}
