'use client';

import { useEffect, useRef } from 'react';
import s from './HeroPaint.module.css';

// Фон главного экрана: несколько красных мазков «прорисовываются» при загрузке,
// а мышь оставляет за собой широкий мазок гуашью, который медленно высыхает и исчезает.
const COLORS = ['200,50,32', '214,72,38', '178,38,30', '222,120,52'];
const LIFE = 3600;

export default function HeroPaint() {
  const cv = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = cv.current;
    const host = c.parentElement;
    const ctx = c.getContext('2d');
    let w = 0, h = 0, raf = 0, down = false, ci = 0;
    const pts = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host.clientWidth; h = host.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = (now) => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (let i = 2; i < pts.length; i++) {
        const a = pts[i - 2], b = pts[i - 1], d = pts[i];
        if (d.t - b.t > 160) continue; // кисть оторвалась
        const life = 1 - (now - b.t) / LIFE;
        if (life <= 0) continue;
        const k = life * life * (3 - 2 * life); // мягкое высыхание
        const x1 = (a.x + b.x) / 2, y1 = (a.y + b.y) / 2, x2 = (b.x + d.x) / 2, y2 = (b.y + d.y) / 2;
        const sp = Math.hypot(d.x - b.x, d.y - b.y);
        const base = (down ? 54 : 38) * (1 - Math.min(sp, 50) / 140);
        // нажим: кисть шире в начале мазка и тоньше к концу
        ctx.strokeStyle = `rgba(${b.c},${0.5 * k})`;
        ctx.lineWidth = base * (0.6 + 0.4 * k);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(b.x, b.y, x2, y2); ctx.stroke();
        // щетина: тонкие полосы чуть темнее по ширине кисти
        const nx = -(d.y - a.y), ny = d.x - a.x, nl = Math.hypot(nx, ny) || 1;
        for (let j = -2; j <= 2; j++) {
          const o = (j / 2) * base * 0.42, ox = (nx / nl) * o, oy = (ny / nl) * o;
          ctx.strokeStyle = `rgba(120,22,16,${0.16 * k})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(x1 + ox, y1 + oy); ctx.quadraticCurveTo(b.x + ox, b.y + oy, x2 + ox, y2 + oy); ctx.stroke();
        }
      }
      if (pts.length) raf = requestAnimationFrame(draw);
    };

    const move = (e) => {
      const r = host.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      const last = pts[pts.length - 1];
      if (!last || performance.now() - last.t > 400) ci = (ci + 1) % COLORS.length; // новый мазок: другой оттенок
      pts.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now(), c: COLORS[ci] });
      if (pts.length > 500) pts.splice(0, 120);
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const dn = () => { down = true; };
    const up = () => { down = false; };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', dn);
    window.addEventListener('pointerup', up);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', dn);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={s.paint} aria-hidden="true">
      <svg className={s.swoosh} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* шероховатый край, как у сухой кисти */}
          <filter id="dry" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.22" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="22" />
          </filter>
        </defs>
        <g filter="url(#dry)" fill="none" strokeLinecap="round">
          <path className={s.m1} pathLength="1" d="M-40 760 C 180 640, 330 700, 520 520 S 760 250, 980 300" />
          <path className={s.m2} pathLength="1" d="M1480 120 C 1300 60, 1160 200, 1210 330 S 1420 430, 1330 560" />
          <path className={s.m3} pathLength="1" d="M60 150 C 150 90, 270 110, 310 190 S 220 300, 140 250" />
        </g>
      </svg>
      <canvas ref={cv} className={s.canvas} />
    </div>
  );
}
