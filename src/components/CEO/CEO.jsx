import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './CEO.module.css'

import bgImage from '../../assets/images/6.png'

gsap.registerPlugin(ScrollTrigger)

function CEO() {
  const sectionRef = useRef(null)
  const lineRef = useRef(null)
  const textRef = useRef(null)
  const bgRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Parallax for the vertical line (starts high, moves low)
      // Since it's centered by CSS (align-items: center), yPercent: 0 is perfectly centered.
      // We go from -150% to 150%, meaning at progress 0.5 it hits 0%.
      gsap.fromTo(lineRef.current, 
        { yPercent: -150 },
        {
          yPercent: 150,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        }
      )

      // Parallax for the text block (starts lower, moves up)
      // It is absolute positioned at top: 50%, so yPercent: -50 is perfectly centered.
      // We go from yPercent: 50 to yPercent: -150, meaning at progress 0.5 it hits -50%.
      gsap.fromTo(textRef.current, 
        { yPercent: 50 },
        {
          yPercent: -150,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          }
        }
      )

      // Subtle Parallax for the background image
      gsap.to(bgRef.current, {
        yPercent: -20,
        rotation: -5,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.ceoSection}>
      <img ref={bgRef} src={bgImage} alt="Mika Burt" className={styles.bgImage} />
      
      <div className={styles.container}>
        <div className={styles.lineContainer}>
          <div ref={lineRef} className={styles.verticalLine}></div>
        </div>
        
        <div className={styles.contentWrapper}>
          <h2 className={styles.title}>
            MIKA<br />
            BURT
          </h2>
          
          <div ref={textRef} className={styles.textContainer}>
            <p className={styles.label}>THE FOUNDER</p>
            <p className={styles.paragraph}>
              With over two decades of shaping earth into form, Mika Burt has redefined modern ceramic artistry. Her work bridges the gap between primitive techniques and contemporary design.
            </p>
            <p className={styles.paragraph}>
              "Every curve and texture is an <span className={styles.highlight}>intimate conversation</span> with the material. We don't force shapes; we uncover them."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CEO
