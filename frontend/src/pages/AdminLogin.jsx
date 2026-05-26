import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// The secret admin code lives only in your .env
// VITE_ADMIN_SECRET=your_secret_code_here
// const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || '';

/* ─────────────────────────────────────────────
   Animated WiFi SVG – drawn arc by arc
───────────────────────────────────────────── */
function WifiIcon() {
  return (
    <svg
      viewBox="0 0 90 60"
      width="80"
      height="54"
      style={{ overflow: 'visible', display: 'block' }}
      aria-hidden="true"
    >
      <circle cx="45" cy="57" r="4.5" fill="#2d55a0" className="cwifi-dot" />
      <path d="M32 45 Q45 33 58 45" stroke="#2d55a0" strokeWidth="4" fill="none" strokeLinecap="round" className="cwifi-arc1" />
      <path d="M20 33 Q45 14 70 33" stroke="#2d55a0" strokeWidth="4" fill="none" strokeLinecap="round" className="cwifi-arc2" />
      <path d="M8 21 Q45 -4 82 21" stroke="#2d55a0" strokeWidth="4" fill="none" strokeLinecap="round" className="cwifi-arc3" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Icon helpers
───────────────────────────────────────────── */
const IconKey = ({ color = '#666' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="15" r="4" stroke={color} strokeWidth="1.8" />
    <path d="M12 11l8-8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 6l2 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 8l2 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconBadge = ({ color = '#666' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="3" stroke={color} strokeWidth="1.8" />
    <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.8" />
    <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconLock = ({ color = '#666' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth="1.8" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconEye = ({ open, color = '#555' }) =>
  open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );

const IconShield = ({ color = '#444' }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconWarning = ({ color = '#a855f7' }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ─────────────────────────────────────────────
   Global CSS injected once
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .cwifi-dot { opacity:0; animation:cwifi-fade 0.35s 1.7s ease forwards; }
  .cwifi-arc1 { opacity:0; stroke-dasharray:300; stroke-dashoffset:300; animation:cwifi-draw 0.45s 2.0s cubic-bezier(.4,0,.2,1) forwards; }
  .cwifi-arc2 { opacity:0; stroke-dasharray:300; stroke-dashoffset:300; animation:cwifi-draw 0.45s 2.35s cubic-bezier(.4,0,.2,1) forwards; }
  .cwifi-arc3 { opacity:0; stroke-dasharray:300; stroke-dashoffset:300; animation:cwifi-draw 0.5s 2.7s cubic-bezier(.4,0,.2,1) forwards; }
  @keyframes cwifi-fade { to { opacity:1; } }
  @keyframes cwifi-draw { to { opacity:1; stroke-dashoffset:0; } }

  .ctag-word { display:block; opacity:0; transform:translateY(32px); }
  .ctag-word-1 { animation:ctag-up 0.65s 0.5s cubic-bezier(.22,1,.36,1) forwards; }
  .ctag-word-2 { animation:ctag-up 0.65s 0.85s cubic-bezier(.22,1,.36,1) forwards; }
  .ctag-word-3 { animation:ctag-up 0.65s 1.2s cubic-bezier(.22,1,.36,1) forwards; }
  @keyframes ctag-up { to { opacity:1; transform:translateY(0); } }

  .cwifi-wrap { opacity:0; transform:translateY(10px); animation:ctag-up 0.65s 0.85s cubic-bezier(.22,1,.36,1) forwards; }
  .csub { opacity:0; animation:cfade 0.9s 1.6s ease forwards; }
  @keyframes cfade { to { opacity:1; } }

  .cpanel { opacity:0; transform:translateX(24px); animation:cpanel-in 0.7s 0.2s cubic-bezier(.22,1,.36,1) forwards; }
  @keyframes cpanel-in { to { opacity:1; transform:translateX(0); } }

  .cfield {
    width:100%; background:#111120; border:1px solid #252540; border-radius:10px;
    color:#e8e8ff; font-size:14px; font-family:'Plus Jakarta Sans',sans-serif;
    transition:border-color 0.2s, box-shadow 0.2s;
  }
  .cfield::placeholder { color:#3a3a5c; }
  .cfield:focus { outline:none; border-color:#a855f7; box-shadow:0 0 0 3px rgba(168,85,247,0.14); background:#12122a; }

  .csubmit { transition:transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s; }
  .csubmit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(168,85,247,0.45); }
  .csubmit:active:not(:disabled) { transform:translateY(0); }

  .ceye { background:none; border:none; cursor:pointer; padding:0; display:flex; align-items:center; justify-content:center; transition:opacity 0.2s; }
  .ceye:hover { opacity:0.8; }

  .creg-link { color:#a855f7; font-weight:600; text-decoration:none; }
  .creg-link:hover { text-decoration:underline; }

  .cadmin-divider { display:flex; align-items:center; gap:10px; }
  .cadmin-divider::before, .cadmin-divider::after { content:''; flex:1; height:1px; background:#1e1e32; }

  .clogin-root *, .clogin-root *::before, .clogin-root *::after { box-sizing:border-box; }
`;

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function AdminLogin() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]       = useState({ cometId: '', password: '', adminCode: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [assets, setAssets] = useState({});
  const [showCode, setShowCode] = useState(false);

  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const rafRef    = useRef(null);

  useEffect(() => {
    const id = 'comet-admin-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = CSS;
      document.head.appendChild(el);
    }
  }, []);

    useEffect(() => {
  const fetchAssets = async () => {
    try {
      const res = await api.get('/assets');
      setAssets(res.data);
    } catch (err) {
      console.error('Failed to load assets');
    }
  };
  fetchAssets();
}, []);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();

    // Client-side secret code check — first line of defence
    // if (form.adminCode !== ADMIN_SECRET) {
    //   toast.error('Invalid admin access code.');
    //   return;
    // }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
      cometId: form.cometId,
      password: form.password,
      adminCode: form.adminCode
      });

      if (data.user.role !== 'admin') {
        toast.error('This account does not have admin privileges.');
        return;
      }

      login(data);
      toast.success(`Admin portal — welcome, ${data.user.name}`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  /* ── canvas particle network ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let W = 0, H = 0;

    const init = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      particles = Array.from({ length: 72 }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r:  Math.random() * 1.8 + 1.2,
      }));
    };

    init();
    const ro = new ResizeObserver(init);
    ro.observe(canvas.parentElement);

    const MAX  = 135;
    const MMAX = 175;

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const m = mouseRef.current;

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < MAX) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(168,85,247,${0.13 * (1 - d / MAX)})`;
            ctx.lineWidth   = 0.75;
            ctx.stroke();
          }
        }
        const mdx = particles[i].x - m.x;
        const mdy = particles[i].y - m.y;
        const md  = Math.hypot(mdx, mdy);
        if (md < MMAX) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = `rgba(168,85,247,${0.45 * (1 - md / MMAX)})`;
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      }

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168,85,247,0.48)';
        ctx.fill();
      });

      if (m.x > 0) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168,85,247,0.6)';
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  const handleMouseMove = useCallback(e => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, []);

  return (
    <div
      className="clogin-root"
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* ══════════════════════════════
          LEFT PANEL  –  hero / branding
      ══════════════════════════════ */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          width: '50%',
          minWidth: 380,
          background: '#f7f7ff',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Particle network canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '36px 48px 32px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: '100vh',
          }}
        >
          {/* Logo */}
         <div>
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      minHeight: 60
    }}
  >
    {assets.logo ? (
      <img
        src={assets.logo.url}
        alt={assets.logo.altText}
        style={{
          height: 52,
          width: 'auto',
          display: 'block',
          objectFit: 'contain'
        }}
      />
    ) : (
      <div
        style={{
          color: '#2d55a0',
          fontWeight: 700
        }}
      >
        Loading logo...
      </div>
    )}
  </div>
</div>

          {/* Tagline */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 50 }}>
            <div style={{ overflow: 'hidden', lineHeight: 1 }}>
              <span className="ctag-word ctag-word-1" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 'clamp(58px, 5.8vw, 86px)', color: '#2d55a0', letterSpacing: '-0.5px', lineHeight: 1.05 }}>
                Future.
              </span>
            </div>
            <div style={{ overflow: 'hidden', lineHeight: 1, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <span className="ctag-word ctag-word-2" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 'clamp(58px, 5.8vw, 86px)', color: '#2d55a0', letterSpacing: '-0.5px', lineHeight: 1.05 }}>
                Wireless.
              </span>
              <span className="cwifi-wrap" style={{ marginBottom: 'clamp(6px,0.8vw,12px)' }}>
                <WifiIcon />
              </span>
            </div>
            <div style={{ overflow: 'hidden', lineHeight: 1 }}>
              <span className="ctag-word ctag-word-3" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 'clamp(58px, 5.8vw, 86px)', color: '#2d55a0', letterSpacing: '-0.5px', lineHeight: 1.05 }}>
                Communication.
              </span>
            </div>
            <div style={{ marginTop: 26 }}>
              <p className="csub" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 3.5, textTransform: 'uppercase', color: '#888' }}>
                Connecting Today. Empowering Tomorrow.
              </p>
              <div className="csub" style={{ marginTop: 14, width: 52, height: 3, background: 'linear-gradient(90deg,#7c3aed,#a855f7)', borderRadius: 2 }} />
            </div>
          </div>

          <p style={{ fontSize: 11, color: '#bbb', letterSpacing: 0.3 }}>
            © 2025 IIITB COMET Foundation. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════
          RIGHT PANEL  –  admin login form
      ══════════════════════════════ */}
      <div
        className="cpanel"
        style={{
          width: '50%',
          background: '#08080f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 48px',
          minHeight: '100vh',
        }}
      >
        <div style={{ width: '100%', maxWidth: 440 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 58, height: 58, borderRadius: '50%', background: 'rgba(168,85,247,0.1)', border: '1.5px solid rgba(168,85,247,0.25)', marginBottom: 18 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 34, color: '#fff', letterSpacing: 0.3, marginBottom: 6 }}>
              Admin Portal
            </h1>
            <p style={{ fontSize: 13, color: '#555', letterSpacing: 0.2 }}>
              Restricted access — authorised personnel only
            </p>
          </div>

          {/* Security notice */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.18)', borderRadius: 10, padding: '10px 14px', marginBottom: 26 }}>
            <IconWarning />
            <p style={{ fontSize: 12, color: '#9b6bc4', lineHeight: 1.6 }}>
              This page is not linked from the student portal.{' '}
              <span style={{ fontWeight: 700, color: '#c084fc' }}>All login attempts are logged.</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Admin Access Code */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#aaa', marginBottom: 8, letterSpacing: 0.2 }}>
                Admin Access Code <span style={{ color: '#ff4d4d' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                  <IconKey color="#6b3a8a" />
                </span>
                <input
                  name="adminCode"
                  type={showCode ? 'text' : 'password'}
                  value={form.adminCode}
                  onChange={handle}
                  required
                  autoComplete="off"
                  placeholder="Secret access code"
                  className="cfield"
                  style={{ padding: '13px 44px 13px 42px', borderColor: '#2a1a3a' }}
                />
                <button type="button" className="ceye" onClick={() => setShowCode(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}
                  aria-label={showCode ? 'Hide code' : 'Show code'}>
                  <IconEye open={showCode} color="#6b3a8a" />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="cadmin-divider" style={{ fontSize: 11, color: '#2a2a40', letterSpacing: 1, textTransform: 'uppercase' }}>
              credentials
            </div>

            {/* COMET ID */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#aaa', marginBottom: 8, letterSpacing: 0.2 }}>
                ADMIN ID <span style={{ color: '#ff4d4d' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                  <IconBadge color="#3a3a5c" />
                </span>
                <input
                  name="cometId"
                  value={form.cometId}
                  onChange={handle}
                  required
                  autoComplete="username"
                  placeholder="Admin COMET ID"
                  className="cfield"
                  style={{ padding: '13px 14px 13px 42px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#aaa', marginBottom: 8, letterSpacing: 0.2 }}>
                Password <span style={{ color: '#ff4d4d' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                  <IconLock color="#3a3a5c" />
                </span>
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handle}
                  required
                  autoComplete="current-password"
                  placeholder="Admin password"
                  className="cfield"
                  style={{ padding: '13px 44px 13px 42px' }}
                />
                <button type="button" className="ceye" onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}>
                  <IconEye open={showPass} color="#3a3a5c" />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="csubmit"
              style={{
                marginTop: 4,
                width: '100%',
                padding: '14px',
                background: loading
                  ? '#252548'
                  : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                border: 'none',
                borderRadius: 10,
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 0.5,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.65 : 1,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Verifying…
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <IconShield color="#fff" />
                  Access Admin Portal
                </span>
              )}
            </button>
          </form>

          {/* Student link */}
          <p style={{ textAlign: 'center', fontSize: 13, color: '#444', marginTop: 22 }}>
            Student?{' '}
            <Link to="/login" className="creg-link">
              Go to student login
            </Link>
          </p>

          {/* Footer */}
          <div style={{ marginTop: 52, textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#2a2a40', marginBottom: 8 }}>
              © 2025 IIITB COMET Foundation. All Rights Reserved.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#2a2a40' }}>
              <IconShield color="#2a2a40" />
              Secure. Verified. Future-Ready.
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}