import { useLocation, useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { generateInvoicePDF } from '../utils/generateInvoice';

export default function Confirmation() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const payment    = state?.payment;
  const form       = state?.form;
  const user       = state?.user;

  if (!payment) { navigate('/payment'); return null; }

  const invoiceData = {
    name: user?.name, cometId: user?.cometId,
    email: user?.email, contact: user?.contact,
    modules: form?.modules || [],
    grandTotal: form?.grandTotal,
    utrNumber: payment?.utrNumber,
    paymentDate: form?.paymentDate,   // ← ADD THIS LINE
  };

  // ── styles ────────────────────────────────────────────────────────────────
  const page = {
    minHeight: '100vh',
    background: '#eef2f7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '40px 16px 64px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  const card = {
    background: '#fff',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '540px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
    overflow: 'hidden',
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

  const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' };

  return (
    <PageShell>
      <div style={page}>
        <div style={{ width: '100%', maxWidth: '540px' }}>

          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="fas fa-check" style={{ fontSize: '26px', color: '#16a34a' }} />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1a3a8f', margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
              Payment Submitted!
            </h1>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
              Your UTR has been recorded. Our team will verify.
            </p>
          </div>

          {/* ── Receipt card ──────────────────────────────────────────────── */}
          <div style={{ ...card, marginBottom: '16px' }}>

            {/* Green status header */}
            <div style={{ background: '#16a34a', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>
                  UTR Recorded
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '6px 14px' }}>
                <code style={{ fontSize: '12px', fontWeight: 700, color: '#fff', fontFamily: 'monospace', letterSpacing: '1px' }}>
                  {payment.utrNumber}
                </code>
              </div>
            </div>

               {/* Payment date badge */}
            {form?.paymentDate && (
              <div style={{ background: '#f0fdf4', borderBottom: '1px solid #dbe4ff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fas fa-calendar-day" style={{ color: '#16a34a' }} /> Date of Payment
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>
                  {new Date(form.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}

            
            {/* User details */}
            <div style={{ ...box, borderRadius: 0, border: 'none', borderBottom: '1px solid #dbe4ff' }}>
              {[
                ['Name',     user?.name],
                ['COMET ID', user?.cometId],
                ['Email',    user?.email],
              ].map(([k, v], i, arr) => (
                <div key={k}>
                  <div style={row}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{k}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>{v}</span>
                  </div>
                  {i < arr.length - 1 && <div style={divider} />}
                </div>
              ))}
            </div>

            {/* Modules */}
            <div style={{ background: '#f0f4ff', padding: '0 0 8px' }}>
              <p style={boxLabel}>Modules Enrolled</p>
              <div style={{ padding: '8px 0 0' }}>
                {form?.modules?.map((m, i, arr) => (
                  <div key={i}>
                    <div style={row}>
                      <span style={{ fontSize: '13px', color: '#374151' }}>
                        {m.moduleName}{m.termName ? ` — ${m.termName}` : ''}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1f2937' }}>
                        ₹{m.fee.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {i < arr.length - 1 && <div style={divider} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Grand total */}
            <div style={{ borderTop: '1px solid #dbe4ff', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>Grand Total</span>
              <span style={{ fontSize: '26px', fontWeight: 800, color: '#16a34a' }}>
                ₹{form?.grandTotal?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* ── Download button ───────────────────────────────────────────── */}
          <button
            onClick={() => generateInvoicePDF(invoiceData)}
            style={{
              width: '100%',
              padding: '14px',
              background: '#2d55a0',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '16px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a3a8f'}
            onMouseLeave={e => e.currentTarget.style.background = '#2d55a0'}
          >
            <i className="fas fa-file-invoice" /> Download Invoice PDF
          </button>

          {/* ── Footer note ───────────────────────────────────────────────── */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', margin: 0 }}>
            For queries contact{' '}
            <a href="mailto:fwc@iiitb.ac.in" style={{ color: '#2d55a0', fontWeight: 600, textDecoration: 'none' }}>
              fwc@iiitb.ac.in
            </a>
          </p>

        </div>
      </div>
    </PageShell>
  );
}
