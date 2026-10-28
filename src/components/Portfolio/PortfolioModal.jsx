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
  },
  "A LIGHT WITHIN": {
    dimensions: "DIMENSIONS: 60*70*3 CM / SLIP CASTED AND CARVED JADE PORCELAIN / ON A WALL INSTALLATION, FIRED AT 1280'C REDUCTION FIRING",
    description: [
      '"A Light Within" is a series of porcelain forms exploring individuality, difference, and the quiet beauty of imperfection. Made from luminous jade porcelain, each form shares a similar language while remaining subtly different, reflecting the uniqueness of individual bodies and identities.',
      "Some forms are smooth and composed, while others are distorted, irregular, or fragmented. Rather than seeing these differences as flaws, I embrace them as part of their character. Warm yellow light inside the most distorted forms suggests hope, warmth, and beauty within vulnerability and imperfection."
    ]
  },
  "FRAGMENTS OF BECOMING": {
    dimensions: "DIMENSIONS: JADE PORCELAIN WITH CELADON, 14K GOLD LUSTER AND GOLD LEAVES / FIRED AT 1280'C REDUCTION FIRING",
    description: [
      "This series of work inspired by the curves of the human back, the triangular forms focus on the softness, folds, and tension of the body, turning them into abstract sculpture.",
      "The smooth, shiny celadon contrasts with rough, dark surfaces, suggesting different qualities of the same form, softness and strength, vulnerability and resilience. Irregular traces of gold luster and gold leaves look like small fragments of light or healed cracks, bringing ideas of imperfection, memory, and renewal.",
      "By combining organic body forms with geometric shapes, the work explores the relationship between the body and the object, fragility and permanence, and imperfection and beauty. The repeated forms show how the same shape can change through color, texture, and material."
    ]
  },
  "LINGER": {
    dimensions: "DIMENSIONS: 30*17*25 CM / JADE PORCELAIN WITH RED STAIN AND JUCI / AT 1280'C REDUCTION FIRING",
    description: [
      "The hand built figure depicts an alienated form, yet its soft, human-like hands suggest emotion and vulnerability.",
      "During firing, the porcelain developed cracks. Instead of hiding them, I used Juci, a ceramic stapling and riveting technique, to connect and hold the broken areas together. The metal becomes part of the figure, turning damage into something visible and meaningful. The cracks are no longer simply imperfections; they become an acceptance and signs of resilience.",
      "A light placed inside the sculpture reveals the natural translucency of the jade porcelain, enhanced by the thinness created through the pinching technique.",
      "Ultimately, the work reflects on fragility, alienation, and the beauty of finding meaning within imperfection."
    ]
  },
  "RED AND BLUE VELVET": {
    dimensions: "DIMENSIONS: 63*26*26 CM / STONEWARE BODY AT 1240'C REDUCTION FIRING / FINISHED WITH SCARLET RED AND ULTRAMARINE BLUE FLOCK SURFACES",
    description: [
      '"Red and Blue Velvet" explores the space between the human body and the structures that contain it. The rigid rectangular volume suggests architecture, an ordered, constructed world, while the curved contour of the human back emerges from within it, introducing softness, vulnerability, and physical presence.',
      "The sculpture brings together two seemingly opposing languages: geometry and anatomy, structure and sensation, permanence and fragility. The back is recognizable as part of the human body, yet it has been transformed into an abstract architectural surface, questioning where the body ends and its surrounding structure begins.",
      "Rendered in a deep, saturated red and blue, the work becomes less a representation of a particular body and more an emotional object, a quiet monument to the experience of being contained, shaped, and carried by the structures around us."
    ]
  },
  "VESSEL": {
    dimensions: "DIMENSIONS: 47*22*18 CM / HAND-BUILDING JADE PORCELAIN WITH RED STAIN / HIGH-FIRED AT 1280'C REDUCTION FIRING",
    description: [
      '"Vessel" is a fragmented human torso, its soft, folded surfaces appearing to open, collapse, and protect themselves simultaneously. Two slender forms emerge through the body, creating a sense of intrusion and tension between the interior and exterior.',
      "The irregularity of the hand-building process is intentionally preserved. Marks, folds, and subtle asymmetries emphasize the vulnerability of the material and connect the physical process of making with the subject of the work. Through the contrast of porcelain's fragility and the piercing red forms, the sculpture considers how the body can become a site where pain, protection, and emotional experience intersect."
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

  const textData = portfolio ? (portfolio.textData && Object.keys(portfolio.textData).length > 0 ? portfolio.textData : PORTFOLIO_TEXT[portfolio.title]) : null;

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
              <div className={styles.textOverlayContent} data-lenis-prevent>
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
