import React, { useState, useEffect } from 'react';
import { CASES, PROFILES, CAT_COLORS, getPatientHistory } from '../engine';

export default function Sidebar({
  selCase, setSelCase,
  selProfile, setSelProfile,
  alpha, setAlpha,
  beta, setBeta,
  gamma, setGamma,
  onRunDijkstra,
  result
}) {
  const [step, setStep] = useState(1);
  const [activeCategory, setActiveCategory] = useState('ALL');
  
  const profile = PROFILES.find(p => p.id === selProfile) || PROFILES[0];
  const history = getPatientHistory(selProfile, selCase);

  const categories = ['ALL', ...Object.keys(CAT_COLORS).map(k => k.toUpperCase())];
  const filteredCases = activeCategory === 'ALL' 
    ? CASES 
    : CASES.filter(c => c.category.toUpperCase() === activeCategory);

  const PRESETS = [
    { label: 'SAFE', values: [0.3, 0.4, 0.3] },
    { label: 'FAST', values: [0.7, 0.1, 0.2] },
    { label: 'BALANCED', values: [0.4, 0.3, 0.3] }
  ];

  const totalSteps = 3;
  const progressWidth = ((step - 1) / (totalSteps - 1)) * 100;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else onRunDijkstra();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'transparent', overflow: 'hidden' }}>
      
      {/* Header Section */}
      <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontWeight: 900, fontSize: '18px' }}>Δ</span>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em' }}>CLINICAL CONSOLE</div>
            <div style={{ fontSize: '9px', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.1em' }}>PRECISION_OS_V4.0</div>
          </div>
        </div>

        {/* Progress Line */}
        <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
          <div style={{ 
            position: 'absolute', left: 0, top: 0, bottom: 0, 
            width: `${progressWidth}%`, background: 'var(--primary)', 
            transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: '0 0 15px var(--primary-glow)', borderRadius: 2
          }} />
          {[1, 2, 3].map(s => (
            <div key={s} style={{ 
              position: 'absolute', left: `${((s-1)/(totalSteps-1))*100}%`, top: '50%', 
              width: 10, height: 10, borderRadius: '50%', transform: 'translate(-50%, -50%)',
              background: step >= s ? 'var(--primary)' : '#18181b',
              border: `2px solid ${step >= s ? '#fff' : 'var(--border-glass)'}`,
              transition: 'all 0.4s ease', zIndex: 2
            }} />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div style={{ flex: 1, position: 'relative', padding: '24px', overflowY: 'auto' }} className="hide-scrollbar">
        
        {step === 1 && (
          <div className="fade-in">
            <div className="label-v3" style={{ marginBottom: 20 }}>Step 01. Physiological Profile</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
              {PROFILES.map(p => (
                <button 
                  key={p.id}
                  onClick={() => setSelProfile(p.id)}
                  style={{
                    padding: '16px 8px', borderRadius: '14px', cursor: 'pointer', border: '1px solid',
                    borderColor: selProfile === p.id ? 'var(--primary)' : 'transparent',
                    background: selProfile === p.id ? 'rgba(0, 242, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    boxShadow: selProfile === p.id ? '0 0 20px rgba(0, 242, 255, 0.2)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{p.icon}</span>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: selProfile === p.id ? 'var(--primary)' : 'var(--text-secondary)' }}>{p.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
            {selProfile && (
              <div className="card-v3" style={{ borderLeft: '3px solid var(--primary)' }}>
                <div className="label-v3" style={{ fontSize: '8px', marginBottom: 8 }}>Patient History Analysis</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "{history}"
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="label-v3" style={{ marginBottom: 20 }}>Step 02. Anatomical Target</div>
            
            {/* Encapsulated Category Selector */}
            <div style={{ 
              position: 'relative', 
              marginBottom: 24, 
              background: 'rgba(0, 242, 255, 0.03)', 
              borderRadius: '30px', 
              padding: '2px',
              border: '1px solid rgba(0, 242, 255, 0.1)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <button 
                onClick={() => document.getElementById('cat-scroll').scrollBy({left: -80, behavior: 'smooth'})}
                style={{ 
                  background: 'none', border: 'none', color: 'var(--primary)', padding: '0 8px', 
                  cursor: 'pointer', fontSize: '14px', fontWeight: 300, opacity: 0.6 
                }}
              >‹</button>
              
              <div 
                id="cat-scroll"
                style={{ 
                  display: 'flex', gap: 4, overflowX: 'auto', padding: '4px 0',
                  scrollBehavior: 'smooth', flex: 1
                }} 
                className="hide-scrollbar"
              >
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '6px 16px', borderRadius: '20px', fontSize: '8px', fontWeight: 800,
                      background: activeCategory === cat ? 'var(--primary)' : 'transparent',
                      color: activeCategory === cat ? '#000' : 'var(--text-muted)',
                      border: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                      whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
                      letterSpacing: '0.05em'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => document.getElementById('cat-scroll').scrollBy({left: 80, behavior: 'smooth'})}
                style={{ 
                  background: 'none', border: 'none', color: 'var(--primary)', padding: '0 8px', 
                  cursor: 'pointer', fontSize: '14px', fontWeight: 300, opacity: 0.6 
                }}
              >›</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
              {filteredCases.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => setSelCase(c)}
                  className="card-v3"
                  style={{
                    borderColor: selCase?.id === c.id ? 'var(--primary)' : 'var(--border-glass)',
                    background: selCase?.id === c.id ? 'rgba(0, 242, 255, 0.05)' : 'rgba(255,255,255,0.02)',
                    padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: selCase?.id === c.id ? 'var(--primary)' : 'var(--text-primary)' }}>{c.label}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 4 }}>{c.technique}</div>
                  </div>
                  {c.urgency === 'URGENCE' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', boxShadow: '0 0 10px var(--danger)' }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in">
            <div className="label-v3" style={{ marginBottom: 20 }}>Step 03. Trajectory Parameters</div>
            
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {PRESETS.map(p => (
                <button 
                  key={p.label}
                  onClick={() => { setAlpha(p.values[0]); setBeta(p.values[1]); setGamma(p.values[2]); }}
                  className="btn-premium btn-premium-secondary"
                  style={{ flex: 1, fontSize: '9px', padding: '10px 0' }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { label: "PRECISION", val: alpha, set: setAlpha, color: "var(--primary)" },
                { label: "HEMOSTASIS", val: beta, set: setBeta, color: "var(--danger)" },
                { label: "VIABILITY", val: gamma, set: setGamma, color: "var(--warning)" }
              ].map(p => (
                <div key={p.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span className="label-v3" style={{ color: 'var(--text-secondary)' }}>{p.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 900, color: p.color }}>{(p.val * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', left: 0, top: 0, bottom: 0, 
                      width: `${p.val * 100}%`, background: p.color, borderRadius: 10,
                      boxShadow: `0 0 15px ${p.color}66`, transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                    <input 
                      type="range" min="0.1" max="1.0" step="0.05" value={p.val} 
                      onChange={e => p.set(+e.target.value)} 
                      style={{ 
                        position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' 
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      <div style={{ padding: '20px 24px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: 12 }}>
        {step > 1 && (
          <button className="btn-premium btn-premium-secondary" style={{ flex: 1 }} onClick={handleBack}>BACK</button>
        )}
        <button 
          className="btn-premium btn-premium-primary" 
          style={{ flex: 2, opacity: (step===1 && !selProfile) || (step===2 && !selCase) ? 0.5 : 1 }} 
          disabled={(step===1 && !selProfile) || (step===2 && !selCase)}
          onClick={handleNext}
        >
          {step === 3 ? (result ? 'RE-CALCULATE' : 'GENERATE PATH') : 'CONTINUE'}
        </button>
      </div>
    </div>
  );
}
