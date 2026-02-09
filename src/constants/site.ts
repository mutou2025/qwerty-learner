const FALLBACK_SITE_ORIGIN = 'https://www.echolearner.com'

const envSiteOrigin = import.meta.env.VITE_SITE_ORIGIN?.trim()

export const SITE_ORIGIN =
  envSiteOrigin && envSiteOrigin.length > 0
    ? envSiteOrigin.replace(/\/+$/, '')
    : typeof window !== 'undefined'
      ? window.location.origin
      : FALLBACK_SITE_ORIGIN

export const SITE_URL = `${SITE_ORIGIN}/`
export const SITE_DOMAIN = SITE_ORIGIN.replace(/^https?:\/\//, '')
export const SITE_OG_IMAGE_URL = `${SITE_ORIGIN}/og-image.png`
