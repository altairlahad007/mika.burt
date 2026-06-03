import { useEffect, useRef } from 'react'
import { fadeUpAnimation } from '../../utils/animations'
import styles from './Section.module.css'

function Section({
  id,
  title,
  subtitle,
  children,
  className = '',
  fullWidth = false,
  centered = true,
  dark = false
}) {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (!contentRef.current) return

    const elements = contentRef.current.querySelectorAll('[data-animate]')

    if (elements.length) {
      fadeUpAnimation(elements, { start: 'top 80%' })
    } else {
      // Animate the section content as a whole
      fadeUpAnimation([contentRef.current], { start: 'top 85%' })
    }
  }, [])

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`${styles.section} ${dark ? styles.dark : ''} ${className}`}
    >
      {!fullWidth && (
        <div className={styles.container}>
          <div ref={contentRef} className={`${styles.content} ${centered ? styles.centered : ''}`}>
            {title && (
              <>
                <h2 className={styles.title}>{title}</h2>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
              </>
            )}
            {children}
          </div>
        </div>
      )}

      {fullWidth && (
        <div ref={contentRef}>
          {children}
        </div>
      )}
    </section>
  )
}

export default Section