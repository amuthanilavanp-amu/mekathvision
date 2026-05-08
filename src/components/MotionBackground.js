'use client';
import { useEffect, useRef } from 'react';

export default function MotionBackground() {
  const canvasRef = useRef(null);
  const totalFrames = 146;
  const frameRate = 40; // ms
  const imagesRef = useRef([]);
  const frameIndexRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Format frame number to 3 digits
  const formatFrame = (num) => num.toString().padStart(3, '0');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Pre-load all frames
    const loadImages = async () => {
      const promises = [];
      for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        img.src = `/motion/frame_${formatFrame(i)}_delay-0.04s.jpg`;
        promises.push(new Promise((resolve) => {
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
        }));
      }
      imagesRef.current = await Promise.all(promises);
      
      // Start animation loop once enough images are loaded
      requestAnimationFrame(animate);
    };

    const animate = (time) => {
      if (time - lastTimeRef.current >= frameRate) {
        lastTimeRef.current = time;
        frameIndexRef.current = (frameIndexRef.current + 1) % totalFrames;
        
        const img = imagesRef.current[frameIndexRef.current];
        if (img && ctx) {
          const dpr = window.devicePixelRatio || 1;
          
          // Set display size (css pixels)
          canvas.style.width = window.innerWidth + 'px';
          canvas.style.height = window.innerHeight + 'px';
          
          // Set actual size in memory (scaled by DPR)
          canvas.width = window.innerWidth * dpr;
          canvas.height = window.innerHeight * dpr;
          
          // Draw image to fill canvas (cover effect)
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
          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
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
      <canvas ref={canvasRef} className="motion-bg-canvas" />
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
        .motion-bg-canvas {
          display: block;
          width: 100%;
          height: 100%;
          filter: contrast(1.15) brightness(0.85) saturate(1.1);
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
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
