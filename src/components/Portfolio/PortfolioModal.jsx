import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import styles from './PortfolioModal.module.css';

const PORTFOLIO_TEXT = {
  "AMONG THE HIDDEN": {
    dimensions: "DIMENSIONS: 30*32*43 CM, 46*32*42 CM, 77*35*42 CM /cone6 glaze on stoneware clay body/ 2025",
    description: [
      '"Among the Hidden" explores the human struggle to emerge from pain and insecurity. Although the figures embody a movement toward healing, they retain physical or psychological scars, wounds, and imperfections, symbols of resilience that mark personal histories and distinguish one individual from another.',
      'These flaws are not signs of weakness but of survival. They serve as markers of identity, highlighting our authenticity and making each of us uniquely recognizable. Among the Hidden reflects the idea that what we often try to conceal, whether physical or emotional scars, can become powerful aspects of self-expression.'
    ]
  },
  "INSIDE": {
    subtitle: "a wall installation pieces",
    dimensions: "DIMENTIONS: 120cm* 100cm /under-glazed painting on stoneware white and black clay body/ 2025",
    description: [
      "This wall installation presents a series of small, cocoon-like sculptures, each about 27 × 12 × 4 cm. Partially concealed within soft protective forms, the figures rest in quiet, passive poses that suggest calm and introspection. Their hiddenness evokes the ways we shield our vulnerabilities, finding not escape but a quiet resilience. The work reflects on concealment as a space of emotional safety and subtle strength."
    ]
  },
  "MINIATURE FIGURES": {
    list: [
      "BENDING HECTIC - DIMENSIONS: 17*13*8 CM /WOOD-FIRED EARTHENWARE CLAY BODY/ 2025",
      "RAKU1 - DIMENSIONS: 12*11*10 CM /RAKU-FIRED STONEWARE CLAY BODY/ 2025",
      "RAKU2 - DIMENSIONS: 13*11*8 CM /RAKU-FIRED STONEWARE CLAY BODY/ 2025",
      "RAKU3 - DIMENSIONS: 10*11*7 CM /RAKU-FIRED STONEWARE CLAY BODY/ 2025",
      "RAKU4 – DIMENTIONS: 10*9*7 CM /RAKU-FIRED STONEWARE CLAY BODY/ 2025",
      "SCARLET - DIMENSIONS: 15*7*5 CM /PORCELAIN BODY WITH RED STAIN/ 2026",
      "THERE THERE - IMENSIONS: 13*12*7 CM /PORCELAIN BODY WITH RED STAIN/ 2026",
      "TWIST - DIMENSIONS: 10*6*5 CM /PORCELAIN BODY APPLIED WITH 14K GOLD LUSTER/ 2026"
    ]
  },
  "DROP": {
    dimensions: "DIMENSIONS: 18*15*15 CM / PORCELAIN BODY APPLIED WITH 14K GOLD LUSTER / 2025"
  },
  "PORCELAIN": {
    list: [
      "CONNECTION - DIMENSIONS: 13*13*5 CM ; 10*10*2 CM / PORCELAIN BODY APPLIED WITH COBALT / 2025",
      "HIDDEN SEEDS – DIMENTIONS: 12*9*4 CM /PORCELAIN BODY APPLIED WITH 14K GOLD LUSTER, MOTHER OF PEARL AND COBALT/ 2025",
      "SILENT SCREAM VASE – DIMENTIONS: 18*11*7 CM /PORCELAIN BODY APPLIED WITH COBALT/ 2025"
    ]
  }
};

export default function PortfolioModal({ portfolio, onClose, onBack }) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(true);

  const isHoveredRef = useRef(isHovered);
  const tweenRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  const textData = portfolio ? PORTFOLIO_TEXT[portfolio.title] : null;

  useEffect(() => {
    if (window.lenis) {
      window.lenis.stop();
    }
    document.body.style.overflow = 'hidden';

    let loadedCount = 0;
    if (!portfolio || !portfolio.images || portfolio.images.length === 0) {
      setImagesLoaded(true);
      return;
    }

    portfolio.images.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / portfolio.images.length) * 100));
        if (loadedCount === portfolio.images.length) {
          setImagesLoaded(true);
        }
      };
    });

    return () => {
      if (window.lenis) {
        window.lenis.start();
      }
      document.body.style.overflow = '';
    };
  }, [portfolio]);

  const numImages = portfolio?.images?.length || 0;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % numImages);
  }, [numImages]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + numImages) % numImages);
  }, [numImages]);

  useEffect(() => {
    if (!imagesLoaded || numImages <= 1) return;

    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    gsap.set(progressBarRef.current, { scaleX: 0 });

    tweenRef.current = gsap.to(progressBarRef.current, {
      scaleX: 1,
      duration: 4,
      ease: 'none',
      onComplete: nextSlide,
    });

    if (isHoveredRef.current) {
      tweenRef.current.pause();
    }

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [currentIndex, imagesLoaded, numImages, nextSlide]);

  useEffect(() => {
    if (tweenRef.current) {
      if (isHovered) {
        tweenRef.current.pause();
      } else {
        tweenRef.current.play();
      }
    }
  }, [isHovered]);

  if (!portfolio) return null;

  return createPortal(
    <div className={styles.modalOverlay}>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
        ✕
      </button>

      {/* Back button — returns to sub-portfolio picker */}
      {onBack && (
        <button className={styles.backButton} onClick={onBack} aria-label="Back to collection">
          &#8592; Back
        </button>
      )}

      <h2 className={styles.modalTitle}>{portfolio.title}</h2>

      <div 
        className={styles.imageContainer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {imagesLoaded && portfolio.images.map((src, idx) => (
          <div 
            key={idx} 
            className={`${styles.imageWrapper} ${idx === currentIndex ? styles.active : ''}`}
            style={{ zIndex: idx === currentIndex ? 10 : 1 }}
          >
            <img src={src} alt="" className={styles.ambientLayer} />
            <img src={src} alt={`${portfolio.title} view ${idx + 1}`} className={styles.imageLayer} />
          </div>
        ))}

        {imagesLoaded && textData && (
          <div className={styles.textOverlayWrapper}>
            <div className={`${styles.textOverlaySlide} ${!isTextVisible ? styles.hiddenText : ''}`}>
              <div className={styles.textOverlayContent}>
                {textData.subtitle && <h3 className={styles.subtitle}>{textData.subtitle}</h3>}
                {textData.dimensions && <p className={styles.dimensions}>{textData.dimensions}</p>}
                {textData.description && textData.description.map((p, i) => (
                  <p key={i} className={styles.description}>{p}</p>
                ))}
                {textData.list && (
                  <ul className={styles.list}>
                    {textData.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
              <button 
                className={styles.toggleTextBtn} 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTextVisible(v => !v);
                }}
              >
                {isTextVisible ? '❮' : '❯'}
              </button>
            </div>
          </div>
        )}

        {imagesLoaded && numImages > 1 && (
          <>
            <button className={`${styles.sliderButton} ${styles.prevButton}`} onClick={prevSlide}>
              &#10094;
            </button>
            <button className={`${styles.sliderButton} ${styles.nextButton}`} onClick={nextSlide}>
              &#10095;
            </button>
            <div className={styles.progressBar} ref={progressBarRef} />
          </>
        )}
      </div>

      {!imagesLoaded && (
        <div className={styles.loader}>Loading Sequence... {progress}%</div>
      )}
    </div>,
    document.body
  );
}
