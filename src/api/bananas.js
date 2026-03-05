const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
).replace(/\/$/, '')

const request = async (path, options = {}) => {
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
      const data = await response.json()
      message = data.message || message
    } catch {
      message = response.statusText || message
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const listBananas = () => request('/api/bananas')

export const buyBananas = (payload) =>
  request('/api/bananas', {
    body: JSON.stringify(payload),
    method: 'POST',
  })

export const sellBananas = (payload) =>
  request('/api/bananas', {
    body: JSON.stringify(payload),
    method: 'PUT',
  })
