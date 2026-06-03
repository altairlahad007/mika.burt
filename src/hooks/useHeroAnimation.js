import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Custom hook for Hero section GSAP animations
 * Handles entrance animations, ambient effects, and icon interactions
 */
export function useHeroAnimation(containerRef) {
  const timelineRef = useRef(null)
  const ambientRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Set initial states for entrance animation
    gsap.set([
      '.hero-nav',
      '.hero-text-block',
      '.hero-feature-item',
      '.hero-arch-tier',
      '.hero-art-piece',
      '.hero-category-item',
      '.hero-cta-btn',
    ], {
      opacity: 0,
    })

    gsap.set('.hero-nav', { y: -30 })
    gsap.set('.hero-text-block', { x: -60 })
    gsap.set('.hero-feature-item', { x: -40, opacity: 0 })
    gsap.set('.hero-arch-tier', { scale: 0.8, opacity: 0 })
    gsap.set('.hero-art-piece', { scale: 0.85, opacity: 0 })
    gsap.set('.hero-category-item', { x: 60, opacity: 0 })
    gsap.set('.hero-cta-btn', { y: 30, opacity: 0 })

    // Create entrance timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Navigation slides down
    tl.to('.hero-nav', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    })

    // Left content animations
    tl.to('.hero-text-block', {
      opacity: 1,
      x: 0,
      duration: 0.9,
    }, '-=0.4')

    // Feature items stagger in
    tl.to('.hero-feature-item', {
      opacity: 1,
      x: 0,
      duration: 0.6,
      stagger: 0.15,
    }, '-=0.4')

    // Center art piece - circles expand outward, then image fades in
    tl.to('.hero-arch-tier', {
      scale: 1,
      opacity: 1,
      duration: 1,
      stagger: 0.12,
      ease: 'power2.out',
    }, '-=0.6')

    tl.to('.hero-art-piece', {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'back.out(1.2)',
    }, '-=0.5')

    // Right content - category items
    tl.to('.hero-category-item', {
      opacity: 1,
      x: 0,
      duration: 0.7,
      stagger: 0.2,
    }, '-=0.6')

    // CTA buttons slide up
    tl.to('.hero-cta-btn', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
    }, '-=0.3')

    timelineRef.current = tl

    // Create ambient animations (continuous)
    const archTiers = container.querySelectorAll('.hero-arch-tier')
    const artPiece = container.querySelector('.hero-art-piece')

    // Ambient: slow rotation and scale pulse for circles
    const ambientTl = gsap.timeline({ repeat: -1, yoyo: true })

    archTiers.forEach((tier, i) => {
      ambientTl.to(tier, {
        scale: 1.02 + (i * 0.01),
        duration: 3 + i * 0.5,
        ease: 'sine.inOut',
      }, 0)
    })

    // Ambient: subtle floating for the art piece
    gsap.to(artPiece, {
      y: -8,
      duration: 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })

    ambientRef.current = ambientTl

    // Cleanup
    return () => {
      tl.kill()
      ambientTl.kill()
      gsap.killTweensOf(artPiece)
    }
  }, [containerRef])

  // Feature icon hover animation
  const animateFeatureHover = (iconElement, isEntering) => {
    gsap.to(iconElement, {
      scale: isEntering ? 1.2 : 1,
      rotation: isEntering ? 5 : 0,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  // Category icon hover animation
  const animateCategoryHover = (iconElement, isEntering) => {
    gsap.to(iconElement, {
      scale: isEntering ? 1.15 : 1,
      y: isEntering ? -4 : 0,
      duration: 0.4,
      ease: 'back.out(1.7)',
    })
  }

  // CTA button glow pulse
  const createCtaPulse = (btnElement) => {
    return gsap.to(btnElement, {
      boxShadow: '0 0 40px rgba(6, 182, 212, 0.6), 0 0 80px rgba(6, 182, 212, 0.35)',
      duration: 1.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })
  }

  // Icon path drawing animation for decorative elements
  const drawIconPath = (svgElement) => {
    const paths = svgElement.querySelectorAll('path, circle, line')
    paths.forEach(path => {
      const length = path.getTotalLength ? path.getTotalLength() : 100
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      })
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut',
      })
    })
  }

  return {
    timelineRef,
    animateFeatureHover,
    animateCategoryHover,
    createCtaPulse,
    drawIconPath,
  }
}

export default useHeroAnimation