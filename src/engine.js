// ══════════════════════════════════════════════════════════════
//  ANATOMICAL GRAPH DATA & SURGICAL ENGINE
// ══════════════════════════════════════════════════════════════

export const ORGANS = {
  Coeur:      { pos: [0.0, 5.5, 1.5],   cat: "cardiovascular", label: "Cœur",       size: 1.4, icon: "♥" },
  Aorte:      { pos: [0.3, 3.5, 1.2],   cat: "cardiovascular", label: "Aorte",      size: 0.8, icon: "⟳" },
  VeineCave:  { pos: [-0.4, 3.8, 1.2],  cat: "cardiovascular", label: "V. Cave",    size: 0.7, icon: "⟳" },
  Trachee:    { pos: [0.0, 7.0, 1.8],   cat: "respiratory",    label: "Trachée",    size: 0.7, icon: "↕" },
  PoumonD:    { pos: [3.5, 5.0, 1.5],   cat: "respiratory",    label: "Poumon D",   size: 1.6, icon: "◈" },
  PoumonG:    { pos: [-3.5, 5.0, 1.5],  cat: "respiratory",    label: "Poumon G",   size: 1.6, icon: "◈" },
  Diaphragme: { pos: [0.0, 2.8, 1.3],   cat: "respiratory",    label: "Diaphragme", size: 0.9, icon: "—" },
  Foie:       { pos: [2.8, 1.8, 1.2],   cat: "digestive",      label: "Foie",       size: 1.5, icon: "◉" },
  Estomac:    { pos: [-1.5, 1.5, 1.3],  cat: "digestive",      label: "Estomac",    size: 1.2, icon: "○" },
  Rate:       { pos: [-3.2, 1.8, 1.2],  cat: "digestive",      label: "Rate",       size: 0.9, icon: "●" },
  Pancreas:   { pos: [-0.8, 0.8, 1.2],  cat: "digestive",      label: "Pancréas",   size: 0.8, icon: "≋" },
  Duodenum:   { pos: [1.5, 0.5, 1.2],   cat: "digestive",      label: "Duodénum",   size: 0.8, icon: "⌒" },
  ColonD:     { pos: [3.5, -1.5, 1.0],  cat: "digestive",      label: "Côlon D",    size: 1.0, icon: "⌇" },
  ColonG:     { pos: [-3.5, -1.5, 1.0], cat: "digestive",      label: "Côlon G",    size: 1.0, icon: "⌇" },
  Appendice:  { pos: [3.0, -2.8, 0.9],  cat: "digestive",      label: "Appendice",  size: 0.6, icon: "⌐" },
  ReinD:      { pos: [3.8, 0.5, 0.5],   cat: "urinary",        label: "Rein D",     size: 1.0, icon: "⬩" },
  ReinG:      { pos: [-3.8, 0.5, 0.5],  cat: "urinary",        label: "Rein G",     size: 1.0, icon: "⬩" },
  Vessie:     { pos: [0.0, -4.0, 0.9],  cat: "urinary",        label: "Vessie",     size: 1.0, icon: "◎" },
};

export const EDGES_RAW = [
  ["Coeur","Aorte",3.5,0.95,0.90],["Coeur","Trachee",2.0,0.70,0.60],
  ["Coeur","VeineCave",2.2,0.85,0.75],["Coeur","PoumonD",4.5,0.60,0.50],
  ["Coeur","PoumonG",4.5,0.60,0.50],["Aorte","VeineCave",0.5,0.90,0.80],
  ["Aorte","Diaphragme",1.8,0.80,0.65],["Aorte","Foie",4.5,0.80,0.55],
  ["Aorte","ReinD",3.5,0.75,0.60],["Aorte","ReinG",3.5,0.75,0.60],
  ["VeineCave","Foie",3.0,0.85,0.60],["Trachee","PoumonD",4.5,0.55,0.45],
  ["Trachee","PoumonG",4.5,0.55,0.45],["Diaphragme","Foie",3.5,0.65,0.50],
  ["Diaphragme","Estomac",3.0,0.55,0.45],["Diaphragme","PoumonD",3.0,0.50,0.40],
  ["Diaphragme","PoumonG",3.0,0.50,0.40],["Foie","Estomac",5.5,0.60,0.50],
  ["Foie","Duodenum",2.0,0.65,0.55],["Estomac","Rate",3.0,0.55,0.45],
  ["Estomac","Pancreas",2.5,0.65,0.55],["Pancreas","Duodenum",2.5,0.70,0.65],
  ["Pancreas","ReinG",4.0,0.60,0.50],["Duodenum","ColonD",3.5,0.50,0.40],
  ["ColonD","Appendice",2.5,0.45,0.35],["ColonD","ReinD",2.5,0.55,0.45],
  ["ColonG","Rate",1.5,0.50,0.40],["ColonG","ReinG",2.5,0.55,0.45],
  ["Appendice","Vessie",3.5,0.30,0.25],["ReinD","Vessie",4.5,0.45,0.35],
  ["ReinG","Vessie",4.5,0.45,0.35],
];

export const CAT_COLORS = {
  cardiovascular: { fill: "#ff3b3b", glow: "#ff0040", bg: "rgba(255,0,64,0.15)", text: "#ff6b6b", label: "Cardio-vasculaire" },
  respiratory:    { fill: "#00d4ff", glow: "#0099ff", bg: "rgba(0,212,255,0.15)", text: "#66e0ff", label: "Respiratoire" },
  digestive:      { fill: "#00ff9d", glow: "#00cc7a", bg: "rgba(0,255,157,0.15)", text: "#66ffbb", label: "Digestif" },
  urinary:        { fill: "#ffd700", glow: "#ffaa00", bg: "rgba(255,215,0,0.15)", text: "#ffde5c", label: "Urinaire" },
};

export const CASES = [
  {
    id: "appendicite", label: "Appendicite Perforée",
    category: "digestive",
    src: "Aorte", tgt: "Appendice",
    color: "#ff3b3b", glow: "#ff0040",
    urgency: "URGENCE", urgencyColor: "#ff3b3b",
    prevalence: "7–8%", mortality: "< 5%", delay: "6–12h",
    technique: "Appendicectomie laparoscopique",
    desc: "Inflammation perforée — péritonite imminente. Intervention Da Vinci minimalement invasive.",
    riskScore: 87,
  },
  {
    id: "vessie", label: "Cystotomie Urgente",
    category: "urinary",
    src: "Diaphragme", tgt: "Vessie",
    color: "#00d4ff", glow: "#0099ff",
    urgency: "URGENCE", urgencyColor: "#ff8c00",
    prevalence: "6–7%", mortality: "< 1%", delay: "< 4h",
    technique: "Cystoscopie robotique",
    desc: "Rétention aiguë / traumatisme vésical. Drainage robotique guidé par Da Vinci.",
    riskScore: 62,
  },
  {
    id: "gastrique", label: "By-pass Gastrique",
    category: "digestive",
    src: "Estomac", tgt: "Duodenum",
    color: "#00ff9d", glow: "#00cc7a",
    urgency: "ÉLECTIF", urgencyColor: "#00ff9d",
    prevalence: "BMI>40", mortality: "0.1–0.3%", delay: "Planifiable",
    technique: "By-pass Roux-en-Y Da Vinci",
    desc: "Dérivation gastro-duodénale pour obésité sévère. Précision millimétrée Da Vinci.",
    riskScore: 34,
  },
  {
    id: "renale", label: "Néphrectomie Partielle",
    category: "urinary",
    src: "Aorte", tgt: "ReinD",
    color: "#ffd700", glow: "#ffaa00",
    urgency: "ÉLECTIF", urgencyColor: "#ffd700",
    prevalence: "3.7% cancers", mortality: "< 2%", delay: "Planifiable",
    technique: "Résection laparoscopique rénale",
    desc: "Résection partielle du rein droit. Conservation maximale du parenchyme rénal.",
    riskScore: 51,
  },
];

export const PROFILES = [
  { id: "standard",  label: "Standard",      icon: "○", alphaM: 1,   betaM: 1,   gammaM: 1,   age: "18–60" },
  { id: "elderly",   label: "Gériatrique",   icon: "◎", alphaM: 1,   betaM: 1.3, gammaM: 1.4, age: "> 70" },
  { id: "obese",     label: "Obèse",         icon: "●", alphaM: 1.2, betaM: 1.1, gammaM: 1,   age: "BMI>35" },
  { id: "pediatric", label: "Pédiatrique",   icon: "◌", alphaM: 0.8, betaM: 1.2, gammaM: 1.5, age: "< 14" },
  { id: "diabetic",  label: "Diabétique",    icon: "◑", alphaM: 1.1, betaM: 1.4, gammaM: 1.2, age: "HbA1c>8" },
];

export function buildGraph(a=0.40, b=0.35, g=0.25) {
  const adj = {};
  Object.keys(ORGANS).forEach(n => { adj[n] = []; });
  EDGES_RAW.forEach(([u,v,d,r,f]) => {
    const w = +(a*d + b*r + g*f).toFixed(4);
    adj[u].push({to:v, w, d, r, f});
    adj[v].push({to:u, w, d, r, f});
  });
  return adj;
}

export function dijkstra(graph, src, tgt) {
  const dist = {}, prev = {}, visited = new Set();
  Object.keys(graph).forEach(n => { dist[n] = Infinity; prev[n] = null; });
  dist[src] = 0;
  const pq = [[0, src]];
  while (pq.length) {
    pq.sort((a,b) => a[0]-b[0]);
    const [cost, u] = pq.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    if (u === tgt) break;
    for (const {to, w} of graph[u]) {
      const alt = cost + w;
      if (alt < dist[to]) { dist[to] = alt; prev[to] = u; pq.push([alt, to]); }
    }
  }
  const path = [];
  let cur = tgt;
  while (cur) { path.unshift(cur); cur = prev[cur]; }
  return { path: path[0] === src ? path : [], cost: dist[tgt] };
}

export function monteCarlo(graph, src, tgt, N=1000, distribution="normal") {
  const results = [];
  for (let i = 0; i < N; i++) {
    const gSim = {};
    Object.keys(graph).forEach(u => {
      gSim[u] = graph[u].map(({to, w, d, r, f}) => {
        let ws;
        if (distribution === "normal") {
          const z = Math.sqrt(-2*Math.log(Math.random())) * Math.cos(2*Math.PI*Math.random());
          ws = Math.max(0.001, w + 0.15*w*z);
        } else {
          ws = Math.max(0.001, -w * Math.log(Math.random()));
        }
        return {to, w: ws, d, r, f};
      });
    });
    const {cost} = dijkstra(gSim, src, tgt);
    if (isFinite(cost)) results.push(cost);
  }
  results.sort((a,b)=>a-b);
  if (results.length === 0) return null;
  const mean = results.reduce((a,b)=>a+b,0)/results.length;
  const std = Math.sqrt(results.reduce((a,b)=>a+(b-mean)**2,0)/results.length);
  const p5 = results[Math.floor(0.05*results.length)];
  const p95 = results[Math.floor(0.95*results.length)];
  return { results, mean, std, p5, p95, cv: std/mean*100 };
}

// ══════════════════════════════════════════════════════════════
//  3D ENGINE MATH
// ══════════════════════════════════════════════════════════════
export function project3D(x, y, z, rotX, rotY, scale=38, cx=400, cy=300) {
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
  const x2 = x * cosY + z * sinY;
  const y2 = y * cosX - (z * cosY - x * sinY) * sinX;
  const z2 = y * sinX + (z * cosY - x * sinY) * cosX;
  const fov = 20 / (20 + z2);
  return { sx: cx + x2 * scale * fov, sy: cy - y2 * scale * fov, z2, fov };
}

export function getBodySilhouette(cx, cy, scale) {
  const s = scale * 0.9;
  return [
    [cx, cy - s*5.8],
    [cx - s*2.2, cy - s*4.2],
    [cx - s*2.8, cy - s*3.8],
    [cx - s*3.2, cy - s*2.5],
    [cx - s*3.4, cy - s*0.5],
    [cx - s*3.1, cy + s*1.2],
    [cx - s*2.6, cy + s*2.5],
    [cx - s*1.8, cy + s*0.5],
    [cx - s*1.6, cy + s*1.5],
    [cx - s*2.0, cy + s*2.8],
    [cx - s*1.8, cy + s*4.5],
    [cx - s*1.6, cy + s*7.0],
    [cx - s*1.4, cy + s*8.8],
    [cx - s*0.5, cy + s*9.0],
    [cx + s*0.5, cy + s*9.0],
    [cx + s*1.4, cy + s*8.8],
    [cx + s*1.6, cy + s*7.0],
    [cx + s*1.8, cy + s*4.5],
    [cx + s*2.0, cy + s*2.8],
    [cx + s*1.6, cy + s*1.5],
    [cx + s*1.8, cy + s*0.5],
    [cx + s*2.6, cy + s*2.5],
    [cx + s*3.1, cy + s*1.2],
    [cx + s*3.4, cy - s*0.5],
    [cx + s*3.2, cy - s*2.5],
    [cx + s*2.8, cy - s*3.8],
    [cx + s*2.2, cy - s*4.2],
  ];
}

// ══════════════════════════════════════════════════════════════
//  V2: CLINICAL SIMULATIONS
// ══════════════════════════════════════════════════════════════

export function generateVitals(profileId, selCase) {
  const baseVitals = {
    hr: 72, bp: [120, 80], spo2: 98, temp: 36.6
  };
  
  const modifiers = {
    standard:  { hr: 1.0, bp: 1.0, spo2: 1.0 },
    elderly:   { hr: 0.9, bp: 1.15, spo2: 0.97 },
    obese:     { hr: 1.1, bp: 1.1, spo2: 0.96 },
    pediatric: { hr: 1.4, bp: 0.8, spo2: 1.0 },
    diabetic:  { hr: 1.05, bp: 1.1, spo2: 0.98 }
  };

  const mod = modifiers[profileId] || modifiers.standard;
  const urgencyMod = (selCase?.urgency === "URGENCE") ? 1.2 : 1.0;

  return {
    hr: Math.round(baseVitals.hr * mod.hr * urgencyMod + (Math.random() * 4 - 2)),
    bp: [
      Math.round(baseVitals.bp[0] * mod.bp * urgencyMod + (Math.random() * 6 - 3)),
      Math.round(baseVitals.bp[1] * mod.bp * urgencyMod + (Math.random() * 4 - 2))
    ],
    spo2: Math.min(100, Math.round(baseVitals.spo2 * mod.spo2 - (Math.random() * 1))),
    temp: (baseVitals.temp + (Math.random() * 0.4 - 0.2)).toFixed(1)
  };
}

export function calculateComplexity(result, profile) {
  if (!result || !result.path || !result.segs || result.segs.length === 0) return 0;
  const pathLen = result.path.length;
  const totalR = result.segs.reduce((a, s) => a + (s.r || 0), 0);
  const meanRisk = totalR / result.segs.length;
  const profileComplexity = ((profile?.alphaM || 1) + (profile?.betaM || 1) + (profile?.gammaM || 1)) / 3;
  
  const score = (pathLen * 5) + (meanRisk * 50) + (profileComplexity * 20);
  return isFinite(score) ? Math.min(100, Math.round(score)) : 0;
}

// ══════════════════════════════════════════════════════════════
//  V4: ADVANCED DIAGNOSTICS
// ══════════════════════════════════════════════════════════════

export function getPatientHistory(profileId, selCase) {
  const histories = {
    standard:  "Patient maintains a moderate lifestyle with no significant prior surgical history. Baseline cardiovascular health is within normal limits.",
    elderly:   "Patient presents with age-related tissue friability and a history of mild hypertension. Post-operative monitoring for cognitive stability recommended.",
    obese:     "Patient BMI indicates increased intra-abdominal pressure. Surgical access may be restricted; high-tension suturing techniques advised.",
    pediatric: "Pediatric physiology requires rapid anesthesia cycling and precise fluid management. Anatomical landmarks are tightly clustered.",
    diabetic:  "History of Type II Diabetes. Elevated risk of delayed wound healing and peroperative glycemic volatility. Prophylactic antibiotics indicated."
  };
  
  return histories[profileId] || histories.standard;
}

export function getDiagnosticMetrics(result, complexity) {
  if (!result || !result.segs || result.segs.length === 0) {
    return { recoveryTime: 0, resourceScore: 0, traumaIndex: "0.0" };
  }
  
  const baseRecovery = 14; 
  const recoveryTime = Math.round(baseRecovery + (complexity / 10) + ((result?.path?.length || 0) * 0.5));
  const validCost = isFinite(result.cost) ? result.cost : 0;
  const resourceScore = Math.min(100, Math.round((complexity * 0.7) + (validCost * 10)));
  
  const totalF = result.segs.reduce((a,s)=>a+(s.f||0), 0);
  const traumaIndex = (totalF / result.segs.length * 10).toFixed(1);
  
  return {
    recoveryTime,
    resourceScore,
    traumaIndex
  };
}
