import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Products.module.css'

// Import images
import img1 from '../../assets/images/1.png'
import img2 from '../../assets/images/2.png'
import img3 from '../../assets/images/3.png'
import img4 from '../../assets/images/4.png'
import img5 from '../../assets/images/5.png'

gsap.registerPlugin(ScrollTrigger)

const products = [
  {
    id: '01',
    title: 'Earth Curve Vase',
    description: 'A beautifully uneven sculptural vase, inspired by the natural asymmetry of river stones.',
    price: '$120',
    image: img1,
  },
  {
    id: '02',
    title: 'Terracotta Mug',
    description: 'Fired at high temperatures to retain the warmth of your morning brew. Raw unglazed exterior.',
    price: '$45',
    image: img2,
  },
  {
    id: '03',
    title: 'Figurative Pitcher',
    description: 'A fluid, abstract pitcher that mimics the soft curves of the human form in motion.',
    price: '$180',
    image: img3,
  },
  {
    id: '04',
    title: 'Ash Glazed Bowl',
    description: 'Deep, earthy tones emerge from our unique wood-ash glazing process. Perfect for hearty meals.',
    price: '$65',
    image: img4,
  },
  {
    id: '05',
    title: 'Speckled Planter',
    description: 'A wide-bodied planter with natural iron speckles, bringing an organic touch to your indoor garden.',
    price: '$140',
    image: img5,
  },
]

function Products() {
  const sectionRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !wrapperRef.current) return

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.' + styles.card)
      
      // Calculate how far we need to move to the left
      const getScrollAmount = () => {
        let wrapperWidth = wrapperRef.current.scrollWidth
        return -(wrapperWidth - window.innerWidth + 120) // 120px buffer for padding
      }

      const tween = gsap.to(wrapperRef.current, {
        x: getScrollAmount,
        ease: 'none',
      })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true,
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="products" ref={sectionRef} className={styles.productsSection}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>COLLECTION</h2>
        <div className={styles.line}></div>
      </div>
      
      <div className={styles.scrollContainer}>
        <div ref={wrapperRef} className={styles.cardsWrapper}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardNumber}>{product.id}</span>
                <div className={styles.imageContainer}>
                  <img src={product.image} alt={product.title} className={styles.image} />
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{product.title}</h3>
                <p className={styles.cardDescription}>{product.description}</p>
                <div className={styles.cardFooter}>
                  <a href="https://www.instagram.com/mika.burt" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>Ask for price</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Products
