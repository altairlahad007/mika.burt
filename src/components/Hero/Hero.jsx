import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import centerImage from '../../assets/images/9.png'
import styles from './Hero.module.css'
import { getHeroZoomScale, prefersReducedMotion } from '../../utils/responsive'
import { useHeroAnimation } from '../../hooks/useHeroAnimation'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 120

function Hero({ theme, toggleTheme }) {
  const heroRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const { createCtaPulse } = useHeroAnimation(heroRef)

  const drawFrame = (img) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, 1080, 1920)
      ctx.drawImage(img, 0, 0, 1080, 1920)
    }
  }

  // Preload sequence frames
  useEffect(() => {
    const images = []
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      const frameNum = i.toString().padStart(3, '0')
      img.src = `/hero_sequence/frame_${frameNum}.png`
      img.onload = () => {
        // Draw the first frame when it's loaded
        if (i === 1) {
          drawFrame(img)
        }
      }
      images.push(img)
    }
    imagesRef.current = images
  }, [])

  // Pinned scroll zoom effect
  useEffect(() => {
    if (!heroRef.current) return
    if (prefersReducedMotion()) return

    const zoomScale = getHeroZoomScale()

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
      }
    })

    const centerPiece = heroRef.current.querySelector('[class*="centerPiece"]')
    const fullscreenBg = heroRef.current.querySelector('.hero-fullscreen-bg')
    const fullscreenImg = heroRef.current.querySelector('[class*="fullscreenImage"]')

    tl.fromTo(centerPiece,
      { scale: 1, opacity: 1 },
      {
        scale: zoomScale,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in'
      }, 0
    )

    // Full screen camera blur fix and zoom for canvas
    tl.fromTo(fullscreenBg,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 0.2
    )

    tl.fromTo(fullscreenImg,
      { filter: 'blur(30px)', scale: 1 },
      { filter: 'blur(0px)', scale: 1.15, duration: 0.8, ease: 'power2.out' }, 0.2
    )

    // Frame sequence animation
    const frameObj = { frame: 0 }
    tl.to(frameObj, {
      frame: FRAME_COUNT - 1,
      snap: 'frame',
      ease: 'none',
      duration: 1, // matches scrub timeline relative duration
      onUpdate: () => {
        if (!imagesRef.current[frameObj.frame]) return;
        drawFrame(imagesRef.current[frameObj.frame])
      }
    }, 0)

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
        <canvas
          ref={canvasRef}
          width={1080}
          height={1920}
          className={styles.fullscreenImage}
        />
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