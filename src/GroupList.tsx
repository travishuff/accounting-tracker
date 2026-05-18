import { useMemo } from 'react'
import { Link, useLoaderData } from 'react-router'

import { groupBananas } from './lib/bananaUtils'
import type { Banana } from './types'

const GroupList = () => {
  const bananas = useLoaderData<Banana[]>()
  const groupedBananas = useMemo(() => groupBananas(bananas), [bananas])

  return (
    <main className="page">
      <section className="card stack">
        <h1 className="page-title">
          <Link className="back-link" to="/">
            ← Dashboard
          </Link>
          Banana Groups
        </h1>
        {groupedBananas.length > 0 ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Buy Date</th>
                  <th>Sale Date</th>
                </tr>
              </thead>
              <tbody>
                {groupedBananas.map((group) => (
                  <tr key={group.key}>
                    <td>{group.quantity}</td>
                    <td>{group.buyDate}</td>
                    <td>
                      {group.sellDate === 'null' ? 'Unsold' : group.sellDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">No grouped inventory to show yet.</div>
        )}
      </section>
    </main>
  )
}

export default GroupList
