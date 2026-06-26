export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isMobileViewport(breakpoint = 768) {
  return window.innerWidth <= breakpoint
}

export function getHorizontalScrollBuffer() {
  if (window.innerWidth <= 480) return 40
  if (window.innerWidth <= 768) return 40
  if (window.innerWidth <= 1024) return 80
  return 160
}

export function getImageSequencePinDuration() {
  if (prefersReducedMotion()) return 1200
  if (isMobileViewport()) return 2800
  return 6000
}

export function getHeroZoomScale() {
  if (prefersReducedMotion()) return 1.5
  if (isMobileViewport()) return 3
  return 6
}
