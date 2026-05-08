'use client';
import { useState, useEffect, useRef } from 'react';

export default function MotionBackground() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 146;
  const frameRate = 40; // ms
  const frameRef = useRef(0);

  // Format frame number to 3 digits
  const formatFrame = (num) => num.toString().padStart(3, '0');

  useEffect(() => {
    // Pre-load all frames for smooth motion
    const loadedImages = [];
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = `/motion/frame_${formatFrame(i)}_delay-0.04s.jpg`;
      loadedImages.push(img);
    }

    const interval = setInterval(() => {
      frameRef.current = (frameRef.current + 1) % totalFrames;
      setCurrentFrame(frameRef.current);
    }, frameRate);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="motion-bg-container">
      <img 
        src={`/motion/frame_${formatFrame(currentFrame)}_delay-0.04s.jpg`}
        alt="Motion Background"
        className="motion-bg-frame"
      />

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
        .motion-bg-frame {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}
