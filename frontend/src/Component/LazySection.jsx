import { useEffect, useRef, useState } from 'react'

/**
 * LazySection — renders children only after the element enters the viewport.
 * Uses a single shared IntersectionObserver for efficiency.
 *
 * Props:
 *  - placeholder: height to reserve while not yet visible (prevents layout shift)
 *  - rootMargin:  how far ahead to start loading (default: 300px below viewport)
 *  - className:   forwarded to the wrapper div
 */
export default function LazySection({
  children,
  placeholder = null,
  rootMargin = '300px 0px',
  threshold = 0,
  className = '',
  style = {},
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // If IntersectionObserver not supported (old browser), just show immediately
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return (
    <div ref={ref} className={className} style={style}>
      {visible ? children : placeholder}
    </div>
  )
}
