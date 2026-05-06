import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* Left Sidebar */}
      <aside className="sidebar-left">
        <div className="vertical-text" style={{ marginBottom: '100px' }}>UPLOAD</div>
        <div className="vertical-text">SHOP</div>
      </aside>

      {/* Right Sidebar */}
      <aside className="sidebar-right">
        <div className="vertical-text">SCROLL</div>
      </aside>

      {/* Header */}
      <header className="header">
        <div className="menu-icon">☰</div>
        <div className="header-right">
          <div className="icon-btn">🔍</div>
          <div className="icon-btn">
             <div style={{ width: '15px', height: '2px', background: 'white' }}></div>
          </div>
          <Link href="/login" className="sign-in-btn">Sign In</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <p className="hero-subtitle">DIVE INTO THE WORLD OF ANIME</p>
        <h1 className="hero-title">
          Explore, Discover, and Read Your Favorite Stories
        </h1>
        
        <div className="hero-btns">
          <Link href="/explore?type=series" className="outline-btn">Series</Link>
          <Link href="/explore?type=movie" className="outline-btn">Movie</Link>
        </div>
      </section>

      {/* Background Decorative Elements (Optional) */}
      <div style={{ 
        position: 'fixed', 
        bottom: '-10%', 
        right: '-5%', 
        width: '40vw', 
        height: '40vw', 
        background: 'radial-gradient(circle, rgba(255,45,85,0.1) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none'
      }}></div>
    </main>
  );
}
