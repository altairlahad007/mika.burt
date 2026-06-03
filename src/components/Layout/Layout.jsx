import Hero from '../Hero/Hero'
import About from '../About/About'
import Products from '../Products/Products'
import CEO from '../CEO/CEO'
import Gallery from '../Gallery/Gallery'
import Portfolio from '../Portfolio/Portfolio'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'

function Layout() {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <Hero />
        <About />
        <Products />
        <CEO />
        <Gallery />
        <Portfolio />
        <Footer />
      </main>
    </div>
  )
}

export default Layout