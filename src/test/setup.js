import '@testing-library/jest-dom/vitest'

const createStorage = () => {
  let store = {}

  return {
    clear: () => {
      store = {}
    },
    getItem: (key) => (key in store ? store[key] : null),
    key: (index) => Object.keys(store)[index] ?? null,
    removeItem: (key) => {
      delete store[key]
    },
    setItem: (key, value) => {
      store[key] = String(value)
    },
  }
}

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: createStorage(),
})
