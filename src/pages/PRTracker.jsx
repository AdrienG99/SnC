import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { users } from '../data/seed.js'
import { loadState, personalRecords } from '../data/store.js'

export default function PRTracker() {
  const { user, role } = useAuth()
  if (!user) return <Navigate to="/login" replace />

  const state = loadState()
  const athleteId = role === 'athlete' ? user.id : null
  const records = personalRecords(state.performanceLogs, athleteId)
  const logs = athleteId
    ? state.performanceLogs.filter((log) => log.athleteId === athleteId)
    : state.performanceLogs

  return (
    <section className="panel">
      <h1>PR tracker</h1>
      <p>
        Best recorded load by lift
        {athleteId ? ` for ${user.name}` : ' across all athletes'}.
      </p>
      <div className="cards">
        {records.map((record) => (
          <article key={record.exerciseName}>
            <h2>{record.exerciseName}</h2>
            <p className="pr">{record.load}</p>
            <span>
              {users.find((row) => row.id === record.athleteId)?.name} · {record.loggedAt}
            </span>
          </article>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Athlete</th>
            <th>Lift</th>
            <th>Sets × reps</th>
            <th>Load</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.loggedAt}</td>
              <td>{users.find((row) => row.id === log.athleteId)?.name}</td>
              <td>{log.exerciseName}</td>
              <td>
                {log.sets}×{log.reps}
              </td>
              <td>{log.load}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
