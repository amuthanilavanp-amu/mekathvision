'use client';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '120px 5%' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 className="serif" style={{ fontSize: '3.5rem', marginBottom: '30px' }}>About Maketh Vision</h1>
        <p style={{ color: 'var(--color-text-dim)', fontSize: '1.2rem', marginBottom: '50px' }}>
          Crafted by <strong>Joshua Amuthanilavan</strong>, Maketh Vision is a sanctuary for storytellers to manifest their visions into a cinematic experience.
        </p>

        <div className="login-card" style={{ maxWidth: '100%', textAlign: 'left' }}>
          <h2 className="serif" style={{ marginBottom: '20px' }}>The Vision</h2>
          <p style={{ marginBottom: '20px' }}>
            We believe that every story is a vision waiting to be told. Our platform provides a cinematic, immersive environment for readers and writers to connect through the art of storytelling.
          </p>
          <h2 className="serif" style={{ marginBottom: '20px' }}>The Creator</h2>
          <p>
            Joshua Amuthanilavan is a visionary developer and storyteller dedicated to pushing the boundaries of web experiences through cinematic design and artistry.
          </p>
        </div>

        <div style={{ marginTop: '60px' }}>
          <Link href="/" className="hero-cta">Return to Sanctuary</Link>
        </div>
      </div>
    </main>
  );
}
