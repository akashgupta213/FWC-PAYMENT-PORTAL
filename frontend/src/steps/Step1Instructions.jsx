const items = [
  { text: <>Check your details carefully before proceeding <strong style={{ color: '#ef4444' }}>*</strong></> },
  { text: 'Module 2 and Module 3 can be paid in installments — Term 1, Term 2, or Full Payment' },
  { text: <>Payment is via <strong>UPI QR Code only</strong> — use GPay, PhonePe, Paytm, or any UPI app</> },
  { text: <>After paying, <strong>enter your UPI Transaction ID (UTR)</strong> to confirm payment</> },
  { text: 'You can download your invoice after confirmation' },
];

export default function Step1Instructions({ onNext }) {
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
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#eef2fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-graduation-cap" style={{ fontSize: '28px', color: '#1a3a8f' }} />
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#1a3a8f', margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
            Welcome
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Future Wireless Communications Program
          </p>
        </div>

        {/* Info box */}
        <div
          style={{
            background: '#f0f4ff',
            border: '1px solid #dbe4ff',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '32px',
          }}
        >
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#1a3a8f', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 4px' }}>
            Before You Begin
          </p>

          {items.map((item, i) => (
            <div key={i}>
              {/* Divider between items */}
              {i > 0 && (
                <div style={{ height: '1px', background: '#dbe4ff', margin: '0 0' }} />
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 0' }}>
                {/* ◉ bullseye icon */}
                <i
                  className="fas fa-circle-dot"
                  style={{ fontSize: '18px', color: '#1a3a8f', flexShrink: 0, marginTop: '1px' }}
                />
                <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.6 }}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={onNext}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'inherit',
            letterSpacing: '0.3px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1a3a8f'}
          onMouseLeave={e => e.currentTarget.style.background = '#2d55a0'}
        >
          Start <i className="fas fa-arrow-right" style={{ fontSize: '13px' }} />
        </button>
      </div>
    </div>
  );
}