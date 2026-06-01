/// <reference types="vite/client" />

declare global {
  interface Window {
    __tweakCity: string
    __tweakCount: number
    Tally?: { loadEmbeds: () => void }
  }
}

export {}
