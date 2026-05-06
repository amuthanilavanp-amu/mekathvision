import Link from 'next/link';

const characters = [
  { name: 'Raris', img: '/assets/character_raris_1778049701954.png' },
  { name: 'Linner', img: '/assets/character_linner_1778049717169.png' },
  { name: 'Landa', img: '/assets/character_landa_1778049912574.png' },
  { name: 'Evnits', img: '/assets/character_evnits_1778049928937.png' },
  { name: 'Martha', img: '/assets/character_martha_1778049952538.png' },
  { name: 'Vemper', img: '/assets/character_raris_1778049701954.png' }, // Reuse for demo
  { name: 'Stores', img: '/assets/character_linner_1778049717169.png' }, // Reuse for demo
];

export default function Home() {
  return (
    <main>
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" className="nav-logo serif">Maketh Vision</Link>
        
        <div className="nav-links">
          <Link href="#" className="nav-link active">Maket Us</Link>
          <Link href="#" className="nav-link">Feature</Link>
          <Link href="#" className="nav-link">Games</Link>
          <Link href="#" className="nav-link">Resources</Link>
          <Link href="#" className="nav-link">About</Link>
        </div>

        <div className="nav-actions">
          <Link href="/explore" className="pill-btn">explor</Link>
          <Link href="/settings" className="pill-btn">settings</Link>
          <Link href="/contact" className="pill-btn">contact</Link>
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
            Lorem ipsum dolor sit amet enel, consectetuer adipiscing elit, sed do eiusmod tempor incididunt ut labore et tistreet dolore magna aliqua. Ut enim ad minis veniam, enuio, musrud exercitation ullamico labro aliquip ex ea commodo outs ncsstrentur roneerl imtersmetinii net in nolpstatt sult mianaimral muitiat. Duis ate irure color commodo consequat.
          </p>
          <Link href="/explore" className="hero-cta">Explore Stories</Link>
        </div>
      </section>

      {/* Character Profiles Section */}
      <section className="section">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2 className="section-title serif">Character Profiles</h2>
          </div>
          <div className="section-description">
             <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
             <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
             <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
          </div>
        </div>

        <div className="character-grid">
          {characters.map((char, index) => (
            <div key={index} className="character-card">
              <img src={char.img} alt={char.name} className="character-img" />
              <div className="character-name">{char.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / Extra Content could go here */}
    </main>
  );
}
