import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ImageSequence.module.css'

// Use Vite's import.meta.glob to dynamically import all frames
const frameModules = import.meta.glob('../../assets/frames/*.jpg', { eager: true })
const frameUrls = Object.keys(frameModules).sort().map(key => frameModules[key].default)

gsap.registerPlugin(ScrollTrigger)

function ImageSequence() {
  const canvasContainerRef = useRef(null)
  const canvasRef = useRef(null)
  const ambientCanvasRef = useRef(null)
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const imagesRef = useRef([])

  // 1. Preload all frames
  useEffect(() => {
    let loadedCount = 0
    const imgArray = []
    
    // Safety check if no frames exist
    if (frameUrls.length === 0) {
      setImagesLoaded(true)
      return
    }

    frameUrls.forEach((url) => {
      const img = new Image()
      img.src = url
      img.onload = () => {
        loadedCount++
        if (loadedCount === frameUrls.length) {
          setImagesLoaded(true)
        }
      }
      imgArray.push(img)
    })
    
    imagesRef.current = imgArray
  }, [])

  // 2. Setup GSAP Image Sequence
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || !sectionRef.current) return
    if (imagesRef.current.length === 0) return // Safety check

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const images = imagesRef.current

    // Initialize canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Render function with content-aware ambient fill and 'contain' for main
    const render = (index) => {
      if (!images[index]) return
      const img = images[index]
      
      const hRatio = canvas.width / img.width
      const vRatio = canvas.height / img.height
      
      // Draw Ambient (cover) - We'll keep it as a base layer
      if (ambientCanvasRef.current) {
        const aCanvas = ambientCanvasRef.current
        if (aCanvas.width !== canvas.width) {
          aCanvas.width = canvas.width
          aCanvas.height = canvas.height
        }
        const aContext = aCanvas.getContext('2d')
        const aRatio = Math.max(hRatio, vRatio)
        const ax = (aCanvas.width - img.width * aRatio) / 2
        const ay = (aCanvas.height - img.height * aRatio) / 2
        aContext.clearRect(0, 0, aCanvas.width, aCanvas.height)
        aContext.drawImage(img, 0, 0, img.width, img.height, ax, ay, img.width * aRatio, img.height * aRatio)
      }

      // Draw Main (cover to stretch full size)
      const ratio = Math.max(hRatio, vRatio)
      const centerShift_x = (canvas.width - img.width * ratio) / 2
      const centerShift_y = (canvas.height - img.height * ratio) / 2
      
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio)
      
      // No feathering needed since image covers the full canvas
    }

    // Initial draw
    render(0)

    const frameCount = images.length - 1
    const playhead = { frame: 0 }

    const ctx = gsap.context(() => {
      // Pin the section and animate the sequence followed by the morph
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=6000', // Extended total pinned scroll duration for both sequence and morph
          pin: true,
          scrub: 0.5,
        }
      })

      // 1. Image Sequence (scrub through 100 frames)
      tl.to(playhead, {
        frame: frameCount,
        snap: 'frame',
        ease: 'none',
        duration: 4, // Timeline proportion
        onUpdate: () => render(playhead.frame)
      })

      // 2. Smooth Morph (shrink, round corners, and fade into the Footer)
      const morphTargets = canvasContainerRef.current;
      tl.to(morphTargets, {
        clipPath: 'inset(15% 15% 15% 15% round 60px)',
        scale: 0.9,
        opacity: 0.1,
        ease: 'power2.inOut',
        duration: 2, // Timeline proportion
      })

      // Fade out the title slightly faster than the sequence begins
      gsap.to(titleRef.current, {
        opacity: 0,
        y: -100,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=1500', 
          scrub: true,
        }
      })

      // Handle window resizes
      const handleResize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        render(playhead.frame)
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)

    }, sectionRef)

    return () => ctx.revert()
  }, [imagesLoaded])

  return (
    <section id="portfolio" ref={sectionRef} className={styles.sequenceSection}>
      {!imagesLoaded && (
        <div className={styles.loader}>Loading Sequence...</div>
      )}
      <div ref={canvasContainerRef} className={styles.canvasContainer}>
        <canvas ref={ambientCanvasRef} className={styles.ambientCanvas}></canvas>
        <canvas ref={canvasRef} className={styles.canvas}></canvas>
      </div>
      <div ref={titleRef} className={styles.titleContainer}>
        <h2 className={styles.title}>JOURNEY</h2>
        <p className={styles.subtitle}>SCROLL TO EXPLORE</p>
      </div>
    </section>
  )
}

export default ImageSequence
