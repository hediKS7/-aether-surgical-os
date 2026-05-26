import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { ORGANS, EDGES_RAW, CAT_COLORS, project3D, getBodySilhouette } from '../engine';

export default function Viewport3D({ 
  result, 
  selCase, 
  animating, 
  animProgress, 
  hoveredOrgan,
  setHoveredOrgan 
}) {
  const canvasRef = useRef(null);
  const [rotX, setRotX] = useState(0.15);
  const [rotY, setRotY] = useState(0.0);
  const [scale, setScale] = useState(38);
  const [dragging, setDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);

  const particles = useMemo(() => {
    return Array.from({ length: 60 }, () => ({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 10,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.01 + 0.005
    }));
  }, []);

  useEffect(() => {
    let frameId;
    const animate = (t) => {
      setTime(t / 1000);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    let currentRotX = rotX;
    let currentRotY = rotY;
    if (!dragging) {
      currentRotX += Math.sin(time * 0.5) * 0.02;
      currentRotY += Math.cos(time * 0.4) * 0.03;
    }

    const cx = W / 2, cy = H / 2 + 20;
    const bodyScale = 0.055;

    // 1. BACKGROUND (Deep Medical Slate)
    const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, H * 1.5);
    bgGrad.addColorStop(0, "#0a0f24");
    bgGrad.addColorStop(1, "#02040a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. SCANNING GRID
    ctx.strokeStyle = "rgba(34, 211, 238, 0.03)";
    ctx.lineWidth = 1;
    const gridOffset = (time * 20) % 40;
    for (let x = -gridOffset; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = -gridOffset; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // 3. PARTICLES
    particles.forEach(p => {
      p.y -= p.speed;
      if (p.y < -10) p.y = 10;
      const pr = project3D(p.x, p.y, p.z, currentRotX, currentRotY, scale, cx, cy - 40);
      const alpha = (pr.z2 + 10) / 20;
      ctx.beginPath();
      ctx.arc(pr.sx, pr.sy, p.size * pr.fov, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 211, 238, ${alpha * 0.2})`;
      ctx.fill();
    });

    // 4. BODY SILHOUETTE
    const bodyPts = getBodySilhouette(cx, cy - 40, bodyScale * scale);
    ctx.beginPath();
    bodyPts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
    ctx.closePath();
    ctx.fillStyle = "rgba(13, 17, 33, 0.9)";
    ctx.fill();
    ctx.strokeStyle = "rgba(34, 211, 238, 0.1)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 5. NODES & EDGES
    const nodes = Object.entries(ORGANS).map(([id, o]) => {
      const pr = project3D(...o.pos, currentRotX, currentRotY, scale, cx, cy - 40);
      return { id, ...o, ...pr };
    }).sort((a, b) => a.z2 - b.z2);

    EDGES_RAW.forEach(([u, v]) => {
      const nu = nodes.find(n => n.id === u), nv = nodes.find(n => n.id === v);
      if (!nu || !nv) return;
      const isPath = result?.path?.includes(u) && result?.path?.includes(v) && 
                     Math.abs(result?.path?.indexOf(u) - result?.path?.indexOf(v)) === 1;
      
      ctx.beginPath();
      ctx.moveTo(nu.sx, nu.sy);
      ctx.lineTo(nv.sx, nv.sy);
      if (isPath) {
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.lineDashOffset = -time * 40;
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 10;
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
    });

    // 6. ROBOT TIP (High-Tech Crosshair)
    if (animating && result && result.path.length > 1) {
      const pathNodes = result.path.map(id => nodes.find(n => n.id === id)).filter(Boolean);
      const prog = animProgress * (pathNodes.length - 1);
      const idx = Math.min(Math.floor(prog), pathNodes.length - 2);
      const frac = prog - idx;
      const a = pathNodes[idx], b = pathNodes[idx+1];
      const ix = a.sx + (b.sx - a.sx) * frac;
      const iy = a.sy + (b.sy - a.sy) * frac;

      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ix - 15, iy); ctx.lineTo(ix + 15, iy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ix, iy - 15); ctx.lineTo(ix, iy + 15); ctx.stroke();
      ctx.beginPath(); ctx.arc(ix, iy, 4, 0, Math.PI * 2); ctx.fillStyle = "white"; ctx.fill();
    }

    // 7. ORGANS (High-Fidelity)
    nodes.forEach(n => {
      const { id, cat, sx, sy, label, size, pos } = n;
      const c = CAT_COLORS[cat];
      const isPath = result?.path?.includes(id);
      const isHov = hoveredOrgan === id;
      const r = (size * 11 + (isHov ? 6 : 0)) * n.fov;

      if (isPath || isHov) {
        ctx.beginPath(); ctx.arc(sx, sy, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = (isPath ? "#22d3ee" : c.fill) + "15";
        ctx.fill();
      }

      const grad = ctx.createRadialGradient(sx - r*0.3, sy - r*0.3, 0, sx, sy, r);
      grad.addColorStop(0, "#fff");
      grad.addColorStop(0.3, isPath ? "#22d3ee" : c.fill);
      grad.addColorStop(1, "#000");
      
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (isPath || isHov) {
        ctx.font = `bold ${Math.max(10, 11 * n.fov)}px var(--font-sans)`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(label, sx, sy - r - 10);

        // MEDICAL COORDINATE TAGS (V4 DETAIL)
        ctx.font = `500 ${Math.max(7, 8 * n.fov)}px var(--font-mono)`;
        ctx.fillStyle = "#22d3ee";
        ctx.fillText(`LOC: [${pos[0].toFixed(1)}, ${pos[1].toFixed(1)}]`, sx, sy + r + 12);
      }
    });

  }, [rotX, rotY, dragging, scale, result, hoveredOrgan, animating, animProgress, time, particles, selCase]);

  useEffect(() => { draw(); }, [draw]);

  const onMouseDown = e => { setDragging(true); setLastMouse({ x: e.clientX, y: e.clientY }); };
  const onMouseMove = useCallback(e => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    if (dragging) {
      setRotY(r => r + (e.clientX - lastMouse.x) * 0.008);
      setRotX(r => Math.max(-1.1, Math.min(1.1, r - (e.clientY - lastMouse.y) * 0.008)));
      setLastMouse({ x: e.clientX, y: e.clientY });
    } else {
      let near = null, nearD = 18;
      Object.entries(ORGANS).forEach(([id, o]) => {
        const pr = project3D(...o.pos, rotX, rotY, scale, canvas.width/2, canvas.height/2 - 20);
        const d = Math.hypot(pr.sx - mx, pr.sy - my);
        if (d < nearD) { nearD = d; near = id; }
      });
      setHoveredOrgan(near);
    }
  }, [dragging, lastMouse, rotX, rotY, scale, setHoveredOrgan]);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(10, Math.min(200, prev * delta)));
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', cursor: dragging ? 'grabbing' : 'crosshair' }}
         onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}
         onWheel={onWheel}>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
