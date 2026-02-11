import { track } from '@vercel/analytics'

export const trackPromotionEvent = (event: string, properties: Record<string, string>) => {
  track(event, properties)

  const gtag =
    typeof window !== 'undefined'
      ? (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
      : undefined
  if (gtag) {
    try {
      gtag('event', event, { ...properties })
      if (properties.action_detail) {
        gtag('event', properties.action_detail)
      }
    } catch (error) {
      console.error(error)
    }
  }
}
