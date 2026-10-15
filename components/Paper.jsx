// Бумажные мотивы: рваный край между секциями и оторванный уголок листа.
// Зазубрины считаются детерминированно от seed, поэтому на сервере и в браузере рисуются одинаково.
const rnd = (seed) => { let x = Math.sin(seed * 9301 + 49297) * 233280; return () => { x = Math.sin(x) * 10000; return x - Math.floor(x); }; };

// Рваный край: ставится между секциями, цветом нижней секции, и наезжает на верхнюю
export function Tear({ color, seed = 1, height = 26 }) {
  const r = rnd(seed);
  const pts = [];
  for (let x = 0; x <= 100; x += 1.2 + r() * 1.6) pts.push(`${x.toFixed(2)}% ${(15 + r() * 70).toFixed(1)}%`);
  pts.push('100% 40%', '100% 100%', '0% 100%');
  return (
    <div aria-hidden="true" style={{ position: 'relative', zIndex: 5, height, marginTop: -height + 1, marginBottom: -1, background: color, clipPath: `polygon(${pts.join(',')})` }} />
  );
}

// Оторванный уголок листа: треугольник с рваной гипотенузой и волокнами бумаги по краю
export function PaperCorner({ corner = 'tr', size = 140, color = '#FBF7EC', seed = 3, style }) {
  const r = rnd(seed);
  const n = 26;
  const edge = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const j = (r() - 0.5) * 7;
    edge.push([100 * (1 - t) + j, 100 * t + j]); // от (100,0) к (0,100)
  }
  const d = `M0 0 L${edge.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')} Z`;
  const fiber = `M${edge.map(([x, y]) => `${(x - 2.2).toFixed(1)} ${(y - 2.2).toFixed(1)}`).join(' L')}`;
  const rot = { tl: 0, tr: 90, br: 180, bl: 270 }[corner];
  const pos = { tl: { top: 0, left: 0 }, tr: { top: 0, right: 0 }, br: { bottom: 0, right: 0 }, bl: { bottom: 0, left: 0 } }[corner];
  return (
    <svg aria-hidden="true" viewBox="-4 -4 108 108" width={size} height={size}
      style={{ position: 'absolute', zIndex: 4, pointerEvents: 'none', transform: `rotate(${rot}deg)`, filter: 'drop-shadow(2px 4px 5px rgba(40,30,10,.28))', ...pos, ...style }}>
      <path d={d} fill={color} />
      <path d={fiber} fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="2.4" strokeLinejoin="round" />
      <path d={d} fill="url(#paperGrain)" opacity=".35" />
      <defs>
        <pattern id="paperGrain" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".5" fill="#000" opacity=".12" /><circle cx="4" cy="3.5" r=".4" fill="#000" opacity=".08" />
        </pattern>
      </defs>
    </svg>
  );
}
