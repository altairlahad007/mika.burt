import { useState } from 'react'
import styles from './Footer.module.css'

function Footer() {
  const [modalContent, setModalContent] = useState(null)

  const handleOpenModal = (e, content) => {
    e.preventDefault()
    setModalContent(content)
  }

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
            <a href="mailto:mikaburt999@gmail.com" className={styles.email}>mikaburt999@gmail.com</a>
            
            <div className={styles.socials}>
              <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Appointment+with+Mika+Burt&details=Meeting+with+Mika+Burt+Studio&location=Google+Meet&add=mikaburt999@gmail.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Schedule an Appointment</a>
              <a href="https://www.behance.net/irismika" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Behance</a>
            </div>
          </div>
        </div>
        
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>© 2026 MIKA BURT STUDIO. ALL RIGHTS RESERVED.</p>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink} onClick={(e) => handleOpenModal(e, 'privacy')}>Privacy Policy</a>
            <a href="#" className={styles.bottomLink} onClick={(e) => handleOpenModal(e, 'terms')}>Terms of Service</a>
          </div>
        </div>
      </div>

      {modalContent && (
        <div className={styles.modalOverlay} onClick={() => setModalContent(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setModalContent(null)}>✕</button>
            <h3 className={styles.modalTitle}>
              {modalContent === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h3>
            <div className={styles.modalBody}>
              {modalContent === 'privacy' ? (
                <p>This is the standard privacy policy. We respect your privacy and do not sell your personal data. All information provided is used solely for studio communication and project coordination.</p>
              ) : (
                <p>These are the standard terms of service. By using this website, you agree to our terms. All artwork and images are copyrighted by Mika Burt Studio.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer
