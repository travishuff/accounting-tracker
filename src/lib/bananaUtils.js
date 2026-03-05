import {
  BANANA_SHELF_LIFE_DAYS,
  addDays,
  getTodayDate,
  isAfter,
  isExpiredOn,
} from './date'

export const getBananasByTime = (bananas, start, end) =>
  bananas.filter(({ buyDate, sellDate }) => {
    const boughtInRange = buyDate >= start && buyDate <= end
    const soldInRange =
      sellDate === null || (sellDate >= start && sellDate <= end)

    return boughtInRange && soldInRange
  })

export const getSoldBananas = (bananas) =>
  bananas.filter(({ sellDate }) => sellDate !== null)

export const getUnsoldBananas = (bananas) =>
  bananas.filter(({ sellDate }) => sellDate === null)

export const getExpiredBananas = (bananas, referenceDate = getTodayDate()) =>
  bananas.filter(({ buyDate }) => isExpiredOn(buyDate, referenceDate))

export const getUnexpiredBananas = (bananas, referenceDate = getTodayDate()) =>
  bananas.filter(({ buyDate }) => !isExpiredOn(buyDate, referenceDate))

export const getUnsoldExpiredBananas = (
  bananas,
  referenceDate = getTodayDate()
) =>
  getExpiredBananas(bananas, referenceDate).filter(
    ({ sellDate }) => sellDate === null
  )

export const getUnsoldUnexpiredBananas = (
  bananas,
  referenceDate = getTodayDate()
) =>
  getUnexpiredBananas(bananas, referenceDate).filter(
    ({ sellDate }) => sellDate === null
  )

export const getAvailableBananas = (bananas, sellDate) =>
  bananas.filter(({ buyDate }) => {
    if (!sellDate) {
      return true
    }

    if (isAfter(buyDate, sellDate)) {
      return false
    }

    return isAfter(addDays(buyDate, BANANA_SHELF_LIFE_DAYS), sellDate)
  })

export const sortBananas = (bananas, column, direction) => {
  const sorted = [...bananas].sort((left, right) => {
    const leftValue = `${left[column] ?? ''}`
    const rightValue = `${right[column] ?? ''}`

    return leftValue.localeCompare(rightValue)
  })

  return direction === 'descending' ? sorted.reverse() : sorted
}

export const groupBananas = (bananas, referenceDate = getTodayDate()) => {
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
    }, new Map())

  return Array.from(groups.values())
}

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
    style: 'currency',
  }).format(Math.abs(value))
