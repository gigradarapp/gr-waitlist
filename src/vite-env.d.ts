/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TALLY_API_KEY?: string
}

declare global {
  interface Window {
    __tweakCity: string
    __tweakCount: number
    Tally?: { loadEmbeds: () => void }
  }
}

export {}
