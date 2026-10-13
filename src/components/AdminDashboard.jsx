import { useState, useEffect, useCallback } from 'react';

const TAB_STYLE = (active) => ({
  padding: '0.5rem 1rem',
  background: active ? 'var(--accent)' : '#e5e7eb',
  color: active ? 'white' : '#374151',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontWeight: 500,
});

const TABLE_WRAP = {
  background: 'white',
  borderRadius: '0.5rem',
  overflow: 'auto',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

const TH = { padding: '1rem', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' };
const TD = { padding: '1rem', verticalAlign: 'top' };

const STATUS_COLORS = {
  New:        { bg: '#fef3c7', color: '#92400e' },
  Contacted:  { bg: '#dbeafe', color: '#1e40af' },
  Quoted:     { bg: '#e0e7ff', color: '#3730a3' },
  Won:        { bg: '#dcfce7', color: '#166534' },
  Lost:       { bg: '#fee2e2', color: '#991b1b' },
  Reviewing:  { bg: '#dbeafe', color: '#1e40af' },
  Shortlisted:{ bg: '#dcfce7', color: '#166534' },
  Rejected:   { bg: '#fee2e2', color: '#991b1b' },
};

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#4b5563' };
  return (
    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', backgroundColor: c.bg, color: c.color }}>
      {status}
    </span>
  );
}

export default function AdminDashboard({ apiUrl }) {
  const [stats,        setStats]        = useState(null);
  const [inquiries,    setInquiries]    = useState([]);
  const [products,     setProducts]     = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab,    setActiveTab]    = useState('overview');
  const [appError,     setAppError]     = useState(null);

  const loadData = useCallback(async () => {
    try {
      const statsRes = await fetch(`${apiUrl}?route=dashboard`, { credentials: 'include' });
      setStats(await statsRes.json());

      const inqRes = await fetch(`${apiUrl}?route=inquiries`, { credentials: 'include' });
      setInquiries(await inqRes.json());

      const prodRes = await fetch(`${apiUrl}?route=products&all=1`, { credentials: 'include' });
      setProducts(await prodRes.json());
    } catch (e) {
      console.error('Error loading admin data', e);
    }
  }, [apiUrl]);

  const loadApplications = useCallback(async () => {
    try {
      setAppError(null);
      const res  = await fetch(`${apiUrl}?route=applications`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) {
        // Table may not yet be migrated
        setAppError(data.error || 'Could not load applications.');
      } else {
        setApplications(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setAppError('Network error loading applications.');
      console.error(e);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Lazy-load applications only when the tab is first opened
  useEffect(() => {
    if (activeTab === 'applications') {
      loadApplications();
    }
  }, [activeTab, loadApplications]);

  const handleUpdateInquiry = async (id, status) => {
    await fetch(`${apiUrl}?route=inquiries`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
      credentials: 'include',
    });
    loadData();
  };

  const handleUpdateApplication = async (id, status) => {
    await fetch(`${apiUrl}?route=applications`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
      credentials: 'include',
    });
    loadApplications();
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await fetch(`${apiUrl}?route=products&id=${id}`, { method: 'DELETE', credentials: 'include' });
      loadData();
    }
  };

  if (!stats) return <div>Loading dashboard…</div>;

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['overview', 'inquiries', 'applications', 'products'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={TAB_STYLE(activeTab === tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'inquiries'    && stats.new_inquiries    > 0 && (
              <span style={{ marginLeft: '0.4rem', background: '#f59e0b', color: 'white', borderRadius: '999px', padding: '0 0.4rem', fontSize: '0.7rem' }}>
                {stats.new_inquiries}
              </span>
            )}
            {tab === 'applications' && stats.new_applications > 0 && (
              <span style={{ marginLeft: '0.4rem', background: '#ef4444', color: 'white', borderRadius: '999px', padding: '0 0.4rem', fontSize: '0.7rem' }}>
                {stats.new_applications}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
          {[
            { label: 'Total Products',      value: stats.total_products,     color: null },
            { label: 'Total Inquiries',     value: stats.total_inquiries,    color: null },
            { label: 'New Inquiries',       value: stats.new_inquiries,      color: '#f59e0b' },
            { label: 'Total Applications',  value: stats.total_applications, color: null },
            { label: 'New Applications',    value: stats.new_applications,   color: '#ef4444' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{label}</h3>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: color || 'inherit' }}>{value ?? 0}</p>
            </div>
          ))}
        </div>
      )}

      {/* Inquiries */}
      {activeTab === 'inquiries' && (
        <div style={TABLE_WRAP}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={TH}>ID / Date</th>
                <th style={TH}>Customer</th>
                <th style={TH}>Product</th>
                <th style={TH}>Message</th>
                <th style={TH}>Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inq => (
                <tr key={inq.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={TD}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{inq.unique_id}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{new Date(inq.created_at).toLocaleDateString()}</div>
                  </td>
                  <td style={TD}>
                    <div style={{ fontWeight: 500 }}>{inq.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#4b5563' }}>{inq.phone}</div>
                    {inq.email && <div style={{ fontSize: '0.8125rem', color: '#4b5563' }}>{inq.email}</div>}
                  </td>
                  <td style={TD}>
                    <div>{inq.product_name || 'General'}</div>
                    {inq.quantity && <div style={{ fontSize: '0.8125rem' }}>Qty: {inq.quantity}</div>}
                  </td>
                  <td style={{ ...TD, maxWidth: '220px' }}>
                    <div style={{ fontSize: '0.8125rem', color: '#4b5563', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {inq.message}
                    </div>
                  </td>
                  <td style={TD}>
                    <select
                      value={inq.status}
                      onChange={(e) => handleUpdateInquiry(inq.id, e.target.value)}
                      style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    >
                      {['New','Contacted','Quoted','Won','Lost'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>No inquiries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Applications */}
      {activeTab === 'applications' && (
        <div>
          {appError ? (
            <div style={{ padding: '1.5rem', background: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              <strong>Could not load applications.</strong> {appError}
              {appError.includes('error') && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  The <code>job_applications</code> table may not yet exist on the hosted database.
                  Apply <code>api/migrations/2026_add_job_applications.sql</code> to the database first.
                </p>
              )}
            </div>
          ) : (
            <div style={TABLE_WRAP}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={TH}>Ref / Date</th>
                    <th style={TH}>Candidate</th>
                    <th style={TH}>Position</th>
                    <th style={TH}>Experience</th>
                    <th style={TH}>Resume</th>
                    <th style={TH}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={TD}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{app.app_ref}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{new Date(app.created_at).toLocaleDateString()}</div>
                      </td>
                      <td style={TD}>
                        <div style={{ fontWeight: 500 }}>{app.name}</div>
                        <div style={{ fontSize: '0.8125rem', color: '#4b5563' }}>{app.phone}</div>
                        <div style={{ fontSize: '0.8125rem', color: '#4b5563' }}>{app.email}</div>
                        {app.location && <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{app.location}</div>}
                      </td>
                      <td style={TD}>
                        <div style={{ fontWeight: 500 }}>{app.position}</div>
                        {app.message && (
                          <div style={{ fontSize: '0.8125rem', color: '#4b5563', marginTop: '0.25rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            title={app.message}>
                            {app.message}
                          </div>
                        )}
                      </td>
                      <td style={TD}>{app.experience}</td>
                      <td style={TD}>
                        {app.resume_url ? (
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--accent)', fontSize: '0.875rem', wordBreak: 'break-all' }}
                          >
                            View ↗
                          </a>
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>—</span>
                        )}
                      </td>
                      <td style={TD}>
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateApplication(app.id, e.target.value)}
                          style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                        >
                          {['New','Reviewing','Shortlisted','Rejected'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr><td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>No applications yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Products */}
      {activeTab === 'products' && (
        <div style={TABLE_WRAP}>
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #e5e7eb' }}>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--navy)', color: 'white', borderRadius: '4px', border: 'none' }}>
              + Add Product (Coming Soon)
            </button>
          </div>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={TH}>Image</th>
                <th style={TH}>Product Details</th>
                <th style={TH}>Status</th>
                <th style={TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={TD}>
                    <img src={prod.image_path} alt={prod.name} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={TD}>
                    <div style={{ fontWeight: 600 }}>{prod.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{prod.category}</div>
                  </td>
                  <td style={TD}>
                    <StatusBadge status={prod.is_published ? 'Won' : 'Lost'} />
                    <span style={{ marginLeft: '0.25rem', fontSize: '0.875rem' }}>
                      {prod.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={TD}>
                    <button onClick={() => handleDeleteProduct(prod.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
                      Delete
                    </button>
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
