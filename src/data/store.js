import { STORAGE_KEY, createSeedState, nextId } from './seed.js'

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }

  const seed = createSeedState()
  saveState(seed)
  return seed
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY)
  return loadState()
}

export function addPlan(state, plan) {
  const workoutPlans = [...state.workoutPlans, { ...plan, id: nextId(state.workoutPlans) }]
  return { ...state, workoutPlans }
}

export function addExercise(state, exercise) {
  const exercises = [...state.exercises, { ...exercise, id: nextId(state.exercises) }]
  return { ...state, exercises }
}

export function addAssignment(state, assignment) {
  const assignments = [...state.assignments, { ...assignment, id: nextId(state.assignments) }]
  return { ...state, assignments }
}

export function addLog(state, log) {
  const performanceLogs = [
    ...state.performanceLogs,
    { ...log, id: nextId(state.performanceLogs) },
  ]
  return { ...state, performanceLogs }
}

export function addOrder(state, order, paymentMethod) {
  const paymentMethods = [
    ...state.paymentMethods,
    { ...paymentMethod, id: nextId(state.paymentMethods) },
  ]
  const orders = [
    ...state.orders,
    {
      ...order,
      id: nextId(state.orders),
      paymentMethodId: paymentMethods.at(-1).id,
    },
  ]
  return { ...state, paymentMethods, orders }
}

export function personalRecords(logs, athleteId) {
  const scoped = athleteId ? logs.filter((log) => log.athleteId === athleteId) : logs
  const best = new Map()

  for (const log of scoped) {
    const current = best.get(log.exerciseName)
    if (!current || log.load > current.load) {
      best.set(log.exerciseName, log)
    }
  }

  return [...best.values()].sort((a, b) => b.load - a.load)
}
