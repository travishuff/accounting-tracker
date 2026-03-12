import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useLoaderData, useRevalidator } from 'react-router'

import { sellBananas } from './api/bananas'
import { getTodayDate, isOnOrAfter } from './lib/date'
import { getAvailableBananas, getUnsoldBananas } from './lib/bananaUtils'
import type { Banana } from './types'

type SellForm = {
  number: string
  sellDate: string
}

type Feedback = {
  message: string
  type: 'error' | 'success'
}

type FieldErrors = Partial<Record<keyof SellForm, string | undefined>>

const INITIAL_FORM: SellForm = {
  number: '',
  sellDate: '',
}

const Sell = () => {
  const bananas = useLoaderData<Banana[]>()
  const revalidator = useRevalidator()
  const [form, setForm] = useState<SellForm>(INITIAL_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const unsoldBananas = getUnsoldBananas(bananas)
  const availableBananas = getAvailableBananas(unsoldBananas, form.sellDate)

  const validate = () => {
    const nextErrors: FieldErrors = {}
    const quantity = Number(form.number)

    if (!form.sellDate || !isOnOrAfter(form.sellDate, getTodayDate())) {
      nextErrors.sellDate = 'Choose today or a future sale date.'
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      nextErrors.number = 'Enter a quantity from 1 to 50 bananas.'
    } else if (quantity > availableBananas.length) {
      nextErrors.number = `Only ${availableBananas.length} bananas can be sold on that date.`
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const field = name as keyof SellForm
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
      await sellBananas({
        number: Number(form.number),
        sellDate: form.sellDate,
      })
      setForm(INITIAL_FORM)
      setErrors({})
      setFeedback({ message: 'You sold bananas.', type: 'success' })
      revalidator.revalidate()
    } catch (error: unknown) {
      setFeedback({
        message:
          error instanceof Error ? error.message : 'The sale request failed.',
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
          <h1 className="page-title">Sell Bananas</h1>
          <p className="section-copy">
            Sales are constrained by inventory availability and the 10-day shelf
            life window.
          </p>
        </div>
        <div className="info-strip">
          <span>{unsoldBananas.length} unsold bananas in inventory</span>
          <span>{availableBananas.length} sellable on the selected date</span>
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
              <span className="field-label">Sale date</span>
              <input
                className="field-input"
                name="sellDate"
                type="date"
                value={form.sellDate}
                onChange={handleChange}
              />
              {errors.sellDate ? (
                <span className="field-error">{errors.sellDate}</span>
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

export default Sell
