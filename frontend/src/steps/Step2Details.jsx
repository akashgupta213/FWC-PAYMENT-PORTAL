export default function Step2Details({ user, onNext, onBack }) {
  const fields = [
    { label: 'Full Name',      value: user?.name,    icon: 'fa-user'     },
    { label: 'COMET ID',       value: user?.cometId, icon: 'fa-id-badge' },
    { label: 'Email Address',  value: user?.email,   icon: 'fa-envelope' },
    // ✅ fixed
{ label: 'Contact Number', value: user?.contacts || user?.contact || user?.phone || user?.mobile || '—', icon: 'fa-phone' },
  ];

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#eef2f7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '48px 40px 40px',
          width: '100%',
          maxWidth: '540px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        }}
      >
        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: '#eef2fb', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fas fa-user-circle" style={{ fontSize: '28px', color: '#1a3a8f' }} />
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#1a3a8f', margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
            Confirm Your Details
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Step 2 of 5 — Review before proceeding
          </p>
        </div>

        {/* Profile card */}
        <div style={{
          background: '#f0f4ff',
          border: '1px solid #dbe4ff',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: '#2d55a0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '18px', fontWeight: 700, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a3a8f', margin: '0 0 2px' }}>
              {user?.name || '—'}
            </p>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 6px' }}>
              {user?.email || '—'}
            </p>
            <span style={{
              display: 'inline-block',
              background: '#2d55a0', color: '#fff',
              fontSize: '10px', fontWeight: 700,
              padding: '2px 10px', borderRadius: '20px',
              letterSpacing: '0.8px', textTransform: 'uppercase',
            }}>
              Student
            </span>
          </div>
        </div>

        {/* Fields box */}
        <div style={{
          background: '#f0f4ff',
          border: '1px solid #dbe4ff',
          borderRadius: '12px',
          marginBottom: '24px',
          overflow: 'hidden',
        }}>
          <p style={{
            fontSize: '11px', fontWeight: 700, color: '#1a3a8f',
            letterSpacing: '1px', textTransform: 'uppercase',
            margin: 0, padding: '16px 20px 4px',
          }}>
            Your Information
          </p>

          {fields.map((f, i) => (
            <div key={f.label}>
              {i > 0 && <div style={{ height: '1px', background: '#dbe4ff', margin: '0 20px' }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px' }}>
                <i
                  className={`fas ${f.icon}`}
                  style={{ fontSize: '15px', color: '#2d55a0', width: '18px', textAlign: 'center', flexShrink: 0 }}
                />
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 2px' }}>
                    {f.label}
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                    {f.value || '—'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Wrong account note */}
        <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginBottom: '28px' }}>
          Details pulled from your account.{' '}
          <a href="/login" style={{ color: '#2d55a0', fontWeight: 600, textDecoration: 'underline' }}>
            Wrong account? Sign out
          </a>
        </p>

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
              padding: '13px 32px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: 'inherit', letterSpacing: '0.3px',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a3a8f'}
            onMouseLeave={e => e.currentTarget.style.background = '#2d55a0'}
          >
            Continue <i className="fas fa-arrow-right" style={{ fontSize: '13px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}