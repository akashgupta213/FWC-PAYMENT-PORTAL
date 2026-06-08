import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAssets } from '../context/AssetsContext';
import { validateUTR } from '../utils/utrValidator';

const UPI_ID     = '9845943079m@pnb';
const UPI_NAME   = 'IIITB COMET FOUNDATION';
const TIMER_SECS = 5 * 60;

export default function Step5Payment({ form, updateForm, onBack, onSubmit, submitting }) {
  const { assets }                  = useAssets();
  const navigate                    = useNavigate();
  const [timeLeft, setTimeLeft]     = useState(TIMER_SECS);
  const [expired, setExpired]       = useState(false);
  const [utr, setUtr]               = useState(form.utrNumber || '');
  const [paymentDate, setPaymentDate] = useState(form.paymentDate || '');
  const [dateTouched, setDateTouched] = useState(false);
  const [touched, setTouched]       = useState(false);
  const intervalRef                 = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setExpired(true);
          toast.error('QR code expired. Payment session cancelled.');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const mins     = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs     = String(timeLeft % 60).padStart(2, '0');
  const progress = (timeLeft / TIMER_SECS) * 100;

  const timerColor = timeLeft > 120 ? '#16a34a' : timeLeft > 60 ? '#d97706' : '#dc2626';
  const barColor   = timeLeft > 120 ? '#4ade80' : timeLeft > 60 ? '#fbbf24' : '#ef4444';

  const upiLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${form.grandTotal}&cu=INR&tn=COMET Registration`;
  const qrSrc   = assets?.qr_code?.url
    || `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}`;

  const utrError = touched ? validateUTR(utr) : null;
  const utrValid = !validateUTR(utr);
  const dateError = dateTouched && !paymentDate ? 'Date of payment is required' : null;
  const dateValid = !!paymentDate;

// ✅ Fixed — pass UTR directly so submit() doesn't depend on stale state
const handleSubmit = () => {
  setTouched(true);
  setDateTouched(true);
  if (!utrValid || !dateValid) return;
  updateForm({ utrNumber: utr.trim(), paymentDate });
  onSubmit(utr.trim(), paymentDate);
};

  const handleCancel = () => {
    clearInterval(intervalRef.current);
    navigate('/payment');
    window.location.reload();
  };

  const card = {
    background: '#fff',
    borderRadius: '20px',
    padding: '48px 40px 40px',
    width: '100%',
    maxWidth: '540px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
  };

  const page = {
    minHeight: '100vh',
    background: '#eef2f7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  const box = {
    background: '#f0f4ff',
    border: '1px solid #dbe4ff',
    borderRadius: '12px',
    overflow: 'hidden',
  };

  const boxLabel = {
    fontSize: '11px', fontWeight: 700, color: '#1a3a8f',
    letterSpacing: '1px', textTransform: 'uppercase',
    margin: 0, padding: '14px 20px 4px',
  };

  const divider = { height: '1px', background: '#dbe4ff', margin: '0 20px' };



  
  // ── EXPIRED ──
  if (expired) {
    return (
      <div style={page}>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-clock" style={{ fontSize: '26px', color: '#dc2626' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#1a3a8f', margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
              Session Expired
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px' }}>
              Your 5-minute payment window has closed.
            </p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
              No payment has been recorded. Please start again.
            </p>
          </div>
          <button
            onClick={handleCancel}
            style={{ width: '100%', padding: '14px', background: '#2d55a0', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a3a8f'}
            onMouseLeave={e => e.currentTarget.style.background = '#2d55a0'}
          >
            <i className="fas fa-rotate-left" /> Start Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={card}>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#eef2fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-qrcode" style={{ fontSize: '26px', color: '#1a3a8f' }} />
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#1a3a8f', margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
            Complete Your Payment
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Step 5 of 5 — Scan, pay, then enter your UTR
          </p>
        </div>

        {/* Timer box */}
        <div style={{ ...box, marginBottom: '16px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-clock" style={{ fontSize: '14px', color: timerColor }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Session expires in</span>
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: 800, color: timerColor }}>
              {mins}:{secs}
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#dbe4ff', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: barColor, borderRadius: '99px', transition: 'width 1s linear' }} />
          </div>
          {timeLeft <= 60 && (
            <p style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600, margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-triangle-exclamation" /> Less than a minute left — complete quickly!
            </p>
          )}
        </div>

        {/* Amount box */}
        <div style={{ background: '#2d55a0', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#93b4e8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>
              Pay Exactly
            </p>
            <p style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: 0 }}>
              ₹{form.grandTotal.toLocaleString('en-IN')}
            </p>
          </div>
          <i className="fas fa-indian-rupee-sign" style={{ fontSize: '36px', color: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* QR code box */}
        <div style={{ ...box, marginBottom: '16px', padding: '20px' }}>
          <p style={boxLabel}>Scan to Pay</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 8px' }}>
            <div style={{ background: '#fff', border: '2px solid #2d55a0', borderRadius: '14px', padding: '10px', marginBottom: '14px' }}>
              <img src={qrSrc} alt="UPI QR Code" style={{ width: '180px', height: '180px', display: 'block', borderRadius: '8px' }} />
            </div>
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 6px' }}>Scan with GPay, PhonePe, Paytm or any UPI app</p>
            
          </div>
        </div>

        {/* Steps box */}
        <div style={{ ...box, marginBottom: '16px' }}>
          <p style={boxLabel}>How to Pay</p>
          {[
            'Open GPay, PhonePe or any UPI app',
            'Tap Scan QR and scan the code',
            `Enter ₹${form.grandTotal.toLocaleString('en-IN')} if not pre-filled`,
            'Complete the payment',
            'Note your 12-digit UTR number',
          ].map((t, i) => (
            <div key={i}>
              {i > 0 && <div style={divider} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#2d55a0', color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>{t}</p>
              </div>
            </div>
          ))}
        </div>

        {/* UTR input box */}
        <div style={{
          background: utrValid && utr ? '#f0fdf4' : '#f0f4ff',
          border: `1px solid ${utrError ? '#fca5a5' : utrValid && utr ? '#86efac' : '#dbe4ff'}`,
          borderRadius: '12px',
          padding: '18px 20px',
          marginBottom: '16px',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#1a3a8f', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className={`fas fa-receipt`} style={{ color: utrValid && utr ? '#16a34a' : '#2d55a0' }} />
            Enter Your UTR / Transaction ID
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 12px', lineHeight: 1.5 }}>
            Find this in your UPI app under payment history — exactly 12 digits
            (e.g. <code style={{ background: '#fff', border: '1px solid #dbe4ff', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px' }}>407612345678</code>)
          </p>
          <input
            type="text"
            value={utr}
            maxLength={12}
            placeholder="Enter 12-digit UTR"
            onChange={e => { setUtr(e.target.value); setTouched(true); }}
            style={{
              width: '100%',
              border: `2px solid ${utrError ? '#fca5a5' : utrValid && utr ? '#86efac' : '#dbe4ff'}`,
              borderRadius: '10px',
              padding: '12px 16px',
              fontFamily: 'monospace',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '4px',
              color: '#1f2937',
              background: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
          />
          {utrError && (
            <p style={{ fontSize: '12px', color: '#dc2626', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-circle-xmark" /> {utrError}
            </p>
          )}
          {utrValid && utr && (
            <p style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-circle-check" /> Valid UTR — click Confirm Payment below
            </p>
          )}
        </div>

        {/* Date of Payment box */}
        <div style={{
          background: dateValid ? '#f0fdf4' : '#f0f4ff',
          border: `1px solid ${dateError ? '#fca5a5' : dateValid ? '#86efac' : '#dbe4ff'}`,
          borderRadius: '12px',
          padding: '18px 20px',
          marginBottom: '16px',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#1a3a8f', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-calendar-day" style={{ color: dateValid ? '#16a34a' : '#2d55a0' }} />
            Date of Payment
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 12px', lineHeight: 1.5 }}>
            Select the date on which you made the UPI payment
          </p>
          <input
  type="date"
  value={paymentDate}
  max={new Date().toISOString().split('T')[0]}
  onChange={e => { setPaymentDate(e.target.value); setDateTouched(true); }}
  onBlur={() => setDateTouched(true)}
  style={{
    width: '100%',
    border: `2px solid ${dateError ? '#fca5a5' : dateValid ? '#86efac' : '#dbe4ff'}`,
    borderRadius: '10px',
    padding: '12px 16px',
    fontFamily: 'inherit',
    fontSize: '15px',
    fontWeight: 600,
    color: '#1f2937',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
    cursor: 'pointer',
  }}
/>
          {dateError && (
            <p style={{ fontSize: '12px', color: '#dc2626', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-circle-xmark" /> {dateError}
            </p>
          )}
         {dateValid && (
  <p style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
    <i className="fas fa-circle-check" />
    {new Date(paymentDate + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
  </p>
)}
        </div>

        {/* Confirm button */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !utrValid || !dateValid || expired}
          style={{
            width: '100%',
            padding: '14px',
            background: submitting || !utrValid || !dateValid || expired ? '#cbd5e1' : '#16a34a',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 700,
            cursor: submitting || !utrValid || !dateValid || expired ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'inherit',
            marginBottom: '20px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (!submitting && utrValid && dateValid && !expired) e.currentTarget.style.background = '#15803d'; }}
          onMouseLeave={e => { if (!submitting && utrValid && dateValid && !expired) e.currentTarget.style.background = '#16a34a'; }}
        >
          {submitting
            ? <><i className="fas fa-spinner fa-spin" /> Submitting…</>
            : <><i className="fas fa-circle-check" /> Confirm Payment of ₹{form.grandTotal.toLocaleString('en-IN')}</>
          }
        </button>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit', padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = '#4b5563'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
          >
            <i className="fas fa-arrow-left" style={{ fontSize: '11px' }} /> Back
          </button>
          <button
            onClick={handleCancel}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#f87171', fontFamily: 'inherit', padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
            onMouseLeave={e => e.currentTarget.style.color = '#f87171'}
          >
            Cancel payment
          </button>
        </div>

      </div>
    </div>
  );
}
