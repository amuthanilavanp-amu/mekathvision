import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* Sidebar Nav */}
      <nav className="sidebar">
        <Link href="/" className="nav-item active">Home</Link>
        <Link href="/stories" className="nav-item">Genres</Link>
        <Link href="/contact" className="nav-item">Contact</Link>
        <Link href="/news" className="nav-item">News</Link>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-subtitle">Dive into the world of Stories</p>
          <h1 className="hero-title serif">Explore, Discover, and Read Your Favorite Stories</h1>
          <div className="hero-btns">
            <Link href="/stories" className="btn btn-secondary">Browse Stories</Link>
            <Link href="/upload" className="btn btn-primary">Upload Story</Link>
          </div>
        </div>
        
        {/* Top Right Icons */}
        <div style={{ position: 'absolute', top: '40px', right: '40px', display: 'flex', gap: '20px', z-index: 10 }}>
           <button className="glass-btn">🔍</button>
           <button className="glass-btn">●●●</button>
        </div>
      </section>

      {/* Categories / Stories Grid could go here */}
      <section style={{ padding: '100px 10%' }}>
        <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '50px' }}>Featured Genres</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
          {['Fantasy', 'Horror', 'Love', 'Motivation', 'Adventure', 'Sci-Fi'].map((genre) => (
            <div key={genre} className="glass-card" style={{ textAlign: 'center', transition: 'transform 0.3s' }}>
              <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{genre}</h3>
              <p style={{ opacity: 0.6 }}>Explore the magic of {genre.toLowerCase()} tales.</p>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .glass-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        .glass-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </main>
  );
}
