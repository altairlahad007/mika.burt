import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import Layout from './components/Layout/Layout'
import { initScrollTrigger, killAllScrollTriggers } from './utils/animations'

function App() {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis
    window.lenis = lenis // Make available globally for scrollTo utility

    // Connect Lenis to GSAP ScrollTrigger
    initScrollTrigger(lenis)


    // Cleanup on unmount
    return () => {
      killAllScrollTriggers()
      lenis.destroy()
      lenisRef.current = null
      window.lenis = null
    }
  }, [])

  return <Layout />
}

export default App