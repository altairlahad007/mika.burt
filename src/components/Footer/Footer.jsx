import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <h2 className={styles.ctaTitle}>
            LET'S SHAPE<br />
            SOMETHING<br />
            TOGETHER.
          </h2>
          <div className={styles.contactInfo}>
            <p className={styles.label}>GET IN TOUCH</p>
            <a href="mailto:studio@mikaburt.com" className={styles.email}>studio@mikaburt.com</a>
            
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink}>Instagram</a>
              <a href="#" className={styles.socialLink}>Pinterest</a>
              <a href="#" className={styles.socialLink}>Twitter</a>
            </div>
          </div>
        </div>
        
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>© 2026 MIKA BURT STUDIO. ALL RIGHTS RESERVED.</p>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>Privacy Policy</a>
            <a href="#" className={styles.bottomLink}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
