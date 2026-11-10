export const STORAGE_KEY = 'sc-app-v1'

export const roles = [
  { id: 1, name: 'coach' },
  { id: 2, name: 'athlete' },
]

export const users = [
  {
    id: 1,
    roleId: 1,
    name: 'Marcus Hale',
    email: 'marcus.coach@sc.app',
    password: 'coach123',
  },
  {
    id: 2,
    roleId: 2,
    name: 'Avery Cole',
    email: 'avery.athlete@sc.app',
    password: 'athlete123',
  },
  {
    id: 3,
    roleId: 2,
    name: 'Jordan Blake',
    email: 'jordan.athlete@sc.app',
    password: 'athlete123',
  },
]

export const subscriptions = [
  {
    id: 1,
    name: 'Athlete Monthly',
    price: 29,
    durationDays: 30,
    description: 'Program access, calendar assignments, and PR tracking.',
  },
  {
    id: 2,
    name: 'Athlete Quarterly',
    price: 79,
    durationDays: 90,
    description: 'Three months of coaching access at a lower monthly rate.',
  },
  {
    id: 3,
    name: 'Coach Seat',
    price: 49,
    durationDays: 30,
    description: 'Build plans, assign athletes, and review performance logs.',
  },
]

export const paymentMethods = []

export const orders = []

export const workoutPlans = [
  {
    id: 1,
    coachId: 1,
    name: '4-Week Strength Block',
    weeks: 4,
    notes: 'Lower-body emphasis. Add load when all prescribed reps are clean.',
  },
]

export const exercises = [
  { id: 1, planId: 1, name: 'Back Squat', sets: 5, reps: 5, targetLoad: 225, week: 1, day: 1 },
  { id: 2, planId: 1, name: 'Bench Press', sets: 5, reps: 5, targetLoad: 185, week: 1, day: 2 },
  { id: 3, planId: 1, name: 'Deadlift', sets: 3, reps: 5, targetLoad: 275, week: 1, day: 3 },
  { id: 4, planId: 1, name: 'Overhead Press', sets: 4, reps: 6, targetLoad: 115, week: 1, day: 4 },
]

export const assignments = [
  { id: 1, planId: 1, athleteId: 2, scheduledDate: '2026-10-27', status: 'scheduled' },
  { id: 2, planId: 1, athleteId: 2, scheduledDate: '2026-10-29', status: 'scheduled' },
  { id: 3, planId: 1, athleteId: 3, scheduledDate: '2026-10-28', status: 'scheduled' },
]

export const performanceLogs = [
  {
    id: 1,
    assignmentId: 1,
    athleteId: 2,
    exerciseName: 'Back Squat',
    sets: 5,
    reps: 5,
    load: 230,
    loggedAt: '2026-10-20',
  },
  {
    id: 2,
    assignmentId: 1,
    athleteId: 2,
    exerciseName: 'Bench Press',
    sets: 5,
    reps: 5,
    load: 190,
    loggedAt: '2026-10-21',
  },
  {
    id: 3,
    assignmentId: 3,
    athleteId: 3,
    exerciseName: 'Deadlift',
    sets: 3,
    reps: 5,
    load: 315,
    loggedAt: '2026-10-22',
  },
  {
    id: 4,
    assignmentId: 1,
    athleteId: 2,
    exerciseName: 'Back Squat',
    sets: 3,
    reps: 3,
    load: 245,
    loggedAt: '2026-10-24',
  },
]

export function createSeedState() {
  return {
    roles: structuredClone(roles),
    users: structuredClone(users),
    subscriptions: structuredClone(subscriptions),
    paymentMethods: structuredClone(paymentMethods),
    orders: structuredClone(orders),
    workoutPlans: structuredClone(workoutPlans),
    exercises: structuredClone(exercises),
    assignments: structuredClone(assignments),
    performanceLogs: structuredClone(performanceLogs),
  }
}

export function nextId(rows) {
  return rows.reduce((max, row) => Math.max(max, row.id), 0) + 1
}
