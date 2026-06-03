import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MorphSVGPlugin)

// Smooth scroll-to utility using Lenis
export const scrollTo = (target, options = {}) => {
  const lenis = window.lenis
  if (lenis) {
    lenis.scrollTo(target, options)
  } else {
    gsap.to(window, { duration: 1, scrollTo: { y: target, ...options } })
  }
}

// Initialize ScrollTrigger with Lenis
export const initScrollTrigger = (lenis) => {
  lenis.on('scroll', ScrollTrigger.update)
  
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  
  gsap.ticker.lagSmoothing(0)
}

// Fade-up animation for elements
export const fadeUpAnimation = (elements, options = {}) => {
  const {
    duration = 0.8,
    y = 60,
    stagger = 0.1,
    start = 'top 85%',
    ease = 'power3.out'
  } = options

  return gsap.fromTo(
    elements,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger,
      scrollTrigger: {
        trigger: elements[0]?.parentElement || elements[0],
        start,
        toggleActions: 'play none none reverse'
      }
    }
  )
}

// Scale-up animation
export const scaleUpAnimation = (elements, options = {}) => {
  const {
    duration = 0.8,
    scale = 0.8,
    stagger = 0.1,
    start = 'top 80%',
    ease = 'power3.out'
  } = options

  return gsap.fromTo(
    elements,
    { opacity: 0, scale },
    {
      opacity: 1,
      scale: 1,
      duration,
      ease,
      stagger,
      scrollTrigger: {
        trigger: elements[0]?.parentElement || elements[0],
        start,
        toggleActions: 'play none none reverse'
      }
    }
  )
}

// Horizontal slide animation
export const slideInAnimation = (elements, options = {}) => {
  const {
    duration = 0.8,
    x = 100,
    stagger = 0.1,
    start = 'top 80%',
    ease = 'power3.out'
  } = options

  return gsap.fromTo(
    elements,
    { opacity: 0, x },
    {
      opacity: 1,
      x: 0,
      duration,
      ease,
      stagger,
      scrollTrigger: {
        trigger: elements[0]?.parentElement || elements[0],
        start,
        toggleActions: 'play none none reverse'
      }
    }
  )
}

// Parallax effect
export const createParallax = (element, options = {}) => {
  const { yPercent = -20, start = 'top bottom', end = 'bottom top' } = options

  return gsap.to(element, {
    yPercent,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start,
      end,
      scrub: true
    }
  })
}

// Text reveal animation
export const textRevealAnimation = (element, options = {}) => {
  const { duration = 0.8, stagger = 0.05, ease = 'power3.out' } = options

  const lines = element.querySelectorAll('div')
  if (!lines.length) return

  gsap.set(lines, { overflow: 'hidden' })

  return gsap.fromTo(
    lines,
    { y: '100%' },
    {
      y: '0%',
      duration,
      ease,
      stagger,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  )
}

// Horizontal scroll section (pinned)
export const horizontalScroll = (container, panels, options = {}) => {
  const { padding = '100px' } = options

  return gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      snap: 1 / (panels.length - 1),
      end: () => '+=' + container.offsetWidth
    }
  })
}

// Kill all ScrollTriggers (for cleanup)
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

export { gsap, ScrollTrigger }