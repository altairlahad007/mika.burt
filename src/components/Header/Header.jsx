import { useState, useEffect, useRef } from 'react'
import styles from './Header.module.css'

const NAV_ITEMS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'products', label: 'WORKS' },
  { id: 'portfolio', label: 'CONTACT' }
]

function Header({ theme, toggleTheme }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const navRefs = useRef({})

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when section is exactly in the middle of the viewport
      threshold: 0
    }

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    NAV_ITEMS.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const activeRef = navRefs.current[activeSection]
    if (activeRef) {
      setPillStyle({
        left: activeRef.offsetLeft,
        width: activeRef.offsetWidth,
        opacity: 1
      })
    }
  }, [activeSection, isScrolled]) // Also re-measure if scrolled state changes (in case layout changes)

  const handleNavClick = (e, id) => {
    e.preventDefault()
    window.lenis?.scrollTo(`#${id}`)
    setActiveSection(id) // Instant visual feedback
    setIsMobileMenuOpen(false) // Close mobile menu if open
  }

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navLeft}>
        <div className={styles.logoWrapper}>
          <span className={styles.logo}>MIKA BURT</span>
          <span className={styles.logoSubtitle}>CERAMIST and visual artist</span>
        </div>
      </div>

      <ul className={styles.navCenter}>
        <div 
          className={`${styles.pill} ${pillStyle.opacity ? styles.visible : ''}`} 
          style={{ 
            left: `${pillStyle.left}px`, 
            width: `${pillStyle.width}px` 
          }} 
        />
        {NAV_ITEMS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              ref={el => navRefs.current[id] = el}
              className={`${styles.navLink} ${activeSection === id ? styles.active : ''}`}
              onClick={(e) => handleNavClick(e, id)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className={styles.navRight}>
        <button
          className={styles.iconBtn}
          aria-label="Toggle Theme"
          onClick={toggleTheme}
        >
          {theme === 'default' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
          )}
        </button>
        <button 
          className={styles.mobileMenuBtn}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
        >
          {isMobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.open : ''}`}>
        <ul className={styles.mobileNavList}>
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={`mobile-${id}`}>
              <a
                href={`#${id}`}
                className={`${styles.mobileNavLink} ${activeSection === id ? styles.active : ''}`}
                onClick={(e) => handleNavClick(e, id)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}

export default Header
