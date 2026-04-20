/** Design-time panel (postMessage + local controls). Safe no-op if DOM nodes are missing. */
export const TWEAK_DEFAULTS = { city: 'Singapore', startCount: 1247 } as const

window.addEventListener('message', (e) => {
  const panel = document.getElementById('tweaks-panel')
  if (!panel) return
  if (e.data?.type === '__activate_edit_mode') panel.classList.add('open')
  if (e.data?.type === '__deactivate_edit_mode') panel.classList.remove('open')
})
window.parent.postMessage({ type: '__edit_mode_available' }, '*')

document.getElementById('tweaks-close')?.addEventListener('click', () => {
  document.getElementById('tweaks-panel')?.classList.remove('open')
})

window.__tweakCity = TWEAK_DEFAULTS.city
window.__tweakCount = TWEAK_DEFAULTS.startCount
window.__tweakState = null

function setTweakState(s: string) {
  window.__tweakState = s
  ;['pre', 'post'].forEach((x) => {
    document.getElementById(`btn-${x}`)?.classList.toggle('active', x === s)
  })
  window.__tweakStateChange?.(s)
}

window.setTweakState = setTweakState

document.getElementById('tweak-city')?.addEventListener('change', (e) => {
  const v = (e.target as HTMLSelectElement).value
  window.__tweakCity = v
  window.__tweakCityChange?.(v)
})

document.getElementById('tweak-count')?.addEventListener('change', (e) => {
  const n = parseInt((e.target as HTMLInputElement).value, 10) || TWEAK_DEFAULTS.startCount
  window.__tweakCount = n
  window.__tweakCountChange?.(n)
})
