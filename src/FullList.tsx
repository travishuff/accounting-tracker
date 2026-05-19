import { useMemo, useState } from 'react'
import { Link, useLoaderData } from 'react-router'

import { sortBananas } from './lib/bananaUtils'
import type { Banana } from './types'

type SortConfig = {
  column: keyof Banana
  direction: 'ascending' | 'descending'
}

const FullList = () => {
  const bananas = useLoaderData<Banana[]>()
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'id',
    direction: 'ascending',
  })

  const sortedBananas = useMemo(
    () => sortBananas(bananas, sortConfig.column, sortConfig.direction),
    [bananas, sortConfig.column, sortConfig.direction]
  )

  const handleSort = (column: keyof Banana) => {
    setSortConfig((current) => ({
      column,
      direction:
        current.column === column && current.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    }))
  }

  const sortIndicator = (column: keyof Banana) => {
    if (sortConfig.column !== column) {
      return null
    }

    return (
      <span aria-hidden="true" style={{ fontSize: '0.65rem', marginLeft: '0.25rem' }}>
        {sortConfig.direction === 'ascending' ? '▲' : '▼'}
      </span>
    )
  }

  return (
    <main className="page">
      <section className="card stack">
        <h1 className="page-title">
          <Link className="back-link" to="/">
            ← Dashboard
          </Link>
          Full List of Bananas
        </h1>

        {sortedBananas.length > 0 ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th aria-sort={sortConfig.column === 'id' ? sortConfig.direction : 'none'}>
                    <button
                      className="table-sort"
                      type="button"
                      onClick={() => handleSort('id')}
                    >
                      ID ({bananas.length} total){sortIndicator('id')}
                    </button>
                  </th>
                  <th aria-sort={sortConfig.column === 'buyDate' ? sortConfig.direction : 'none'}>
                    <button
                      className="table-sort"
                      type="button"
                      onClick={() => handleSort('buyDate')}
                    >
                      Buy Date{sortIndicator('buyDate')}
                    </button>
                  </th>
                  <th aria-sort={sortConfig.column === 'sellDate' ? sortConfig.direction : 'none'}>
                    <button
                      className="table-sort"
                      type="button"
                      onClick={() => handleSort('sellDate')}
                    >
                      Sell Date{sortIndicator('sellDate')}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedBananas.map(({ buyDate, sellDate, id }) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{buyDate}</td>
                    <td>{sellDate ?? 'Unsold'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">No bananas have been recorded yet.</div>
        )}
      </section>
    </main>
  )
}

export default FullList
