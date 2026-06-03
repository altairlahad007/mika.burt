import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.css'

// Import an image to use as the faint glowing background
import bgImage from '../../assets/images/8.png'

gsap.registerPlugin(ScrollTrigger)

function About() {
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
          yPercent: 150, // Move down significantly
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

      // Parallax for the faint background image
      gsap.to(bgRef.current, {
        yPercent: -30,
        rotation: 15,
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
    <section id="about" ref={sectionRef} className={styles.about}>
      <img ref={bgRef} src={bgImage} alt="" className={styles.bgImage} />
      
      <div className={styles.container}>
        <div className={styles.lineContainer}>
          <div ref={lineRef} className={styles.verticalLine}></div>
        </div>
        
        <div className={styles.contentWrapper}>
          <h2 className={styles.title}>
            CRAFTING<br />
            ORGANIC<br />
            FORMS
          </h2>
          
          <div ref={textRef} className={styles.textContainer}>
            <p className={styles.paragraph}>
              We have to give props to the raw materials we find in nature. We sculpt, shape, and fire our ceramics entirely by hand, ensuring that no two pieces are ever exactly alike.
            </p>
            <p className={styles.paragraph}>
              Drawing deep inspiration from natural landscapes and expressive human figures, our work celebrates the <span className={styles.highlight}>perfectly imperfect</span>. Every piece carries the warmth and character of its origin.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About