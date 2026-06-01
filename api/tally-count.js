const TALLY_SUBMISSIONS_LIST_LIMIT = 1

function readCount(data) {
  const totals = data?.totalNumberOfSubmissionsPerFilter
  if (!totals) return null
  if (typeof totals.completed === 'number') return totals.completed
  if (typeof totals.all === 'number') return totals.all
  return null
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    response.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const url = new URL(request.url, `https://${request.headers.host ?? 'localhost'}`)
  const formId = url.searchParams.get('formId')?.trim()
  if (!formId) {
    response.status(400).json({ error: 'missing_form_id' })
    return
  }

  const apiKey = process.env.TALLY_API_KEY?.trim()
  if (!apiKey) {
    response.status(204).end()
    return
  }

  try {
    const upstream = await fetch(
      `https://api.tally.so/forms/${encodeURIComponent(formId)}/submissions?limit=${TALLY_SUBMISSIONS_LIST_LIMIT}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
        },
      },
    )

    if (!upstream.ok) {
      response.status(502).json({ error: 'tally_upstream_error' })
      return
    }

    const data = await upstream.json()
    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600')
    response.status(200).json({ count: readCount(data) })
  } catch {
    response.status(502).json({ error: 'tally_unavailable' })
  }
}
