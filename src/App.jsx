import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';
import { buildGraph, dijkstra, PROFILES, generateVitals, calculateComplexity } from './engine';
import Sidebar from './components/Sidebar';
import Viewport3D from './components/Viewport3D';
import AnalysisPanel from './components/AnalysisPanel';

export default function App() {
  const [phase, setPhase] = useState(0);
  const [selCase, setSelCase] = useState(null);
  const [selProfile, setSelProfile] = useState("standard");
  const [alpha, setAlpha] = useState(0.40);
  const [beta, setBeta] = useState(0.35);
  const [gamma, setGamma] = useState(0.25);
  const [result, setResult] = useState(null);
  const [vitals, setVitals] = useState(null);
  const [complexity, setComplexity] = useState(0);
  
  const [animating, setAnimating] = useState(false);
  const [animProgress, setAnimProgress] = useState(0);
  const [hoveredOrgan, setHoveredOrgan] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(true);
  
  const animRef = useRef(null);
  const vitalsInterval = useRef(null);

  const profile = PROFILES.find(p => p.id === selProfile) || PROFILES[0];
  const eA = +(alpha * (profile.alphaM || 1)).toFixed(3);
  const eB = +(beta * (profile.betaM || 1)).toFixed(3);
  const eG = +(gamma * (profile.gammaM || 1)).toFixed(3);

  useEffect(() => {
    const updateVitals = () => setVitals(generateVitals(selProfile, selCase));
    updateVitals();
    vitalsInterval.current = setInterval(updateVitals, 3000);
    return () => clearInterval(vitalsInterval.current);
  }, [selProfile, selCase]);

  const totalWeight = eA + eB + eG;
  const nA = totalWeight > 0 ? +(eA / totalWeight).toFixed(3) : 0.333;
  const nB = totalWeight > 0 ? +(eB / totalWeight).toFixed(3) : 0.333;
  const nG = totalWeight > 0 ? +(eG / totalWeight).toFixed(3) : 0.334;

  useEffect(() => {
    if (result) setComplexity(calculateComplexity(result, profile));
  }, [result, profile]);

  const runDijkstra = useCallback(() => {
    if (!selCase) return;
    try {
      const graph = buildGraph(nA, nB, nG);
      const res = dijkstra(graph, selCase.src, selCase.tgt);
      if (!res || !res.path) throw new Error("Pathfinding Error");

      const graph0 = buildGraph();
      const segs = [];
      for (let i = 0; i < res.path.length - 1; i++) {
        const u = res.path[i], v = res.path[i + 1];
        const edge = graph0[u]?.find(e => e.to === v);
        if (edge) {
          segs.push({ u, v, ...edge, w: +(nA * edge.d + nB * edge.r + nG * edge.f).toFixed(4) });
        }
      }
      setResult({ ...res, segs });
      setAnimProgress(0);
      setAnimating(false);
    } catch (err) {
      console.error("DIJKSTRA_CRITICAL_FAILURE:", err);
    }
  }, [selCase, nA, nB, nG]);

  const runAnimation = () => {
    if (animating) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setAnimating(false);
      setAnimProgress(0);
      return;
    }
    
    setAnimating(true);
    setAnimProgress(0);
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / 2400, 1);
      setAnimProgress(progress);
      if (progress < 1) animRef.current = requestAnimationFrame(step);
      else setAnimating(false);
    };
    animRef.current = requestAnimationFrame(step);
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', background: 'var(--bg-main)', overflow: 'hidden' }}>
      
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Viewport3D 
          result={result}
          selCase={selCase}
          animating={animating}
          animProgress={animProgress}
          hoveredOrgan={hoveredOrgan}
          setHoveredOrgan={setHoveredOrgan}
        />
      </div>

      {/* Global Branding (Top Left) */}
      <div style={{ 
        position: 'absolute', top: 24, left: 24, zIndex: 100, 
        pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 16
      }}>
        {/* Modern Hexagonal Icon */}
        <div style={{ 
          width: 40, height: 40, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          filter: 'drop-shadow(0 0 10px var(--primary-glow))'
        }}>
          <div style={{ 
            width: '100%', height: '100%', background: 'var(--primary)', 
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            opacity: 0.15, border: '1px solid var(--primary)'
          }} />
          <div style={{ 
            position: 'absolute', width: '60%', height: '60%', background: 'var(--primary)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
             <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff', boxShadow: '0 0 10px #fff' }} />
          </div>
          {/* Rotating Ring */}
          <div style={{ 
            position: 'absolute', inset: -4, border: '1px dashed var(--primary)', borderRadius: '50%', 
            opacity: 0.3, animation: 'heartPulse 4s linear infinite'
          }} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontWeight: 900, fontSize: '18px', letterSpacing: '0.05em', color: '#fff' }}>AETHER</span>
            <span style={{ fontWeight: 300, fontSize: '18px', letterSpacing: '0.15em', color: 'var(--primary)' }}>SURGICAL</span>
          </div>
          <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.2em', marginTop: -2 }}>
            BIO-SYNAPTIC INTERFACE <span style={{ color: 'var(--success)' }}>V4.2.0</span>
          </div>
        </div>
      </div>

      {/* Patient Monitor (Bottom Center) */}
      <div style={{ 
        position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)', zIndex: 5,
        width: 340, transition: 'all 0.5s ease',
      }}>
        <div className="glass-dark card-v2" style={{ border: '1px solid var(--border-glass)', padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="label-v2" style={{ margin: 0 }}>ECG_MONITOR_PRIMARY</div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
          </div>
          
          <EKGDisplay hr={vitals?.hr || 72} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
            <div>
              <div className="label-v2" style={{ fontSize: '8px' }}>HR</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--danger)' }}>{vitals?.hr || '--'}</div>
            </div>
            <div>
              <div className="label-v2" style={{ fontSize: '8px' }}>NIBP</div>
              <div style={{ fontSize: '14px', fontWeight: 800 }}>{vitals?.bp ? `${vitals.bp[0]}/${vitals.bp[1]}` : '--/--'}</div>
            </div>
            <div>
              <div className="label-v2" style={{ fontSize: '8px' }}>SPO2</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--success)' }}>{vitals?.spo2 || '--'}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Drawer Interface */}
      <div style={{ 
        position: 'absolute', top: 80, left: 24, bottom: 48, zIndex: 80,
        width: isSidebarOpen ? 380 : 0, 
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div className="glass card-v2" style={{ 
          width: 380, height: '100%', overflow: 'hidden', padding: 0, 
          opacity: isSidebarOpen ? 1 : 0, transform: `translateX(${isSidebarOpen ? 0 : -20}px)`,
          display: 'flex', flexDirection: 'column', flexShrink: 1
        }}>
          <Sidebar 
            selCase={selCase} setSelCase={setSelCase}
            selProfile={selProfile} setSelProfile={setSelProfile}
            alpha={alpha} setAlpha={setAlpha}
            beta={beta} setBeta={setBeta}
            gamma={gamma} setGamma={setGamma}
            onRunDijkstra={runDijkstra}
            result={result}
          />
        </div>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ 
            position: 'absolute', left: isSidebarOpen ? 390 : 0, top: '50%', transform: 'translateY(-50%)',
            width: 24, height: 60, borderRadius: '4px', background: 'var(--bg-glass-dark)',
            border: '1px solid var(--border-glass)', color: 'var(--primary)', zIndex: 20, 
            fontSize: 14, fontWeight: 900, transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {isSidebarOpen ? '‹' : '›'}
        </button>
      </div>

      {/* Floating Analytics Module */}
      <div style={{ 
        position: 'absolute', top: 80, right: 24, bottom: 48, zIndex: 10, 
        width: isAnalysisOpen ? 340 : 0,
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div className="glass card-v2" style={{ 
          width: 340, height: '100%', overflow: 'hidden', padding: 0,
          display: 'flex', flexDirection: 'column', flexShrink: 1,
          opacity: isAnalysisOpen ? 1 : 0, 
          transform: `translateX(${isAnalysisOpen ? 0 : 20}px)`,
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <AnalysisPanel 
            result={result}
            selCase={selCase}
            nA={nA} nB={nB} nG={nG}
            complexity={complexity}
          />
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsAnalysisOpen(!isAnalysisOpen)}
          style={{ 
            position: 'absolute', right: isAnalysisOpen ? 350 : 0, top: '50%', transform: 'translateY(-50%)',
            width: 24, height: 60, borderRadius: '4px', background: 'var(--bg-glass-dark)',
            border: '1px solid var(--border-glass)', color: 'var(--primary)', zIndex: 20, 
            fontSize: 14, fontWeight: 900, transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {isAnalysisOpen ? '›' : '‹'}
        </button>
      </div>

      {/* Robotic Action Trigger */}
      {result && (
        <div className="fade-in" style={{ 
          position: 'absolute', bottom: 48, left: 'calc(50% + 170px + 40px)', 
          transform: 'translateX(-50%)', zIndex: 100
        }}>
          <button 
            className="btn-robotic" 
            onClick={runAnimation} 
            title={animating ? "STOP SEQUENCE" : "START SEQUENCE"}
            style={{ 
              borderColor: animating ? 'var(--danger)' : 'var(--primary)',
              color: animating ? 'var(--danger)' : 'var(--primary)',
              animation: animating ? 'none' : 'neonPulse 2s infinite ease-in-out',
              boxShadow: animating ? '0 0 20px var(--danger)' : ''
            }}
          >
            {animating ? '■' : '▶'}
          </button>
        </div>
      )}

      {/* Status Bar */}
      <div style={{ 
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid var(--border-glass)', zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 20px',
        fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em'
      }}>
        <span style={{ color: 'var(--success)', marginRight: 15 }}>● SYSTEM_NOMINAL_ONLINE</span>
        <span style={{ marginRight: 15 }}>UPLINK: 10.4.92.1</span>
        <span>DA_VINCI_CONTROL_V4.0.2</span>
        <span style={{ marginLeft: 'auto' }}>UTC {new Date().toISOString().slice(11,19)}</span>
      </div>

    </div>
  );
}

function EKGDisplay({ hr }) {
  const canvasRef = useRef(null);
  const points = useRef([]);
  const lastUpdate = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    
    let frameId;
    const animate = (time) => {
      // Clear with fade effect
      ctx.fillStyle = 'rgba(5, 8, 22, 0.2)';
      ctx.fillRect(0, 0, W, H);

      // Add new point based on HR
      const beatInterval = 60000 / hr;
      const elapsed = time - lastUpdate.current;
      
      let y = H / 2;
      const progress = (elapsed % beatInterval) / beatInterval;
      
      if (progress < 0.1) y -= progress * 100; // P wave
      else if (progress < 0.15) y = H/2;
      else if (progress < 0.2) y += 20; // Q
      else if (progress < 0.25) y -= 60; // R
      else if (progress < 0.3) y += 40; // S
      else if (progress < 0.4) y = H/2;
      else if (progress < 0.5) y -= 10; // T wave
      
      points.current.push({ x: W, y });
      if (points.current.length > W / 2) points.current.shift();

      ctx.beginPath();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#10b981';
      
      for (let i = 0; i < points.current.length; i++) {
        points.current[i].x -= 2;
        if (i === 0) ctx.moveTo(points.current[i].x, points.current[i].y);
        else ctx.lineTo(points.current[i].x, points.current[i].y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [hr]);

  return <canvas ref={canvasRef} width={276} height={60} style={{ width: '100%', height: 60, background: '#050816', borderRadius: 4 }} />;
}
