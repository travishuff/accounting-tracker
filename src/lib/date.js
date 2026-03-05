export const BANANA_SHELF_LIFE_DAYS = 10
const DAY_IN_MS = 24 * 60 * 60 * 1000

const pad = (value) => `${value}`.padStart(2, '0')

export const parseDateString = (value) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const formatDateInput = (value) => {
  const date = value instanceof Date ? value : new Date(value)

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-')
}

export const getTodayDate = () => formatDateInput(new Date())

export const addDays = (value, days) => {
  const date = parseDateString(value)
  date.setDate(date.getDate() + days)
  return formatDateInput(date)
}

export const isOnOrAfter = (left, right) => left >= right

export const isAfter = (left, right) => left > right

export const differenceInCalendarDays = (left, right) => {
  const leftDate = parseDateString(left)
  const rightDate = parseDateString(right)

  return Math.round((leftDate - rightDate) / DAY_IN_MS)
}

export const startOfCurrentMonth = () => {
  const date = new Date()
  return formatDateInput(new Date(date.getFullYear(), date.getMonth(), 1))
}

export const endOfCurrentMonth = () => {
  const date = new Date()
  return formatDateInput(new Date(date.getFullYear(), date.getMonth() + 1, 0))
}

export const isExpiredOn = (buyDate, referenceDate = getTodayDate()) =>
  differenceInCalendarDays(referenceDate, buyDate) > BANANA_SHELF_LIFE_DAYS
