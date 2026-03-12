import type { Banana } from '../types'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
).replace(/\/$/, '')

const request = async <T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Request failed.'

    try {
      const data = (await response.json()) as { message?: string }
      message = data.message || message
    } catch {
      message = response.statusText || message
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json() as Promise<T>
}

export const listBananas = () => request<Banana[]>('/api/bananas')

export const buyBananas = (payload: { number: number; buyDate: string }) =>
  request('/api/bananas', {
    body: JSON.stringify(payload),
    method: 'POST',
  })

export const sellBananas = (payload: { number: number; sellDate: string }) =>
  request('/api/bananas', {
    body: JSON.stringify(payload),
    method: 'PUT',
  })
