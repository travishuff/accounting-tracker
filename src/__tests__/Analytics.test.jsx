import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLoaderData } from 'react-router'

import Analytics from '../Analytics'

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    useLoaderData: vi.fn(),
  }
})

const ANALYTICS_DB = [
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
    useLoaderData.mockReturnValue(ANALYTICS_DB)
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

    expect(
      JSON.parse(window.localStorage.getItem('banana-tracker.analytics'))
    ).toEqual(
      expect.objectContaining({
        buyPrice: 0.55,
      })
    )
  })
})
