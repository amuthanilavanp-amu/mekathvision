'use client';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Link href="/" className="nav-logo serif" style={{ display: 'block', marginBottom: '30px' }}>Maketh Vision</Link>
          <h2 className="serif">Welcome Back</h2>
          <p>Enter your details to continue your journey</p>
        </div>

        <form>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="name@example.com" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '30px', fontSize: '0.85rem', color: 'rgba(250, 237, 205, 0.5)' }}>
          Don't have an account? <Link href="/signup" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Start your story</Link>
        </div>
        
        <Link href="/" style={{ display: 'inline-block', marginTop: '20px', fontSize: '0.8rem', color: 'rgba(250, 237, 205, 0.3)', textDecoration: 'none' }}>
          ← Back to home
        </Link>
      </div>
      
      <style jsx>{`
        /* Local overrides if needed, but mostly uses globals.css */
      `}</style>
    </main>
  );
}
