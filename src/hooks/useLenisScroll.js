import { useEffect, useRef, useState } from 'react'

/**
 * Hook to subscribe to Lenis scroll events
 * @param {Function} callback - Function called with scroll info on each scroll event
 * @returns {Object} - { scrollY, direction, velocity, progress } - latest scroll values
 */
export function useLenisScroll(callback) {
  const callbackRef = useRef(callback)
  const [scrollData, setScrollData] = useState({
    scrollY: 0,
    direction: null,
    velocity: 0,
    progress: 0,
  })

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const lenis = window.lenis

    if (!lenis) {
      console.warn('Lenis not initialized yet')
      return
    }

    const handleScroll = (e) => {
      const scrollY = lenis.scroll
      const direction = e.direction || (scrollY > scrollData.scrollY ? 1 : -1)
      const velocity = Math.abs(e.velocity || 0)
      const progress = scrollY / (document.body.scrollHeight - window.innerHeight || 1)

      const data = { scrollY, direction, velocity, progress }
      setScrollData(data)

      if (callbackRef.current) {
        callbackRef.current(data)
      }
    }

    lenis.on('scroll', handleScroll)

    return () => {
      lenis.off('scroll', handleScroll)
    }
  }, [])

  return scrollData
}

/**
 * Hook to get a specific scroll threshold crossed
 * @param {number} threshold - Scroll position in pixels
 * @returns {boolean} - Whether threshold has been crossed
 */
export function useScrollThreshold(threshold) {
  const [crossed, setCrossed] = useState(false)
  const { scrollY } = useLenisScroll()

  useEffect(() => {
    if (scrollY > threshold && !crossed) {
      setCrossed(true)
    } else if (scrollY < threshold && crossed) {
      setCrossed(false)
    }
  }, [scrollY, threshold, crossed])

  return crossed
}