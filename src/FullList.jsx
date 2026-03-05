import { useState } from 'react'
import { Link, useLoaderData } from 'react-router'

import { sortBananas } from './lib/bananaUtils'

const FullList = () => {
  const bananas = useLoaderData()
  const [sortConfig, setSortConfig] = useState({
    column: 'id',
    direction: 'ascending',
  })

  const sortedBananas = sortBananas(
    bananas,
    sortConfig.column,
    sortConfig.direction
  )

  const handleSort = (column) => {
    setSortConfig((current) => ({
      column,
      direction:
        current.column === column && current.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    }))
  }

  const sortLabel = (column) =>
    sortConfig.column === column ? ` (${sortConfig.direction})` : ''

  return (
    <main className="page">
      <section className="card stack">
        <h1 className="page-title">
          <Link className="back-link" to="/analytics">
            ← Analytics
          </Link>
          Full List of Bananas
        </h1>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <button
                    className="table-sort"
                    type="button"
                    onClick={() => handleSort('id')}
                  >
                    ID ({bananas.length} total){sortLabel('id')}
                  </button>
                </th>
                <th>
                  <button
                    className="table-sort"
                    type="button"
                    onClick={() => handleSort('buyDate')}
                  >
                    Buy Date{sortLabel('buyDate')}
                  </button>
                </th>
                <th>
                  <button
                    className="table-sort"
                    type="button"
                    onClick={() => handleSort('sellDate')}
                  >
                    Sell Date{sortLabel('sellDate')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBananas.map(({ buyDate, sellDate, id }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{buyDate}</td>
                  <td>{sellDate ?? 'null'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default FullList
