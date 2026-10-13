import { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const apiUrl = '/api/index.php'; // In production, this matches the same domain

  useEffect(() => {
    fetch(`${apiUrl}?route=check-auth`, {credentials: 'include'})
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setIsAuthenticated(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${apiUrl}?route=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleLogout = async () => {
    await fetch(`${apiUrl}?route=logout`, { method: 'POST', credentials: 'include' });
    setIsAuthenticated(false);
  };

  if (loading) return <div style={{padding: '2rem', color: 'white'}}>Loading...</div>;

  if (!isAuthenticated) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--navy)'}}>
        <form onSubmit={handleLogin} style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '400px'}}>
          <h2 style={{color: 'var(--navy)', marginBottom: '1.5rem', fontWeight: 700}}>Admin Login</h2>
          {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
          <div style={{marginBottom: '1rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--gray-600)'}}>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px'}} />
          </div>
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--gray-600)'}}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px'}} />
          </div>
          <button type="submit" style={{width: '100%', padding: '0.75rem', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{backgroundColor: '#f3f4f6', minHeight: '100vh', color: '#111827'}}>
      <header style={{backgroundColor: 'var(--navy)', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 style={{fontWeight: 700}}>Yash Industries Admin</h1>
        <div style={{display: 'flex', gap: '1rem'}}>
            <a href="/" style={{color: 'white', textDecoration: 'underline'}}>View Site</a>
            <button onClick={handleLogout} style={{color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600}}>Logout</button>
        </div>
      </header>
      <main style={{padding: '2rem'}}>
        <AdminDashboard apiUrl={apiUrl} />
      </main>
    </div>
  );
}
