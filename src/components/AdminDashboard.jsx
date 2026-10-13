import { useState, useEffect, useCallback } from 'react';

export default function AdminDashboard({ apiUrl }) {
  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const loadData = useCallback(async () => {
    try {
      const statsRes = await fetch(`${apiUrl}?route=dashboard`, {credentials: 'include'});
      setStats(await statsRes.json());
      
      const inqRes = await fetch(`${apiUrl}?route=inquiries`, {credentials: 'include'});
      setInquiries(await inqRes.json());
      
      const prodRes = await fetch(`${apiUrl}?route=products&all=1`, {credentials: 'include'});
      setProducts(await prodRes.json());
    } catch (e) {
      console.error('Error loading admin data', e);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateInquiry = async (id, status) => {
    await fetch(`${apiUrl}?route=inquiries`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
      credentials: 'include'
    });
    loadData();
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await fetch(`${apiUrl}?route=products&id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      loadData();
    }
  };

  if (!stats) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
        <button onClick={() => setActiveTab('overview')} style={{padding: '0.5rem 1rem', background: activeTab === 'overview' ? 'var(--accent)' : '#e5e7eb', color: activeTab === 'overview' ? 'white' : '#374151', borderRadius: '4px'}}>Overview</button>
        <button onClick={() => setActiveTab('inquiries')} style={{padding: '0.5rem 1rem', background: activeTab === 'inquiries' ? 'var(--accent)' : '#e5e7eb', color: activeTab === 'inquiries' ? 'white' : '#374151', borderRadius: '4px'}}>Inquiries</button>
        <button onClick={() => setActiveTab('products')} style={{padding: '0.5rem 1rem', background: activeTab === 'products' ? 'var(--accent)' : '#e5e7eb', color: activeTab === 'products' ? 'white' : '#374151', borderRadius: '4px'}}>Products</button>
      </div>

      {activeTab === 'overview' && (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem'}}>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: 'var(--gray-500)', fontSize: '0.875rem'}}>Total Products</h3>
            <p style={{fontSize: '2rem', fontWeight: 700}}>{stats.total_products}</p>
          </div>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: 'var(--gray-500)', fontSize: '0.875rem'}}>Total Inquiries</h3>
            <p style={{fontSize: '2rem', fontWeight: 700}}>{stats.total_inquiries}</p>
          </div>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: 'var(--gray-500)', fontSize: '0.875rem'}}>New Inquiries</h3>
            <p style={{fontSize: '2rem', fontWeight: 700, color: '#f59e0b'}}>{stats.new_inquiries}</p>
          </div>
        </div>
      )}

      {activeTab === 'inquiries' && (
        <div style={{background: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
            <thead style={{backgroundColor: '#f9fafb'}}>
              <tr>
                <th style={{padding: '1rem', borderBottom: '1px solid #e5e7eb'}}>ID / Date</th>
                <th style={{padding: '1rem', borderBottom: '1px solid #e5e7eb'}}>Customer</th>
                <th style={{padding: '1rem', borderBottom: '1px solid #e5e7eb'}}>Product</th>
                <th style={{padding: '1rem', borderBottom: '1px solid #e5e7eb'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inq => (
                <tr key={inq.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                  <td style={{padding: '1rem'}}>
                    <div style={{fontWeight: 600}}>{inq.unique_id}</div>
                    <div style={{fontSize: '0.75rem', color: '#6b7280'}}>{new Date(inq.created_at).toLocaleDateString()}</div>
                  </td>
                  <td style={{padding: '1rem'}}>
                    <div>{inq.name}</div>
                    <div style={{fontSize: '0.875rem', color: '#4b5563'}}>{inq.phone} | {inq.email}</div>
                  </td>
                  <td style={{padding: '1rem'}}>
                    <div>{inq.product_name || 'General'}</div>
                    {inq.quantity && <div style={{fontSize: '0.875rem'}}>Qty: {inq.quantity}</div>}
                  </td>
                  <td style={{padding: '1rem'}}>
                    <select 
                      value={inq.status} 
                      onChange={(e) => handleUpdateInquiry(inq.id, e.target.value)}
                      style={{padding: '0.25rem', borderRadius: '4px', border: '1px solid #d1d5db'}}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && <tr><td colSpan="4" style={{padding: '1rem', textAlign: 'center'}}>No inquiries yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'products' && (
        <div style={{background: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <div style={{padding: '1rem', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #e5e7eb'}}>
             {/* In a complete build, a modal for adding a new product would open here */}
            <button style={{padding: '0.5rem 1rem', backgroundColor: 'var(--navy)', color: 'white', borderRadius: '4px', border: 'none'}}>+ Add Product (Coming Soon)</button>
          </div>
          <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
            <thead style={{backgroundColor: '#f9fafb'}}>
              <tr>
                <th style={{padding: '1rem', borderBottom: '1px solid #e5e7eb'}}>Image</th>
                <th style={{padding: '1rem', borderBottom: '1px solid #e5e7eb'}}>Product Details</th>
                <th style={{padding: '1rem', borderBottom: '1px solid #e5e7eb'}}>Status</th>
                <th style={{padding: '1rem', borderBottom: '1px solid #e5e7eb'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                  <td style={{padding: '1rem'}}>
                    <img src={prod.image_path} alt={prod.name} style={{width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} />
                  </td>
                  <td style={{padding: '1rem'}}>
                    <div style={{fontWeight: 600}}>{prod.name}</div>
                    <div style={{fontSize: '0.75rem', color: '#6b7280'}}>{prod.category}</div>
                  </td>
                  <td style={{padding: '1rem'}}>
                    <span style={{padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', backgroundColor: prod.is_published ? '#dcfce7' : '#f3f4f6', color: prod.is_published ? '#166534' : '#4b5563'}}>
                      {prod.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{padding: '1rem'}}>
                    <button onClick={() => handleDeleteProduct(prod.id)} style={{color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem'}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
