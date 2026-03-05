import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Buy from '../Buy'

describe('Buy', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('submits a valid purchase request', async () => {
    fetch.mockResolvedValue({
      json: async () => ({ ok: true }),
      ok: true,
      status: 200,
    })

    render(<Buy />)

    fireEvent.change(screen.getByLabelText(/quantity/i), {
      target: { value: '12' },
    })
    fireEvent.change(screen.getByLabelText(/purchase date/i), {
      target: { value: '2026-03-06' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() =>
      expect(screen.getByText(/you bought bananas/i)).toBeInTheDocument()
    )

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/bananas',
      expect.objectContaining({
        body: JSON.stringify({ buyDate: '2026-03-06', number: 12 }),
        method: 'POST',
      })
    )
  })

  test('blocks invalid dates and quantities', async () => {
    render(<Buy />)

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(
      await screen.findByText(/fix the highlighted fields before submitting/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/choose today or a future purchase date/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/enter a quantity from 1 to 50 bananas/i)
    ).toBeInTheDocument()
  })
})
