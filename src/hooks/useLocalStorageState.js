import { useEffect, useState } from 'react'

const useLocalStorageState = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    const storedValue = window.localStorage.getItem(key)
    if (!storedValue) {
      return initialValue
    }

    try {
      return JSON.parse(storedValue)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorageState
