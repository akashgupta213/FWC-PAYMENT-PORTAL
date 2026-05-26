import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth }   from '../context/AuthContext';
import { useAssets } from '../context/AssetsContext';

export default function Navbar() {
  const { user, logout }  = useAuth();
  const { assets }        = useAssets();
  const navigate          = useNavigate();
  const [open, setOpen]   = useState(false);
  const ref               = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <nav
      className="sticky top-0 z-50"
      style={{ background: '#0a1628', borderTop: '4px solid #f5c400' }}
    >
      <div
        className="mx-auto px-6"
        style={{
          maxWidth: '1280px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >

        {/* ── Left: Logo — FIXED HEIGHT, no flex-grow ── */}
        <Link
          to={user ? (user.role === 'admin' ? '/admin' : '/payment') : '/login'}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            height: '64px',           /* match navbar height */
            overflow: 'hidden',       /* hard clip */
          }}
          >
          {assets?.logo ? (
            <img
              src={assets.logo.url}
              alt={assets.logo.altText || 'IIITB COMET'}
              style={{
                height: '40px',       /* fixed pixel height */
                width: 'auto',
                maxWidth: '160px',    /* never wider than this */
                objectFit: 'contain',
                display: 'block',
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                background: '#1a56db',
                borderRadius: '6px',
                padding: '4px 8px',
                color: '#fff',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: '13px',
                letterSpacing: '0.5px',
                lineHeight: 1.2,
                textAlign: 'center',
              }}>
                IIITB<br />COMET
              </div>
              <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
                Foundation
              </span>
            </div>
          )}
        </Link>

        {/* ── Center: Branding ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1.25 }}>
          <p style={{
            color: '#2d55a0',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: '18px',
            letterSpacing: '0.5px',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}>
            <i className="fas fa-wifi" style={{ fontSize: '15px' }} />
            Future Wireless Communications Program
          </p>
          <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0 0 0', whiteSpace: 'nowrap' }}>
            Payment Portal — IIITB COMET Foundation
          </p>
        </div>

        {/* ── Right: Profile ── */}
        {user ? (
          <div style={{ flexShrink: 0, position: 'relative' }} ref={ref}>
            <button
              onClick={() => setOpen(o => !o)}
              aria-haspopup="true"
              aria-expanded={open}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.06)',
                border: '0.5px solid rgba(255,255,255,0.14)',
                borderRadius: '40px',
                padding: '5px 14px 5px 5px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a56db, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {initials}
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', margin: 0, lineHeight: 1.3 }}>{user.name}</p>
                <p style={{ fontSize: '10px', color: '#64748b', margin: 0, lineHeight: 1.3 }}>{user.cometId}</p>
              </div>
              <i
                className="fas fa-chevron-down"
                style={{ fontSize: '10px', color: '#64748b', marginLeft: '2px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              />
            </button>

            {/* Dropdown */}
            {open && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '220px',
                background: '#0f1f3d',
                border: '0.5px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                zIndex: 50,
              }}>
                {/* Header */}
                <div style={{ padding: '12px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', margin: '0 0 2px' }}>{user.name}</p>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{user.email}</p>
                  {user.role === 'admin' && (
                    <span style={{
                      display: 'inline-block',
                      marginTop: '6px',
                      background: 'rgba(139,92,246,0.2)',
                      color: '#a78bfa',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '20px',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      border: '0.5px solid rgba(139,92,246,0.3)',
                    }}>
                      Admin
                    </span>
                  )}
                </div>

                {/* Nav items */}
                {user.role === 'admin' && (
                  <button
                    onClick={() => { navigate('/admin'); setOpen(false); }}
                    style={{ width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: '13px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <i className="fas fa-shield-halved" style={{ color: '#3b82f6', width: '16px' }} /> Dashboard
                  </button>
                )}

                  {/* Student — Payment History button */}
                {user.role === 'student' && (
                  <button
                    onClick={() => { navigate('/history'); setOpen(false); }}
                    style={{ width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: '13px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <span style={{
                      width: '28px', height: '28px', borderRadius: '7px',
                      background: 'rgba(45,85,160,0.2)',
                      border: '0.5px solid rgba(45,85,160,0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <i className="fas fa-clock-rotate-left" style={{ color: '#3b82f6', fontSize: '12px' }} />
                    </span>
                    Payment History
                  </button>
                )}
 
                {/* Divider before sign out */}
                <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />



                
                {/* Sign out */}
                <button
                  onClick={handleLogout}
                  style={{ width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: '13px', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'inherit', fontWeight: 600 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <span style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(239,68,68,0.12)', border: '0.5px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="16 17 21 12 16 7" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="21" y1="12" x2="9" y2="12" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/login" style={{ fontSize: '13px', fontWeight: 600, color: '#3b82f6', textDecoration: 'none', padding: '6px 14px', borderRadius: '8px', border: '0.5px solid rgba(59,130,246,0.3)' }}>
              Sign in
            </Link>
            <Link to="/register" style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textDecoration: 'none', background: '#1a56db', padding: '7px 16px', borderRadius: '8px' }}>
              Register
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
}