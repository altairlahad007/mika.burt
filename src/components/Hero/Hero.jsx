import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import centerImage from '../../assets/images/9.png'
import fullscreenImage from '../../assets/images/8.png'
import styles from './Hero.module.css'
import { useHeroAnimation } from '../../hooks/useHeroAnimation'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Hero() {
  const heroRef = useRef(null)
  const { animateFeatureHover, animateCategoryHover, createCtaPulse } = useHeroAnimation(heroRef)

  // Pinned scroll zoom effect
  useEffect(() => {
    if (!heroRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=150%', // the scrolling distance over which the animation occurs
        pin: true,
        scrub: 1, // smooth scrubbing
      }
    })

    const nav = heroRef.current.querySelector('.hero-nav')
    const leftContent = heroRef.current.querySelector('[class*="leftContent"]')
    const rightContent = heroRef.current.querySelector('[class*="rightContent"]')
    const centerPiece = heroRef.current.querySelector('[class*="centerPiece"]')

    const fullscreenBg = heroRef.current.querySelector('.hero-fullscreen-bg')
    const fullscreenImg = heroRef.current.querySelector('[class*="fullscreenImage"]')

    // Fade out surrounding content (using fromTo to ensure it returns to opacity: 1 on scroll up)
    tl.fromTo([nav, leftContent, rightContent], 
      { opacity: 1 },
      {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0
    )

    // Zoom in the center piece and fade out
    tl.fromTo(centerPiece,
      { scale: 1, opacity: 1 },
      {
        scale: 6, // massive zoom
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in'
      }, 0
    )

    // Full screen camera blur fix and zoom for 8.png
    tl.fromTo(fullscreenBg,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 0.2
    )

    tl.fromTo(fullscreenImg,
      { filter: 'blur(30px)', scale: 1 },
      { filter: 'blur(0px)', scale: 1.15, duration: 0.8, ease: 'power2.out' }, 0.2
    )

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill()
      tl.kill()
    }
  }, [])

  useEffect(() => {
    // Start CTA pulse animation after entrance completes
    const ctaBtns = document.querySelectorAll('.hero-cta-btn')
    ctaBtns.forEach(btn => {
      const pulse = createCtaPulse(btn)
      return () => pulse.kill()
    })
  }, [createCtaPulse])

  const handleFeatureMouseEnter = (e) => {
    const icon = e.currentTarget.querySelector('[class*="featureIcon"]')
    if (icon) animateFeatureHover(icon, true)
  }

  const handleFeatureMouseLeave = (e) => {
    const icon = e.currentTarget.querySelector('[class*="featureIcon"]')
    if (icon) animateFeatureHover(icon, false)
  }

  const handleCategoryMouseEnter = (e) => {
    const icon = e.currentTarget.querySelector('[class*="categoryIcon"]')
    if (icon) animateCategoryHover(icon, true)
  }

  const handleCategoryMouseLeave = (e) => {
    const icon = e.currentTarget.querySelector('[class*="categoryIcon"]')
    if (icon) animateCategoryHover(icon, false)
  }

  return (
    <section id="home" ref={heroRef} className={styles.hero}>
      <div className={styles.backgroundGradient} />
      <div className={styles.lightSource} />

      {/* Fullscreen Blur Fix Layer */}
      <div className={`${styles.fullscreenBg} hero-fullscreen-bg`}>
        <img src={fullscreenImage} alt="" className={styles.fullscreenImage} />
      </div>

      {/* Navigation */}
      <nav className={`${styles.nav} hero-nav`}>
        <div className={styles.navLeft}>
          <span className={styles.logo}>Mika.Burt</span>
        </div>
        <ul className={styles.navCenter}>
          <li>
            <a
              href="#home"
              className={styles.navLink}
              onClick={(e) => { e.preventDefault(); window.lenis?.scrollTo('#home') }}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -2, opacity: 1, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, opacity: 0.9, duration: 0.2 })}
            >Home</a>
          </li>
          <li>
            <a
              href="#products"
              className={styles.navLink}
              onClick={(e) => { e.preventDefault(); window.lenis?.scrollTo('#products') }}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -2, opacity: 1, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, opacity: 0.9, duration: 0.2 })}
            >Shop</a>
          </li>
          <li>
            <a
              href="#gallery"
              className={styles.navLink}
              onClick={(e) => { e.preventDefault(); window.lenis?.scrollTo('#gallery') }}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -2, opacity: 1, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, opacity: 0.9, duration: 0.2 })}
            >Categories</a>
          </li>
          <li>
            <a
              href="#about"
              className={styles.navLink}
              onClick={(e) => { e.preventDefault(); window.lenis?.scrollTo('#about') }}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -2, opacity: 1, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, opacity: 0.9, duration: 0.2 })}
            >About</a>
          </li>
        </ul>
        <div className={styles.navRight}>
          <button
            className={`${styles.iconBtn} hero-icon-btn`}
            aria-label="Search"
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.15, y: -2, duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.3 })}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button
            className={`${styles.iconBtn} hero-icon-btn`}
            aria-label="Cart"
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.15, y: -2, duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.3 })}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M6 6L5 2H2" />
            </svg>
          </button>
          <button
            className={`${styles.iconBtn} hero-icon-btn`}
            aria-label="Profile"
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.15, y: -2, duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.3 })}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Left Content */}
        <div className={styles.leftContent}>
          <div className={`${styles.textBlock} hero-text-block`}>
            <h1 className={styles.headline}>
              Crafted By Hands,<br />Inspired by Earth
            </h1>
            <p className={styles.description}>
              Discover timeless, handmade ceramics designed to bring warmth and character to your home.
            </p>
            <button className={`${styles.ctaBtn} hero-cta-btn`} data-hero-cta>
              Shop Collection
            </button>
          </div>

          <div className={`${styles.featuresLeft} hero-features`}>
            <div
              className={`${styles.featureItem} hero-feature-item`}
              onMouseEnter={handleFeatureMouseEnter}
              onMouseLeave={handleFeatureMouseLeave}
            >
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className={styles.featureText}>100% Handmade</span>
            </div>
            <div
              className={`${styles.featureItem} hero-feature-item`}
              onMouseEnter={handleFeatureMouseEnter}
              onMouseLeave={handleFeatureMouseLeave}
            >
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 6v6" />
                  <path d="M8 10l4-4 4 4" />
                </svg>
              </div>
              <span className={styles.featureText}>Eco-friendly & Durable</span>
            </div>
            <div
              className={`${styles.featureItem} hero-feature-item`}
              onMouseEnter={handleFeatureMouseEnter}
              onMouseLeave={handleFeatureMouseLeave}
            >
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span className={styles.featureText}>Unique, No Two Pieces Alike</span>
            </div>
          </div>
        </div>

        {/* Center Art Piece */}
        <div className={`${styles.centerPiece} hero-center`}>
          <div className={`${styles.archFrame} hero-arch-frame`}>
            <div className={`${styles.archTier} hero-arch-tier`} />
            <div className={`${styles.archTier} hero-arch-tier`} />
            <div className={`${styles.archTier} hero-arch-tier`} />
          </div>
          <div className={`${styles.artPiece} hero-art-piece`}>
            <img src={centerImage} alt="Handcrafted ceramic sculpture" className={styles.heroImage} />
          </div>
        </div>

        {/* Right Content */}
        <div className={`${styles.rightContent} hero-right`}>
          <div className={`${styles.categories} hero-categories`}>
            <div
              className={`${styles.categoryItem} hero-category-item`}
              onMouseEnter={handleCategoryMouseEnter}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <div className={styles.categoryIcon}>
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M8 40h32" />
                  <path d="M10 40c0-8 6-28 14-28s14 20 14 28" />
                  <path d="M18 20c2-1 6-2 12-2s10 1 12 2" strokeWidth="1" />
                  <path d="M20 12c1-3 2-5 1-7" opacity="0.6" />
                  <path d="M28 10c1-3 0-5-1-7" opacity="0.6" />
                </svg>
              </div>
              <span className={styles.categoryLabel}>Mugs</span>
              <span className={styles.categoryDesc}>For your morning rituals</span>
            </div>

            <div
              className={`${styles.categoryItem} hero-category-item`}
              onMouseEnter={handleCategoryMouseEnter}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <div className={styles.categoryIcon}>
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M16 40h16" />
                  <path d="M14 40c-2-20 4-36 10-36s12 16 10 36" />
                  <path d="M24 4c-3 8-4 16-2 20" opacity="0.5" />
                </svg>
              </div>
              <span className={styles.categoryLabel}>Vases</span>
              <span className={styles.categoryDesc}>Sculptural curves</span>
            </div>
          </div>

          <button className={`${styles.ctaBtnRight} hero-cta-btn`} data-hero-cta>
            Explore Story
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero