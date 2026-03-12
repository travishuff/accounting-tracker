import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useLoaderData, useRevalidator } from 'react-router'

import Sell from '../Sell'
import type { Banana } from '../types'

vi.mock('../lib/date', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('../lib/date')

  return {
    ...actual,
    getTodayDate: () => '2026-03-05',
  }
})

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

const SELLABLE_BANANAS: Banana[] = [
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
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch)
    mockedUseLoaderData.mockReturnValue(SELLABLE_BANANAS)
    mockedUseRevalidator.mockReturnValue({
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
    fetchMock.mockResolvedValue({
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
