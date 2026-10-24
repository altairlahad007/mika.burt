import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './SubPortfolioModal.module.css'

const DESCRIPTIONS = {
  "AMONG THE HIDDEN": [
    '"Among the Hidden" explores the human struggle to emerge from pain and insecurity. Although the figures embody a movement toward healing, they retain physical or psychological scars, wounds, and imperfections, symbols of resilience that mark personal histories and distinguish one individual from another.',
    'These flaws are not signs of weakness but of survival. They serve as markers of identity, highlighting our authenticity and making each of us uniquely recognizable. Among the Hidden reflects the idea that what we often try to conceal, whether physical or emotional scars, can become powerful aspects of self-expression.'
  ]
}

export default function SubPortfolioModal({ parent, onSelectSub, onClose }) {
  const overlayRef = useRef(null)

  // Lock scroll
  useEffect(() => {
    if (window.lenis) window.lenis.stop()
    document.body.style.overflow = 'hidden'

    return () => {
      if (window.lenis) window.lenis.start()
      document.body.style.overflow = ''
    }
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Close on backdrop click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  if (!parent) return null

  const description = (parent.textData && parent.textData.description && parent.textData.description.length > 0) ? parent.textData.description : DESCRIPTIONS[parent.title]

  return createPortal(
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      {/* Close button */}
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className={styles.title}>{parent.title}</h2>

      {/* Scrollable grid area */}
      <div className={styles.content}>
        <div className={styles.layout}>
          <div className={styles.grid}>
            {parent.subPortfolioList.map((sub, idx) => (
              <button
                key={idx}
                className={styles.card}
                onClick={() => onSelectSub(sub)}
                aria-label={`Open ${sub.title}`}
              >
                <div className={styles.imageWrapper}>
                  {sub.displayImage && (
                    <img
                      src={sub.displayImage}
                      alt={sub.title}
                      className={styles.image}
                    />
                  )}
                  <div className={styles.cardOverlay}>
                    <span className={styles.cardLabel}>{sub.title}</span>
                    <span className={styles.cardCount}>
                      {sub.images.length} {sub.images.length === 1 ? 'image' : 'images'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {description && (
            <div className={styles.description}>
              {description.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
