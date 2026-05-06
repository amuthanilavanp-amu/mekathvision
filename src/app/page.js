import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* Navbar */}
      <nav className="navbar">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Link href="/" className="nav-logo serif">Maketh Vision</Link>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>
            By Joshua Amuthanilavan
          </span>
        </div>
        
        <div className="nav-links">
          <Link href="/" className="nav-link active">Home</Link>
          <Link href="/upload" className="nav-link">Upload</Link>
          <Link href="/explore" className="nav-link">Explore</Link>
          <Link href="/about" className="nav-link">About</Link>
        </div>

        <div className="nav-actions">
          <Link href="/explore" className="pill-btn">explore</Link>
          <Link href="/upload" className="pill-btn">upload</Link>
          <Link href="/login" className="pill-btn primary">login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <img 
          src="/assets/hero_background_1778049679282.png" 
          alt="Hero background" 
          className="hero-bg"
        />
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <h1 className="hero-title serif">The Storying</h1>
          <p className="hero-description">
            Experience storytelling like never before. Dive into a world of imagination, where every tale is a cinematic journey crafted with passion and vision.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link href="/explore" className="hero-cta">Explore Stories</Link>
            <Link href="/upload" className="hero-cta" style={{ background: 'transparent', border: '1px solid var(--color-accent)', color: 'var(--color-accent)' }}>
              Share Your Tale
            </Link>
          </div>
        </div>
      </section>

      {/* Quote / Intro Section (Replacing Characters) */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="section-title serif" style={{ fontSize: '3rem', marginBottom: '40px', textAlign: 'center', border: 'none' }}>
            "Every story is a vision waiting to be told."
          </h2>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '1.2rem', fontStyle: 'italic' }}>
            - Joshua Amuthanilavan
          </p>
        </div>
      </section>

      {/* Simple Footer */}
      <footer style={{ padding: '60px 5%', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
          © 2026 Maketh Vision. All rights reserved. | Crafted with ❤️ by Joshua Amuthanilavan
        </p>
      </footer>
    </main>
  );
}
