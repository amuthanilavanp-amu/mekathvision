'use client';
import { useEffect, useRef, useState } from 'react';

export default function MotionBackground() {
  const canvasRef = useRef(null);
  const totalFrames = 192; // Updated to actual frame count
  const frameRate = 40; // ms
  const imagesRef = useRef([]);
  const frameIndexRef = useRef(0);
  const lastTimeRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const formatFrame = (num) => num.toString().padStart(3, '0');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const loadImages = async () => {
      const promises = [];
      for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        img.src = `/motion/frame_${formatFrame(i)}.jpg`; // Consistent filename
        promises.push(new Promise((resolve) => {
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
        }));
      }
      const loaded = await Promise.all(promises);
      imagesRef.current = loaded.filter(img => img !== null);
      
      if (imagesRef.current.length > 0) {
        setIsLoaded(true);
        requestAnimationFrame(animate);
      }
    };

    const animate = (time) => {
      if (time - lastTimeRef.current >= frameRate) {
        lastTimeRef.current = time;
        frameIndexRef.current = (frameIndexRef.current + 1) % imagesRef.current.length;
        
        const img = imagesRef.current[frameIndexRef.current];
        if (img && ctx) {
          const dpr = window.devicePixelRatio || 1;
          
          canvas.style.width = window.innerWidth + 'px';
          canvas.style.height = window.innerHeight + 'px';
          canvas.width = window.innerWidth * dpr;
          canvas.height = window.innerHeight * dpr;
          
          const imgRatio = img.width / img.height;
          const canvasRatio = canvas.width / canvas.height;
          let drawWidth, drawHeight, drawX, drawY;

          if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            drawX = 0;
            drawY = (canvas.height - drawHeight) / 2;
          } else {
            drawWidth = canvas.height * imgRatio;
            drawHeight = canvas.height;
            drawX = (canvas.width - drawWidth) / 2;
            drawY = 0;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // High-performance sharpen
          ctx.imageSmoothingEnabled = false; // Crisp for JPGs
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    loadImages();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="motion-bg-container">
      {/* Placeholder image until canvas is ready */}
      {!isLoaded && (
        <img 
          src="/assets/hero_background_1778049679282.png" 
          alt="Loading..." 
          className="motion-placeholder"
        />
      )}
      <canvas 
        ref={canvasRef} 
        className={`motion-bg-canvas ${isLoaded ? 'visible' : ''}`} 
      />
      <div className="motion-vignette" />

      <style jsx>{`
        .motion-bg-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
          background: #000;
        }
        .motion-placeholder {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.5;
        }
        .motion-bg-canvas {
          display: block;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1.5s ease-in-out;
          filter: contrast(1.2) brightness(0.85) saturate(1.2) drop-shadow(0 0 10px rgba(0,0,0,0.5));
          image-rendering: pixelated; /* Forces sharpness on high-res displays */
          image-rendering: -webkit-optimize-contrast;
          transform: translateZ(0); /* Hardware acceleration */
        }
        .motion-bg-canvas.visible {
          opacity: 1;
        }
        .motion-vignette {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
