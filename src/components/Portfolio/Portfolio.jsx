import React, { useState, useMemo } from 'react'
import styles from './Portfolio.module.css'
import PortfolioModal from './PortfolioModal'
import SubPortfolioModal from './SubPortfolioModal'
import portfolioData from '../../data/portfolioData.json'

// Dynamically load all images from portfolio subdirectories
// Use a pattern that works reliably on Windows
const imageModules = import.meta.glob([
  '../../assets/portfolio/*.{jpg,jpeg,png,webp}',
  '../../assets/portfolio/**/*.{jpg,jpeg,png,webp}'
], { eager: true })

// ─── Debug: log the first few raw paths so we know what Vite actually returns ─
const allGlobKeys = Object.keys(imageModules)
const amountAmongGlob = allGlobKeys.filter(key => key.includes('AMONG')).slice(0, 2);
const parsedAmountAmongGlob = amountAmongGlob.map(k => {
  const decoded = decodeURIComponent(k.replace(/\\/g, '/'))
  const idx = decoded.lastIndexOf('/portfolio/')
  if (idx !== -1) {
    return decoded.slice(idx + '/portfolio/'.length).split('/').filter(p => p)
  }
  return 'ERROR'
});

window.__globalPortfolioDebug = {
  totalGlobKeys: allGlobKeys.length,
  amountAmongRaw: amountAmongGlob,
  amountAmongParsed: parsedAmountAmongGlob
};

// ─── Path parser ───────────────────────────────────────────────────────────────
// Vite returns relative paths like: ../../assets/portfolio/FOO/BAR/1.jpg
// We need to extract the portfolio structure: FOO, BAR, 1.jpg
function parsePath(rawPath) {
  const decoded = decodeURIComponent(rawPath.replace(/\\/g, '/'))

  // Try to find 'portfolio/' marker (with or without leading slash)
  let match = decoded.match(/\/portfolio\/(.+)$/)
  if (match) {
    return match[1].split('/').filter(p => p)
  }

  // Fallback: look for 'portfolio/' without leading slash (Vite relative paths)
  match = decoded.match(/portfolio\/(.+)$/)
  if (match) {
    return match[1].split('/').filter(p => p)
  }

  // Last resort: strip known prefixes
  const fallback = decoded.replace(/^.*portfolio[\\/]?/, '')
  return fallback.split('/').filter(p => p)
}

function Portfolio() {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null)
  const [subPortfolioParent, setSubPortfolioParent] = useState(null)

  const portfolios = useMemo(() => {
    try {
      const pMap = {}
      const allKeys = Object.keys(imageModules)

      // DEBUG: Log glob results for inspection
      const amountAmongKeys = allKeys.filter(k => k.includes('AMONG')).slice(0, 5);
      const parsedAmongKeys = amountAmongKeys.map(k => ({
        raw: k,
        parsed: parsePath(k)
      }));

      // Store in window for browser inspection
      window.__portfolioGlobDebug = {
        totalKeys: allKeys.length,
        amountAmongRaw: amountAmongKeys,
        amountAmongParsed: parsedAmongKeys
      };

      // Log to console
      console.log('[Portfolio GLOB DEBUG]', window.__portfolioGlobDebug);

      // Known nested portfolios
      const knownNested = ['AMONG THE HIDDEN', 'MINIATURE FIGURES', 'PORCELAIN']

      // ── Initialize all portfolios from portfolioData.json AND knownNested
      for (const [title, data] of Object.entries(portfolioData || {})) {
        pMap[title] = {
          title: data.title || title,
          images: [],
          displayImage: null,
          isNested: data.isNested || knownNested.includes(title),
          textData: data.textData || {},
          subPortfolios: {}
        };
        if (data.subPortfolios) {
          for (const [subTitle, subData] of Object.entries(data.subPortfolios)) {
            pMap[title].subPortfolios[subTitle] = {
              title: subData.title || subTitle,
              images: [],
              displayImage: null,
              textData: subData.textData || {}
            };
          }
        }
      }

      for (const nestedName of knownNested) {
        if (!pMap[nestedName]) {
          pMap[nestedName] = {
            title: nestedName,
            images: [],
            displayImage: null,
            isNested: true,
            textData: portfolioData?.[nestedName]?.textData || {},
            subPortfolios: {}
          }
        }
      }

      // ── Process all images
      for (const [rawPath, module] of Object.entries(imageModules)) {
        const url = module.default
        const parts = parsePath(rawPath)

        if (parts.length < 1) continue

        const portfolioName = parts[0]
        const fileName = parts[parts.length - 1]

        const isKnownNested = knownNested.includes(portfolioName) || pMap[portfolioName]?.isNested

        // Initialize portfolio if not exists
        if (!pMap[portfolioName]) {
          pMap[portfolioName] = {
            title: portfolioName,
            images: [],
            displayImage: null,
            isNested: isKnownNested,
            textData: portfolioData?.[portfolioName]?.textData || {},
            subPortfolios: {}
          }
        }

        // If portfolio is nested AND has 3+ parts, organize into subPortfolios
        if (isKnownNested && parts.length >= 3) {
          const subFolderName = parts[1]

          if (!pMap[portfolioName].subPortfolios[subFolderName]) {
            pMap[portfolioName].subPortfolios[subFolderName] = {
              title: subFolderName,
              images: [],
              displayImage: null,
              textData: portfolioData?.[portfolioName]?.subPortfolios?.[subFolderName]?.textData || {}
            }
          }

          const sub = pMap[portfolioName].subPortfolios[subFolderName]

          if (fileName.toUpperCase().startsWith('DISPLAY IMAGE')) {
            sub.displayImage = url
            if (!pMap[portfolioName].displayImage) {
              pMap[portfolioName].displayImage = url
            }
          } else {
            sub.images.push(url)
          }
        } else {
          // Flat: add to main portfolio images
          if (fileName.toUpperCase().startsWith('DISPLAY IMAGE')) {
            pMap[portfolioName].displayImage = url
          } else {
            pMap[portfolioName].images.push(url)
          }
        }
      }

      // ── Finalize: sort and prepare subPortfolioList
      const pList = Object.values(pMap).map(p => {
        if (p.isNested) {
          const subList = Object.values(p.subPortfolios).map(sub => {
            if (!sub.displayImage && sub.images.length > 0) {
              sub.displayImage = sub.images[0]
            }
            // Sort images numerically
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
    } catch (err) {
      console.error('[Portfolio] useMemo crashed:', err)
      return []
    }
  }, [])

  const handleCardClick = (portfolio) => {
    console.log('[Portfolio] Card clicked:', portfolio.title, 'isNested:', portfolio.isNested, 'subPortfolioList:', portfolio.subPortfolioList?.length || 0)
    window.__lastClickedPortfolio__ = portfolio
    if (portfolio.isNested) {
      setSubPortfolioParent(portfolio)
    } else {
      setSelectedPortfolio(portfolio)
    }
  }

  return (
    <section id="portfolio" className={styles.portfolioSection}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>WORKS</h2>
          <div className={styles.headerLine}></div>
        </div>

        <div className={styles.grid}>
          {portfolios.map((portfolio, idx) => (
            <div
              key={idx}
              className={styles.card}
              onClick={() => handleCardClick(portfolio)}
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

      {/* Sub-portfolio picker (e.g. AMONG THE HIDDEN → 3 sculpture cards) */}
      {subPortfolioParent && (
        <SubPortfolioModal
          parent={subPortfolioParent}
          onSelectSub={(sub) => setSelectedPortfolio(sub)}
          onClose={() => setSubPortfolioParent(null)}
        />
      )}

      {/* Full image slideshow modal */}
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

export default Portfolio
