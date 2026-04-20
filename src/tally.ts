/** Tally inline embed — loads widget script once and activates iframes with `data-tally-src`. */
const TALLY_SCRIPT = 'https://tally.so/widgets/embed.js'

export const TALLY_EMBED_URL =
  'https://tally.so/embed/pbPvqZ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1'

/** Same form as the embed (`/embed/{id}`). Change `TALLY_EMBED_URL` if you use another form. */
export const TALLY_FORM_ID = new URL(TALLY_EMBED_URL).pathname.split('/').filter(Boolean).pop() ?? 'pbPvqZ'

export function initTallyEmbeds(): void {
  const apply = () => {
    if (typeof window.Tally !== 'undefined') {
      window.Tally.loadEmbeds()
      return
    }
    document.querySelectorAll<HTMLIFrameElement>('iframe[data-tally-src]:not([src])').forEach((el) => {
      const src = el.dataset.tallySrc
      if (src) el.src = src
    })
  }

  if (typeof window.Tally !== 'undefined') {
    apply()
    return
  }

  let script = document.querySelector<HTMLScriptElement>(`script[src="${TALLY_SCRIPT}"]`)
  if (!script) {
    script = document.createElement('script')
    script.src = TALLY_SCRIPT
    script.async = true
    script.onload = apply
    script.onerror = apply
    document.body.appendChild(script)
    return
  }

  script.addEventListener('load', apply, { once: true })
  queueMicrotask(apply)
}
