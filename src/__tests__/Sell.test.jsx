import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useLoaderData, useRevalidator } from 'react-router'

import Sell from '../Sell'

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    useLoaderData: vi.fn(),
    useRevalidator: vi.fn(),
  }
})

const SELLABLE_BANANAS = [
  {
    id: 'banana-1',
    buyDate: '2026-03-01',
    sellDate: null,
  },
  {
    id: 'banana-2',
    buyDate: '2026-03-02',
    sellDate: null,
  },
]

describe('Sell', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    useLoaderData.mockReturnValue(SELLABLE_BANANAS)
    useRevalidator.mockReturnValue({
      revalidate: vi.fn(),
      state: 'idle',
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  test('shows inventory constraints before submitting', async () => {
    render(
      <MemoryRouter>
        <Sell />
      </MemoryRouter>
    )

    expect(
      await screen.findByText(/2 unsold bananas in inventory/i)
    ).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/sale date/i), {
      target: { value: '2026-03-05' },
    })
    fireEvent.change(screen.getByLabelText(/quantity/i), {
      target: { value: '3' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(
      await screen.findByText(/only 2 bananas can be sold on that date/i)
    ).toBeInTheDocument()
  })

  test('submits a valid sale request', async () => {
    fetch.mockResolvedValue({
      json: async () => ({ ok: true }),
      ok: true,
      status: 200,
    })

    render(
      <MemoryRouter>
        <Sell />
      </MemoryRouter>
    )

    fireEvent.change(await screen.findByLabelText(/sale date/i), {
      target: { value: '2026-03-05' },
    })
    fireEvent.change(screen.getByLabelText(/quantity/i), {
      target: { value: '2' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() =>
      expect(screen.getByText(/you sold bananas/i)).toBeInTheDocument()
    )
  })
})
