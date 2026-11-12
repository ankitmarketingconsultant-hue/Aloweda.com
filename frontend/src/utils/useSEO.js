/**
 * useSEO — sets document title, meta description, canonical URL and OG tags
 * dynamically on every page. Call once at the top of each page component.
 *
 * Usage:
 *   useSEO({
 *     title: 'Super Glow Serum | Aloweda',
 *     description: 'Vitamin C 15% brightening serum...',
 *     canonical: '/product/8',
 *     ogImage: '/og-super-glow.jpg',   // optional
 *   })
 */

const BASE_URL = 'https://www.aloweda.com'
const DEFAULT_IMAGE = `${BASE_URL}/favicon.png`

function setMeta(name, content, attr = 'name') {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href) {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function useSEO({ title, description, canonical, ogImage, noindex = false } = {}) {
  // Run only on the client, in an effect-like way (called at render time is fine for SPAs)
  if (typeof window === 'undefined') return

  const fullCanonical = canonical
    ? canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical}`
    : BASE_URL + window.location.pathname

  const image = ogImage
    ? (ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`)
    : DEFAULT_IMAGE

  // Title
  if (title) document.title = title

  // Robots
  setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')

  // Description
  if (description) {
    setMeta('description', description)
    setMeta('og:description', description, 'property')
    setMeta('twitter:description', description, 'name')
  }

  // Canonical
  setLink('canonical', fullCanonical)

  // OG
  setMeta('og:url', fullCanonical, 'property')
  setMeta('og:title', title || document.title, 'property')
  setMeta('og:image', image, 'property')
  setMeta('twitter:title', title || document.title, 'name')
  setMeta('twitter:image', image, 'name')
}
