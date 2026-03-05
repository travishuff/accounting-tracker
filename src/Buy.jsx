import { useState } from 'react'

import { buyBananas } from './api/bananas'
import { getTodayDate, isOnOrAfter } from './lib/date'

const INITIAL_FORM = {
  buyDate: '',
  number: '',
}

const Buy = () => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const nextErrors = {}
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

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFeedback(null)
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const resetForm = () => {
    setForm(INITIAL_FORM)
    setErrors({})
    setFeedback(null)
  }

  const handleSubmit = async (event) => {
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
      setFeedback({ message: 'You bought bananas.', type: 'success' })
    } catch (error) {
      setFeedback({
        message: error.message || 'The purchase request failed.',
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
            Record a purchase batch. The backend expands the quantity into
            individual banana rows.
          </p>
        </div>
        <form className="stack" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="field">
              <span className="field-label">Quantity</span>
              <input
                className="field-input"
                max="50"
                min="1"
                name="number"
                placeholder="0"
                type="number"
                value={form.number}
                onChange={handleChange}
              />
              {errors.number ? (
                <span className="field-error">{errors.number}</span>
              ) : null}
            </label>
            <label className="field">
              <span className="field-label">Purchase date</span>
              <input
                className="field-input"
                name="buyDate"
                type="date"
                value={form.buyDate}
                onChange={handleChange}
              />
              {errors.buyDate ? (
                <span className="field-error">{errors.buyDate}</span>
              ) : null}
            </label>
          </div>
          {feedback ? (
            <div className={`alert alert-${feedback.type}`}>
              {feedback.message}
            </div>
          ) : null}
          <div className="form-actions">
            <button
              className="btn btn-primary"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Saving…' : 'Submit'}
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
