import { useState, useEffect } from 'react'
import Hero from '../Hero/Hero'
import About from '../About/About'
import Products from '../Products/Products'
import Gallery from '../Gallery/Gallery'
import Portfolio from '../Portfolio/Portfolio'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'

function Layout() {
  const [theme, setTheme] = useState('default')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'default' ? 'inverse' : 'default')
  }

  return (
    <div className={styles.layout}>
      <button className={styles.themeToggle} onClick={toggleTheme}>
        {theme === 'default' ? '🌓 Inverse Theme' : '🌓 Default Theme'}
      </button>
      <main className={styles.main}>
        <Hero />
        <About />
        <Products />
        <Gallery />
        <Portfolio />
        <Footer />
      </main>
    </div>
  )
}

export default Layout