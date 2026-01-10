// 📁 src/pages/HomePage.jsx
// ========================================
// 🎯 PURPOSE: Public home page (no login required)
// ========================================

import { Link } from 'react-router-dom';

export  function HomePage() {
  console.log('🏠 HomePage loaded');

  return (
    <div style={{ padding: '40px' }}>
      <nav style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        marginBottom: '30px',
        borderRadius: '8px'
      }}>
        <Link to="/" style={{ marginRight: '20px' }}>Home</Link>
        <Link to="/posts" style={{ marginRight: '20px' }}>Posts</Link>
        <Link to="/admin/login" style={{ marginRight: '20px' }}>Admin Login</Link>
      </nav>

      <h1>🌍 Welcome to Our Website</h1>
      <p style={{ fontSize: '18px', color: '#666', marginTop: '20px' }}>
        This is a public page. Anyone can view this without logging in.
      </p>

      <div style={{ 
        marginTop: '40px',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>About This App</h2>
        <ul style={{ lineHeight: '2', color: '#666' }}>
          <li>✅ Public pages (Home, Posts) - No login required</li>
          <li>✅ Admin dashboard - Requires admin login</li>
          <li>✅ Super Admin dashboard - Requires superadmin role</li>
          <li>✅ Auto token refresh - Stays logged in for 7 days</li>
          <li>✅ Secure authentication - HTTP-only cookies + JWT</li>
        </ul>
      </div>
    </div>
  );
}

// ========================================
// 📁 src/pages/PostsPage.jsx
// ========================================

export function PostsPage() {
  console.log('📝 PostsPage loaded');

  return (
    <div style={{ padding: '40px' }}>
      <nav style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        marginBottom: '30px',
        borderRadius: '8px'
      }}>
        <Link to="/" style={{ marginRight: '20px' }}>Home</Link>
        <Link to="/posts" style={{ marginRight: '20px' }}>Posts</Link>
        <Link to="/admin/login" style={{ marginRight: '20px' }}>Admin Login</Link>
      </nav>

      <h1>📝 Blog Posts</h1>
      <p style={{ fontSize: '18px', color: '#666', marginTop: '20px' }}>
        Public posts page - No login required
      </p>

      <div style={{ marginTop: '40px' }}>
        {[1, 2, 3].map((post) => (
          <div key={post} style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3>Post Title {post}</h3>
            <p style={{ color: '#666' }}>
              This is a sample blog post. Anyone can read this without logging in.
            </p>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
              Posted 2 days ago
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// 📁 src/pages/UnauthorizedPage.jsx
// ========================================

export function UnauthorizedPage() {
  console.log('🚫 UnauthorizedPage loaded');

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '48px', margin: 0 }}>🚫</h1>
        <h2 style={{ marginTop: '20px' }}>Access Denied</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>
          You don't have permission to access this page.
        </p>
        <Link 
          to="/"
          style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}