# Ironworks S&C

MCDA 5510 group project: strength and conditioning programming, calendar assignments, PR tracking, and a subscription checkout with custom validation.

The React app runs against `localStorage` so the UI is demoable without Azure. `server/` is an in-memory REST skeleton for the same 9 entities; swap that store for Azure SQL later.

## Run

```bash
npm install
npm run dev
```

Optional API (port 3001, proxied through Vite as `/api`):

```bash
npm run dev:api
```

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Coach | marcus.coach@sc.app | coach123 |
| Athlete | avery.athlete@sc.app | athlete123 |
| Athlete | jordan.athlete@sc.app | athlete123 |

Valid checkout sample: name `Avery Cole`, phone `902-555-0147`, Canada postal `B3H 0A1`, Visa `4111111111111111`, expiry `12/27`.

## Who owns what

- Adrien: app shell, workout builder, schedule
- Johnson: storefront, `src/validation/rules.js`, PR tracker UI
- Mohamad: `server/index.js` → Azure SQL + App Service + CI/CD

## 9 entities

`User`, `Role`, `Subscription`, `PaymentMethod`, `Order`, `WorkoutPlan`, `Exercise`, `Assignment`, `PerformanceLog`
