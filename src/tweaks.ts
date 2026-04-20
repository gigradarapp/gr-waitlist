/** Default landing copy (city label + waitlist counter seed). */
export const TWEAK_DEFAULTS = { city: 'Singapore', startCount: 1247 } as const

window.__tweakCity = TWEAK_DEFAULTS.city
window.__tweakCount = TWEAK_DEFAULTS.startCount
