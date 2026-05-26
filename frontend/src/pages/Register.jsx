import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

/* ─────────────────────────────────────────────
   Animated WiFi SVG
───────────────────────────────────────────── */
function WifiIcon() {
  return (
    <svg viewBox="0 0 90 60" width="80" height="54" style={{ overflow: 'visible', display: 'block' }} aria-hidden="true">
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
const IconUser = ({ color = '#3a3a5c' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.8" />
    <path d="M4 21v-2a8 8 0 0 1 16 0v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconBadge = ({ color = '#3a3a5c' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="3" stroke={color} strokeWidth="1.8" />
    <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.8" />
    <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconMail = ({ color = '#3a3a5c' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.8" />
    <path d="M2 7l10 7 10-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconPhone = ({ color = '#3a3a5c' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.15 12a19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 2.06 1.18h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L6.09 8.91a16 16 0 0 0 6 6l1.09-1.09a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7a2 2 0 0 1 1.72 2.03z" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconLock = ({ color = '#3a3a5c' }) => (
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

  .cpanel-reg { opacity:0; transform:translateX(24px); animation:cpanel-in 0.7s 0.2s cubic-bezier(.22,1,.36,1) forwards; }
  @keyframes cpanel-in { to { opacity:1; transform:translateX(0); } }

  .cfield {
    width:100%; background:#111120; border:1px solid #252540; border-radius:10px;
    color:#e8e8ff; font-size:14px; font-family:'Plus Jakarta Sans',sans-serif;
    transition:border-color 0.2s, box-shadow 0.2s;
  }
  .cfield::placeholder { color:#3a3a5c; }
  .cfield:focus { outline:none; border-color:#3b3bff; box-shadow:0 0 0 3px rgba(59,59,255,0.14); background:#12122a; }

  .csubmit { transition:transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s; }
  .csubmit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(59,59,255,0.45); }
  .csubmit:active:not(:disabled) { transform:translateY(0); }

  .ceye { background:none; border:none; cursor:pointer; padding:0; display:flex; align-items:center; justify-content:center; transition:opacity 0.2s; }
  .ceye:hover { opacity:0.8; }

  .creg-link-blue { color:#5b5bff; font-weight:600; text-decoration:none; }
  .creg-link-blue:hover { text-decoration:underline; }

  .cfield-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  @media (max-width: 600px) { .cfield-grid { grid-template-columns:1fr; } }

  .clogin-root *, .clogin-root *::before, .clogin-root *::after { box-sizing:border-box; }
`;

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function Register() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]       = useState({ name: '', cometId: '', email: '', contact: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [assets, setAssets] = useState({});
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const rafRef    = useRef(null);

  useEffect(() => {
    const id = 'comet-register-styles';
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
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (!/^[0-9]{10}$/.test(form.contact)) return toast.error('Contact must be 10 digits');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');

      // ── New: COMET ID must start with "COMETFWC" ──────────────────
      if (!form.cometId.startsWith('COMETFWC'))
      return toast.error('COMET ID must start with "COMETFWC"');

      // ── New: Email must end with ".fwc@iiitb.ac.in" ───────────────
    if (!form.email.endsWith('.fwc@iiitb.ac.in') && !form.email.endsWith('@outlook.com') && !form.email.endsWith('@iiitb.ac.in'))
    return toast.error('Enter Your IIITB Mail ID');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name, cometId: form.cometId,
        email: form.email, contact: form.contact, password: form.password,
      });
      login(data);
      toast.success('Account created! Welcome to COMET FWC.');
      navigate('/payment');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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

    const MAX = 135, MMAX = 175;

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
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        />

        <div style={{ position: 'relative', zIndex: 1, padding: '36px 48px 32px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh' }}>
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
              <span className="ctag-word ctag-word-1" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 'clamp(58px,5.8vw,86px)', color: '#2d55a0', letterSpacing: '-0.5px', lineHeight: 1.05 }}>
                Future.
              </span>
            </div>
            <div style={{ overflow: 'hidden', lineHeight: 1, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <span className="ctag-word ctag-word-2" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 'clamp(58px,5.8vw,86px)', color: '#2d55a0', letterSpacing: '-0.5px', lineHeight: 1.05 }}>
                Wireless.
              </span>
              <span className="cwifi-wrap" style={{ marginBottom: 'clamp(6px,0.8vw,12px)' }}>
                <WifiIcon />
              </span>
            </div>
            <div style={{ overflow: 'hidden', lineHeight: 1 }}>
              <span className="ctag-word ctag-word-3" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 'clamp(58px,5.8vw,86px)', color: '#2d55a0', letterSpacing: '-0.5px', lineHeight: 1.05 }}>
                Communication.
              </span>
            </div>
            <div style={{ marginTop: 26 }}>
              <p className="csub" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 3.5, textTransform: 'uppercase', color: '#888' }}>
                Connecting Today. Empowering Tomorrow.
              </p>
              <div className="csub" style={{ marginTop: 14, width: 52, height: 3, background: 'linear-gradient(90deg,#2d55a0,#5555ff)', borderRadius: 2 }} />
            </div>
          </div>

          <p style={{ fontSize: 11, color: '#bbb', letterSpacing: 0.3 }}>
            © 2025 IIITB COMET Foundation. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════
          RIGHT PANEL  –  register form
      ══════════════════════════════ */}
      <div
        className="cpanel-reg"
        style={{
          width: '50%',
          background: '#08080f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 48px',
          minHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: 440, paddingTop: 24, paddingBottom: 24 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 58, height: 58, borderRadius: '50%', background: 'rgba(59,59,255,0.1)', border: '1.5px solid rgba(59,59,255,0.25)', marginBottom: 18 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#5b5bff" strokeWidth="2" strokeLinecap="round" />
                <circle cx="9" cy="7" r="4" stroke="#5b5bff" strokeWidth="2" />
                <line x1="19" y1="8" x2="19" y2="14" stroke="#5b5bff" strokeWidth="2" strokeLinecap="round" />
                <line x1="22" y1="11" x2="16" y2="11" stroke="#5b5bff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 34, color: '#fff', letterSpacing: 0.3, marginBottom: 6 }}>
              Create Account
            </h1>
            <p style={{ fontSize: 13, color: '#555', letterSpacing: 0.2 }}>
              IIITB COMET Foundation — Future Wireless Communications Program
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Name + COMET ID */}
            <div className="cfield-grid">
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#aaa', marginBottom: 8, letterSpacing: 0.2 }}>
                  Full Name <span style={{ color: '#ff4d4d' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                    <IconUser />
                  </span>
                  <input name="name" value={form.name} onChange={handle} required autoComplete="name" placeholder="Rajesh Kumar" className="cfield" style={{ padding: '13px 14px 13px 42px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#aaa', marginBottom: 8, letterSpacing: 0.2 }}>
                  COMET ID <span style={{ color: '#ff4d4d' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                    <IconBadge />
                  </span>
                  <input name="cometId" value={form.cometId} onChange={handle} required placeholder="COMETFWCID" className="cfield" style={{ padding: '13px 14px 13px 42px' }} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#aaa', marginBottom: 8, letterSpacing: 0.2 }}>
                Email Address <span style={{ color: '#ff4d4d' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                  <IconMail />
                </span>
                <input name="email" type="email" value={form.email} onChange={handle} required autoComplete="email" placeholder="you@example.com" className="cfield" style={{ padding: '13px 14px 13px 42px' }} />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#aaa', marginBottom: 8, letterSpacing: 0.2 }}>
                Contact Number <span style={{ color: '#ff4d4d' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                  <IconPhone />
                </span>
                <input name="contact" type="tel" value={form.contact} onChange={handle} required autoComplete="tel" placeholder="10-digit mobile number" className="cfield" style={{ padding: '13px 14px 13px 42px' }} />
              </div>
            </div>

            {/* Password + Confirm */}
            <div className="cfield-grid">
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#aaa', marginBottom: 8, letterSpacing: 0.2 }}>
                  Password <span style={{ color: '#ff4d4d' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                    <IconLock />
                  </span>
                  <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handle} required autoComplete="new-password" placeholder="Min. 6 chars" className="cfield" style={{ padding: '13px 44px 13px 42px' }} />
                  <button type="button" className="ceye" onClick={() => setShowPass(v => !v)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}
                    aria-label={showPass ? 'Hide password' : 'Show password'}>
                    <IconEye open={showPass} color="#3a3a5c" />
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#aaa', marginBottom: 8, letterSpacing: 0.2 }}>
                  Confirm <span style={{ color: '#ff4d4d' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                    <IconLock />
                  </span>
                  <input name="confirm" type="password" value={form.confirm} onChange={handle} required autoComplete="new-password" placeholder="Repeat password" className="cfield" style={{ padding: '13px 14px 13px 42px' }} />
                </div>
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
                  : 'linear-gradient(135deg, #2b2bde 0%, #5454ff 100%)',
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
                  Creating account…
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p style={{ textAlign: 'center', fontSize: 13, color: '#444', marginTop: 22 }}>
            Already have an account?{' '}
            <Link to="/login" className="creg-link-blue">
              Sign in
            </Link>
          </p>

          {/* Footer */}
          <div style={{ marginTop: 40, textAlign: 'center' }}>
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