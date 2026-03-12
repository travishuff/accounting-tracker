import { Link, useLoaderData } from 'react-router'
import type { ChangeEvent } from 'react'

import './css/analytics.css'

import Dates from './Dates'
import Margins from './Margins'
import useLocalStorageState from './hooks/useLocalStorageState'
import {
  formatCurrency,
  getBananasByTime,
  getSoldBananas,
  getUnsoldExpiredBananas,
  getUnsoldUnexpiredBananas,
} from './lib/bananaUtils'
import { endOfCurrentMonth, startOfCurrentMonth } from './lib/date'
import type { Banana } from './types'

type AnalyticsSettings = {
  buyPrice: number
  end: string
  sellPrice: number
  start: string
}

const DEFAULT_ANALYTICS_SETTINGS: AnalyticsSettings = {
  buyPrice: 0.2,
  end: endOfCurrentMonth(),
  sellPrice: 0.35,
  start: startOfCurrentMonth(),
}

const Analytics = () => {
  const bananas = useLoaderData<Banana[]>()
  const [settings, setSettings] = useLocalStorageState<AnalyticsSettings>(
    'banana-tracker.analytics',
    DEFAULT_ANALYTICS_SETTINGS
  )

  const scopedBananas = getBananasByTime(bananas, settings.start, settings.end)
  const soldBananas = getSoldBananas(scopedBananas)
  const unsoldUnexpiredBananas = getUnsoldUnexpiredBananas(scopedBananas)
  const unsoldExpiredBananas = getUnsoldExpiredBananas(scopedBananas)

  const soldBananasValue = soldBananas.length * settings.sellPrice
  const totalBananasCost = scopedBananas.length * settings.buyPrice
  const totalProfit = soldBananasValue - totalBananasCost
  const unsoldUnexpiredBananasValue =
    unsoldUnexpiredBananas.length * settings.sellPrice
  const unsoldExpiredBananasCost =
    unsoldExpiredBananas.length * settings.buyPrice
  const allOtherBananasCost = totalBananasCost - unsoldExpiredBananasCost
  const potentialProfit =
    soldBananasValue + unsoldUnexpiredBananasValue - totalBananasCost

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

  const resetFields = () => {
    setSettings(DEFAULT_ANALYTICS_SETTINGS)
  }

  return (
    <main className="page stack">
      <section className="card stack">
        <div className="split-header">
          <div>
            <h1 className="page-title">Analytics</h1>
            <p className="section-copy">
              Compare realized results with inventory still sitting on the
              shelf.
            </p>
          </div>
          <div className="page-actions">
            <Link className="btn btn-secondary btn-inline" to="/groups">
              Banana Groups
            </Link>
            <Link className="btn btn-secondary btn-inline" to="/list">
              Full List
            </Link>
          </div>
        </div>
        <Dates
          end={settings.end}
          handleDateChange={handleDateChange}
          start={settings.start}
        />
      </section>

      <section className="card stack">
        <h2 className="section-title">Non-GAAP Measures</h2>
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
                <td>{soldBananas.length}</td>
                <td>{formatCurrency(settings.sellPrice)}</td>
                <td className="positive">{formatCurrency(soldBananasValue)}</td>
              </tr>
              <tr>
                <td>Unsold unexpired bananas</td>
                <td>{unsoldUnexpiredBananas.length}</td>
                <td>{formatCurrency(settings.sellPrice)}</td>
                <td className="positive">
                  {formatCurrency(unsoldUnexpiredBananasValue)}
                </td>
              </tr>
              <tr>
                <td>Unsold expired bananas</td>
                <td>{unsoldExpiredBananas.length}</td>
                <td>{formatCurrency(settings.buyPrice)}</td>
                <td className="negative">
                  {formatCurrency(unsoldExpiredBananasCost)}
                </td>
              </tr>
              <tr>
                <td>All other purchased bananas</td>
                <td>{scopedBananas.length - unsoldExpiredBananas.length}</td>
                <td>{formatCurrency(settings.buyPrice)}</td>
                <td className="negative">
                  {formatCurrency(allOtherBananasCost)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="table-summary-label">
                  Potential Profit/Loss
                </td>
                <td className={potentialProfit >= 0 ? 'positive' : 'negative'}>
                  {formatCurrency(potentialProfit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="card stack">
        <h2 className="section-title">GAAP Measures</h2>
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
                <td>{soldBananas.length}</td>
                <td>{formatCurrency(settings.sellPrice)}</td>
                <td className="positive">{formatCurrency(soldBananasValue)}</td>
              </tr>
              <tr>
                <td>Bananas purchased</td>
                <td>{scopedBananas.length}</td>
                <td>{formatCurrency(settings.buyPrice)}</td>
                <td className="negative">{formatCurrency(totalBananasCost)}</td>
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
      </section>

      <Margins
        buyPrice={settings.buyPrice}
        handlePriceChange={handlePriceChange}
        sellPrice={settings.sellPrice}
      />

      <div>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={resetFields}
        >
          Reset All Fields
        </button>
      </div>
    </main>
  )
}

export default Analytics
