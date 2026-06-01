/** GET /forms/{id}/submissions — uses totals in the response body (limit=1 keeps payload small). */
type TallyCountApiResponse = {
  count?: number | null
}

export async function fetchTallyCompletedCount(formId: string): Promise<number | null> {
  const id = formId.trim()
  if (!id) return null

  const url = `/api/tally-count?formId=${encodeURIComponent(id)}`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (res.status === 204) return null
  if (!res.ok) return null

  const data = (await res.json()) as TallyCountApiResponse
  if (typeof data.count === 'number') return data.count
  return null
}
