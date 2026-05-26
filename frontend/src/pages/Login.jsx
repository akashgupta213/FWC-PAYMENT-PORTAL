import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
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
   Icon helpers (inline SVG, no deps)
───────────────────────────────────────────── */
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

const IconInfo = ({ color = '#f59e0b' }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path d="M12 8v4M12 16h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ─────────────────────────────────────────────
   Global CSS injected once
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .cwifi-dot { opacity: 0; animation: cwifi-fade 0.35s 1.7s ease forwards; }
  .cwifi-arc1 { opacity: 0; stroke-dasharray: 300; stroke-dashoffset: 300; animation: cwifi-draw 0.45s 2.0s cubic-bezier(.4,0,.2,1) forwards; }
  .cwifi-arc2 { opacity: 0; stroke-dasharray: 300; stroke-dashoffset: 300; animation: cwifi-draw 0.45s 2.35s cubic-bezier(.4,0,.2,1) forwards; }
  .cwifi-arc3 { opacity: 0; stroke-dasharray: 300; stroke-dashoffset: 300; animation: cwifi-draw 0.5s 2.7s cubic-bezier(.4,0,.2,1) forwards; }
  @keyframes cwifi-fade { to { opacity: 1; } }
  @keyframes cwifi-draw { to { opacity: 1; stroke-dashoffset: 0; } }

  .ctag-word { display: block; opacity: 0; transform: translateY(32px); }
  .ctag-word-1 { animation: ctag-up 0.65s 0.5s cubic-bezier(.22,1,.36,1) forwards; }
  .ctag-word-2 { animation: ctag-up 0.65s 0.85s cubic-bezier(.22,1,.36,1) forwards; }
  .ctag-word-3 { animation: ctag-up 0.65s 1.2s cubic-bezier(.22,1,.36,1) forwards; }
  @keyframes ctag-up { to { opacity: 1; transform: translateY(0); } }

  .cwifi-wrap { opacity: 0; transform: translateY(10px); animation: ctag-up 0.65s 0.85s cubic-bezier(.22,1,.36,1) forwards; }

  .csub { opacity: 0; animation: cfade 0.9s 1.6s ease forwards; }
  @keyframes cfade { to { opacity: 1; } }

  .cpanel { opacity: 0; transform: translateX(24px); animation: cpanel-in 0.7s 0.2s cubic-bezier(.22,1,.36,1) forwards; }
  @keyframes cpanel-in { to { opacity: 1; transform: translateX(0); } }

  .cfield {
    width: 100%;
    background: #111120;
    border: 1px solid #252540;
    border-radius: 10px;
    color: #e8e8ff;
    font-size: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .cfield::placeholder { color: #3a3a5c; }
  .cfield:focus {
    outline: none;
    border-color: #3b3bff;
    box-shadow: 0 0 0 3px rgba(59,59,255,0.14);
    background: #12122a;
  }

  .csubmit { transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s; }
  .csubmit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(59,59,255,0.45); }
  .csubmit:active:not(:disabled) { transform: translateY(0); }

  .ceye { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s; }
  .ceye:hover { opacity: 0.8; }

  .cadmin-link { color: #f59e0b; font-weight: 700; text-decoration: underline; }
  .cadmin-link:hover { color: #fcd34d; }

  .creg-link { color: #5b5bff; font-weight: 600; text-decoration: none; }
  .creg-link:hover { text-decoration: underline; }

  .clogin-root *, .clogin-root *::before, .clogin-root *::after { box-sizing: border-box; }
`;

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]     = useState({ cometId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [assets, setAssets] = useState({});
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const rafRef    = useRef(null);

  /* ── inject CSS once ── */
  useEffect(() => {
    const id = 'comet-login-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = CSS;
      document.head.appendChild(el);
    }
  }, []);

  //for logo
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


  /* ── form handlers ── */
  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/payment');
    } catch (err) {
      toast.error("Invalid COMET ID or password.");
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
            ctx.strokeStyle = `rgba(26,26,219,${0.13 * (1 - d / MAX)})`;
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
          ctx.strokeStyle = `rgba(80,80,255,${0.45 * (1 - md / MMAX)})`;
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      }

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(30,30,210,0.48)';
        ctx.fill();
      });

      if (m.x > 0) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(80,80,255,0.6)';
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
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
          LEFT PANEL  –  hero / branding   ← FIXED: 50% not 46%
      ══════════════════════════════ */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          width: '50%',           /* ← was 46% */
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

        {/* Left panel content */}
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
          {/* ─── Logo ─── */}
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
            {/* Fallback text logo */}
            <div style={{ display: 'none', alignItems: 'center', gap: 10 }}>
              <div style={{ background: 'linear-gradient(135deg,#2d55a0,#4040ff)', borderRadius: 8, padding: '6px 10px', color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 14, letterSpacing: 1, lineHeight: 1.15 }}>
                IIITB<br />COMET
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, color: '#2d55a0', letterSpacing: 2, textTransform: 'uppercase', lineHeight: 1.45 }}>
                FUTURE WIRELESS<br />COMMUNICATIONS
              </div>
            </div>
          </div>

          {/* ─── Tagline block ─── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 50 }}>
            <div style={{ overflow: 'hidden', lineHeight: 1 }}>
              <span className="ctag-word ctag-word-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(58px, 5.8vw, 86px)', color: '#2d55a0', letterSpacing: '-0.5px', lineHeight: 1.05 }}>
                Future.
              </span>
            </div>

            <div style={{ overflow: 'hidden', lineHeight: 1, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <span className="ctag-word ctag-word-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(58px, 5.8vw, 86px)', color: '#2d55a0', letterSpacing: '-0.5px', lineHeight: 1.05 }}>
                Wireless.
              </span>
              <span className="cwifi-wrap" style={{ marginBottom: 'clamp(6px, 0.8vw, 12px)' }}>
                <WifiIcon />
              </span>
            </div>

            <div style={{ overflow: 'hidden', lineHeight: 1 }}>
              <span className="ctag-word ctag-word-3" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(58px, 5.8vw, 86px)', color: '#2d55a0', letterSpacing: '-0.5px', lineHeight: 1.05 }}>
                Communication.
              </span>
            </div>

            <div style={{ marginTop: 26 }}>
              <p className="csub" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 3.5, textTransform: 'uppercase', color: '#888' }}>
                Connecting Today. Empowering Tomorrow.
              </p>
              <div className="csub" style={{ marginTop: 14, width: 52, height: 3, background: 'linear-gradient(90deg,#2d55a0,#5555ff)', borderRadius: 2 }} />
            </div>
          </div>

          {/* Footer */}
          <p style={{ fontSize: 11, color: '#bbb', letterSpacing: 0.3 }}>
            © 2025 IIITB COMET Foundation. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════
          RIGHT PANEL  –  login form    ← FIXED: width 50% not flex:1
      ══════════════════════════════ */}
      <div
        className="cpanel"
        style={{
          width: '50%',           /* ← was flex: 1 */
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

          {/* ─── Header ─── */}
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 58, height: 58, borderRadius: '50%', background: 'rgba(59,59,255,0.1)', border: '1.5px solid rgba(59,59,255,0.25)', marginBottom: 18 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="7" r="4" stroke="#5b5bff" strokeWidth="2" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" stroke="#5b5bff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 34, color: '#fff', letterSpacing: 0.3, marginBottom: 6 }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: 13, color: '#555', letterSpacing: 0.2 }}>
              IIITB COMET Foundation - Future Wireless Communications Program
            </p>
          </div>

          {/* ─── Admin notice ─── */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: 10, padding: '10px 14px', marginBottom: 26 }}>
            <IconInfo />
            <p style={{ fontSize: 12, color: '#b8882a', lineHeight: 1.6 }}>
              Are you an admin?{' '}
              <Link to="/admin-login" className="cadmin-link">
                Use the admin portal →
              </Link>
            </p>
          </div>

          {/* ─── Form ─── */}
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* COMET ID */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#aaa', marginBottom: 8, letterSpacing: 0.2 }}>
                COMET ID <span style={{ color: '#ff4d4d' }}>*</span>
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
                  placeholder="Your COMET ID"
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
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={handle}
                  required
                  autoComplete="current-password"
                  placeholder="Your password"
                  className="cfield"
                  style={{ padding: '13px 44px 13px 42px' }}
                />
                <button
                  type="button"
                  className="ceye"
                  onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  <IconEye open={showPw} color="#3a3a5c" />
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
                background: loading ? '#252548' : 'linear-gradient(135deg, #2b2bde 0%, #5454ff 100%)',
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
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* ─── Register link ─── */}
          <p style={{ textAlign: 'center', fontSize: 13, color: '#444', marginTop: 22 }}>
            New student?{' '}
            <Link to="/register" className="creg-link">
              Create an account
            </Link>
          </p>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#444', marginTop: 22 }}>
             Admin Register - {' '}
            <Link to="/admin/register" className="creg-link">
              Create an account
            </Link>
          </p>

          {/* ─── Bottom footer ─── */}
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