import cors from 'cors'
import express from 'express'
import { createSeedState, nextId } from '../src/data/seed.js'

const app = express()
const port = process.env.PORT || 3001
let db = createSeedState()

app.use(cors())
app.use(express.json())

const resources = [
  'roles',
  'users',
  'subscriptions',
  'paymentMethods',
  'orders',
  'workoutPlans',
  'exercises',
  'assignments',
  'performanceLogs',
]

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, store: 'memory', entities: resources.length })
})

for (const resource of resources) {
  app.get(`/api/${resource}`, (_req, res) => {
    res.json(db[resource])
  })

  app.post(`/api/${resource}`, (req, res) => {
    const row = { ...req.body, id: nextId(db[resource]) }
    db[resource] = [...db[resource], row]
    res.status(201).json(row)
  })
}

app.post('/api/reset', (_req, res) => {
  db = createSeedState()
  res.json({ ok: true })
})

app.listen(port, () => {
  console.log(`Ironworks API on http://localhost:${port}`)
})
