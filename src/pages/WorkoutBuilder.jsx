import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { addExercise, addPlan, loadState, saveState } from '../data/store.js'

const emptyPlan = { name: '', weeks: 4, notes: '' }
const emptyLift = { name: '', sets: 5, reps: 5, targetLoad: 135, week: 1, day: 1 }

export default function WorkoutBuilder() {
  const { user, role } = useAuth()
  const [state, setState] = useState(loadState)
  const [planForm, setPlanForm] = useState(emptyPlan)
  const [liftForm, setLiftForm] = useState(emptyLift)
  const [selectedPlanId, setSelectedPlanId] = useState(state.workoutPlans[0]?.id ?? null)
  const plans = useMemo(
    () => state.workoutPlans.filter((plan) => plan.coachId === user?.id),
    [state.workoutPlans, user?.id],
  )

  if (!user) return <Navigate to="/login" replace />
  if (role !== 'coach') {
    return (
      <section className="panel">
        <h1>Coach only</h1>
        <p>Sign in as Marcus Hale to build and edit programs.</p>
      </section>
    )
  }

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0]
  const lifts = state.exercises.filter((exercise) => exercise.planId === selectedPlan?.id)

  const persist = (next) => {
    saveState(next)
    setState(next)
  }

  const createPlan = (event) => {
    event.preventDefault()
    if (!planForm.name.trim()) return
    const next = addPlan(state, {
      coachId: user.id,
      name: planForm.name.trim(),
      weeks: Number(planForm.weeks) || 1,
      notes: planForm.notes.trim(),
    })
    persist(next)
    setSelectedPlanId(next.workoutPlans.at(-1).id)
    setPlanForm(emptyPlan)
  }

  const createLift = (event) => {
    event.preventDefault()
    if (!selectedPlan || !liftForm.name.trim()) return
    persist(
      addExercise(state, {
        ...liftForm,
        planId: selectedPlan.id,
        name: liftForm.name.trim(),
        sets: Number(liftForm.sets),
        reps: Number(liftForm.reps),
        targetLoad: Number(liftForm.targetLoad),
        week: Number(liftForm.week),
        day: Number(liftForm.day),
      }),
    )
    setLiftForm({ ...emptyLift, week: liftForm.week, day: liftForm.day })
  }

  return (
    <section className="split">
      <div className="panel">
        <h1>Workout builder</h1>
        <form onSubmit={createPlan} className="stack">
          <label>
            Plan name
            <input
              value={planForm.name}
              onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
              placeholder="Off-season hypertrophy"
            />
          </label>
          <label>
            Weeks
            <input
              type="number"
              min="1"
              max="16"
              value={planForm.weeks}
              onChange={(e) => setPlanForm({ ...planForm, weeks: e.target.value })}
            />
          </label>
          <label>
            Notes
            <textarea
              value={planForm.notes}
              onChange={(e) => setPlanForm({ ...planForm, notes: e.target.value })}
            />
          </label>
          <button className="primary" type="submit">
            Create plan
          </button>
        </form>
        <ul className="list">
          {plans.map((plan) => (
            <li key={plan.id}>
              <button
                type="button"
                className={plan.id === selectedPlan?.id ? 'selected' : ''}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                {plan.name}
                <span>{plan.weeks} weeks</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <h2>{selectedPlan ? selectedPlan.name : 'No plan selected'}</h2>
        {selectedPlan ? (
          <>
            <p>{selectedPlan.notes || 'No notes yet.'}</p>
            <form onSubmit={createLift} className="grid-form">
              <label>
                Exercise
                <input
                  value={liftForm.name}
                  onChange={(e) => setLiftForm({ ...liftForm, name: e.target.value })}
                  placeholder="Front squat"
                />
              </label>
              <label>
                Sets
                <input
                  type="number"
                  min="1"
                  value={liftForm.sets}
                  onChange={(e) => setLiftForm({ ...liftForm, sets: e.target.value })}
                />
              </label>
              <label>
                Reps
                <input
                  type="number"
                  min="1"
                  value={liftForm.reps}
                  onChange={(e) => setLiftForm({ ...liftForm, reps: e.target.value })}
                />
              </label>
              <label>
                Target load
                <input
                  type="number"
                  min="0"
                  value={liftForm.targetLoad}
                  onChange={(e) => setLiftForm({ ...liftForm, targetLoad: e.target.value })}
                />
              </label>
              <label>
                Week
                <input
                  type="number"
                  min="1"
                  value={liftForm.week}
                  onChange={(e) => setLiftForm({ ...liftForm, week: e.target.value })}
                />
              </label>
              <label>
                Day
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={liftForm.day}
                  onChange={(e) => setLiftForm({ ...liftForm, day: e.target.value })}
                />
              </label>
              <button className="primary" type="submit">
                Add exercise
              </button>
            </form>
            <table>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Day</th>
                  <th>Lift</th>
                  <th>Rx</th>
                </tr>
              </thead>
              <tbody>
                {lifts.map((lift) => (
                  <tr key={lift.id}>
                    <td>{lift.week}</td>
                    <td>{lift.day}</td>
                    <td>{lift.name}</td>
                    <td>
                      {lift.sets}×{lift.reps} @ {lift.targetLoad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}
      </div>
    </section>
  )
}
