import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Gallery.module.css'

import img1 from '../../assets/images/1.png'
import img2 from '../../assets/images/2.png'
import img3 from '../../assets/images/3.png'
import img4 from '../../assets/images/4.png'
import img5 from '../../assets/images/5.png'
import img6 from '../../assets/images/6.png'
import img7 from '../../assets/images/7.png'
import img8 from '../../assets/images/8.png'

gsap.registerPlugin(ScrollTrigger)

const col1 = [img1, img4, img7, img2]
const col2 = [img2, img5, img8, img3]
const col3 = [img3, img6, img1, img5]

function Gallery() {
  const sectionRef = useRef(null)
  const col1Ref = useRef(null)
  const col2Ref = useRef(null)
  const col3Ref = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Column 1 moves UP 
      gsap.fromTo(col1Ref.current,
        { yPercent: 0 },
        {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        }
      )

      // Column 2 moves DOWN (starts high, moves lower)
      gsap.fromTo(col2Ref.current,
        { yPercent: -20 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          }
        }
      )

      // Column 3 moves UP (faster)
      gsap.fromTo(col3Ref.current,
        { yPercent: 5 },
        {
          yPercent: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="gallery" ref={sectionRef} className={styles.gallerySection}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>OUR WORK</h2>
        <div className={styles.line}></div>
      </div>

      <div className={styles.gridContainer}>
        <div ref={col1Ref} className={styles.column}>
          {col1.map((img, i) => (
            <div key={`col1-${i}`} className={styles.imageWrapper}>
              <img src={img} alt={`Gallery artwork ${i}`} className={styles.image} />
            </div>
          ))}
        </div>
        <div ref={col2Ref} className={`${styles.column} ${styles.colCenter}`}>
          {col2.map((img, i) => (
            <div key={`col2-${i}`} className={styles.imageWrapper}>
              <img src={img} alt={`Gallery artwork ${i}`} className={styles.image} />
            </div>
          ))}
        </div>
        <div ref={col3Ref} className={styles.column}>
          {col3.map((img, i) => (
            <div key={`col3-${i}`} className={styles.imageWrapper}>
              <img src={img} alt={`Gallery artwork ${i}`} className={styles.image} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
