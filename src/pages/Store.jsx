import { useState } from 'react'
import { addOrder, loadState, saveState } from '../data/store.js'
import { hasErrors, validateCheckout } from '../validation/rules.js'
import { useAuth } from '../context/useAuth.js'

const emptyForm = {
  name: '',
  phone: '',
  country: 'CA',
  postalCode: '',
  cardNumber: '',
  expiry: '',
}

export default function Store() {
  const { user } = useAuth()
  const [state, setState] = useState(loadState)
  const [selectedId, setSelectedId] = useState(state.subscriptions[0].id)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [receipt, setReceipt] = useState(null)
  const selected = state.subscriptions.find((row) => row.id === selectedId)

  const update = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value })
  }

  const checkout = (event) => {
    event.preventDefault()
    const nextErrors = validateCheckout(form)
    setErrors(nextErrors)
    if (hasErrors(nextErrors) || !selected) return

    const next = addOrder(
      state,
      {
        userId: user?.id ?? 0,
        subscriptionId: selected.id,
        amount: selected.price,
        status: 'authorized',
        createdAt: new Date().toISOString(),
      },
      {
        userId: user?.id ?? 0,
        brand: form.cardNumber.startsWith('4') ? 'Visa' : 'Card',
        last4: form.cardNumber.replace(/\D/g, '').slice(-4),
      },
    )
    saveState(next)
    setState(next)
    setReceipt(selected)
    setForm(emptyForm)
  }

  return (
    <section className="split">
      <div className="panel">
        <h1>Subscription store</h1>
        <p>Internal authorization only. No Stripe or PayPal.</p>
        <div className="cards">
          {state.subscriptions.map((plan) => (
            <button
              key={plan.id}
              type="button"
              className={`product ${plan.id === selectedId ? 'selected' : ''}`}
              onClick={() => setSelectedId(plan.id)}
            >
              <h2>{plan.name}</h2>
              <p className="pr">${plan.price}</p>
              <span>{plan.description}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="panel">
        <h2>Checkout · {selected?.name}</h2>
        <form onSubmit={checkout} className="stack">
          <label>
            Cardholder name
            <input value={form.name} onChange={update('name')} />
            {errors.name ? <small className="error">{errors.name}</small> : null}
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={update('phone')} placeholder="902-555-0147" />
            {errors.phone ? <small className="error">{errors.phone}</small> : null}
          </label>
          <label>
            Country
            <select value={form.country} onChange={update('country')}>
              <option value="CA">Canada</option>
              <option value="US">United States</option>
            </select>
          </label>
          <label>
            Postal / ZIP
            <input value={form.postalCode} onChange={update('postalCode')} placeholder="B3H 0A1" />
            {errors.postalCode ? <small className="error">{errors.postalCode}</small> : null}
          </label>
          <label>
            Card number
            <input
              value={form.cardNumber}
              onChange={update('cardNumber')}
              placeholder="4111111111111111"
            />
            {errors.cardNumber ? <small className="error">{errors.cardNumber}</small> : null}
          </label>
          <label>
            Expiry
            <input value={form.expiry} onChange={update('expiry')} placeholder="12/27" />
            {errors.expiry ? <small className="error">{errors.expiry}</small> : null}
          </label>
          <button className="primary" type="submit">
            Authorize ${selected?.price ?? 0}
          </button>
        </form>
        {receipt ? (
          <p className="success">
            Authorized {receipt.name}. Stored as order #{state.orders.at(-1)?.id} with a
            payment method row. Johnson can tighten the validator from here.
          </p>
        ) : null}
      </div>
    </section>
  )
}
