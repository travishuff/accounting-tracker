import '@testing-library/jest-dom/vitest'

const createStorage = (): Storage => {
  let store: Record<string, string> = {}

  return {
    get length() {
      return Object.keys(store).length
    },
    clear: () => {
      store = {}
    },
    getItem: (key: string) => (key in store ? store[key] : null),
    key: (index: number) => Object.keys(store)[index] ?? null,
    removeItem: (key: string) => {
      delete store[key]
    },
    setItem: (key: string, value: string) => {
      store[key] = String(value)
    },
  }
}

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: createStorage(),
})
