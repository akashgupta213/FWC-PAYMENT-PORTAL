import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

/* ─────────────────────────────────────────────
   CSS — injected once, matches site dark theme
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .ph-root *, .ph-root *::before, .ph-root *::after { box-sizing: border-box; }

  .ph-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e5eaf3;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px);
    animation: ph-rise 0.5s ease forwards;
  }
  @keyframes ph-rise { to { opacity: 1; transform: translateY(0); } }

  .ph-card:nth-child(1) { animation-delay: 0.05s; }
  .ph-card:nth-child(2) { animation-delay: 0.10s; }
  .ph-card:nth-child(3) { animation-delay: 0.15s; }
  .ph-card:nth-child(4) { animation-delay: 0.20s; }
  .ph-card:nth-child(5) { animation-delay: 0.25s; }

  .ph-card-header {
    padding: 18px 22px 14px;
    border-bottom: 1px solid #f0f4ff;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .ph-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 0.4px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .ph-badge-pending  { background: rgba(245,196,0,0.12);  color: #b38600; border: 1px solid rgba(245,196,0,0.3);  }
  .ph-badge-verified { background: rgba(16,185,129,0.10); color: #059669; border: 1px solid rgba(16,185,129,0.25); }
  .ph-badge-rejected { background: rgba(239,68,68,0.10);  color: #dc2626; border: 1px solid rgba(239,68,68,0.25);  }

  .ph-module-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #f0f4ff;
    border: 1px solid #dbe4ff;
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    color: #1a3a8f;
  }

  .ph-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    font-family: inherit;
    padding: 0;
    transition: color 0.18s;
  }
  .ph-back-btn:hover { color: #1a3a8f; }

  .ph-empty-pulse {
    width: 72px; height: 72px; border-radius: 50%;
    background: #eef2fb;
    display: flex; align-items: center; justify-content: center;
    animation: ph-pulse 2s ease-in-out infinite;
  }
  @keyframes ph-pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(45,85,160,0.15); }
    50%       { transform: scale(1.06); box-shadow: 0 0 0 10px rgba(45,85,160,0); }
  }

  .ph-skeleton {
    background: linear-gradient(90deg, #f0f4ff 25%, #e0e8ff 50%, #f0f4ff 75%);
    background-size: 200% 100%;
    animation: ph-shimmer 1.4s infinite;
    border-radius: 8px;
  }
  @keyframes ph-shimmer { to { background-position: -200% 0; } }
`;

/* ─────────────────────────────────────────────
   Status badge helper
───────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    'Pending Verification': { cls: 'ph-badge-pending',  icon: 'fa-hourglass-half',  label: 'Pending'  },
    'Verified':             { cls: 'ph-badge-verified', icon: 'fa-circle-check',    label: 'Verified' },
    'Rejected':             { cls: 'ph-badge-rejected', icon: 'fa-circle-xmark',    label: 'Rejected' },
  };
  const s = map[status] || map['Pending Verification'];
  return (
    <span className={`ph-badge ${s.cls}`}>
      <i className={`fas ${s.icon}`} style={{ fontSize: '10px' }} />
      {s.label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Format date helper
───────────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    '  ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/* ─────────────────────────────────────────────
   Skeleton loader
───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5eaf3', padding: '22px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div className="ph-skeleton" style={{ width: '140px', height: '18px' }} />
        <div className="ph-skeleton" style={{ width: '80px', height: '22px', borderRadius: '20px' }} />
      </div>
      <div className="ph-skeleton" style={{ width: '100%', height: '1px', marginBottom: '16px' }} />
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <div className="ph-skeleton" style={{ width: '100px', height: '26px', borderRadius: '20px' }} />
        <div className="ph-skeleton" style={{ width: '120px', height: '26px', borderRadius: '20px' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="ph-skeleton" style={{ width: '160px', height: '14px' }} />
        <div className="ph-skeleton" style={{ width: '80px', height: '14px' }} />
      </div>
    </div>
  );
}
/* ─────────────────────────────────────────────
   Resubmit UTR block — shown on rejected cards
───────────────────────────────────────────── */
function ResubmitBlock({ payment, onSuccess }) {
  const [showInput, setShowInput] = useState(false);
  const [utr, setUtr]             = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  // Already resubmitted — show locked message
  if (payment.resubmitted) {
    return (
      <div style={{
        marginTop: '14px',
        background: 'rgba(100,116,139,0.08)',
        border: '1px solid rgba(100,116,139,0.2)',
        borderRadius: '8px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <i className="fas fa-lock" style={{ color: '#64748b', fontSize: '12px', flexShrink: 0 }} />
        <p style={{ fontSize: '12px', color: '#64748b', margin: 0, fontWeight: 500 }}>
          Resubmission already used. Contact support if the issue persists.
        </p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!/^[0-9]{12}$/.test(utr)) {
      setError('UTR must be exactly 12 digits.');
      return;
    }
    if (!paymentDate) {
      
setError('Please select the date of payment');
      
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.patch(`/payment/resubmit/${payment._id}`, { utrNumber: utr, paymentDate });
      onSuccess(data.payment);
      setShowInput(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Resubmit failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '14px' }}>
      {/* Info row */}
      <div style={{
        background: 'rgba(239,68,68,0.06)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: showInput ? '8px 8px 0 0' : '8px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-circle-info" style={{ color: '#dc2626', fontSize: '13px', flexShrink: 0 }} />
          <p style={{ fontSize: '12px', color: '#dc2626', margin: 0, fontWeight: 500 }}>
            Payment rejected. You can resubmit your UTR once.
          </p>
        </div>
        {!showInput && (
          <button
            onClick={() => setShowInput(true)}
            style={{
              background: '#dc2626', color: '#fff', border: 'none',
              borderRadius: '7px', padding: '6px 12px',
              fontSize: '11px', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: '5px',
              flexShrink: 0,
            }}
          >
            <i className="fas fa-rotate-right" style={{ fontSize: '10px' }} />
            Resubmit UTR
          </button>
        )}
      </div>

      {/* Input panel */}
      {showInput && (
        <div style={{
          background: '#fff8f8',
          border: '1px solid rgba(239,68,68,0.2)',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          padding: '14px',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 8px' }}>
            Enter New UTR Number
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              maxLength={12}
              value={utr}
              onChange={e => { setUtr(e.target.value.replace(/\D/g, '')); setError(''); }}
              placeholder="12-digit UTR"
              style={{
                flex: 1, padding: '9px 12px',
                border: error ? '1px solid #dc2626' : '1px solid #dbe4ff',
                borderRadius: '8px', fontSize: '14px',
                fontFamily: 'inherit', outline: 'none',
                background: '#fff', color: '#1f2937',
                letterSpacing: '1px', fontWeight: 600,
              }}
              onFocus={e => e.target.style.borderColor = '#2d55a0'}
              onBlur={e => e.target.style.borderColor = error ? '#dc2626' : '#dbe4ff'}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || utr.length !== 12}
              style={{
                background: loading || utr.length !== 12 ? '#94a3b8' : '#2d55a0',
                color: '#fff', border: 'none', borderRadius: '8px',
                padding: '9px 16px', fontSize: '13px', fontWeight: 700,
                cursor: loading || utr.length !== 12 ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'background 0.2s',
              }}
            >
              {loading
                ? <><i className="fas fa-spinner fa-spin" style={{ fontSize: '11px' }} /> Submitting</>
                : <><i className="fas fa-paper-plane" style={{ fontSize: '11px' }} /> Submit</>
              }
            </button>
            <button
              onClick={() => { setShowInput(false); setUtr(''); setPaymentDate(''); setError(''); }}
              disabled={loading}
              style={{
                background: 'none', border: '1px solid #e5eaf3',
                borderRadius: '8px', padding: '9px 12px',
                fontSize: '12px', color: '#64748b',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Cancel
            </button>
          </div>

          {/* Date of Payment */}
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '12px 0 8px' }}>
            Date of Payment
          </p>
          <input
            type="date"
            value={paymentDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => { setPaymentDate(e.target.value); setError(''); }}
            style={{
              width: '100%', padding: '9px 12px',
              border: error && !paymentDate ? '1px solid #dc2626' : '1px solid #dbe4ff',
              borderRadius: '8px', fontSize: '14px',
              fontFamily: 'inherit', outline: 'none',
              background: '#fff', color: '#1f2937',
              fontWeight: 600, cursor: 'pointer',
            }}
            onFocus={e => e.target.style.borderColor = '#2d55a0'}
            onBlur={e => e.target.style.borderColor = '#dbe4ff'}
          />
          {error && (
            <p style={{ fontSize: '11px', color: '#dc2626', margin: '6px 0 0', fontWeight: 600 }}>
              <i className="fas fa-triangle-exclamation" style={{ marginRight: '4px' }} />
              {error}
            </p>
          )}
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '8px 0 0' }}>
            ⚠️ You only get one resubmission. Make sure the UTR is correct before submitting.
          </p>
        </div>
      )}
    </div>
  );
}
/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function PaymentHistory() {
  const { user }              = useAuth();
  const navigate              = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  /* inject CSS */
  useEffect(() => {
    const id = 'ph-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = CSS;
      document.head.appendChild(el);
    }
  }, []);

  /* fetch payments */
  useEffect(() => {
    api.get('/payment/my')
      .then(res => setPayments(res.data))
      .catch(() => setError('Failed to load payment history. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="ph-root"
      style={{
        minHeight: '100vh',
        background: '#eef2f7',
        padding: '40px 16px 64px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ maxWidth: '660px', margin: '0 auto' }}>

        {/* ── Back button ── */}
        <button className="ph-back-btn" onClick={() => navigate('/payment')} style={{ marginBottom: '24px' }}>
          <i className="fas fa-arrow-left" style={{ fontSize: '11px' }} />
          Back to Payment
        </button>

        {/* ── Page header ── */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #1a3a8f, #2d55a0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(45,85,160,0.3)',
            }}>
              <i className="fas fa-clock-rotate-left" style={{ color: '#fff', fontSize: '17px' }} />
            </div>
            <div>
              <h1 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800, fontSize: '28px',
                color: '#1a3a8f', margin: 0, letterSpacing: '0.3px',
              }}>
                Payment History
              </h1>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                {user?.name} · {user?.cometId}
              </p>
            </div>
          </div>
        </div>

        {/* ── Summary strip ── */}
        {!loading && !error && payments.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '24px',
          }}>
            {[
              { label: 'Total Submitted', value: payments.length, icon: 'fa-file-invoice', color: '#2d55a0' },
              { label: 'Verified',        value: payments.filter(p => p.paymentStatus === 'Verified').length,   icon: 'fa-circle-check', color: '#059669' },
              { label: 'Pending',         value: payments.filter(p => p.paymentStatus === 'Pending Verification').length, icon: 'fa-hourglass-half', color: '#b38600' },
            ].map(s => (
              <div key={s.label} style={{
                background: '#fff', borderRadius: '14px',
                border: '1px solid #e5eaf3', padding: '16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                textAlign: 'center',
              }}>
                <i className={`fas ${s.icon}`} style={{ fontSize: '18px', color: s.color, marginBottom: '6px', display: 'block' }} />
                <p style={{ fontSize: '22px', fontWeight: 800, color: '#1a3a8f', margin: '0 0 2px', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {s.value}
                </p>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0, fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Loading skeletons ── */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* ── Error state ── */}
        {error && (
          <div style={{
            background: '#fff', borderRadius: '16px', border: '1px solid #fecaca',
            padding: '32px', textAlign: 'center',
            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
          }}>
            <i className="fas fa-triangle-exclamation" style={{ fontSize: '28px', color: '#dc2626', marginBottom: '12px', display: 'block' }} />
            <p style={{ fontSize: '14px', color: '#dc2626', fontWeight: 600, margin: '0 0 16px' }}>{error}</p>
            <button
              onClick={() => { setError(''); setLoading(true); api.get('/payment/my').then(r => setPayments(r.data)).catch(() => setError('Failed again. Please refresh.')).finally(() => setLoading(false)); }}
              style={{ background: '#2d55a0', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && payments.length === 0 && (
          <div style={{
            background: '#fff', borderRadius: '20px', border: '1px solid #e5eaf3',
            padding: '56px 32px', textAlign: 'center',
            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div className="ph-empty-pulse">
                <i className="fas fa-clock-rotate-left" style={{ fontSize: '28px', color: '#2d55a0' }} />
              </div>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a3a8f', margin: '0 0 8px' }}>
              No Payments Yet
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>
              You haven't submitted any payments yet.<br />
              Complete your payment to see history here.
            </p>
            <button
              onClick={() => navigate('/payment')}
              style={{ background: '#2d55a0', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fas fa-arrow-right" style={{ fontSize: '12px' }} />
              Go to Payment
            </button>
          </div>
        )}

        {/* ── Payment cards ── */}
        {!loading && !error && payments.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {payments.map((p, idx) => (
              <div key={p._id} className="ph-card">

                {/* Card header */}
                <div className="ph-card-header">
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 3px' }}>
                      Payment #{payments.length - idx}
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a3a8f', margin: 0, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.3px' }}>
                      UTR: {p.utrNumber}
                    </p>
                  </div>
                  <StatusBadge status={p.paymentStatus} />
                </div>

                {/* Card body */}
                <div style={{ padding: '16px 22px' }}>

                  {/* Modules */}
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 10px' }}>
                    Modules Selected
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '18px' }}>
                    {p.modules.map((m, i) => (
                      <span key={i} className="ph-module-pill">
                        <i className="fas fa-book-open" style={{ fontSize: '10px', color: '#2d55a0' }} />
                        {m.moduleName}{m.termName ? ` — ${m.termName}` : ''}
                      </span>
                    ))}
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', background: '#f0f4ff', marginBottom: '16px' }} />

                  {/* Footer row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fas fa-calendar-days" style={{ fontSize: '12px', color: '#94a3b8' }} />
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                        
                        {p.paymentDate && (
                        <span><b>Paid on:</b> {new Date(p.paymentDate).toLocaleDateString('en-IN', {
                         day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata'
                                })}</span>   
                              )}
                         <span> </span>

<div>
  <b>{p.resubmitted ? 'Resubmitted:' : 'Submitted:'}</b>{' '}
  {formatDate(p.resubmitted ? p.updatedAt : p.createdAt)}
</div>
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fas fa-indian-rupee-sign" style={{ fontSize: '12px', color: '#2d55a0' }} />
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#1a3a8f', fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {p.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

{/* Rejected — resubmit section */}
{p.paymentStatus === 'Rejected' && (
  <ResubmitBlock payment={p} onSuccess={(updated) => {
    setPayments(prev => prev.map(x => x._id === updated._id ? updated : x));
  }} />
)}

                  {/* Verified note */}
                  {p.paymentStatus === 'Verified' && (
                    <div style={{
                      marginTop: '14px',
                      background: 'rgba(16,185,129,0.06)',
                      border: '1px solid rgba(16,185,129,0.2)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <i className="fas fa-circle-check" style={{ color: '#059669', fontSize: '13px', flexShrink: 0 }} />
                      <p style={{ fontSize: '12px', color: '#059669', margin: 0, fontWeight: 500 }}>
                        Payment verified successfully. You are enrolled in the selected modules.
      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
