/** Tally inline embed — loads widget script once and activates iframes with `data-tally-src`. */
export { TALLY_EMBED_URL, TALLY_FORM_ID } from './config/tally'
import { TALLY_SCRIPT_URL } from './config/tally'

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

  let script = document.querySelector<HTMLScriptElement>(`script[src="${TALLY_SCRIPT_URL}"]`)
  if (!script) {
    script = document.createElement('script')
    script.src = TALLY_SCRIPT_URL
    script.async = true
    script.onload = apply
    script.onerror = apply
    document.body.appendChild(script)
    return
  }

  script.addEventListener('load', apply, { once: true })
  queueMicrotask(apply)
}
