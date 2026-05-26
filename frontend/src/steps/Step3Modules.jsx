import useModules from '../hooks/useModules';

export default function Step3Modules({ form, updateForm, onNext, onBack }) {
  const { modules, loading, error } = useModules();

  const isSelected   = id => form.modules.some(m => m.moduleId === id);
  const selectedTerm = id => form.modules.find(m => m.moduleId === id)?.termId ?? null;
  const calcTotal    = mods => mods.reduce((s, m) => s + m.fee, 0);

  const toggleModule = mod => {
    let updated;
    if (isSelected(mod.id)) {
      updated = form.modules.filter(m => m.moduleId !== mod.id);
    } else {
      if (!mod.hasTerms) {
        updated = [...form.modules, { moduleId: mod.id, moduleName: mod.name, termId: null, termName: null, fee: mod.fee }];
      } else {
        const t = mod.terms[0];
        updated = [...form.modules, { moduleId: mod.id, moduleName: mod.name, termId: t.id, termName: t.name, fee: t.fee }];
      }
    }
    const total = calcTotal(updated);
    updateForm({ modules: updated, subTotal: total, grandTotal: total });
  };

  const pickTerm = (mod, term) => {
    const updated = form.modules.map(m =>
      m.moduleId === mod.id ? { ...m, termId: term.id, termName: term.name, fee: term.fee } : m
    );
    const total = calcTotal(updated);
    updateForm({ modules: updated, subTotal: total, grandTotal: total });
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#eef2f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#2d55a0' }} />
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#eef2f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#ef4444' }}>{error}</p>
    </div>
  );

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
            <i className="fas fa-layer-group" style={{ fontSize: '26px', color: '#1a3a8f' }} />
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#1a3a8f', margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
            Select Your Modules
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Step 3 of 5 — Choose modules and payment terms
          </p>
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
            margin: 0, padding: '16px 20px 4px',
          }}>
            Available Modules
          </p>

          {modules.map((mod, i) => {
            const sel       = isSelected(mod.id);
            const selTermId = selectedTerm(mod.id);

            return (
              <div key={mod.id}>
                {i > 0 && <div style={{ height: '1px', background: '#dbe4ff', margin: '0 20px' }} />}

                {/* Module row */}
                <div
                  onClick={() => toggleModule(mod)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px', cursor: 'pointer',
                    background: sel ? '#e8eeff' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!sel) e.currentTarget.style.background = '#f5f7ff'; }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Checkbox */}
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                      border: sel ? 'none' : '2px solid #c5cfe8',
                      background: sel ? '#2d55a0' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}>
                      {sel && <i className="fas fa-check" style={{ fontSize: '10px', color: '#fff' }} />}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', margin: '0 0 2px' }}>
                        {mod.name}
                      </p>
                      {mod.hasTerms && (
                        <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
                          Installment options available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fee or tag */}
                  {!mod.hasTerms && (
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#2d55a0', flexShrink: 0 }}>
                      ₹{mod.fee?.toLocaleString('en-IN')}
                    </span>
                  )}
                  {mod.hasTerms && !sel && (
                    <span style={{
                      fontSize: '11px', fontWeight: 600, color: '#9ca3af',
                      background: '#e5e7eb', padding: '3px 10px', borderRadius: '8px', flexShrink: 0,
                    }}>
                      Select term
                    </span>
                  )}
                </div>

                {/* Terms panel */}
                {mod.hasTerms && sel && (
                  <div style={{
                    borderTop: '1px solid #dbe4ff',
                    background: '#f8f9ff',
                    padding: '14px 20px',
                  }}>
                    <p style={{
                      fontSize: '10px', fontWeight: 700, color: '#9ca3af',
                      textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 10px',
                    }}>
                      Payment Term
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {mod.terms.map(t => (
                        <button
                          key={t.id}
                          onClick={e => { e.stopPropagation(); pickTerm(mod, t); }}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: selTermId === t.id ? '2px solid #2d55a0' : '1.5px solid #dbe4ff',
                            background: selTermId === t.id ? '#e8eeff' : '#fff',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            fontFamily: 'inherit',
                          }}
                        >
                          <p style={{ fontSize: '11px', fontWeight: 700, color: selTermId === t.id ? '#2d55a0' : '#6b7280', margin: '0 0 3px' }}>
                            {t.name}
                          </p>
                          <p style={{ fontSize: '14px', fontWeight: 800, color: selTermId === t.id ? '#1a3a8f' : '#1f2937', margin: 0 }}>
                            ₹{t.fee.toLocaleString('en-IN')}
                          </p>
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: '11px', color: '#9ca3af', margin: '8px 0 0' }}>
                      Full module: ₹{mod.fullFee?.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Total bar */}
        {form.grandTotal > 0 && (
          <div style={{
            background: '#2d55a0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#93b4e8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>
                Total Payable
              </p>
              <p style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: 0 }}>
                ₹{form.grandTotal.toLocaleString('en-IN')}
              </p>
            </div>
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="fas fa-indian-rupee-sign" style={{ fontSize: '20px', color: '#fff' }} />
            </div>
          </div>
        )}

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
            disabled={!form.modules.length}
            style={{
              background: form.modules.length ? '#2d55a0' : '#cbd5e1',
              border: 'none', borderRadius: '10px',
              color: '#fff', fontSize: '15px', fontWeight: 700,
              padding: '13px 28px', cursor: form.modules.length ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: 'inherit', letterSpacing: '0.3px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (form.modules.length) e.currentTarget.style.background = '#1a3a8f'; }}
            onMouseLeave={e => { if (form.modules.length) e.currentTarget.style.background = '#2d55a0'; }}
          >
            Proceed to Summary <i className="fas fa-arrow-right" style={{ fontSize: '13px' }} />
          </button>
        </div>

      </div>
    </div>
  );
}