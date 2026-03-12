import {
  getAvailableBananas,
  getBananasByTime,
  getUnsoldExpiredBananas,
  groupBananas,
} from '../lib/bananaUtils'
import { DB } from '../testDB'

const SELLABLE_DATE = '2019-07-05'

describe('bananaUtils', () => {
  test('filters bananas by purchase and sale date range', () => {
    expect(getBananasByTime(DB, '2019-06-01', '2019-06-30')).toEqual([
      {
        id: '93b03cdc-1480-4220-861c-e20756a43e42',
        buyDate: '2019-06-01',
        sellDate: '2019-06-06',
      },
      {
        id: '19d1adf5-cb4d-42f3-b8b2-116f435c0523',
        buyDate: '2019-06-30',
        sellDate: null,
      },
    ])
  })

  test('returns only bananas that are sellable on a specific date', () => {
    expect(
      getAvailableBananas(
        DB.filter((banana) => banana.sellDate === null),
        SELLABLE_DATE
      )
    ).toHaveLength(2)
  })

  test('groups bananas by buy and sell date for reporting', () => {
    expect(groupBananas(DB, '2019-07-05')).toEqual([
      {
        buyDate: '2019-05-24',
        key: '2019-05-24-2019-05-25',
        quantity: 1,
        sellDate: '2019-05-25',
      },
      {
        buyDate: '2019-05-24',
        key: '2019-05-24-2019-05-26',
        quantity: 1,
        sellDate: '2019-05-26',
      },
      {
        buyDate: '2019-05-25',
        key: '2019-05-25-EXPIRED',
        quantity: 1,
        sellDate: 'EXPIRED',
      },
      {
        buyDate: '2019-06-01',
        key: '2019-06-01-2019-06-06',
        quantity: 1,
        sellDate: '2019-06-06',
      },
      {
        buyDate: '2019-06-30',
        key: '2019-06-30-null',
        quantity: 1,
        sellDate: 'null',
      },
      {
        buyDate: '2019-06-30',
        key: '2019-06-30-2019-07-01',
        quantity: 1,
        sellDate: '2019-07-01',
      },
      {
        buyDate: '2019-06-30',
        key: '2019-06-30-2019-07-02',
        quantity: 1,
        sellDate: '2019-07-02',
      },
      {
        buyDate: '2019-07-01',
        key: '2019-07-01-null',
        quantity: 1,
        sellDate: 'null',
      },
    ])
  })

  test('marks old unsold bananas as expired', () => {
    expect(getUnsoldExpiredBananas(DB, '2019-07-11')).toHaveLength(2)
  })
})
