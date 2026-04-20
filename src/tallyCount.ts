/** GET /forms/{id}/submissions — uses totals in the response body (limit=1 keeps payload small). */

type TallyListResponse = {
  totalNumberOfSubmissionsPerFilter?: {
    all?: number
    completed?: number
    partial?: number
  }
}

export async function fetchTallyCompletedCount(formId: string, apiKey: string): Promise<number | null> {
  const key = apiKey.trim()
  if (!formId || !key) return null

  const url = `https://api.tally.so/forms/${encodeURIComponent(formId)}/submissions?limit=1`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
  })

  if (!res.ok) return null

  const data = (await res.json()) as TallyListResponse
  const t = data.totalNumberOfSubmissionsPerFilter
  if (!t) return null
  if (typeof t.completed === 'number') return t.completed
  if (typeof t.all === 'number') return t.all
  return null
}
