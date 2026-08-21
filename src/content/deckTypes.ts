/**
 * Shared deck slide shape for in-site project intros.
 */
export type DeckSlide = {
  kicker?: string
  title?: string
  lead?: string
  body?: string[]
  columns?: { heading: string; items: string[] }[]
  bullets?: string[]
  note?: string
  images?: { src: string; caption?: string }[]
  closing?: boolean
}

export type ProjectDeck = {
  brand: string
  brandZh?: string
  slides: DeckSlide[]
}
