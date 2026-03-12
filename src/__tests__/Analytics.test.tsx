import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLoaderData } from 'react-router'

import Analytics from '../Analytics'
import type { Banana } from '../types'

vi.mock('react-router', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('react-router')

  return {
    ...actual,
    useLoaderData: vi.fn(),
  }
})

const mockedUseLoaderData = vi.mocked(useLoaderData)

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
  })

  afterEach(() => {
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
})
