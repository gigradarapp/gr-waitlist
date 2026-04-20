/// <reference types="vite/client" />

declare global {
  interface Window {
    __tweakCity: string
    __tweakCount: number
    /** `null` = follow app / localStorage; `'pre' | 'post'` = design tool override */
    __tweakState: string | null
    __tweakStateChange?: (s: string) => void
    __tweakCityChange?: (c: string) => void
    __tweakCountChange?: (c: number) => void
    setTweakState: (s: string) => void
  }
}

export {}
