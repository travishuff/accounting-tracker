import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

import { buyBananas } from './api/bananas'
import { getTodayDate, isOnOrAfter } from './lib/date'

type BuyForm = {
  buyDate: string
  number: string
}

type Feedback = {
  message: string
  type: 'error' | 'success'
}

type FieldErrors = Partial<Record<keyof BuyForm, string | undefined>>

const INITIAL_FORM: BuyForm = {
  buyDate: '',
  number: '',
}

const Buy = () => {
  const [form, setForm] = useState<BuyForm>(INITIAL_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const nextErrors: FieldErrors = {}
    const quantity = Number(form.number)

    if (!form.buyDate || !isOnOrAfter(form.buyDate, getTodayDate())) {
      nextErrors.buyDate = 'Choose today or a future purchase date.'
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      nextErrors.number = 'Enter a quantity from 1 to 50 bananas.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const field = name as keyof BuyForm
    setForm((current) => ({ ...current, [field]: value }))
    setFeedback(null)
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const resetForm = () => {
    setForm(INITIAL_FORM)
    setErrors({})
    setFeedback(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) {
      setFeedback({
        message: 'Fix the highlighted fields before submitting.',
        type: 'error',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await buyBananas({
        buyDate: form.buyDate,
        number: Number(form.number),
      })
      setForm(INITIAL_FORM)
      setErrors({})
      setFeedback({
        message: `${form.number} banana${Number(form.number) === 1 ? '' : 's'} added to inventory.`,
        type: 'success',
      })
    } catch (error: unknown) {
      setFeedback({
        message:
          error instanceof Error
            ? error.message
            : 'The purchase request failed.',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page">
      <section className="card stack">
        <div>
          <h1 className="page-title">Buy Bananas</h1>
          <p className="section-copy">
            Add a purchase batch to inventory. Each banana is tracked as its own
            ledger row.
          </p>
        </div>
        <form className="stack" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label className="field-label" htmlFor="buy-quantity">
                Quantity
              </label>
              <input
                className="field-input"
                id="buy-quantity"
                max="50"
                min="1"
                name="number"
                placeholder="0"
                type="number"
                value={form.number}
                onChange={handleChange}
                aria-invalid={errors.number ? 'true' : undefined}
                aria-describedby={errors.number ? 'buy-quantity-error' : undefined}
              />
              {errors.number ? (
                <span className="field-error" id="buy-quantity-error">
                  {errors.number}
                </span>
              ) : null}
            </div>
            <div className="field">
              <label className="field-label" htmlFor="buy-date">
                Purchase date
              </label>
              <input
                className="field-input"
                id="buy-date"
                name="buyDate"
                type="date"
                value={form.buyDate}
                onChange={handleChange}
                aria-invalid={errors.buyDate ? 'true' : undefined}
                aria-describedby={errors.buyDate ? 'buy-date-error' : undefined}
              />
              {errors.buyDate ? (
                <span className="field-error" id="buy-date-error">
                  {errors.buyDate}
                </span>
              ) : null}
            </div>
          </div>
          {feedback ? (
            <div className={`alert alert-${feedback.type}`} role="alert">
              {feedback.message}
            </div>
          ) : null}
          <div className="form-actions">
            <button
              className="btn btn-primary"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Saving…' : 'Record purchase'}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={resetForm}
            >
              Reset
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default Buy
