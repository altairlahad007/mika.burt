import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import styles from './PortfolioModal.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioModal({ portfolio, onClose }) {
  const containerRef = useRef(null);
  const scrollSpaceRef = useRef(null);
  const imagesContainerRef = useRef(null);
  const imageRefs = useRef([]);
  
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Smooth scroll height (1200px per transition for a tighter, smoother feel)
  const scrollHeight = portfolio?.images ? Math.max(portfolio.images.length * 1200, 1200) : 1200;

  useEffect(() => {
    if (window.lenis) {
      window.lenis.stop();
    }
    // Always hide body scroll to prevent background scrolling
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

  useEffect(() => {
    if (!imagesLoaded || !containerRef.current || !scrollSpaceRef.current || imageRefs.current.length === 0) return;

    // Use Lenis for smooth scrolling in the modal
    const lenis = new Lenis({
      wrapper: containerRef.current,
      content: scrollSpaceRef.current,
      lerp: 0.08, // Smoother interpolation
      smoothWheel: true,
    });
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSpaceRef.current,
        scroller: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Add scrub smoothing
      }
    });

    const numImages = imageRefs.current.length;
    
    // Animate out each image to reveal the one underneath
    for (let i = 0; i < numImages - 1; i++) {
      const target = imageRefs.current[i];
      if (!target) continue;

      // Dissolve for all images for a smooth crossfade without scaling
      tl.to(target, {
        opacity: 0,
        ease: 'power1.inOut',
        duration: 1
      });
    }

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => {
        if (t.scroller === containerRef.current) t.kill();
      });
    };
  }, [imagesLoaded]);

  if (!portfolio) return null;

  return createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.scrollContainer} ref={containerRef}>
        <div className={styles.scrollSpace} ref={scrollSpaceRef} style={{ height: `${scrollHeight}px` }}>
          <div className={styles.stickyWrapper}>
            <div className={styles.imageContainer} ref={imagesContainerRef}>
              {imagesLoaded && portfolio.images.map((src, idx) => (
                <img 
                  key={idx} 
                  src={src} 
                  alt={`${portfolio.title} view ${idx + 1}`} 
                  className={styles.imageLayer}
                  style={{ zIndex: portfolio.images.length - idx }}
                  ref={el => imageRefs.current[idx] = el}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
        ✕
      </button>
      <h2 className={styles.modalTitle}>{portfolio.title}</h2>
      
      {!imagesLoaded && (
        <div className={styles.loader}>Loading Sequence... {progress}%</div>
      )}
    </div>,
    document.body
  );
}
