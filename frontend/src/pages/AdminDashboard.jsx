import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { exportPaymentsCSV } from '../utils/exportCSV';

const STATUSES = ['All', 'Pending Verification', 'Verified', 'Rejected'];

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  page:     { minHeight: '100vh', background: '#eef2f7', fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', flexDirection: 'column' },
  card:     { background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' },
};

const STATUS_STYLE = {
  'Pending Verification': { background: '#fef9c3', color: '#854d0e', border: '1px solid #fde68a' },
  'Verified':             { background: '#dcfce7', color: '#166534', border: '1px solid #86efac' },
  'Rejected':             { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
};

const STATUS_DOT = {
  'Pending Verification': '#d97706',
  'Verified':             '#16a34a',
  'Rejected':             '#dc2626',
};

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, count, icon, accent }) {
  return (
    <div style={{ ...T.card, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i className={`fas ${icon}`} style={{ fontSize: '20px', color: accent }} />
      </div>
      <div>
        <p style={{ fontSize: '28px', fontWeight: 800, color: accent, margin: 0, lineHeight: 1 }}>{count}</p>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0', fontWeight: 500 }}>{label}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterComet,  setFilterComet]  = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [filterTerm,   setFilterTerm]   = useState('All');
  const [updating, setUpdating]         = useState(null);
  const [search, setSearch]             = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'All') params.status  = filterStatus;
      if (filterComet.trim())     params.cometId = filterComet.trim();
      const { data } = await api.get('/payment/admin/all', { params });
      setPayments(data);
    } catch {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, [filterStatus, filterComet]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`/payment/admin/${id}/status`, { paymentStatus: status });
      toast.success(`Status updated to "${status}"`);
      setPayments(prev => prev.map(p => p._id === id ? { ...p, paymentStatus: status } : p));
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const filtered = payments.filter(p => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !p.cometId?.toLowerCase().includes(q) &&
        !p.name?.toLowerCase().includes(q) &&
        !p.utrNumber?.includes(q)
      ) return false;
    }
    if (filterModule !== 'All') {
      const hasModule = p.modules?.some(m => m.moduleName === filterModule);
      if (!hasModule) return false;
    }
    if (filterTerm !== 'All' && filterModule !== 'All') {
      const hasTerm = p.modules?.some(m => m.moduleName === filterModule && m.termName === filterTerm);
      if (!hasTerm) return false;
    }
    return true;
  });

  const stats = [
    { label: 'Total Payments', count: payments.length,                                                         icon: 'fa-layer-group',  accent: '#2d55a0' },
    { label: 'Pending',        count: payments.filter(p => p.paymentStatus === 'Pending Verification').length, icon: 'fa-clock',        accent: '#d97706' },
    { label: 'Verified',       count: payments.filter(p => p.paymentStatus === 'Verified').length,             icon: 'fa-circle-check', accent: '#16a34a' },
    { label: 'Rejected',       count: payments.filter(p => p.paymentStatus === 'Rejected').length,             icon: 'fa-circle-xmark', accent: '#dc2626' },
  ];

  const totalRevenue = payments
    .filter(p => p.paymentStatus === 'Verified')
    .reduce((sum, p) => sum + (p.grandTotal || 0), 0);

  return (
    <div style={T.page}>

      {/* ── Accent bar ──────────────────────────────────────────────────────── */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #1a3a8f, #2d55a0, #4f7fd4)' }} />

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <header style={{ background: '#fff', borderBottom: '1px solid #dbe4ff', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#2d55a0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-shield-halved" style={{ color: '#fff', fontSize: '16px' }} />
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a3a8f', margin: 0, lineHeight: 1.2 }}>Admin Dashboard</p>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>IIITB COMET FWC — Payment Management</p>
            </div>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

            {/* Refresh */}
            <button
              onClick={fetchPayments}
              title="Refresh"
              style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #dbe4ff', background: '#f0f4ff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#dbe4ff'}
              onMouseLeave={e => e.currentTarget.style.background = '#f0f4ff'}
            >
              <i className="fas fa-rotate-right" style={{ fontSize: '13px', color: '#2d55a0' }} />
            </button>

            {/* Admin pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0f4ff', border: '1px solid #dbe4ff', borderRadius: '10px', padding: '6px 12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2d55a0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700 }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#1a3a8f', margin: 0, lineHeight: 1.2 }}>{user?.name || 'Admin'}</p>
                <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>{user?.cometId}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'none', border: '1px solid #fca5a5', borderRadius: '10px', color: '#dc2626', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <i className="fas fa-right-from-bracket" style={{ fontSize: '12px' }} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '28px 24px 48px' }}>

        {/* Revenue banner */}
        <div style={{ background: 'linear-gradient(135deg, #1a3a8f 0%, #2d55a0 60%, #4f7fd4 100%)', borderRadius: '16px', padding: '24px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 32px rgba(45,85,160,0.25)' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#93b4e8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>Verified Revenue</p>
            <p style={{ fontSize: '36px', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1 }}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <p style={{ fontSize: '12px', color: '#93b4e8', margin: '6px 0 0' }}>
              from {payments.filter(p => p.paymentStatus === 'Verified').length} verified payments
            </p>
          </div>
          <i className="fas fa-indian-rupee-sign" style={{ fontSize: '64px', color: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Filters row */}
        <div style={{ ...T.card, padding: '16px 20px', marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>

          {/* Live search */}
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px', maxWidth: '260px' }}>
            <i className="fas fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#9ca3af', pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, ID, UTR…"
              style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #dbe4ff', borderRadius: '10px', fontSize: '13px', fontFamily: 'inherit', color: '#1f2937', background: '#f0f4ff', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = '#2d55a0'}
              onBlur={e  => e.target.style.borderColor = '#dbe4ff'}
            />
          </div>

          {/* COMET ID filter */}
          <div style={{ position: 'relative', flex: '1 1 180px', minWidth: '160px', maxWidth: '220px' }}>
            <i className="fas fa-id-badge" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#9ca3af', pointerEvents: 'none' }} />
            <input
              value={filterComet}
              onChange={e => setFilterComet(e.target.value)}
              placeholder="Filter by COMET ID"
              style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #dbe4ff', borderRadius: '10px', fontSize: '13px', fontFamily: 'inherit', color: '#1f2937', background: '#f0f4ff', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = '#2d55a0'}
              onBlur={e  => e.target.style.borderColor = '#dbe4ff'}
            />
          </div>

          {/* Status pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: filterStatus === s ? '1px solid #2d55a0' : '1px solid #dbe4ff', background: filterStatus === s ? '#2d55a0' : '#f0f4ff', color: filterStatus === s ? '#fff' : '#6b7280', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Export */}
          <button
            onClick={() => exportPaymentsCSV(payments)}
            disabled={!payments.length}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', background: '#16a34a', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: payments.length ? 'pointer' : 'not-allowed', opacity: payments.length ? 1 : 0.4, fontFamily: 'inherit', transition: 'background 0.15s' }}
            onMouseEnter={e => { if (payments.length) e.currentTarget.style.background = '#15803d'; }}
            onMouseLeave={e => { if (payments.length) e.currentTarget.style.background = '#16a34a'; }}
          >
            <i className="fas fa-download" /> Export CSV
          </button>
        </div>

        {/* Module + Term filter row */}
        <div style={{ ...T.card, padding: '14px 20px', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>

          {/* Module pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginRight: '4px' }}>
              <i className="fas fa-layer-group" style={{ marginRight: '5px' }} />Module
            </span>
            {['All', 'Module 1', 'Module 2', 'Module 3'].map(m => (
              <button
                key={m}
                onClick={() => { setFilterModule(m); setFilterTerm('All'); }}
                style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                  border: filterModule === m ? '1px solid #2d55a0' : '1px solid #dbe4ff',
                  background: filterModule === m ? '#2d55a0' : '#f0f4ff',
                  color: filterModule === m ? '#fff' : '#6b7280',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Term pills — only shown for Module 2 and Module 3 */}
          {(filterModule === 'Module 2' || filterModule === 'Module 3') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', borderLeft: '2px solid #dbe4ff', paddingLeft: '14px', marginLeft: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginRight: '4px' }}>
                <i className="fas fa-calendar-week" style={{ marginRight: '5px' }} />Term
              </span>
              {['All', 'Term 1', 'Term 2'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterTerm(t)}
                  style={{
                    padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                    border: filterTerm === t ? '1px solid #7c3aed' : '1px solid #dbe4ff',
                    background: filterTerm === t ? '#7c3aed' : '#f5f3ff',
                    color: filterTerm === t ? '#fff' : '#6b7280',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Clear filter badge */}
          {(filterModule !== 'All' || filterTerm !== 'All') && (
            <button
              onClick={() => { setFilterModule('All'); setFilterTerm('All'); }}
              style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <i className="fas fa-xmark" /> Clear module filter
            </button>
          )}
        </div>

        {/* Results count */}
        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 12px 4px' }}>
          Showing <strong style={{ color: '#374151' }}>{filtered.length}</strong> of <strong style={{ color: '#374151' }}>{payments.length}</strong> records
        </p>

        {/* ── Table ─────────────────────────────────────────────────────────── */}
        <div style={{ ...T.card, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1100px' }}>

              <thead>
                <tr style={{ background: '#f0f4ff', borderBottom: '2px solid #dbe4ff' }}>
                  {['COMET ID', 'Name', 'Modules', 'Amount', 'UTR', 'Payment Date', 'Submitted', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#1a3a8f', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '64px 0' }}>
                      <i className="fas fa-spinner fa-spin" style={{ fontSize: '28px', color: '#2d55a0' }} />
                      <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '12px' }}>Loading payments…</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '64px 0' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                        <i className="fas fa-inbox" style={{ fontSize: '22px', color: '#9ca3af' }} />
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>No payments found</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((p, i) => (
                    <tr
                      key={p._id}
                      style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f3f4f6' : 'none', transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* COMET ID */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <code style={{ fontSize: '12px', fontWeight: 700, color: '#2d55a0', background: '#f0f4ff', padding: '3px 8px', borderRadius: '6px', fontFamily: 'monospace' }}>
                          {p.cometId}
                        </code>
                      </td>

                      {/* Name */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#2d55a0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                            {p.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: '0 0 2px' }}>
                              {p.name}
                            </p>
                            <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 1px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <i className="fas fa-envelope" style={{ fontSize: '10px' }} />
                              {p.email || '—'}
                            </p>
                            <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <i className="fas fa-phone" style={{ fontSize: '10px' }} />
                              {p.contact || p.contacts || p.phone
                                ? <><span style={{ color: '#6b7280' }}>+91</span>{' '}{p.contact || p.contacts || p.phone}</>
                                : '—'
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Modules */}
                      <td style={{ padding: '14px 16px' }}>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                          {p.modules.map(m => `${m.moduleName}${m.termName ? ' · ' + m.termName : ''}`).join(', ')}
                        </p>
                      </td>

                      {/* Amount */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a3a8f' }}>
                          ₹{p.grandTotal.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* UTR */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <code style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace', letterSpacing: '1px' }}>
                          {p.utrNumber}
                        </code>
                      </td>

                      {/* Payment Date — entered by student */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      
{p.paymentDate ? (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <i className="fas fa-calendar-check" style={{ fontSize: '11px', color: '#2d55a0' }} />
    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>
      {new Date(p.paymentDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata'   // 👈 this one line fixes it
      })}
    </span>
  </div>
) : (
  <span style={{ fontSize: '12px', color: '#d1d5db', fontStyle: 'italic' }}>—</span>
)}
                      </td>

                      {/* Submitted — createdAt */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          {new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, ...STATUS_STYLE[p.paymentStatus] }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: STATUS_DOT[p.paymentStatus], flexShrink: 0 }} />
                          {p.paymentStatus}
                        </span>

                        {/* 👇 Add this below the status badge */}
  {p.resubmitted && (
    <div style={{ marginTop: '5px' }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        background: '#ede9fe', border: '1px solid #c4b5fd',
        borderRadius: '20px', padding: '3px 8px',
        fontSize: '10px', fontWeight: 700, color: '#6d28d9',
      }}>
        <i className="fas fa-rotate-right" style={{ fontSize: '9px' }} />
        Resubmitted
      </span>
    </div>
  )}
                      </td>

                      {/* Action */}
                      <td style={{ padding: '14px 24px', whiteSpace: 'nowrap' }}>
                        {p.paymentStatus === 'Pending Verification' ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => updateStatus(p._id, 'Verified')}
                              disabled={updating === p._id}
                              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', color: '#166534', fontSize: '12px', fontWeight: 700, cursor: updating === p._id ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: updating === p._id ? 0.6 : 1, transition: 'all 0.15s' }}
                              onMouseEnter={e => { if (updating !== p._id) e.currentTarget.style.background = '#bbf7d0'; }}
                              onMouseLeave={e => { if (updating !== p._id) e.currentTarget.style.background = '#dcfce7'; }}
                            >
                              {updating === p._id
                                ? <i className="fas fa-spinner fa-spin" />
                                : <><i className="fas fa-check" /> Verify</>}
                            </button>
                            <button
                              onClick={() => updateStatus(p._id, 'Rejected')}
                              disabled={updating === p._id}
                              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', fontSize: '12px', fontWeight: 700, cursor: updating === p._id ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: updating === p._id ? 0.6 : 1, transition: 'all 0.15s' }}
                              onMouseEnter={e => { if (updating !== p._id) e.currentTarget.style.background = '#fecaca'; }}
                              onMouseLeave={e => { if (updating !== p._id) e.currentTarget.style.background = '#fee2e2'; }}
                            >
                              <i className="fas fa-xmark" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#d1d5db', fontStyle: 'italic' }}>No action</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#1a3a8f', padding: '16px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#93b4e8', margin: 0 }}>
          © 2025 IIITB COMET Foundation — All Rights Reserved
        </p>
      </footer>

    </div>
  );
}
