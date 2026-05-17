import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLoaderData, useRevalidator } from 'react-router'

import Analytics from '../Analytics'
import type { Banana } from '../types'

vi.mock('react-router', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('react-router')

  return {
    ...actual,
    useLoaderData: vi.fn(),
    useRevalidator: vi.fn(),
  }
})

const mockedUseLoaderData = vi.mocked(useLoaderData)
const mockedUseRevalidator = vi.mocked(useRevalidator)
const revalidate = vi.fn()

const ANALYTICS_DB: Banana[] = [
  {
    id: 'banana-1',
    buyDate: '2026-03-01',
    sellDate: '2026-03-03',
  },
  {
    id: 'banana-2',
    buyDate: '2026-03-02',
    sellDate: null,
  },
]

describe('Analytics', () => {
  beforeEach(() => {
    window.localStorage.clear()
    mockedUseLoaderData.mockReturnValue(ANALYTICS_DB)
    mockedUseRevalidator.mockReturnValue({
      revalidate,
      state: 'idle',
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  test('renders analytics tables from routed loader data', async () => {
    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    )

    expect(
      await screen.findByRole('heading', { name: /analytics/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/potential profit\/loss/i)).toBeInTheDocument()
    expect(screen.getAllByText('$0.35')[0]).toBeInTheDocument()
  })

  test('persists updated prices to local storage', async () => {
    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    )

    const buyPriceInput = await screen.findByLabelText(/buy price/i)
    fireEvent.change(buyPriceInput, { target: { value: '0.55' } })

    const stored = window.localStorage.getItem('banana-tracker.analytics')
    expect(stored).not.toBeNull()
    expect(JSON.parse(stored as string)).toEqual(
      expect.objectContaining({
        buyPrice: 0.55,
      })
    )
  })

  test('snaps a stale prior-month default range forward to the current month', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 4, 12))

    window.localStorage.setItem(
      'banana-tracker.analytics',
      JSON.stringify({
        buyPrice: 0.2,
        end: '2026-03-31',
        sellPrice: 0.35,
        start: '2026-03-01',
      })
    )

    try {
      render(
        <MemoryRouter>
          <Analytics />
        </MemoryRouter>
      )

      const startInput = (await screen.findByLabelText(
        /start date/i
      )) as HTMLInputElement
      const endInput = screen.getByLabelText(/end date/i) as HTMLInputElement

      expect(startInput.value).toBe('2026-05-01')
      expect(endInput.value).toBe('2026-05-31')
    } finally {
      vi.useRealTimers()
    }
  })

  test('does not snap a user-chosen range that is not a full prior month', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 4, 12))

    window.localStorage.setItem(
      'banana-tracker.analytics',
      JSON.stringify({
        buyPrice: 0.2,
        end: '2026-03-15',
        sellPrice: 0.35,
        start: '2026-03-05',
      })
    )

    try {
      render(
        <MemoryRouter>
          <Analytics />
        </MemoryRouter>
      )

      const startInput = (await screen.findByLabelText(
        /start date/i
      )) as HTMLInputElement
      const endInput = screen.getByLabelText(/end date/i) as HTMLInputElement

      expect(startInput.value).toBe('2026-03-05')
      expect(endInput.value).toBe('2026-03-15')
    } finally {
      vi.useRealTimers()
    }
  })

  test('shows a hint when loader returned bananas but the date filter drops them all', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 4, 12))

    // Pin a range that contains none of the test bananas (which are dated 2026-03-*),
    // using a non-month-boundary so the snap-forward logic does not fire.
    window.localStorage.setItem(
      'banana-tracker.analytics',
      JSON.stringify({
        buyPrice: 0.2,
        end: '2026-05-12',
        sellPrice: 0.35,
        start: '2026-05-02',
      })
    )

    try {
      render(
        <MemoryRouter>
          <Analytics />
        </MemoryRouter>
      )

      expect(
        await screen.findByText(
          /no bananas fall inside the selected date range/i
        )
      ).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  test('does not show the empty-range hint when at least one banana matches', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 2, 15))

    // Pin a range that contains the test bananas; the module-level defaults
    // were computed at real import time and won't match the fake clock.
    window.localStorage.setItem(
      'banana-tracker.analytics',
      JSON.stringify({
        buyPrice: 0.2,
        end: '2026-03-31',
        sellPrice: 0.35,
        start: '2026-03-01',
      })
    )

    try {
      render(
        <MemoryRouter>
          <Analytics />
        </MemoryRouter>
      )

      // Wait for any effects to settle so a late-rendered hint would be caught.
      await screen.findByRole('heading', { name: /analytics/i })

      expect(
        screen.queryByText(/no bananas fall inside the selected date range/i)
      ).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  test('resets the database and refreshes analytics data', async () => {
    const fetch = vi.fn().mockResolvedValue({
      json: async () => ({ deleted: 2 }),
      ok: true,
      status: 200,
    })
    vi.stubGlobal('fetch', fetch)

    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    )

    fireEvent.click(
      await screen.findByRole('button', { name: /reset all fields/i })
    )

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/database',
      expect.objectContaining({
        method: 'DELETE',
      })
    )
    expect(
      await screen.findByText(/database reset\. deleted 2 bananas\./i)
    ).toBeInTheDocument()
    expect(revalidate).toHaveBeenCalled()
  })
})
