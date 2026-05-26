import React, { useState } from 'react';
import { ORGANS, monteCarlo, buildGraph } from '../engine';

function Gauge({ value, label, color }) {
  const safeValue = isNaN(value) ? 0 : value;
  const radius = 28;
  const circum = 2 * Math.PI * radius;
  const offset = circum - (safeValue / 100) * circum;
  
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto' }}>
        <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="36" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
          <circle cx="36" cy="32" r={radius} fill="none" stroke={color} strokeWidth="5" 
                  strokeDasharray={circum} strokeDashoffset={isNaN(offset) ? circum : offset} strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)', filter: `drop-shadow(0 0 5px ${color})` }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, transform: 'translateY(-2px)' }}>
          {safeValue}<span style={{ fontSize: 8, opacity: 0.7 }}>%</span>
        </div>
      </div>
      <div className="label-v3" style={{ marginTop: 4, color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
}

function Histogram({ results, p5, p95, color }) {
  if (!results?.length) return null;
  const min = Math.min(...results), max = Math.max(...results);
  const bins = 24;
  const range = max - min;
  const step = range === 0 ? 1 : range / bins;
  const counts = Array(bins).fill(0);
  results.forEach(v => {
    const b = Math.min(bins - 1, Math.floor((v - min) / step));
    counts[b]++;
  });
  const maxCount = Math.max(...counts);
  const W = 400, H = 100, PL = 0, PR = 0, PT = 10, PB = 10;
  const iW = W - PL - PR, iH = H - PT - PB;
  const bW = iW / bins;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      {counts.map((c, i) => {
        const bx = PL + i * bW;
        const bh = (c / maxCount) * iH;
        const by = PT + iH - bh;
        const bv = min + i * step;
        const inCi = bv >= p5 && bv <= p95;
        return (
          <rect key={i} x={bx + 1} y={by} width={bW - 2} height={bh} 
                fill={inCi ? color : "rgba(255,255,255,0.05)"} rx="2"
                style={{ transition: 'all 0.5s ease' }} />
        );
      })}
    </svg>
  );
}

export default function AnalysisPanel({ 
  result, 
  selCase, 
  nA, nB, nG,
  complexity
}) {
  const [step, setStep] = useState(1);
  const [mcResult, setMcResult] = useState(null);
  const [mcRunning, setMcRunning] = useState(false);
  const [hoverSegment, setHoverSegment] = useState(null);

  const runMC = () => {
    if (!result || !selCase) return;
    setMcRunning(true);
    setTimeout(() => {
      const graph = buildGraph(nA, nB, nG);
      const mc = monteCarlo(graph, selCase.src, selCase.tgt, 1000, "normal");
      setMcResult(mc);
      setMcRunning(false);
    }, 400);
  };

  const totalSteps = 2;
  const progressWidth = result ? (((step - 1) / (totalSteps - 1)) * 100) : 0;

  const avgRisk = result?.segs?.length > 0 
    ? (result.segs.reduce((a, s) => a + (s.r || 0), 0) / result.segs.length) 
    : 0;
  const riskLevel = Math.round(avgRisk * 100);
  const riskColor = riskLevel > 70 ? "var(--danger)" : riskLevel > 45 ? "var(--warning)" : "var(--success)";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'transparent', overflow: 'hidden' }}>
      
      {/* Analytics Header */}
      <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ 
            width: 32, height: 32, border: '2px solid var(--primary)', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
          }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid var(--primary)', opacity: 0.5 }} />
            <div style={{ width: 1, height: 12, background: 'var(--primary)', position: 'absolute', transform: 'rotate(45deg) translateY(-6px)' }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em' }}>PROCEDURAL DATA</div>
            <div style={{ fontSize: '9px', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.1em' }}>DIAGNOSTIC_INSIGHTS_V4</div>
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
          {[1, 2].map(s => (
            <div key={s} style={{ 
              position: 'absolute', left: `${((s-1)/(totalSteps-1))*100}%`, top: '50%', 
              width: 10, height: 10, borderRadius: '50%', transform: 'translate(-50%, -50%)',
              background: (result && step >= s) ? 'var(--primary)' : '#18181b',
              border: `2px solid ${(result && step >= s) ? '#fff' : 'var(--border-glass)'}`,
              transition: 'all 0.4s ease', zIndex: 2
            }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', padding: '24px', overflowY: 'auto' }} className="hide-scrollbar">
        {!result ? (
          <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '48px', marginBottom: 24, opacity: 0.2 }}>⌬</div>
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--text-secondary)' }}>AWAITING_INPUT</div>
            <div style={{ fontSize: '10px', marginTop: 12, maxWidth: 220, lineHeight: 1.6, opacity: 0.6 }}>
              Complete the surgical identification and target selection to initialize high-fidelity analytics.
            </div>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="fade-in">
                <div className="label-v3" style={{ marginBottom: 24 }}>Operational Metrics</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 32 }}>
                  <Gauge value={riskLevel} label="Overall Risk" color={riskColor} />
                  <Gauge value={complexity} label="Complexity" color="var(--primary)" />
                </div>
                
                <div className="label-v3" style={{ marginBottom: 16 }}>Execution Path Segments</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {result?.path?.map((n, i) => (
                    <div 
                      key={i} 
                      onMouseEnter={() => setHoverSegment(i)}
                      onMouseLeave={() => setHoverSegment(null)}
                      className="card-v3"
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: 12, padding: '14px',
                        borderColor: hoverSegment === i ? 'var(--primary)' : 'var(--border-glass)',
                        background: hoverSegment === i ? 'rgba(0, 242, 255, 0.05)' : 'rgba(255,255,255,0.02)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ 
                        width: 24, height: 24, borderRadius: '6px', 
                        background: i === 0 || i === (result?.path?.length-1) ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        fontSize: 10, fontWeight: 900, color: i === 0 || i === (result?.path?.length-1) ? '#000' : 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {i === 0 ? 'S' : i === (result?.path?.length - 1) ? 'E' : i}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{ORGANS[n]?.label}</div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{ORGANS[n]?.cat}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="fade-in">
                <div className="label-v3" style={{ marginBottom: 20 }}>Robustness Simulation</div>
                <div className="card-v3" style={{ marginBottom: 24, padding: '16px', background: 'rgba(0, 242, 255, 0.03)', borderLeft: '3px solid var(--primary)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Evaluating path stability across 1,000 physiological variance scenarios to confirm peroperative safety.
                  </p>
                </div>

                <button 
                  className="btn-premium btn-premium-primary" 
                  style={{ width: '100%', marginBottom: 32, height: 48 }} 
                  disabled={mcRunning}
                  onClick={runMC}
                >
                  {mcRunning ? 'EXECUTING SCENARIOS...' : 'RUN STRESS TEST'}
                </button>

                {mcResult && (
                  <div className="fade-in">
                    <div className="label-v3" style={{ marginBottom: 12 }}>Cost Distribution</div>
                    <div style={{ padding: '20px', marginBottom: 24, background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid var(--border-glass)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
                      <Histogram results={mcResult.results} p5={mcResult.p5} p95={mcResult.p95} color={selCase?.color || 'var(--primary)'} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[
                        ['Avg. Trauma Index', mcResult.mean.toFixed(3)],
                        ['Deviation Range', mcResult.std.toFixed(3)],
                        ['Confidence', '95%'],
                        ['Safety Status', mcResult.cv > 30 ? 'CRITICAL' : 'OPTIMAL']
                      ].map(([l, v]) => (
                        <div key={l} className="card-v3" style={{ padding: '12px' }}>
                          <div className="label-v3" style={{ fontSize: 7, marginBottom: 4, opacity: 0.7 }}>{l}</div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: l==='Safety Status' && v==='CRITICAL' ? 'var(--danger)' : v==='OPTIMAL' ? 'var(--success)' : 'inherit' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Navigation */}
      <div style={{ padding: '20px 24px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: 12, opacity: result ? 1 : 0.4, pointerEvents: result ? 'auto' : 'none' }}>
        {step > 1 && (
          <button className="btn-premium btn-premium-secondary" style={{ flex: 1 }} onClick={() => setStep(step - 1)}>BACK</button>
        )}
        <button 
          className="btn-premium btn-premium-primary" 
          style={{ flex: 2 }}
          onClick={() => step < totalSteps ? setStep(step + 1) : null}
        >
          {step === 1 ? 'SIMULATION DATA' : 'ANALYSIS COMPLETE'}
        </button>
      </div>
    </div>
  );
}
