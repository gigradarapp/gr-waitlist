export const TALLY_SCRIPT_URL = 'https://tally.so/widgets/embed.js'

export const TALLY_EMBED_URL =
  'https://tally.so/embed/pbPvqZ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1'

/** Same form as the embed (`/embed/{id}`). Change `TALLY_EMBED_URL` if you use another form. */
export const TALLY_FORM_ID = new URL(TALLY_EMBED_URL).pathname.split('/').filter(Boolean).pop() ?? 'pbPvqZ'

export const TALLY_SUBMISSIONS_LIST_LIMIT = 1
