import {
  BANANA_SHELF_LIFE_DAYS,
  addDays,
  getTodayDate,
  isAfter,
  isExpiredOn,
} from './date'
import type { Banana, BananaGroup } from '../types'

type BananaSummary = {
  scopedCount: number
  soldCount: number
  unsoldExpiredCount: number
  unsoldUnexpiredCount: number
}

export const getBananasByTime = (
  bananas: Banana[],
  start: string,
  end: string
) =>
  bananas.filter(({ buyDate, sellDate }) => {
    const boughtInRange = buyDate >= start && buyDate <= end
    const soldInRange =
      sellDate === null || (sellDate >= start && sellDate <= end)

    return boughtInRange && soldInRange
  })

export const getSoldBananas = (bananas: Banana[]) =>
  bananas.filter(({ sellDate }) => sellDate !== null)

export const getUnsoldBananas = (bananas: Banana[]) =>
  bananas.filter(({ sellDate }) => sellDate === null)

export const getExpiredBananas = (
  bananas: Banana[],
  referenceDate: string = getTodayDate()
) => bananas.filter(({ buyDate }) => isExpiredOn(buyDate, referenceDate))

export const getUnexpiredBananas = (
  bananas: Banana[],
  referenceDate: string = getTodayDate()
) => bananas.filter(({ buyDate }) => !isExpiredOn(buyDate, referenceDate))

export const getUnsoldExpiredBananas = (
  bananas: Banana[],
  referenceDate: string = getTodayDate()
) =>
  getExpiredBananas(bananas, referenceDate).filter(
    ({ sellDate }) => sellDate === null
  )

export const getUnsoldUnexpiredBananas = (
  bananas: Banana[],
  referenceDate: string = getTodayDate()
) =>
  getUnexpiredBananas(bananas, referenceDate).filter(
    ({ sellDate }) => sellDate === null
  )

export const getBananaSummary = (
  bananas: Banana[],
  start: string,
  end: string,
  referenceDate: string = getTodayDate()
): BananaSummary => {
  const summary: BananaSummary = {
    scopedCount: 0,
    soldCount: 0,
    unsoldExpiredCount: 0,
    unsoldUnexpiredCount: 0,
  }

  for (const { buyDate, sellDate } of bananas) {
    if (buyDate < start || buyDate > end) {
      continue
    }

    if (sellDate !== null && (sellDate < start || sellDate > end)) {
      continue
    }

    summary.scopedCount += 1

    if (sellDate !== null) {
      summary.soldCount += 1
    } else if (isExpiredOn(buyDate, referenceDate)) {
      summary.unsoldExpiredCount += 1
    } else {
      summary.unsoldUnexpiredCount += 1
    }
  }

  return summary
}

export const getAvailableBananas = (bananas: Banana[], sellDate?: string) =>
  bananas.filter(({ buyDate }) => {
    if (!sellDate) {
      return true
    }

    if (isAfter(buyDate, sellDate)) {
      return false
    }

    return isAfter(addDays(buyDate, BANANA_SHELF_LIFE_DAYS), sellDate)
  })

export const sortBananas = (
  bananas: Banana[],
  column: keyof Banana,
  direction: 'ascending' | 'descending'
) => {
  const sorted = [...bananas].sort((left, right) => {
    const leftValue = `${left[column] ?? ''}`
    const rightValue = `${right[column] ?? ''}`

    return leftValue.localeCompare(rightValue)
  })

  return direction === 'descending' ? sorted.reverse() : sorted
}

export const groupBananas = (
  bananas: Banana[],
  referenceDate: string = getTodayDate()
): BananaGroup[] => {
  const groups = bananas
    .map((banana) => ({
      ...banana,
      displaySellDate:
        banana.sellDate === null && isExpiredOn(banana.buyDate, referenceDate)
          ? 'EXPIRED'
          : banana.sellDate,
    }))
    .sort((left, right) => {
      const buyDateCompare = left.buyDate.localeCompare(right.buyDate)
      if (buyDateCompare !== 0) {
        return buyDateCompare
      }

      return `${left.displaySellDate ?? ''}`.localeCompare(
        `${right.displaySellDate ?? ''}`
      )
    })
    .reduce((all, banana) => {
      const key = `${banana.buyDate}-${banana.displaySellDate ?? 'null'}`
      const currentGroup = all.get(key)

      if (currentGroup) {
        currentGroup.quantity += 1
        return all
      }

      all.set(key, {
        buyDate: banana.buyDate,
        key,
        quantity: 1,
        sellDate: banana.displaySellDate ?? 'null',
      })
      return all
    }, new Map<string, BananaGroup>())

  return Array.from(groups.values())
}

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  minimumFractionDigits: 2,
  style: 'currency',
})

export const formatCurrency = (value: number) =>
  USD_FORMATTER.format(Math.abs(value))
