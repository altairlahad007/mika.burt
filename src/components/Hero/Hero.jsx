import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import centerImage from '../../assets/images/9.png'
import fullscreenImage from '../../assets/images/8.png'
import styles from './Hero.module.css'
import { useHeroAnimation } from '../../hooks/useHeroAnimation'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Hero({ theme, toggleTheme }) {
  const heroRef = useRef(null)
  const { createCtaPulse } = useHeroAnimation(heroRef)

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

    const centerPiece = heroRef.current.querySelector('[class*="centerPiece"]')
    const fullscreenBg = heroRef.current.querySelector('.hero-fullscreen-bg')
    const fullscreenImg = heroRef.current.querySelector('[class*="fullscreenImage"]')

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



  return (
    <section id="home" ref={heroRef} className={styles.hero}>
      <div className={styles.backgroundGradient} />
      <div className={styles.lightSource} />

      {/* Fullscreen Blur Fix Layer */}
      <div className={`${styles.fullscreenBg} hero-fullscreen-bg`}>
        <img src={fullscreenImage} alt="" className={styles.fullscreenImage} />
      </div>



      {/* Main Content */}
      <div className={styles.content}>

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


      </div>
    </section>
  )
}

export default Hero