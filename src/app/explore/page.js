import Link from 'next/link';

export default function ExplorePage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '120px 5%' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 className="serif" style={{ fontSize: '3.5rem', marginBottom: '40px' }}>Explore the Sanctuary</h1>
        <p style={{ color: 'var(--color-text-dim)', marginBottom: '60px', fontSize: '1.2rem' }}>
          Discover tales from every corner of the imagination.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {['Fantasy', 'Horror', 'Love', 'Adventure', 'Sci-Fi', 'Mystery'].map((genre) => (
            <div key={genre} className="login-card" style={{ textAlign: 'center', padding: '40px' }}>
              <h2 className="serif" style={{ marginBottom: '15px' }}>{genre}</h2>
              <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Dive into the world of {genre.toLowerCase()} and discover amazing visions.
              </p>
              <Link href={`/stories?genre=${genre}`} className="pill-btn">Browse {genre}</Link>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <Link href="/" style={{ color: 'var(--color-text-dim)', textDecoration: 'none' }}>← Back to Sanctuary</Link>
        </div>
      </div>
    </main>
  );
}
