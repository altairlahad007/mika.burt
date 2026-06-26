import React, { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getHorizontalScrollBuffer, prefersReducedMotion } from '../../utils/responsive'
import styles from './Products.module.css'
import PortfolioModal from '../Portfolio/PortfolioModal'
import SubPortfolioModal from '../Portfolio/SubPortfolioModal'

// Dynamically load all images from portfolio subdirectories
// Use a pattern that works reliably on Windows
const imageModules = import.meta.glob([
  '../../assets/portfolio/*.{jpg,jpeg,png,webp}',
  '../../assets/portfolio/**/*.{jpg,jpeg,png,webp}'
], { eager: true })

function parsePath(rawPath) {
  const decoded = decodeURIComponent(rawPath.replace(/\\/g, '/'))
  let match = decoded.match(/\/portfolio\/(.+)$/)
  if (match) {
    return match[1].split('/').filter(p => p)
  }

  match = decoded.match(/portfolio\/(.+)$/)
  if (match) {
    return match[1].split('/').filter(p => p)
  }

  const fallback = decoded.replace(/^.*portfolio[\\/]?/, '')
  return fallback.split('/').filter(p => p)
}

gsap.registerPlugin(ScrollTrigger)

function Products() {
  const sectionRef = useRef(null)
  const wrapperRef = useRef(null)
  const [selectedPortfolio, setSelectedPortfolio] = useState(null)
  const [subPortfolioParent, setSubPortfolioParent] = useState(null)

  const portfolios = useMemo(() => {
    const pMap = {}
    const knownNested = ['AMONG THE HIDDEN', 'MINIATURE FIGURES', 'PORCELAIN']

    for (const [rawPath, module] of Object.entries(imageModules)) {
      const url = module.default
      const parts = parsePath(rawPath)

      if (parts.length < 1) continue

      const portfolioName = parts[0]
      const fileName = parts[parts.length - 1]

      if (!pMap[portfolioName]) {
        pMap[portfolioName] = {
          title: portfolioName,
          images: [],
          displayImage: null,
          isNested: knownNested.includes(portfolioName),
          subPortfolios: {}
        }
      }

      const portfolio = pMap[portfolioName]

      if (knownNested.includes(portfolioName) && parts.length >= 3) {
        const subFolderName = parts[1]

        if (!portfolio.subPortfolios[subFolderName]) {
          portfolio.subPortfolios[subFolderName] = {
            title: subFolderName,
            images: [],
            displayImage: null
          }
        }

        const sub = portfolio.subPortfolios[subFolderName]

        if (fileName.toUpperCase().startsWith('DISPLAY IMAGE')) {
          sub.displayImage = url
          if (!portfolio.displayImage) {
            portfolio.displayImage = url
          }
        } else {
          sub.images.push(url)
        }
      } else {
        if (fileName.toUpperCase().startsWith('DISPLAY IMAGE')) {
          portfolio.displayImage = url
        } else {
          portfolio.images.push(url)
        }
      }
    }

    const pList = Object.values(pMap).map(p => {
      if (p.isNested) {
        const subList = Object.values(p.subPortfolios).map(sub => {
          if (!sub.displayImage && sub.images.length > 0) {
            sub.displayImage = sub.images[0]
          }
          sub.images.sort((a, b) => {
            const numA = parseInt(a.match(/(\d+)\.\w+$/)?.[1] ?? '0', 10)
            const numB = parseInt(b.match(/(\d+)\.\w+$/)?.[1] ?? '0', 10)
            return numA - numB
          })
          return sub
        })

        subList.sort((a, b) => a.title.localeCompare(b.title))
        p.subPortfolioList = subList
        if (!p.displayImage && subList.length > 0) {
          p.displayImage = subList[0].displayImage
        }
      } else {
        if (!p.displayImage && p.images.length > 0) {
          p.displayImage = p.images[0]
        }
        p.images.sort((a, b) => {
          const numA = parseInt(a.match(/(\d+)\.\w+$/)?.[1] ?? '0', 10)
          const numB = parseInt(b.match(/(\d+)\.\w+$/)?.[1] ?? '0', 10)
          return numA - numB
        })
      }
      return p
    })

    pList.sort((a, b) => a.title.localeCompare(b.title))
    return pList
  }, [])

  useEffect(() => {
    if (!sectionRef.current || !wrapperRef.current) return

    const mobileQuery = window.matchMedia('(max-width: 768px)')
    let ctx

    const setupScroll = () => {
      gsap.set(wrapperRef.current, { x: 0 })

      if (mobileQuery.matches || prefersReducedMotion()) return

      ctx = gsap.context(() => {
        const getScrollAmount = () => {
          const wrapperWidth = wrapperRef.current.scrollWidth
          return -(wrapperWidth - window.innerWidth + getHorizontalScrollBuffer())
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
    }

    setupScroll()

    const handleChange = () => {
      ctx?.revert()
      setupScroll()
      ScrollTrigger.refresh()
    }

    mobileQuery.addEventListener('change', handleChange)
    window.addEventListener('resize', handleChange)

    return () => {
      mobileQuery.removeEventListener('change', handleChange)
      window.removeEventListener('resize', handleChange)
      ctx?.revert()
    }
  }, [portfolios])

  const handleCardClick = (portfolio) => {
    if (portfolio.isNested) {
      setSubPortfolioParent(portfolio)
    } else {
      setSelectedPortfolio(portfolio)
    }
  }

  return (
    <section id="products" ref={sectionRef} className={styles.productsSection}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>WORKS</h2>
        <div className={styles.line}></div>
      </div>

      <div className={styles.scrollContainer}>
        <div ref={wrapperRef} className={styles.cardsWrapper}>
          {portfolios.map((portfolio, idx) => (
            <div
              key={idx}
              className={styles.card}
              onClick={() => handleCardClick(portfolio)}
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

      {subPortfolioParent && (
        <SubPortfolioModal
          parent={subPortfolioParent}
          onSelectSub={(sub) => setSelectedPortfolio(sub)}
          onClose={() => setSubPortfolioParent(null)}
        />
      )}

      {selectedPortfolio && (
        <PortfolioModal
          portfolio={selectedPortfolio}
          onClose={() => setSelectedPortfolio(null)}
          onBack={subPortfolioParent ? () => setSelectedPortfolio(null) : null}
        />
      )}
    </section>
  )
}

export default Products
