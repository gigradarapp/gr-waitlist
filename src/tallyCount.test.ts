import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchTallyCompletedCount } from './tallyCount'

const originalFetch = globalThis.fetch

afterEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = originalFetch
})

describe('fetchTallyCompletedCount', () => {
  it('reads the completed count from the internal API', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ count: 42 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchTallyCompletedCount('pbPvqZ')).resolves.toBe(42)
    expect(fetchMock).toHaveBeenCalledWith('/api/tally-count?formId=pbPvqZ', {
      headers: { Accept: 'application/json' },
    })
  })

  it('does not call the API without a form id', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchTallyCompletedCount('   ')).resolves.toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('falls back when the internal API is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })))

    await expect(fetchTallyCompletedCount('pbPvqZ')).resolves.toBeNull()
  })
})
