export default function Step4Summary({ form, user, onNext, onBack }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#eef2f7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '48px 40px 40px',
        width: '100%',
        maxWidth: '540px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
      }}>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: '#eef2fb', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fas fa-file-lines" style={{ fontSize: '26px', color: '#1a3a8f' }} />
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#1a3a8f', margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
            Review Your Details
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Step 4 of 5 — Confirm before payment
          </p>
        </div>

        {/* Student info box */}
        <div style={{
          background: '#f0f4ff',
          border: '1px solid #dbe4ff',
          borderRadius: '12px',
          marginBottom: '16px',
          overflow: 'hidden',
        }}>
          <p style={{
            fontSize: '11px', fontWeight: 700, color: '#1a3a8f',
            letterSpacing: '1px', textTransform: 'uppercase',
            margin: 0, padding: '14px 20px 4px',
          }}>
            Student Information
          </p>

          {[
            ['Name',    user?.name],
            ['COMET ID', user?.cometId],
            ['Email',   user?.email],
            ['Contact', user?.contact || user?.phone || user?.mobile || '—'],
          ].map(([k, v], i) => (
            <div key={k}>
              {i > 0 && <div style={{ height: '1px', background: '#dbe4ff', margin: '0 20px' }} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>{k}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>{v || '—'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modules box */}
        <div style={{
          background: '#f0f4ff',
          border: '1px solid #dbe4ff',
          borderRadius: '12px',
          marginBottom: '20px',
          overflow: 'hidden',
        }}>
          <p style={{
            fontSize: '11px', fontWeight: 700, color: '#1a3a8f',
            letterSpacing: '1px', textTransform: 'uppercase',
            margin: 0, padding: '14px 20px 4px',
          }}>
            Selected Modules
          </p>

          {form.modules.map((m, i) => (
            <div key={i}>
              {i > 0 && <div style={{ height: '1px', background: '#dbe4ff', margin: '0 20px' }} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', margin: '0 0 2px' }}>
                    {m.moduleName}
                  </p>
                  {m.termName && (
                    <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>{m.termName}</p>
                  )}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#2d55a0', flexShrink: 0 }}>
                  ₹{m.fee.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Grand total bar */}
        <div style={{
          background: '#2d55a0',
          borderRadius: '12px',
          padding: '18px 20px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#93b4e8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>
              Grand Total
            </p>
            <p style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: 0 }}>
              ₹{form.grandTotal.toLocaleString('en-IN')}
            </p>
          </div>
          <i className="fas fa-shield-check" style={{ fontSize: '40px', color: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, color: '#9ca3af',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: 'inherit', padding: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#4b5563'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
          >
            <i className="fas fa-arrow-left" style={{ fontSize: '11px' }} /> Back
          </button>

          <button
            onClick={onNext}
            style={{
              background: '#2d55a0', border: 'none', borderRadius: '10px',
              color: '#fff', fontSize: '15px', fontWeight: 700,
              padding: '13px 28px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: 'inherit', letterSpacing: '0.3px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a3a8f'}
            onMouseLeave={e => e.currentTarget.style.background = '#2d55a0'}
          >
            Proceed to Payment <i className="fas fa-arrow-right" style={{ fontSize: '13px' }} />
          </button>
        </div>

      </div>
    </div>
  );
}