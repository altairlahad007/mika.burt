import { useState, useEffect } from 'react'
import Header from '../Header/Header'
import Hero from '../Hero/Hero'
import About from '../About/About'
import Products from '../Products/Products'
import Gallery from '../Gallery/Gallery'
import Portfolio from '../Portfolio/Portfolio'
import ImageSequence from '../ImageSequence/ImageSequence'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'

function Layout() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'default'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'default' ? 'inverse' : 'default')
  }

  return (
    <div className={styles.layout}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className={styles.main}>
        <Hero theme={theme} toggleTheme={toggleTheme} />
        <About />
        <Products />
        <ImageSequence />
        <Footer />
      </main>
    </div>
  )
}

export default Layout