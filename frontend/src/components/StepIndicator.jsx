export default function StepIndicator({ current }) {
  const steps = ['Instructions', 'Details', 'Modules', 'Summary', 'Payment'];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 24px',
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
    }}>
      {steps.map((name, i) => {
        const s      = i + 1;
        const done   = s < current;
        const active = s === current;

        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>

            {/* Step circle + label */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                fontWeight: 700,
                transition: 'all 0.3s',
                background: active ? '#2d55a0'
                          : done   ? '#248e39'
                          :          '#fff',
                color: (active || done) ? '#fff' : '#c0c8d8',
                border: (active || done) ? 'none' : '2px solid #d1d9e6',
                boxShadow: active ? '0 0 0 5px rgba(45,85,160,0.15)' : 'none',
              }}>
                {done
                  ? <i className="fas fa-check" style={{ fontSize: '13px' }} />
                  : s
                }
              </div>
              <span style={{
                fontSize: '11px',
                marginTop: '6px',
                fontWeight: active ? 700 : 400,
                color: active ? '#2da053' : '#9ca3af',
                whiteSpace: 'nowrap',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                {name}
              </span>
            </div>

            {/* Connector line */}
            {s < steps.length && (
              <div style={{
                width: '80px',
                height: '2px',
                marginBottom: '22px',
                background: done ? '#2da053' : '#e2e6ef',
                transition: 'background 0.4s',
              }} />
            )}

          </div>
        );
      })}
    </div>
  );
}