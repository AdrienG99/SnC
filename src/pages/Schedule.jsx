import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { users } from '../data/seed.js'
import { addAssignment, addLog, loadState, saveState } from '../data/store.js'

function monthDays(year, month) {
  const first = new Date(year, month, 1)
  const days = []
  const pad = first.getDay()
  for (let i = 0; i < pad; i += 1) days.push(null)
  const count = new Date(year, month + 1, 0).getDate()
  for (let day = 1; day <= count; day += 1) {
    days.push(new Date(year, month, day))
  }
  return days
}

function iso(date) {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10)
}

export default function Schedule() {
  const { user, role } = useAuth()
  const [state, setState] = useState(loadState)
  const today = new Date()
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const athletes = users.filter((row) => row.roleId === 2)
  const [athleteId, setAthleteId] = useState(athletes[0].id)
  const [planId, setPlanId] = useState(state.workoutPlans[0]?.id ?? 1)
  const [selectedDate, setSelectedDate] = useState(iso(today))
  const [logForm, setLogForm] = useState({
    exerciseName: 'Back Squat',
    sets: 5,
    reps: 5,
    load: 185,
  })

  const days = useMemo(
    () => monthDays(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  )

  if (!user) return <Navigate to="/login" replace />

  const visibleAthleteId = role === 'athlete' ? user.id : athleteId
  const scopedAssignments = state.assignments.filter((row) =>
    role === 'coach' ? true : row.athleteId === user.id,
  )
  const dayAssignments = scopedAssignments.filter((row) => row.scheduledDate === selectedDate)
  const selectedAssignment = dayAssignments[0]

  const persist = (next) => {
    saveState(next)
    setState(next)
  }

  const assignDay = () => {
    if (role !== 'coach' || !selectedDate) return
    persist(
      addAssignment(state, {
        planId: Number(planId),
        athleteId: Number(visibleAthleteId),
        scheduledDate: selectedDate,
        status: 'scheduled',
      }),
    )
  }

  const logSet = (event) => {
    event.preventDefault()
    if (!selectedAssignment) return
    persist(
      addLog(state, {
        assignmentId: selectedAssignment.id,
        athleteId: selectedAssignment.athleteId,
        exerciseName: logForm.exerciseName.trim(),
        sets: Number(logForm.sets),
        reps: Number(logForm.reps),
        load: Number(logForm.load),
        loggedAt: selectedDate,
      }),
    )
  }

  return (
    <section className="split">
      <div className="panel">
        <div className="cal-head">
          <h1>
            {cursor.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h1>
          <div className="actions">
            <button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
              Prev
            </button>
            <button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
              Next
            </button>
          </div>
        </div>
        <div className="calendar">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
            <div key={label} className="dow">
              {label}
            </div>
          ))}
          {days.map((date, index) => {
            if (!date) return <div key={`empty-${index}`} className="day empty" />
            const key = iso(date)
            const count = scopedAssignments.filter((row) => row.scheduledDate === key).length
            return (
              <button
                key={key}
                type="button"
                className={`day ${key === selectedDate ? 'selected' : ''}`}
                onClick={() => setSelectedDate(key)}
              >
                <span>{date.getDate()}</span>
                {count ? <em>{count}</em> : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className="panel">
        <h2>{selectedDate}</h2>
        {role === 'coach' ? (
          <div className="stack">
            <label>
              Athlete
              <select value={visibleAthleteId} onChange={(e) => setAthleteId(Number(e.target.value))}>
                {athletes.map((athlete) => (
                  <option key={athlete.id} value={athlete.id}>
                    {athlete.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Plan
              <select value={planId} onChange={(e) => setPlanId(Number(e.target.value))}>
                {state.workoutPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="primary" type="button" onClick={assignDay}>
              Assign plan to this day
            </button>
          </div>
        ) : null}

        <ul className="list">
          {dayAssignments.length === 0 ? <li>No sessions on this day.</li> : null}
          {dayAssignments.map((row) => {
            const athlete = users.find((item) => item.id === row.athleteId)
            const plan = state.workoutPlans.find((item) => item.id === row.planId)
            return (
              <li key={row.id}>
                <strong>{plan?.name}</strong>
                <span>
                  {athlete?.name} · {row.status}
                </span>
              </li>
            )
          })}
        </ul>

        {selectedAssignment ? (
          <form onSubmit={logSet} className="grid-form">
            <h2>Log a set</h2>
            <label>
              Exercise
              <input
                value={logForm.exerciseName}
                onChange={(e) => setLogForm({ ...logForm, exerciseName: e.target.value })}
              />
            </label>
            <label>
              Load
              <input
                type="number"
                value={logForm.load}
                onChange={(e) => setLogForm({ ...logForm, load: e.target.value })}
              />
            </label>
            <label>
              Sets
              <input
                type="number"
                value={logForm.sets}
                onChange={(e) => setLogForm({ ...logForm, sets: e.target.value })}
              />
            </label>
            <label>
              Reps
              <input
                type="number"
                value={logForm.reps}
                onChange={(e) => setLogForm({ ...logForm, reps: e.target.value })}
              />
            </label>
            <button className="primary" type="submit">
              Save log
            </button>
          </form>
        ) : null}
      </div>
    </section>
  )
}
