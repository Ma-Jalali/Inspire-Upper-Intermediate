// Inspire Hub: lesson illustrations for the Vocabulary and Grammar pages, in the Unit 5 vocabulary style.
// Served by the Supabase edge function "lesson-art" (imported at deploy time); each SVG is saved to class-media on first request.
const W = '#FFFFFF', CO = '#FF6B5B';
const PAL = {
  blue:   { m: '#2563EB', d: '#1E3A8A', l: '#BFD8FB', b: '#EAF2FE' },
  purple: { m: '#7C3AED', d: '#4C1D95', l: '#D9C8FB', b: '#F3EDFE' },
  green:  { m: '#16803D', d: '#14532D', l: '#BFE6CC', b: '#E9F7EE' },
  orange: { m: '#EA580C', d: '#7C2D12', l: '#FDD2B0', b: '#FFF1E6' },
  gold:   { m: '#CA8A04', d: '#713F12', l: '#F9E08A', b: '#FEF8DC' },
  red:    { m: '#DC2626', d: '#7F1D1D', l: '#F8C3CB', b: '#FDECEE' },
  slate:  { m: '#475569', d: '#1E293B', l: '#D5DAE1', b: '#F1F3F6' },
  teal:   { m: '#0F766E', d: '#134E4A', l: '#B4E6DC', b: '#E6F6F3' },
  pink:   { m: '#DB2777', d: '#831843', l: '#FBCFE8', b: '#FDF0F6' },
  indigo: { m: '#4F46E5', d: '#312E81', l: '#C7D2FE', b: '#EEF0FF' },
  sky:    { m: '#0284C7', d: '#0C4A6E', l: '#BAE6FD', b: '#EAF6FD' },
};
const FONT = "font-family='Helvetica Neue, Helvetica, Arial, sans-serif' font-weight='800'";
const r1 = (n) => Math.round(n * 10) / 10;
function sp(x, y, s, f = CO) { const k = s * 0.28; return `<path d='M${x},${y - s} Q${r1(x + k)},${r1(y - k)} ${x + s},${y} Q${r1(x + k)},${r1(y + k)} ${x},${y + s} Q${r1(x - k)},${r1(y + k)} ${x - s},${y} Q${r1(x - k)},${r1(y - k)} ${x},${y - s}Z' fill='${f}'/>`; }
function heart(x, y, s, f = CO, st = '', sw = 4) { return `<path d='M${x},${r1(y + s * .9)} C${r1(x - s * 1.6)},${r1(y - s * .2)} ${r1(x - s * .6)},${r1(y - s * 1.4)} ${x},${r1(y - s * .5)} C${r1(x + s * .6)},${r1(y - s * 1.4)} ${r1(x + s * 1.6)},${r1(y - s * .2)} ${x},${r1(y + s * .9)}Z' fill='${f}'${st ? ` stroke='${st}' stroke-width='${sw}' stroke-linejoin='round'` : ''}/>`; }
function txt(x, y, s, f, t, extra = '') { return `<text x='${x}' y='${y}' text-anchor='middle' ${FONT} font-size='${s}' fill='${f}'${extra}>${t}</text>`; }
function rnd(seed) { let h = 2166136261; for (const c of seed) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; }
function confetti(P, seed) {
  const R = rnd(seed); const out = [];
  for (let i = 0; i < 18; i++) {
    const left = i % 2 === 0;
    const x = Math.round(left ? 60 + R() * 320 : 1220 + R() * 320), y = Math.round(70 + R() * 550);
    const k = R();
    if (k < 0.22) { const s = Math.round(10 + R() * 8); out.push(sp(x, y, s)); }
    else if (k < 0.47) { const s = Math.round(14 + R() * 12); out.push(`<rect x='${x}' y='${y}' width='${s}' height='${s}' rx='${Math.round(s / 3)}' transform='rotate(${Math.round(R() * 80)} ${x} ${y})' fill='none' stroke='${P.m}' stroke-width='4' opacity='.45'/>`); }
    else if (k < 0.72) { out.push(`<circle cx='${x}' cy='${y}' r='${Math.round(9 + R() * 9)}' fill='none' stroke='${P.d}' stroke-width='3.5' opacity='.25'/>`); }
    else { out.push(`<circle cx='${x}' cy='${y}' r='${Math.round(6 + R() * 8)}' fill='${P.m}' opacity='${[0.2, 0.4, 0.6][Math.floor(R() * 3)]}'/>`); }
  }
  return out.join('');
}
function frame(P, seed, motif, defs = '') {
  return `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='680' viewBox='0 0 1600 680'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#FFFFFF'/><stop offset='.55' stop-color='${P.b}'/><stop offset='1' stop-color='${P.l}'/></linearGradient><pattern id='d' width='34' height='34' patternUnits='userSpaceOnUse'><circle cx='17' cy='17' r='2.1' fill='${P.l}'/></pattern><radialGradient id='r' cx='.5' cy='.5' r='.5'><stop offset='0' stop-color='#FFFFFF' stop-opacity='.95'/><stop offset='1' stop-color='#FFFFFF' stop-opacity='0'/></radialGradient>${defs}</defs>` +
    `<rect width='1600' height='680' fill='url(#g)'/><rect width='1600' height='680' fill='url(#d)' opacity='.7'/><circle cx='170' cy='120' r='210' fill='${P.l}' opacity='.35'/><circle cx='1470' cy='600' r='240' fill='${P.l}' opacity='.4'/><circle cx='800' cy='340' r='330' fill='${P.l}' opacity='.45'/><circle cx='800' cy='340' r='300' fill='url(#r)'/><circle cx='800' cy='340' r='330' fill='none' stroke='${P.m}' stroke-width='2' stroke-dasharray='2 14' stroke-linecap='round' opacity='.5'/>` +
    confetti(P, seed) + `<ellipse cx='800' cy='632' rx='300' ry='16' fill='${P.d}' opacity='.07'/><g transform='translate(800 330)'>${motif}</g></svg>`;
}
const S = (P, w = 5) => `stroke='${P.d}' stroke-width='${w}' stroke-linejoin='round'`;
function bubble(P, x, y, w, h, rx, fill, tail) { // tail: [x1,x2,tipx,tipy] base on bottom edge
  const [a, b, tx, ty] = tail; const by = y + h - 6;
  return `<path d='M${a},${by} L${tx},${ty} L${b},${by} Z' fill='${fill}' ${S(P)}/><rect x='${x}' y='${y}' width='${w}' height='${h}' rx='${rx}' fill='${fill}' ${S(P)}/><path d='M${a + 3},${by - 2} L${tx},${ty - 7} L${b - 3},${by - 2}' fill='${fill}'/>`;
}
const M = {};
// ---------- Vocabulary ----------
M.u1v = ['blue', 'u1-vocab-talk', (P) =>
  bubble(P, -330, -200, 310, 170, 70, P.m, [-270, -200, -300, 28]) +
  `<circle cx='-235' cy='-115' r='15' fill='${W}'/><circle cx='-175' cy='-115' r='15' fill='${W}'/><circle cx='-115' cy='-115' r='15' fill='${W}'/>` +
  bubble(P, 20, -50, 320, 170, 70, W, [220, 290, 310, 176]) +
  `<rect x='76' y='0' width='206' height='20' rx='10' fill='${P.l}'/><rect x='76' y='42' width='134' height='20' rx='10' fill='${P.l}'/>` +
  heart(70, -170, 34, CO, P.d) + sp(330, -150, 22) + sp(-60, 120, 16) + sp(-340, 120, 14, P.m)];
M.u2v = ['green', 'u2-vocab-heal', (P) =>
  `<circle cx='0' cy='30' r='185' fill='${P.l}' ${S(P)}/>` +
  `<g clip-path='url(#cg)'><path d='M-150,-60 C-110,-120 -20,-120 0,-70 C20,-30 -30,-10 -50,20 C-70,55 -125,45 -150,15 C-175,-15 -180,-35 -150,-60Z' fill='${P.m}'/><path d='M50,60 C90,25 150,45 165,90 C178,135 130,185 85,170 C40,155 25,95 50,60Z' fill='${P.m}'/><path d='M60,-120 C95,-135 135,-110 120,-80 C108,-55 75,-62 62,-85Z' fill='${P.m}'/><path d='M-110,120 C-80,105 -50,130 -60,160 C-75,185 -120,170 -115,145Z' fill='${P.m}'/></g>` +
  `<ellipse cx='0' cy='30' rx='80' ry='185' fill='none' stroke='${P.d}' stroke-width='3' opacity='.22'/><line x1='-185' y1='30' x2='185' y2='30' stroke='${P.d}' stroke-width='3' opacity='.22'/>` +
  `<g transform='rotate(-30 0 30)'><rect x='-215' y='-14' width='430' height='88' rx='44' fill='${W}' ${S(P)}/><rect x='-52' y='-2' width='104' height='64' rx='14' fill='${P.l}'/>` +
  [-30, 0, 30].map(dx => `<circle cx='${dx}' cy='18' r='5' fill='${P.m}' opacity='.5'/><circle cx='${dx}' cy='42' r='5' fill='${P.m}' opacity='.5'/>`).join('') +
  `<circle cx='-150' cy='30' r='5' fill='${P.l}'/><circle cx='-120' cy='30' r='5' fill='${P.l}'/><circle cx='120' cy='30' r='5' fill='${P.l}'/><circle cx='150' cy='30' r='5' fill='${P.l}'/></g>` +
  `<path d='M150,-130 C160,-170 175,-195 205,-215' fill='none' stroke='${P.d}' stroke-width='6' stroke-linecap='round'/><ellipse cx='225' cy='-200' rx='40' ry='17' transform='rotate(-30 225 -200)' fill='${P.m}' ${S(P, 4)}/><ellipse cx='160' cy='-215' rx='34' ry='15' transform='rotate(-120 160 -215)' fill='${W}' ${S(P, 4)}/>` +
  heart(-230, -150, 32, CO, P.d) + sp(300, 90, 20) + sp(-300, 180, 14)];
M.u3v = ['orange', 'u3-vocab-summit', (P) =>
  `<circle cx='250' cy='-160' r='56' fill='${CO}' opacity='.9'/>` +
  `<polygon points='40,270 220,-50 390,270' fill='${P.l}' ${S(P)}/>` +
  `<polygon points='-370,270 -60,-170 250,270' fill='${P.m}' ${S(P)}/>` +
  `<path d='M-60,-170 L-131,-70 L-104,-84 L-80,-58 L-54,-88 L-26,-62 L11,-70 Z' fill='${W}' ${S(P, 4)}/>` +
  `<path d='M-250,250 L-120,195 L-205,130 L-95,70 L-150,10 L-85,-45' fill='none' stroke='${W}' stroke-width='7' stroke-dasharray='4 18' stroke-linecap='round' opacity='.9'/>` +
  `<line x1='-60' y1='-170' x2='-60' y2='-285' stroke='${P.d}' stroke-width='6' stroke-linecap='round'/><path d='M-57,-281 L22,-256 L-57,-230 Z' fill='${CO}' ${S(P, 4)}/>` +
  `<rect x='-390' y='266' width='800' height='12' rx='6' fill='${P.d}' opacity='.8'/>` + sp(-300, -120, 22) + sp(120, -230, 14) + sp(330, 60, 16)];
M.u6v1 = ['gold', 'u6-vocab-rings', (P) => {
  const ring = (cx, band) => `<circle cx='${cx}' cy='-10' r='105' fill='none' stroke='${P.d}' stroke-width='34'/><circle cx='${cx}' cy='-10' r='105' fill='none' stroke='${band}' stroke-width='24'/>`;
  const coins = [0, 1, 2, 3, 4, 5].map(i => { const yt = 236 - i * 28; return `<path d='M140,${yt} L140,${yt + 26} A70,22 0 0 0 280,${yt + 26} L280,${yt} Z' fill='${P.m}' ${S(P, 4)}/><ellipse cx='210' cy='${yt}' rx='70' ry='22' fill='${i % 2 ? P.l : P.m}' ${S(P, 4)}/>`; }).join('');
  return ring(-30, P.l) + ring(-170, P.m) + `<g clip-path='url(#rk)'>${ring(-30, P.l)}</g>` +
    `<polygon points='-195,-150 -145,-150 -125,-128 -170,-82 -215,-128' fill='${W}' ${S(P, 4)}/><path d='M-215,-128 L-125,-128 M-182,-150 L-170,-82 L-158,-150' fill='none' stroke='${P.l}' stroke-width='3'/>` +
    coins + `<circle cx='300' cy='-70' r='72' fill='${P.m}' ${S(P)}/><circle cx='300' cy='-70' r='52' fill='none' stroke='${W}' stroke-width='3' opacity='.6'/>` + txt(300, -44, 74, W, '$') +
    sp(-330, -150, 22) + sp(60, -200, 16) + sp(-300, 150, 14);
}, `<clipPath id='rk'><rect x='-140' y='30' width='80' height='80'/></clipPath>`];
M.u6v2 = ['red', 'u6-vocab-invites', (P) => {
  const env = (cx, cy, rot, fill) => `<g transform='rotate(${rot} ${cx} ${cy})'><rect x='${cx - 150}' y='${cy - 100}' width='300' height='200' rx='16' fill='${fill}' ${S(P)}/><path d='M${cx - 150},${cy - 96} L${cx},${cy + 14} L${cx + 150},${cy - 96}' fill='none' ${S(P)}/></g>`;
  const rows = [-128, -88, -48].map(y => `<rect x='110' y='${y}' width='90' height='16' rx='8' fill='${P.l}'/><rect x='222' y='${y}' width='44' height='16' rx='8' fill='${P.l}'/>`).join('');
  return env(-200, -40, -9, P.l) + env(-150, 40, 6, W) + heart(-150, 52, 26, CO, P.d) +
    `<path d='M90,-215 L290,-215 L290,190 L270,212 L250,190 L230,212 L210,190 L190,212 L170,190 L150,212 L130,190 L110,212 L90,190 Z' fill='${W}' ${S(P)}/>` +
    `<rect x='110' y='-182' width='130' height='18' rx='9' fill='${P.m}' opacity='.8'/>` + rows +
    `<line x1='110' y1='0' x2='270' y2='0' stroke='${P.l}' stroke-width='4' stroke-dasharray='3 10' stroke-linecap='round'/><rect x='110' y='116' width='160' height='28' rx='14' fill='${P.m}'/>` +
    `<circle cx='305' cy='-205' r='50' fill='${P.m}' ${S(P)}/><path d='M305,-230 L305,-182 M285,-202 L305,-182 L325,-202' fill='none' stroke='${W}' stroke-width='9' stroke-linecap='round' stroke-linejoin='round'/>` +
    sp(-20, -200, 20) + sp(-330, 170, 16) + sp(40, 170, 12);
}];
M.u6v3 = ['pink', 'u6-vocab-cake', (P) => {
  const scallop = (x0, w, y) => { let d = `M${x0 + 8},${y}`; for (let x = x0 + 8; x < x0 + w - 20; x += 34) d += ` Q${x + 17},${y + 22} ${x + 34},${y}`; return `<path d='${d}' fill='none' stroke='${P.m}' stroke-width='10' stroke-linecap='round'/>`; };
  const bell = (cx, cy, rot) => `<g transform='rotate(${rot} ${cx} ${cy})'><circle cx='${cx}' cy='${cy + 72}' r='15' fill='${W}' ${S(P, 4)}/><path d='M${cx - 58},${cy + 44} C${cx - 58},${cy - 8} ${cx - 46},${cy - 64} ${cx},${cy - 64} C${cx + 46},${cy - 64} ${cx + 58},${cy - 8} ${cx + 58},${cy + 44} L${cx + 74},${cy + 62} L${cx - 74},${cy + 62} Z' fill='${P.m}' ${S(P)}/></g>`;
  return `<ellipse cx='-70' cy='262' rx='230' ry='24' fill='${P.l}' ${S(P)}/>` +
    `<rect x='-240' y='140' width='340' height='118' rx='16' fill='${W}' ${S(P)}/>` + scallop(-240, 340, 152) +
    `<rect x='-200' y='42' width='260' height='100' rx='14' fill='${P.l}' ${S(P)}/>` + [-160, -120, -80, -40, 0, 40].map(x => `<circle cx='${x + 10}' cy='100' r='7' fill='${W}'/>`).join('') +
    `<rect x='-160' y='-48' width='180' height='92' rx='12' fill='${W}' ${S(P)}/>` + scallop(-160, 180, -36) +
    `<line x1='-70' y1='-48' x2='-70' y2='-86' stroke='${P.d}' stroke-width='5' stroke-linecap='round'/>` + heart(-70, -118, 34, CO, P.d) +
    bell(230, -60, -14) + bell(320, -20, 12) + `<path d='M262,-150 L238,-176 L232,-140 Z M272,-150 L298,-170 L300,-134 Z' fill='${CO}' ${S(P, 4)}/><circle cx='267' cy='-150' r='9' fill='${CO}' ${S(P, 4)}/>` +
    sp(-330, -140, 20) + sp(120, -200, 16) + sp(330, 170, 14);
}];
M.u7v1 = ['teal', 'u7-vocab-switchoff', (P) =>
  `<rect x='-300' y='30' width='380' height='176' rx='88' fill='${P.l}' ${S(P)}/><circle cx='-212' cy='118' r='66' fill='${W}' ${S(P)}/><circle cx='-6' cy='118' r='24' fill='none' stroke='${P.d}' stroke-width='6' opacity='.55'/>` +
  `<circle cx='180' cy='-100' r='95' fill='${P.m}' mask='url(#mm)'/><circle cx='180' cy='-100' r='95' fill='none' ${S(P)} mask='url(#mm)'/><circle cx='228' cy='-138' r='76' fill='none' ${S(P)} clip-path='url(#mc)'/>` +
  txt(300, -170, 60, P.d, 'Z', " opacity='.75'") + txt(345, -225, 42, P.d, 'z', " opacity='.6'") + txt(372, -262, 30, P.d, 'z', " opacity='.45'") +
  sp(40, -200, 16, P.m) + sp(-80, -120, 22) + sp(330, 60, 14, P.m) +
  `<path d='M-330,-40 C-320,-100 -270,-130 -230,-140 C-240,-95 -280,-55 -330,-40Z' fill='${P.m}' ${S(P, 4)}/><path d='M-330,-40 C-300,-80 -270,-105 -240,-130' fill='none' stroke='${W}' stroke-width='4' stroke-linecap='round'/>`,
  `<mask id='mm'><rect x='-400' y='-400' width='800' height='800' fill='white'/><circle cx='228' cy='-138' r='76' fill='black'/></mask><clipPath id='mc'><circle cx='180' cy='-100' r='95'/></clipPath>`];
M.u7v2 = ['indigo', 'u7-vocab-balance', (P) =>
  `<rect x='-100' y='244' width='200' height='26' rx='13' fill='${P.d}'/><rect x='-15' y='-150' width='30' height='398' rx='14' fill='${P.m}' ${S(P)}/>` +
  `<line x1='-280' y1='-128' x2='-370' y2='30' stroke='${P.d}' stroke-width='4'/><line x1='-280' y1='-128' x2='-190' y2='30' stroke='${P.d}' stroke-width='4'/><line x1='280' y1='-128' x2='190' y2='30' stroke='${P.d}' stroke-width='4'/><line x1='280' y1='-128' x2='370' y2='30' stroke='${P.d}' stroke-width='4'/>` +
  `<rect x='-310' y='-142' width='620' height='24' rx='12' fill='${W}' ${S(P)}/><circle cx='0' cy='-170' r='26' fill='${CO}' ${S(P, 4)}/>` +
  `<rect x='-322' y='-44' width='84' height='70' rx='12' fill='${P.m}' ${S(P)}/><path d='M-300,-44 L-300,-62 L-260,-62 L-260,-44' fill='none' ${S(P)}/><line x1='-322' y1='-14' x2='-238' y2='-14' stroke='${P.d}' stroke-width='4'/>` +
  heart(280, -6, 36, CO, P.d, 5) +
  `<path d='M-375,30 Q-280,112 -185,30 Z' fill='${P.l}' ${S(P)}/><path d='M185,30 Q280,112 375,30 Z' fill='${P.l}' ${S(P)}/>` +
  sp(-170, -230, 20) + sp(170, -230, 16) + sp(-340, 190, 14) + sp(330, 180, 18)];
M.u7v3 = ['orange', 'u7-vocab-stress', (P) => {
  const pt = (deg, r) => [r1(r * Math.cos(deg * Math.PI / 180)), r1(150 - r * Math.sin(deg * Math.PI / 180))];
  const arc = (a1, a2, c) => { const [x1, y1] = pt(a1, 200), [x2, y2] = pt(a2, 200); return `<path d='M${x1},${y1} A200,200 0 0 1 ${x2},${y2}' fill='none' stroke='${c}' stroke-width='40'/>`; };
  const ticks = [165, 135, 105, 75, 45, 15].map(a => { const [x1, y1] = pt(a, 238), [x2, y2] = pt(a, 252); return `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke='${P.d}' stroke-width='5' stroke-linecap='round' opacity='.5'/>`; }).join('');
  const [nx, ny] = pt(32, 168);
  return `<path d='M-275,150 A275,275 0 0 1 275,150 Z' fill='${W}' ${S(P)}/>` + arc(180, 122, P.l) + arc(120, 62, P.m) + arc(60, 0, CO) + ticks +
    `<line x1='0' y1='150' x2='${nx}' y2='${ny}' stroke='${P.d}' stroke-width='12' stroke-linecap='round'/><circle cx='0' cy='150' r='28' fill='${P.d}'/><circle cx='0' cy='150' r='10' fill='${W}'/>` +
    `<rect x='-300' y='148' width='600' height='30' rx='15' fill='${P.d}'/>` +
    `<polygon points='-232,-230 -292,-118 -252,-118 -276,-30 -196,-152 -238,-152 -206,-230' fill='${CO}' ${S(P, 4)}/>` +
    `<path d='M262,-200 C262,-200 228,-156 228,-136 A34,34 0 0 0 296,-136 C296,-156 262,-200 262,-200Z' fill='${P.l}' ${S(P, 4)}/><path d='M326,-110 C326,-110 304,-82 304,-70 A22,22 0 0 0 348,-70 C348,-82 326,-110 326,-110Z' fill='${P.l}' ${S(P, 4)}/>` +
    sp(-120, -220, 18) + sp(140, -250, 14);
}];
// ---------- Grammar ----------
M.u1g1 = ['blue', 'u1-gram-now', (P) => {
  let grid = ''; const done = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2]];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const x = -318 + c * 90, y = -66 + r * 66; grid += `<rect x='${x}' y='${y}' width='66' height='50' rx='12' fill='${P.l}'/>`; if (done.some(([a, b]) => a === c && b === r)) grid += `<path d='M${x + 18},${y + 26} l11,11 l21,-22' fill='none' stroke='${P.m}' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'/>`; }
  return `<rect x='-345' y='-170' width='300' height='310' rx='26' fill='${W}' ${S(P)}/><path d='M-345,-92 L-345,-144 A26,26 0 0 1 -319,-170 L-71,-170 A26,26 0 0 1 -45,-144 L-45,-92 Z' fill='${P.m}' ${S(P)}/>` +
    `<rect x='-290' y='-196' width='20' height='52' rx='10' fill='${W}' ${S(P, 4)}/><rect x='-120' y='-196' width='20' height='52' rx='10' fill='${W}' ${S(P, 4)}/>` + grid +
    `<circle cx='175' cy='0' r='186' fill='none' stroke='${P.m}' stroke-width='3' opacity='.2'/><circle cx='175' cy='0' r='164' fill='none' stroke='${P.m}' stroke-width='3' opacity='.35'/>` +
    `<circle cx='175' cy='0' r='140' fill='${W}' ${S(P)}/><path d='M175,-112 A112,112 0 1 1 78,-56' fill='none' stroke='${P.m}' stroke-width='22' stroke-linecap='round'/>` +
    `<line x1='175' y1='0' x2='175' y2='-70' stroke='${P.d}' stroke-width='11' stroke-linecap='round'/><line x1='175' y1='0' x2='226' y2='32' stroke='${P.d}' stroke-width='11' stroke-linecap='round'/><circle cx='175' cy='0' r='14' fill='${CO}'/>` +
    sp(30, -220, 18) + sp(360, -170, 14) + sp(-20, 200, 16);
}];
M.u1g2 = ['purple', 'u1-gram-questions', (P) =>
  bubble(P, -200, -205, 400, 330, 110, P.m, [-50, 40, -110, 196]) + txt(0, 52, 250, W, '?') +
  bubble(P, -370, -70, 140, 118, 46, W, [-330, -290, -350, 86]) + txt(-300, 18, 86, P.m, '?') +
  bubble(P, 232, -190, 128, 108, 42, P.l, [300, 336, 346, -50]) + txt(296, -110, 76, P.d, '?') +
  sp(270, 90, 22) + sp(-260, -170, 16) + sp(-120, 220, 14)];
M.u1g3 = ['orange', 'u1-gram-articles', (P) => {
  const tile = (x, y, w, h, rot, fill, tcol, t, fs) => { const cx = x + w / 2, cy = y + h / 2; return `<g transform='rotate(${rot} ${cx} ${cy})'><rect x='${x}' y='${y + 12}' width='${w}' height='${h}' rx='36' fill='${P.d}' opacity='.12'/><rect x='${x}' y='${y}' width='${w}' height='${h}' rx='36' fill='${fill}' ${S(P)}/>${txt(cx, cy + fs * .35, fs, tcol, t)}</g>`; };
  return tile(-350, -40, 170, 170, -8, W, P.d, 'a', 110) + tile(-120, -165, 200, 190, 4, P.m, W, 'an', 104) + tile(130, -40, 240, 170, -3, P.l, P.d, 'the', 96) +
    `<circle cx='-20' cy='130' r='36' fill='${CO}' ${S(P, 4)}/><path d='M-20,94 C-18,82 -14,76 -6,70' fill='none' stroke='${P.d}' stroke-width='5' stroke-linecap='round'/><ellipse cx='10' cy='80' rx='18' ry='9' transform='rotate(-25 10 80)' fill='${P.m}' ${S(P, 3)}/>` +
    sp(100, -210, 20) + sp(-300, -170, 16) + sp(330, 190, 14);
}];
M.u2g1 = ['teal', 'u2-gram-bridge', (P) => {
  const ax = (x) => { const t = (x + 275) / 550, u = 1 - t; return r1(280 * u * u + 2 * u * t * (-200) + 280 * t * t); };
  const cables = [-130, -65, 0, 65, 130].map(x => `<line x1='${x}' y1='${ax(x)}' x2='${x}' y2='140' stroke='${P.d}' stroke-width='4' opacity='.6'/>`).join('');
  return cables + `<path d='M-275,280 Q0,-200 275,280' fill='none' stroke='${P.d}' stroke-width='30' stroke-linecap='round'/><path d='M-275,280 Q0,-200 275,280' fill='none' stroke='${P.m}' stroke-width='20' stroke-linecap='round'/>` +
    `<rect x='-300' y='150' width='50' height='120' rx='8' fill='${W}' ${S(P)}/><rect x='250' y='150' width='50' height='120' rx='8' fill='${W}' ${S(P)}/>` +
    `<rect x='-370' y='136' width='740' height='26' rx='13' fill='${W}' ${S(P)}/>` +
    `<circle cx='-300' cy='-70' r='62' fill='${P.l}' ${S(P)}/><line x1='-300' y1='-70' x2='-300' y2='-106' stroke='${P.d}' stroke-width='8' stroke-linecap='round'/><line x1='-300' y1='-70' x2='-326' y2='-56' stroke='${P.d}' stroke-width='8' stroke-linecap='round'/><path d='M-352,-38 A62,62 0 0 1 -360,-90' fill='none' stroke='${P.m}' stroke-width='7' stroke-linecap='round'/><polygon points='-372,-84 -358,-104 -346,-84' fill='${P.m}'/>` +
    `<circle cx='300' cy='-70' r='62' fill='${P.m}' ${S(P)}/><polygon points='300,-110 310,-82 340,-82 316,-64 325,-36 300,-53 275,-36 284,-64 260,-82 290,-82' fill='${W}'/>` +
    `<path d='M-230,-110 C-120,-190 120,-190 230,-110' fill='none' stroke='${P.d}' stroke-width='5' stroke-dasharray='4 16' stroke-linecap='round' opacity='.4'/>` +
    sp(0, -230, 18) + sp(-160, 220, 14) + sp(170, 220, 14);
}];
M.u2g2 = ['indigo', 'u2-gram-hourglass', (P) =>
  `<rect x='30' y='-222' width='240' height='30' rx='13' fill='${P.d}'/><rect x='30' y='152' width='240' height='30' rx='13' fill='${P.d}'/>` +
  `<path d='M66,-192 C66,-92 132,-60 132,-20 C132,20 66,52 66,152 L234,152 C234,52 168,20 168,-20 C168,-60 234,-92 234,-192 Z' fill='${W}' ${S(P)}/>` +
  `<path d='M92,-140 C98,-92 140,-70 150,-36 C160,-70 202,-92 208,-140 Z' fill='${P.m}'/><line x1='150' y1='-30' x2='150' y2='118' stroke='${P.m}' stroke-width='6' stroke-dasharray='2 12' stroke-linecap='round'/><path d='M82,152 Q150,70 218,152 Z' fill='${P.m}'/>` +
  `<rect x='-370' y='70' width='340' height='58' rx='29' fill='${W}' ${S(P)}/><g clip-path='url(#pb)'><rect x='-365' y='75' width='250' height='48' rx='24' fill='${P.m}'/>` +
  [-360, -320, -280, -240, -200, -160].map(x => `<line x1='${x}' y1='128' x2='${x + 34}' y2='70' stroke='${W}' stroke-width='10' opacity='.3'/>`).join('') + `</g><circle cx='-115' cy='99' r='30' fill='${CO}' ${S(P)}/>` +
  `<path d='M-240,-30 A70,70 0 1 1 -170,40' fill='none' stroke='${P.m}' stroke-width='14' stroke-linecap='round'/><polygon points='-268,-36 -240,-62 -214,-34' fill='${P.m}'/>` +
  sp(-60, -200, 20) + sp(330, -80, 16) + sp(-330, 200, 14),
  `<clipPath id='pb'><rect x='-365' y='75' width='250' height='48' rx='24'/></clipPath>`];
M.u3g3 = ['gold', 'u3-gram-jars', (P) => {
  const jar = (x, n) => { let balls = ''; const cols = [-42, 0, 42]; for (let i = 0; i < n; i++) { const r = Math.floor(i / 3), c = i % 3; balls += `<circle cx='${x + cols[c]}' cy='${172 - r * 46}' r='21' fill='${(i + r) % 2 ? P.l : P.m}' ${S(P, 3)}/>`; }
    return `<rect x='${x - 78}' y='-58' width='156' height='262' rx='36' fill='${W}' ${S(P)}/>${balls}<rect x='${x + 40}' y='-30' width='12' height='110' rx='6' fill='${P.l}' opacity='.8'/><rect x='${x - 62}' y='-100' width='124' height='44' rx='12' fill='${P.m}' ${S(P)}/>`; };
  return jar(-235, 2) + jar(0, 7) + jar(235, 15) + `<rect x='-360' y='210' width='720' height='12' rx='6' fill='${P.d}' opacity='.8'/>` +
    sp(-120, -200, 18) + sp(120, -210, 14) + sp(350, -120, 16);
}];
M.u4g1 = ['purple', 'u4-gram-signpost', (P) =>
  `<path d='M-230,284 Q0,214 230,284 Z' fill='${P.l}' ${S(P)}/><rect x='-17' y='-250' width='34' height='510' rx='10' fill='${W}' ${S(P)}/><circle cx='0' cy='-266' r='22' fill='${CO}' ${S(P, 4)}/>` +
  `<polygon points='-20,-225 235,-225 290,-180 235,-135 -20,-135' fill='${P.m}' ${S(P)}/><rect x='20' y='-189' width='150' height='18' rx='9' fill='${W}' opacity='.9'/>` +
  `<polygon points='-265,-105 20,-105 20,-25 -265,-25 -315,-65' fill='${W}' ${S(P)}/><rect x='-230' y='-74' width='170' height='18' rx='9' fill='${P.l}'/>` +
  `<polygon points='-20,5 205,5 255,50 205,95 -20,95' fill='${P.l}' ${S(P)}/><rect x='20' y='41' width='130' height='18' rx='9' fill='${P.m}' opacity='.6'/>` +
  `<polygon points='-205,125 20,125 20,195 -205,195 -245,160' fill='${CO}' ${S(P)}/><rect x='-170' y='151' width='120' height='18' rx='9' fill='${W}' opacity='.9'/>` +
  sp(-300, -190, 20) + sp(330, -30, 16) + sp(300, 200, 14)];
M.u4g2 = ['sky', 'u4-gram-timeline', (P) =>
  `<line x1='-360' y1='175' x2='330' y2='175' stroke='${P.d}' stroke-width='6' stroke-linecap='round'/><polygon points='326,155 368,175 326,195' fill='${P.d}'/>` +
  [-280, -140, 0, 140, 280].map(x => `<line x1='${x}' y1='163' x2='${x}' y2='187' stroke='${P.d}' stroke-width='5' stroke-linecap='round'/>`).join('') +
  `<circle cx='-280' cy='175' r='22' fill='${CO}' ${S(P, 4)}/>` +
  `<rect x='-170' y='60' width='300' height='62' rx='31' fill='${P.m}' ${S(P)}/><g clip-path='url(#sb)'>` + [-170, -130, -90, -50, -10, 30, 70, 110].map(x => `<line x1='${x}' y1='124' x2='${x + 36}' y2='58' stroke='${W}' stroke-width='11' opacity='.3'/>`).join('') + `</g>` +
  `<line x1='-170' y1='126' x2='-170' y2='160' stroke='${P.d}' stroke-width='4' stroke-dasharray='3 8' opacity='.5'/><line x1='130' y1='126' x2='130' y2='160' stroke='${P.d}' stroke-width='4' stroke-dasharray='3 8' opacity='.5'/>` +
  `<line x1='236' y1='-24' x2='280' y2='158' stroke='${P.d}' stroke-width='4' stroke-dasharray='3 10' opacity='.5'/>` +
  `<rect x='150' y='-210' width='176' height='186' rx='24' fill='${W}' ${S(P)}/><path d='M150,-158 L150,-186 A24,24 0 0 1 174,-210 L302,-210 A24,24 0 0 1 326,-186 L326,-158 Z' fill='${P.m}' ${S(P)}/><path d='M194,-96 L228,-62 L288,-128' fill='none' stroke='${CO}' stroke-width='16' stroke-linecap='round' stroke-linejoin='round'/>` +
  `<circle cx='-250' cy='-80' r='76' fill='${P.l}' ${S(P)}/><line x1='-250' y1='-80' x2='-250' y2='-124' stroke='${P.d}' stroke-width='9' stroke-linecap='round'/><line x1='-250' y1='-80' x2='-216' y2='-60' stroke='${P.d}' stroke-width='9' stroke-linecap='round'/><circle cx='-250' cy='-80' r='9' fill='${CO}'/>` +
  sp(-40, -170, 20) + sp(60, -250, 14) + sp(-350, 60, 14),
  `<clipPath id='sb'><rect x='-170' y='60' width='300' height='62' rx='31'/></clipPath>`];
M.u5g1 = ['green', 'u5-gram-ifthen', (P) =>
  `<rect x='-300' y='-100' width='200' height='200' rx='30' transform='rotate(45 -200 0)' fill='${P.m}' ${S(P)}/>` + txt(-200, 32, 92, W, 'if') +
  `<path d='M-40,0 L76,0' stroke='${P.d}' stroke-width='6' stroke-dasharray='4 16' stroke-linecap='round' opacity='.5'/><polygon points='78,-20 112,0 78,20' fill='${P.d}'/>` +
  `<circle cx='245' cy='-50' r='150' fill='#FDE68A' opacity='.35'/>` +
  [-150, -120, -90, -60, -30].map(a => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<line x1='${r1(245 + 128 * c)}' y1='${r1(-50 + 128 * s)}' x2='${r1(245 + 168 * c)}' y2='${r1(-50 + 168 * s)}' stroke='${CO}' stroke-width='9' stroke-linecap='round'/>`; }).join('') +
  `<path d='M200,40 L290,40 L280,92 L210,92 Z' fill='${W}' ${S(P)}/><circle cx='245' cy='-50' r='106' fill='${W}' ${S(P)}/><rect x='202' y='40' width='86' height='10' fill='${W}'/>` +
  `<path d='M214,-44 Q229,-86 245,-44 Q261,-86 276,-44' fill='none' stroke='${CO}' stroke-width='7' stroke-linecap='round'/><line x1='222' y1='40' x2='214' y2='-42' stroke='${P.d}' stroke-width='4'/><line x1='268' y1='40' x2='276' y2='-42' stroke='${P.d}' stroke-width='4'/>` +
  `<rect x='208' y='92' width='74' height='20' rx='7' fill='${P.l}' ${S(P, 4)}/><rect x='213' y='112' width='64' height='20' rx='7' fill='${P.l}' ${S(P, 4)}/><path d='M226,132 Q245,158 264,132 Z' fill='${P.d}'/>` +
  sp(-340, -150, 18) + sp(-60, -190, 16) + sp(-60, 190, 14)];
M.u5g2 = ['indigo', 'u5-gram-imagine', (P) =>
  [[-170, -40, 92], [-70, -112, 112], [55, -82, 98], [-112, 32, 88], [12, 28, 92], [128, -2, 74]].map(([x, y, r]) => `<circle cx='${x}' cy='${y}' r='${r}' fill='${P.m}'/>`).join('') +
  `<circle cx='155' cy='135' r='30' fill='${P.m}'/><circle cx='212' cy='200' r='18' fill='${P.m}'/>` +
  `<circle cx='-45' cy='-44' r='62' fill='${W}' ${S(P)}/><path d='M-45,-106 A62,62 0 0 1 17,-44' fill='none' stroke='${P.l}' stroke-width='14' opacity='.8'/><ellipse cx='-45' cy='-44' rx='112' ry='26' transform='rotate(-18 -45 -44)' fill='none' stroke='${CO}' stroke-width='9'/>` +
  sp(-180, -100, 16, W) + sp(80, -140, 12, W) + sp(70, 30, 10, W) +
  `<circle cx='-260' cy='170' r='86' fill='${W}' ${S(P)}/><polygon points='-232,140 -232,200 -272,170' fill='${P.m}'/><polygon points='-272,140 -272,200 -312,170' fill='${P.m}'/>` +
  sp(300, -170, 20) + sp(-340, -170, 14) + sp(330, 120, 14)];
M.u6g1 = ['slate', 'u6-gram-parcel', (P) =>
  `<rect x='-340' y='176' width='680' height='50' rx='25' fill='${P.l}' ${S(P)}/>` + [-280, -170, -60, 50, 160, 270].map(x => `<circle cx='${x}' cy='201' r='13' fill='${W}' ${S(P, 4)}/>`).join('') +
  `<line x1='-330' y1='40' x2='-250' y2='40' stroke='${P.d}' stroke-width='7' stroke-linecap='round' opacity='.35'/><line x1='-350' y1='96' x2='-244' y2='96' stroke='${P.d}' stroke-width='7' stroke-linecap='round' opacity='.35'/>` +
  `<polygon points='60,-40 140,-110 140,96 60,170' fill='${P.l}' ${S(P)}/><rect x='-200' y='-40' width='260' height='210' rx='6' fill='${W}' ${S(P)}/><polygon points='-200,-40 -120,-110 140,-110 60,-40' fill='${P.b}' ${S(P)}/>` +
  `<rect x='-98' y='-37' width='56' height='204' fill='${P.m}' opacity='.5'/><polygon points='-98,-40 -18,-110 38,-110 -42,-40' fill='${P.m}' opacity='.5'/>` +
  `<rect x='-180' y='100' width='60' height='14' rx='7' fill='${P.l}'/><rect x='-180' y='126' width='40' height='14' rx='7' fill='${P.l}'/>` +
  `<circle cx='215' cy='-150' r='72' fill='${CO}' ${S(P)}/><circle cx='215' cy='-150' r='54' fill='none' stroke='${W}' stroke-width='3' opacity='.6'/><path d='M184,-152 L206,-128 L248,-174' fill='none' stroke='${W}' stroke-width='14' stroke-linecap='round' stroke-linejoin='round'/>` +
  sp(-280, -170, 20) + sp(320, 40, 16) + sp(-40, -220, 14)];
M.u6g2 = ['pink', 'u6-gram-salon', (P) => {
  let teeth = ''; for (let i = 0; i < 12; i++) teeth += `<rect x='${-322 + i * 23}' y='-30' width='11' height='86' rx='5' fill='${P.m}' ${S(P, 3)}/>`;
  return `<g transform='rotate(-18 -180 0)'>${teeth}<rect x='-336' y='-78' width='300' height='56' rx='20' fill='${P.m}' ${S(P)}/></g>` +
    `<g transform='rotate(28 130 -20)'><path d='M112,-6 L338,-66 L344,-50 L156,22 Z' fill='${W}' ${S(P)}/><path d='M112,-34 L338,26 L344,10 L156,-62 Z' fill='${P.l}' ${S(P)}/>` +
    `<line x1='132' y1='-20' x2='60' y2='-70' stroke='${P.m}' stroke-width='22' stroke-linecap='round'/><line x1='132' y1='-20' x2='60' y2='30' stroke='${P.m}' stroke-width='22' stroke-linecap='round'/>` +
    `<circle cx='20' cy='-96' r='46' fill='none' stroke='${P.d}' stroke-width='30'/><circle cx='20' cy='-96' r='46' fill='none' stroke='${P.m}' stroke-width='20'/><circle cx='20' cy='56' r='46' fill='none' stroke='${P.d}' stroke-width='30'/><circle cx='20' cy='56' r='46' fill='none' stroke='${P.m}' stroke-width='20'/>` +
    `<circle cx='132' cy='-20' r='13' fill='${CO}' ${S(P, 4)}/></g>` +
    heart(-200, 150, 30, CO, P.d) + sp(-100, -220, 18) + sp(300, 170, 18) + sp(-340, -150, 14) + sp(120, 200, 12);
}];
M.u7g1 = ['orange', 'u7-gram-fork', (P) =>
  `<path d='M-150,0 C-70,0 -80,-120 -6,-120' fill='none' stroke='${P.d}' stroke-width='5' stroke-dasharray='4 16' stroke-linecap='round' opacity='.5'/><path d='M-150,0 C-70,0 -80,120 -6,120' fill='none' stroke='${P.d}' stroke-width='5' stroke-dasharray='4 16' stroke-linecap='round' opacity='.5'/>` +
  `<rect x='-370' y='-55' width='220' height='110' rx='55' fill='${W}' ${S(P)}/>` + txt(-260, 20, 56, P.d, 'verb') +
  `<rect x='0' y='-188' width='250' height='134' rx='42' fill='${P.m}' ${S(P)}/>` + txt(125, -95, 86, W, '-ing') +
  `<rect x='0' y='54' width='350' height='134' rx='42' fill='${P.l}' ${S(P)}/>` + txt(175, 144, 62, P.d, 'to + verb') +
  sp(320, -170, 20) + sp(-300, -150, 16) + sp(-290, 160, 14)];
M.u7g2 = ['teal', 'u7-gram-senses', (P) => {
  const pos = [[-300, 70], [-150, -40], [0, -80], [150, -40], [300, 70]];
  const fills = [P.m, W, P.m, W, P.m];
  let s = `<path d='M-300,70 Q0,-230 300,70' fill='none' stroke='${P.d}' stroke-width='5' stroke-dasharray='4 16' stroke-linecap='round' opacity='.4'/>`;
  pos.forEach(([x, y], i) => { s += `<circle cx='${x}' cy='${y + 10}' r='72' fill='${P.d}' opacity='.12'/><circle cx='${x}' cy='${y}' r='72' fill='${fills[i]}' ${S(P)}/>`; });
  const [ex, ey] = pos[0]; s += `<path d='M${ex - 46},${ey} Q${ex},${ey - 40} ${ex + 46},${ey} Q${ex},${ey + 40} ${ex - 46},${ey} Z' fill='${W}'/><circle cx='${ex}' cy='${ey}' r='17' fill='${P.d}'/><circle cx='${ex + 6}' cy='${ey - 6}' r='5' fill='${W}'/>`;
  const [nx, ny] = pos[1]; s += `<ellipse cx='${nx - 12}' cy='${ny + 26}' rx='18' ry='13' transform='rotate(-20 ${nx - 12} ${ny + 26})' fill='${P.d}'/><rect x='${nx + 2}' y='${ny - 40}' width='7' height='68' rx='3' fill='${P.d}'/><path d='M${nx + 8},${ny - 40} q26,8 22,34 q-6,-14 -22,-16 z' fill='${P.d}'/>`;
  const [fx, fy] = pos[2]; for (let k = 0; k < 5; k++) { const a = (k * 72 - 90) * Math.PI / 180; s += `<circle cx='${r1(fx + 24 * Math.cos(a))}' cy='${r1(fy + 24 * Math.sin(a))}' r='17' fill='${W}'/>`; } s += `<circle cx='${fx}' cy='${fy}' r='12' fill='${CO}'/>`;
  const [cx, cy] = pos[3]; s += `<path d='M${cx - 34},${cy} L${cx + 34},${cy} L${cx + 24},${cy + 42} L${cx - 24},${cy + 42} Z' fill='${CO}' ${S(P, 4)}/><path d='M${cx - 40},${cy + 2} C${cx - 44},${cy - 30} ${cx - 10},${cy - 46} ${cx},${cy - 40} C${cx + 10},${cy - 46} ${cx + 44},${cy - 30} ${cx + 40},${cy + 2} Z' fill='${P.l}' ${S(P, 4)}/><circle cx='${cx}' cy='${cy - 46}' r='8' fill='${CO}'/>`;
  const [hx, hy] = pos[4]; s += `<rect x='${hx - 30}' y='${hy - 6}' width='60' height='50' rx='18' fill='${W}'/>` + [-24, -8, 8, 24].map((dx, i) => `<rect x='${hx + dx - 7}' y='${hy - 42 + [8, 0, 2, 10][i]}' width='14' height='50' rx='7' fill='${W}'/>`).join('') + `<rect x='${hx - 46}' y='${hy + 2}' width='14' height='38' rx='7' transform='rotate(-35 ${hx - 39} ${hy + 21})' fill='${W}'/>`;
  return s + sp(0, 140, 20) + sp(-330, -140, 16) + sp(330, -130, 16);
}];
M.u8g1 = ['blue', 'u8-gram-signs', (P) =>
  `<rect x='-370' y='266' width='740' height='12' rx='6' fill='${P.d}' opacity='.8'/>` +
  `<rect x='-238' y='30' width='16' height='240' rx='6' fill='${W}' ${S(P, 4)}/><rect x='-8' y='-14' width='16' height='284' rx='6' fill='${W}' ${S(P, 4)}/><rect x='222' y='22' width='16' height='248' rx='6' fill='${W}' ${S(P, 4)}/>` +
  `<circle cx='-230' cy='-60' r='96' fill='${P.m}' ${S(P)}/><path d='M-272,-60 L-242,-30 L-186,-92' fill='none' stroke='${W}' stroke-width='18' stroke-linecap='round' stroke-linejoin='round'/>` +
  `<path d='M0,-215 L118,-6 L-118,-6 Z' fill='${CO}' ${S(P, 6)}/><rect x='-10' y='-150' width='20' height='86' rx='10' fill='${W}'/><circle cx='0' cy='-40' r='12' fill='${W}'/>` +
  `<rect x='145' y='-145' width='170' height='170' rx='36' fill='${W}' ${S(P)}/><circle cx='230' cy='-74' r='42' fill='${P.l}' ${S(P, 4)}/><rect x='212' y='-34' width='36' height='14' rx='4' fill='${P.m}'/><rect x='216' y='-18' width='28' height='12' rx='4' fill='${P.m}'/><path d='M216,-72 Q223,-94 230,-72 Q237,-94 244,-72' fill='none' stroke='${P.m}' stroke-width='5' stroke-linecap='round'/>` +
  sp(-100, -210, 18) + sp(110, -230, 14) + sp(340, 140, 16) + sp(-350, 140, 14)];
M.u8g2 = ['slate', 'u8-gram-detective', (P) => {
  const prints = [[-340, 238, -32], [-292, 206, -32], [-268, 150, -40], [-214, 130, -40], [-196, 72, -48]].map(([x, y, rot], i) => `<g transform='rotate(${rot} ${x} ${y})' opacity='.55'><ellipse cx='${x + (i % 2 ? 12 : -12)}' cy='${y}' rx='14' ry='24' fill='${P.m}'/><circle cx='${x + (i % 2 ? 12 : -12)}' cy='${y + 32}' r='11' fill='${P.m}'/></g>`).join('');
  return prints + `<g transform='rotate(45 186 54)'><rect x='186' y='34' width='190' height='40' rx='20' fill='${P.m}' ${S(P)}/><rect x='176' y='30' width='34' height='48' rx='8' fill='${P.d}'/></g>` +
    `<circle cx='90' cy='-40' r='138' fill='${W}' ${S(P)}/><circle cx='90' cy='-40' r='116' fill='${P.b}' stroke='${P.m}' stroke-width='12'/><path d='M20,-120 A100,100 0 0 1 120,-140' fill='none' stroke='${W}' stroke-width='14' stroke-linecap='round'/>` +
    txt(90, 22, 170, P.m, '?') + sp(-80, -200, 18) + sp(300, -170, 16) + sp(-330, -80, 14) + sp(320, 160, 14);
}];
M.u9g1 = ['purple', 'u9-gram-reported', (P) =>
  bubble(P, -370, -190, 290, 190, 64, W, [-330, -270, -350, 40]) +
  `<text x='-262' y='-30' text-anchor='middle' font-family='Georgia, Times New Roman, serif' font-weight='700' font-size='200' fill='${P.m}'>“</text><text x='-180' y='-30' text-anchor='middle' font-family='Georgia, Times New Roman, serif' font-weight='700' font-size='200' fill='${P.m}'>”</text>` +
  `<path d='M-70,-150 C10,-250 120,-220 170,-120' fill='none' stroke='${P.d}' stroke-width='6' stroke-dasharray='4 16' stroke-linecap='round' opacity='.5'/><polygon points='150,-128 180,-96 190,-138' fill='${P.d}'/>` +
  bubble(P, 50, -60, 320, 200, 64, P.m, [270, 330, 350, 196]) +
  `<rect x='96' y='0' width='220' height='20' rx='10' fill='${W}'/><rect x='96' y='42' width='160' height='20' rx='10' fill='${W}' opacity='.75'/><rect x='96' y='84' width='190' height='20' rx='10' fill='${W}' opacity='.55'/>` +
  sp(-90, 120, 20) + sp(330, -200, 16) + sp(-20, -240, 14)];
M.u9g2 = ['orange', 'u9-gram-megaphone', (P) =>
  `<rect x='-352' y='-56' width='76' height='112' rx='20' fill='${W}' ${S(P)}/><rect x='-300' y='30' width='44' height='110' rx='14' fill='${P.d}'/>` +
  `<path d='M-284,-52 L-60,-170 Q-36,0 -60,170 L-284,52 Z' fill='${P.m}' ${S(P)}/><ellipse cx='-60' cy='0' rx='38' ry='170' fill='${P.l}' ${S(P)}/>` +
  `<path d='M20,-96 Q64,0 20,96' fill='none' stroke='${CO}' stroke-width='12' stroke-linecap='round'/><path d='M70,-148 Q140,0 70,148' fill='none' stroke='${P.m}' stroke-width='12' stroke-linecap='round' opacity='.65'/>` +
  [[180, -170, W], [200, -40, P.l], [170, 90, P.m]].map(([x, y, f], i) => `<rect x='${x}' y='${y}' width='190' height='72' rx='36' fill='${f}' ${S(P)}/><circle cx='${x + 38}' cy='${y + 36}' r='12' fill='${i === 2 ? W : CO}'/><rect x='${x + 64}' y='${y + 27}' width='96' height='18' rx='9' fill='${i === 2 ? W : P.d}' opacity='${i === 2 ? .85 : .35}'/>`).join('') +
  sp(-180, -220, 18) + sp(-330, 190, 14) + sp(30, 220, 16)];
M.u10g1 = ['sky', 'u10-gram-which', (P) => {
  const house = (x, hi) => `<rect x='${x - 62}' y='100' width='124' height='130' rx='6' fill='${hi ? P.m : W}' ${S(P)}/><polygon points='${x - 84},106 ${x},18 ${x + 84},106' fill='${hi ? P.d : P.l}' ${S(P)}/><rect x='${x - 18}' y='160' width='36' height='70' rx='8' fill='${hi ? W : P.l}' ${S(P, 4)}/><rect x='${x + 26}' y='126' width='24' height='24' rx='5' fill='${hi ? P.l : P.b}' ${S(P, 3)}/>`;
  return house(-270, 0) + house(-90, 0) + house(90, 1) + house(270, 0) + `<rect x='-370' y='226' width='740' height='12' rx='6' fill='${P.d}' opacity='.8'/>` +
    `<path d='M90,-12 C42,-70 32,-100 32,-122 A58,58 0 1 1 148,-122 C148,-100 138,-70 90,-12 Z' fill='${CO}' ${S(P)}/><circle cx='90' cy='-122' r='22' fill='${W}'/>` +
    sp(-250, -150, 20) + sp(300, -150, 16) + sp(-60, -210, 14);
}];
M.u10g2 = ['green', 'u10-gram-commas', (P) => {
  const comma = (cx, cy) => `<path d='M${cx + 44},${cy + 8} C${cx + 50},${cy + 72} ${cx + 12},${cy + 116} ${cx - 42},${cy + 136} C${cx - 16},${cy + 104} ${cx - 6},${cy + 84} ${cx - 6},${cy + 50} A48,48 0 1 1 ${cx + 44},${cy + 8} Z' fill='${P.m}' ${S(P)}/>`;
  return comma(-275, -10) + comma(255, -10) +
    `<rect x='-180' y='-150' width='360' height='250' rx='36' fill='${W}' ${S(P)}/><circle cx='-104' cy='-76' r='40' fill='${P.m}'/>` + txt(-104, -54, 62, W, 'i') +
    `<rect x='-42' y='-94' width='176' height='20' rx='10' fill='${P.l}'/><rect x='-42' y='-62' width='120' height='16' rx='8' fill='${P.l}' opacity='.7'/><rect x='-136' y='-6' width='272' height='20' rx='10' fill='${P.l}'/><rect x='-136' y='34' width='200' height='20' rx='10' fill='${P.l}'/>` +
    sp(0, -230, 20) + sp(-330, -170, 14) + sp(340, 180, 16) + sp(-40, 180, 14);
}];
// ---------- General pages ----------
M.course = ['indigo', 'course-overview', (P) =>
  `<g transform='rotate(-6 -150 20)'><rect x='-300' y='-150' width='300' height='340' rx='16' fill='${P.l}' ${S(P)}/><rect x='-280' y='-170' width='300' height='340' rx='16' fill='${W}' ${S(P)}/>` +
  `<rect x='-250' y='-130' width='150' height='18' rx='9' fill='${P.m}'/><rect x='-250' y='-92' width='230' height='12' rx='6' fill='${P.l}'/><rect x='-250' y='-66' width='200' height='12' rx='6' fill='${P.l}'/><rect x='-250' y='-40' width='220' height='12' rx='6' fill='${P.l}'/>` +
  [0,1,2].map(i => `<rect x='-250' y='${0 + i*34}' width='22' height='22' rx='6' fill='${P.m}' opacity='.9'/><path d='M${-244},${11 + i*34} l5,5 l10,-11' fill='none' stroke='${W}' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/><rect x='-216' y='${5 + i*34}' width='${160 - i*30}' height='12' rx='6' fill='${P.l}'/>`).join('') + `</g>` +
  `<g transform='rotate(38 190 -80)'><rect x='176' y='-190' width='28' height='170' rx='8' fill='${CO}' ${S(P)}/><rect x='176' y='-190' width='28' height='26' rx='8' fill='${P.l}' ${S(P)}/><path d='M176,-20 L190,16 L204,-20 Z' fill='${W}' ${S(P)}/><path d='M185,0 L190,14 L195,0 Z' fill='${P.d}'/></g>` +
  `<circle cx='250' cy='110' r='70' fill='${W}' ${S(P)}/><circle cx='250' cy='110' r='52' fill='none' stroke='${P.m}' stroke-width='3' opacity='.5'/><path d='M250,110 L250,70 M250,110 L278,126' stroke='${P.d}' stroke-width='6' stroke-linecap='round'/><circle cx='250' cy='110' r='7' fill='${CO}'/>` +
  sp(120, 60, 20) + sp(330, -40, 16) + sp(-340, 220, 14)];
M.schedule = ['teal', 'weekly-schedule', (P) =>
  `<rect x='-290' y='-170' width='400' height='380' rx='26' fill='${W}' ${S(P)}/><path d='M-290,-110 L-290,-144 A26,26 0 0 1 -264,-170 L84,-170 A26,26 0 0 1 110,-144 L110,-110 Z' fill='${P.m}' ${S(P)}/>` +
  `<rect x='-220' y='-200' width='22' height='60' rx='11' fill='${W}' ${S(P,4)}/><rect x='18' y='-200' width='22' height='60' rx='11' fill='${W}' ${S(P,4)}/>` +
  [0,1,2,3,4].map(c => [0,1,2,3].map(r => { const x = -262 + c*70, y = -84 + r*68; const done = r < 2 || (r===2 && c<3); const today = r===2 && c===3;
    return `<rect x='${x}' y='${y}' width='54' height='54' rx='14' fill='${today ? CO : (done ? P.l : W)}' ${today ? S(P,4) : `stroke='${P.l}' stroke-width='3'`}/>` + (done && !today ? `<path d='M${x+16},${y+28} l9,9 l15,-17' fill='none' stroke='${P.d}' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/>` : '') + (today ? `<circle cx='${x+27}' cy='${y+27}' r='7' fill='${W}'/>` : ''); }).join('')).join('') +
  `<circle cx='250' cy='-30' r='92' fill='${W}' ${S(P)}/><circle cx='250' cy='-30' r='72' fill='none' stroke='${P.l}' stroke-width='4'/>` +
  [0,90,180,270].map(a => { const ra=58, rb=70, rad=a*Math.PI/180; return `<line x1='${r1(250+ra*Math.cos(rad))}' y1='${r1(-30+ra*Math.sin(rad))}' x2='${r1(250+rb*Math.cos(rad))}' y2='${r1(-30+rb*Math.sin(rad))}' stroke='${P.d}' stroke-width='5' stroke-linecap='round'/>`; }).join('') +
  `<path d='M250,-30 L250,-78 M250,-30 L284,-10' stroke='${P.d}' stroke-width='7' stroke-linecap='round'/><circle cx='250' cy='-30' r='8' fill='${CO}'/>` +
  `<rect x='190' y='110' width='120' height='40' rx='20' fill='${P.m}' ${S(P)}/><rect x='206' y='126' width='60' height='8' rx='4' fill='${W}'/><circle cx='290' cy='130' r='6' fill='${W}'/>` +
  sp(340, -140, 20) + sp(-340, -200, 16) + sp(150, 200, 14)];

function svgFor(key) {
  const e = M[key]; if (!e) return null;
  const [pal, name, fn, defs] = e; const P = PAL[pal];
  let d = defs || '';
  if (key === 'u2v') d += `<clipPath id='cg'><circle cx='0' cy='30' r='183'/></clipPath>`;
  return { name, svg: frame(P, key, fn(P), d) };
}
export { svgFor };
