import { Link, useLoaderData, useRevalidator } from 'react-router'
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'

import './css/analytics.css'

import Dates from './Dates'
import Margins from './Margins'
import { resetDatabase } from './api/bananas'
import useLocalStorageState from './hooks/useLocalStorageState'
import { formatCurrency, getBananaSummary } from './lib/bananaUtils'
import {
  endOfCurrentMonth,
  isStaleMonthDefault,
  startOfCurrentMonth,
} from './lib/date'
import type { Banana } from './types'

type AnalyticsSettings = {
  buyPrice: number
  end: string
  sellPrice: number
  start: string
}

type Feedback = {
  message: string
  type: 'error' | 'success'
}

type MetricCard = {
  helperClassName?: string
  helper: string
  label: string
  value: number | string
}

const DEFAULT_ANALYTICS_SETTINGS: AnalyticsSettings = {
  buyPrice: 0.2,
  end: endOfCurrentMonth(),
  sellPrice: 0.35,
  start: startOfCurrentMonth(),
}

const Analytics = () => {
  const bananas = useLoaderData<Banana[]>()
  const revalidator = useRevalidator()
  const [settings, setSettings] = useLocalStorageState<AnalyticsSettings>(
    'banana-tracker.analytics',
    DEFAULT_ANALYTICS_SETTINGS
  )
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    if (isStaleMonthDefault(settings.start, settings.end)) {
      setSettings((current) => ({
        ...current,
        end: endOfCurrentMonth(),
        start: startOfCurrentMonth(),
      }))
    }
    // Snap forward once on mount; later edits are intentional and should stick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bananaSummary = useMemo(
    () => getBananaSummary(bananas, settings.start, settings.end),
    [bananas, settings.end, settings.start]
  )

  const soldBananasValue = bananaSummary.soldCount * settings.sellPrice
  const totalBananasCost = bananaSummary.scopedCount * settings.buyPrice
  const totalProfit = soldBananasValue - totalBananasCost
  const unsoldUnexpiredBananasValue =
    bananaSummary.unsoldUnexpiredCount * settings.sellPrice
  const unsoldExpiredBananasCost =
    bananaSummary.unsoldExpiredCount * settings.buyPrice
  const allOtherBananasCost = totalBananasCost - unsoldExpiredBananasCost
  const potentialProfit =
    soldBananasValue + unsoldUnexpiredBananasValue - totalBananasCost
  const metricCards: MetricCard[] = [
    {
      helper: 'Inside selected range',
      label: 'Scoped bananas',
      value: bananaSummary.scopedCount,
    },
    {
      helper: 'Recognized sales',
      label: 'Sold bananas',
      value: bananaSummary.soldCount,
    },
    {
      helper: totalProfit >= 0 ? 'Profit' : 'Loss',
      helperClassName: totalProfit >= 0 ? 'positive' : 'negative',
      label: 'Realized result',
      value: formatCurrency(totalProfit),
    },
    {
      helper: potentialProfit >= 0 ? 'Profit' : 'Loss',
      helperClassName: potentialProfit >= 0 ? 'positive' : 'negative',
      label: 'Potential result',
      value: formatCurrency(potentialProfit),
    },
  ]

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const field = name as keyof AnalyticsSettings
    setSettings((current) => ({
      ...current,
      [field]: Number(value),
    }))
  }

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const field = name as keyof AnalyticsSettings
    setSettings((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const resetFields = async () => {
    setIsResetting(true)
    setFeedback(null)

    try {
      const { deleted } = await resetDatabase()
      setSettings(DEFAULT_ANALYTICS_SETTINGS)
      setFeedback({
        message: `Database reset. Deleted ${deleted} banana${deleted === 1 ? '' : 's'}.`,
        type: 'success',
      })
      revalidator.revalidate()
    } catch (error: unknown) {
      setFeedback({
        message:
          error instanceof Error
            ? error.message
            : 'The database reset request failed.',
        type: 'error',
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <main className="analytics-page">
      <section className="analytics-hero">
        <div className="analytics-intro">
          <p className="eyebrow">Performance dashboard</p>
          <h1 className="analytics-title">Analytics</h1>
          <p className="analytics-copy">
            Compare realized results with inventory still sitting on the shelf.
          </p>
        </div>
        <div className="quick-actions">
          <Link className="btn btn-secondary btn-inline" to="/groups">
            Banana groups
          </Link>
          <Link className="btn btn-secondary btn-inline" to="/list">
            Full list
          </Link>
        </div>
      </section>

      <section className="metric-grid" aria-label="Analytics summary">
        {metricCards.map((card) => (
          <article className="metric-card" key={card.label}>
            <span className="metric-label">{card.label}</span>
            <strong className="metric-value">{card.value}</strong>
            <span className={card.helperClassName ?? 'metric-helper'}>
              {card.helper}
            </span>
          </article>
        ))}
      </section>

      {bananas.length > 0 && bananaSummary.scopedCount === 0 ? (
        <div className="alert alert-info" role="status">
          No bananas fall inside the selected date range. {bananas.length}{' '}
          banana{bananas.length === 1 ? '' : 's'} sit outside it — adjust the
          dates below or reset filters to jump back to this month.
        </div>
      ) : null}

      <section className="analytics-grid">
        <article className="panel stack analytics-panel-large">
          <div>
            <h2 className="section-title">Non-GAAP Measures</h2>
            <p className="section-copy">
              Includes sellable inventory still on hand as potential revenue.
            </p>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bananas sold</td>
                  <td>{bananaSummary.soldCount}</td>
                  <td>{formatCurrency(settings.sellPrice)}</td>
                  <td className="positive">
                    {formatCurrency(soldBananasValue)}
                  </td>
                </tr>
                <tr>
                  <td>Unsold unexpired bananas</td>
                  <td>{bananaSummary.unsoldUnexpiredCount}</td>
                  <td>{formatCurrency(settings.sellPrice)}</td>
                  <td className="positive">
                    {formatCurrency(unsoldUnexpiredBananasValue)}
                  </td>
                </tr>
                <tr>
                  <td>Unsold expired bananas</td>
                  <td>{bananaSummary.unsoldExpiredCount}</td>
                  <td>{formatCurrency(settings.buyPrice)}</td>
                  <td className="negative">
                    {formatCurrency(unsoldExpiredBananasCost)}
                  </td>
                </tr>
                <tr>
                  <td>All other purchased bananas</td>
                  <td>
                    {bananaSummary.scopedCount -
                      bananaSummary.unsoldExpiredCount}
                  </td>
                  <td>{formatCurrency(settings.buyPrice)}</td>
                  <td className="negative">
                    {formatCurrency(allOtherBananasCost)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="table-summary-label">
                    Potential Profit/Loss
                  </td>
                  <td
                    className={potentialProfit >= 0 ? 'positive' : 'negative'}
                  >
                    {formatCurrency(potentialProfit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel stack">
          <div>
            <h2 className="section-title">GAAP Measures</h2>
            <p className="section-copy">
              Counts only realized sales against purchased inventory cost.
            </p>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bananas sold</td>
                  <td>{bananaSummary.soldCount}</td>
                  <td>{formatCurrency(settings.sellPrice)}</td>
                  <td className="positive">
                    {formatCurrency(soldBananasValue)}
                  </td>
                </tr>
                <tr>
                  <td>Bananas purchased</td>
                  <td>{bananaSummary.scopedCount}</td>
                  <td>{formatCurrency(settings.buyPrice)}</td>
                  <td className="negative">
                    {formatCurrency(totalBananasCost)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="table-summary-label">
                    Profit/Loss
                  </td>
                  <td className={totalProfit >= 0 ? 'positive' : 'negative'}>
                    {formatCurrency(totalProfit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="analytics-controls-grid">
        <article className="panel stack">
          <div>
            <h2 className="section-title">Date Range</h2>
            <p className="section-copy">
              Scope the tables and metric cards to a purchase and sale window.
            </p>
          </div>
          <Dates
            end={settings.end}
            handleDateChange={handleDateChange}
            start={settings.start}
          />
          {feedback ? (
            <div className={`alert alert-${feedback.type}`}>
              {feedback.message}
            </div>
          ) : null}
          <button
            className="btn btn-secondary btn-inline"
            disabled={isResetting}
            type="button"
            onClick={resetFields}
          >
            {isResetting ? 'Resetting…' : 'Reset database and filters'}
          </button>
        </article>

        <Margins
          buyPrice={settings.buyPrice}
          handlePriceChange={handlePriceChange}
          sellPrice={settings.sellPrice}
        />
      </section>
    </main>
  )
}

export default Analytics
