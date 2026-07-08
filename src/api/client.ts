// Client HTTP terpusat. Semua panggilan API lewat sini biar konsisten:
// base URL, header, token auth, dan penanganan error.
const BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1'

type ApiOptions = Omit<RequestInit, 'body'> & { body?: unknown }

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options
  const token = localStorage.getItem('token')

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    // FastAPI biasanya kirim { detail }, backend lain { message }.
    throw new Error(data.detail || data.message || `Request gagal (${response.status})`)
  }

  if (response.status === 204) return undefined as T // No Content
  return response.json() as Promise<T>
}
