import { Link, useLoaderData } from 'react-router'

import { groupBananas } from './lib/bananaUtils'

const GroupList = () => {
  const bananas = useLoaderData()
  const groupedBananas = groupBananas(bananas)

  return (
    <main className="page">
      <section className="card stack">
        <h1 className="page-title">
          <Link className="back-link" to="/analytics">
            ← Analytics
          </Link>
          Banana Groups
        </h1>
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
                  <td>{group.sellDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default GroupList
