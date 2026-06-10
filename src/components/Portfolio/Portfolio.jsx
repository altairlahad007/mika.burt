import React, { useState, useMemo } from 'react'
import styles from './Portfolio.module.css'
import PortfolioModal from './PortfolioModal'

// Dynamically load all images from portfolio subdirectories
const imageModules = import.meta.glob('../../assets/portfolio/**/*.{jpg,jpeg,png,webp}', { eager: true })

function Portfolio() {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null)

  // Parse paths and group by portfolio name
  const portfolios = useMemo(() => {
    const pMap = {}

    for (const [path, module] of Object.entries(imageModules)) {
      // Path format: ../../assets/portfolio/AMONG THE HIDDEN/1ST SCULPTURE/1.jpeg
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

    // Fallback display image and sort images
    const pList = Object.values(pMap).map(p => {
      if (!p.displayImage && p.images.length > 0) {
        p.displayImage = p.images[0]
      }
      p.images.sort()
      return p
    })

    // Sort portfolios alphabetically
    pList.sort((a, b) => a.title.localeCompare(b.title))

    return pList
  }, [])

  return (
    <section id="portfolio" className={styles.portfolioSection}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>COLLECTION</h2>
          <div className={styles.headerLine}></div>
        </div>

        <div className={styles.grid}>
          {portfolios.map((portfolio, idx) => (
            <div
              key={idx}
              className={styles.card}
              onClick={() => setSelectedPortfolio(portfolio)}
            >
              <div className={styles.thumbnailContainer}>
                {portfolio.displayImage && (
                  <img
                    src={portfolio.displayImage}
                    alt={portfolio.title}
                    className={styles.thumbnail}
                  />
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

export default Portfolio
