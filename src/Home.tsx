import { Link, useLoaderData } from 'react-router'
import { useMemo } from 'react'

import './css/home.css'

import {
  getAvailableBananas,
  getSoldBananas,
  getUnsoldBananas,
  getUnsoldExpiredBananas,
  sortBananas,
} from './lib/bananaUtils'
import { addDays, getTodayDate } from './lib/date'
import type { Banana } from './types'

const formatDate = (value: string | null) => value ?? 'Unsold'

const Home = () => {
  const bananas = useLoaderData<Banana[]>()
  const today = getTodayDate()

  const dashboard = useMemo(() => {
    const unsoldBananas = getUnsoldBananas(bananas)
    const availableToday = getAvailableBananas(unsoldBananas, today)
    const expired = getUnsoldExpiredBananas(unsoldBananas, today)
    const sold = getSoldBananas(bananas)
    const recent = sortBananas(bananas, 'buyDate', 'descending').slice(0, 5)
    const nextExpiryDate =
      availableToday.length > 0
        ? sortBananas(availableToday, 'buyDate', 'ascending')[0]?.buyDate
        : null

    return {
      availableToday,
      expired,
      nextExpiryDate,
      recent,
      sold,
      unsoldBananas,
    }
  }, [bananas, today])

  const statusCards = [
    {
      label: 'Total inventory',
      value: bananas.length,
      helper: `${dashboard.sold.length} sold to date`,
    },
    {
      label: 'On hand',
      value: dashboard.unsoldBananas.length,
      helper: `${dashboard.availableToday.length} sellable today`,
    },
    {
      label: 'Expired',
      value: dashboard.expired.length,
      helper:
        dashboard.expired.length === 0
          ? 'No write-off pressure'
          : 'Review before selling',
    },
    {
      label: 'Next expiry',
      value: dashboard.nextExpiryDate
        ? addDays(dashboard.nextExpiryDate, 11)
        : 'None',
      helper: dashboard.nextExpiryDate
        ? 'Oldest sellable batch'
        : 'No active inventory',
    },
  ]

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-intro">
          <p className="eyebrow">Inventory dashboard</p>
          <h1 className="dashboard-title">Banana Tracker</h1>
          <p className="dashboard-copy">
            Monitor stock, freshness, and sales movement without digging through
            the ledger.
          </p>
        </div>

        <div className="quick-actions" aria-label="Quick actions">
          <Link className="btn btn-primary" to="/buy">
            Buy bananas
          </Link>
          <Link className="btn btn-secondary" to="/sell">
            Sell bananas
          </Link>
        </div>
      </section>

      <section className="metric-grid" aria-label="Inventory summary">
        {statusCards.map((card) => (
          <article className="metric-card" key={card.label}>
            <span className="metric-label">{card.label}</span>
            <strong className="metric-value">{card.value}</strong>
            <span className="metric-helper">{card.helper}</span>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel stack">
          <div className="split-header">
            <div>
              <h2 className="section-title">Inventory Flow</h2>
              <p className="section-copy">
                Today&apos;s sellable count uses the 10-day freshness window.
              </p>
            </div>
            <Link className="btn btn-secondary btn-inline" to="/analytics">
              View analytics
            </Link>
          </div>
          <div className="flow-list">
            <div className="flow-item">
              <span>Purchased</span>
              <strong>{bananas.length}</strong>
            </div>
            <div className="flow-item">
              <span>Sold</span>
              <strong>{dashboard.sold.length}</strong>
            </div>
            <div className="flow-item">
              <span>Available today</span>
              <strong>{dashboard.availableToday.length}</strong>
            </div>
            <div className="flow-item">
              <span>Expired on hand</span>
              <strong>{dashboard.expired.length}</strong>
            </div>
          </div>
        </article>

        <article className="panel stack">
          <div className="split-header">
            <div>
              <h2 className="section-title">Recent Bananas</h2>
              <p className="section-copy">Latest batches by purchase date.</p>
            </div>
            <Link className="btn btn-secondary btn-inline" to="/list">
              Full list
            </Link>
          </div>
          {dashboard.recent.length > 0 ? (
            <div className="table-wrap">
              <table className="data-table compact-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Buy Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recent.map(({ buyDate, id, sellDate }) => (
                    <tr key={id}>
                      <td>{id.slice(0, 8)}</td>
                      <td>{buyDate}</td>
                      <td>{formatDate(sellDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              No bananas have been recorded yet.
            </div>
          )}
        </article>
      </section>
    </main>
  )
}

export default Home
