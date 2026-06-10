import React, { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Products.module.css'
import PortfolioModal from '../Portfolio/PortfolioModal'

// Dynamically load all images from portfolio subdirectories
const imageModules = import.meta.glob('../../assets/portfolio/**/*.{jpg,jpeg,png,webp}', { eager: true })

gsap.registerPlugin(ScrollTrigger)

function Products() {
  const sectionRef = useRef(null)
  const wrapperRef = useRef(null)
  const [selectedPortfolio, setSelectedPortfolio] = useState(null)

  // Parse paths and group by portfolio name
  const portfolios = useMemo(() => {
    const pMap = {}

    for (const [path, module] of Object.entries(imageModules)) {
      const relativePath = path.replace('../../assets/portfolio/', '')
      const parts = relativePath.split('/')
      const portfolioName = parts[0]
      const fileName = parts[parts.length - 1]
      const url = module.default

      if (!pMap[portfolioName]) {
        pMap[portfolioName] = {
          title: portfolioName,
          images: [],
          displayImage: null
        }
      }

      pMap[portfolioName].images.push(url)

      if (fileName.toUpperCase().startsWith('DISPLAY IMAGE')) {
        pMap[portfolioName].displayImage = url
      }
    }

    const pList = Object.values(pMap).map(p => {
      if (!p.displayImage && p.images.length > 0) {
        p.displayImage = p.images[0]
      }
      p.images.sort()
      return p
    })

    pList.sort((a, b) => a.title.localeCompare(b.title))

    return pList
  }, [])

  useEffect(() => {
    if (!sectionRef.current || !wrapperRef.current) return

    const ctx = gsap.context(() => {
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
  }, [portfolios])

  return (
    <section id="products" ref={sectionRef} className={styles.productsSection}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>COLLECTION</h2>
        <div className={styles.line}></div>
      </div>

      <div className={styles.scrollContainer}>
        <div ref={wrapperRef} className={styles.cardsWrapper}>
          {portfolios.map((portfolio, idx) => (
            <div
              key={idx}
              className={styles.card}
              onClick={() => setSelectedPortfolio(portfolio)}
            >
              <div className={styles.imageContainer}>
                {portfolio.displayImage && (
                  <img src={portfolio.displayImage} alt={portfolio.title} className={styles.image} />
                )}
              </div>
              
              <div className={styles.overlay}>
                <h3 className={styles.cardTitle}>{portfolio.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPortfolio && (
        <PortfolioModal
          portfolio={selectedPortfolio}
          onClose={() => setSelectedPortfolio(null)}
        />
      )}
    </section>
  )
}

export default Products
