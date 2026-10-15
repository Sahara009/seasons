'use client';

import { useEffect, useRef } from 'react';

// Зерно бумаги на фоне секции. Под курсором зерно оживает: в круге оно мерцает и чуть светлеет.
// Ставится первым ребёнком секции; секции нужны position: relative и isolation: isolate.
const TILE = 200;
function makeTiles(n, alpha) {
  return Array.from({ length: n }, () => {
    const c = document.createElement('canvas'); c.width = c.height = TILE;
    const x = c.getContext('2d'); const d = x.createImageData(TILE, TILE);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random() < 0.5 ? 0 : 255;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
      d.data[i + 3] = Math.random() * alpha;
    }
    x.putImageData(d, 0, 0); return c;
  });
}

export default function Grain({ strength = 38, light = false }) {
  const base = useRef(null);
  const live = useRef(null);

  useEffect(() => {
    const host = base.current.parentElement;
    const b = base.current, l = live.current;
    const bx = b.getContext('2d'), lx = l.getContext('2d');
    const [still] = makeTiles(1, strength);
    const moving = makeTiles(4, strength * 2.2);
    const R = 170;
    const st = { x: -999, y: -999, a: 0, on: false, raf: 0, t: 0 };

    const size = () => {
      const w = host.clientWidth, h = host.clientHeight;
      for (const c of [b, l]) { c.width = w; c.height = h; }
      bx.fillStyle = bx.createPattern(still, 'repeat'); bx.fillRect(0, 0, w, h);
    };
    size();
    const ro = new ResizeObserver(size); ro.observe(host);

    const frame = (now) => {
      st.raf = 0;
      st.a += ((st.on ? 1 : 0) - st.a) * 0.12;
      lx.clearRect(0, 0, l.width, l.height);
      if (st.a > 0.02) {
        if (now - st.t > 40) st.t = now; // ~25 кадров в секунду достаточно для зерна
        const tile = moving[Math.floor(now / 40) % moving.length];
        const x0 = st.x - R, y0 = st.y - R;
        lx.save();
        lx.globalAlpha = st.a;
        lx.translate((Math.random() * TILE) | 0, (Math.random() * TILE) | 0);
        lx.fillStyle = lx.createPattern(tile, 'repeat');
        lx.fillRect(x0 - TILE, y0 - TILE, R * 2 + TILE, R * 2 + TILE);
        lx.restore();
        // мягкий круг: всё за пределами гаснет
        lx.globalCompositeOperation = 'destination-in';
        const g = lx.createRadialGradient(st.x, st.y, 0, st.x, st.y, R);
        g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        lx.fillStyle = g; lx.fillRect(x0, y0, R * 2, R * 2);
        lx.globalCompositeOperation = 'source-over';
        if (light) { const s = lx.createRadialGradient(st.x, st.y, 0, st.x, st.y, R); s.addColorStop(0, `rgba(255,250,235,${0.09 * st.a})`); s.addColorStop(1, 'rgba(255,250,235,0)'); lx.fillStyle = s; lx.fillRect(x0, y0, R * 2, R * 2); }
      }
      if (st.on || st.a > 0.02) st.raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!st.raf) st.raf = requestAnimationFrame(frame); };
    const move = (e) => { const r = host.getBoundingClientRect(); st.x = e.clientX - r.left; st.y = e.clientY - r.top; st.on = true; kick(); };
    const leave = () => { st.on = false; kick(); };
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (fine) { host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave); }
    return () => { ro.disconnect(); cancelAnimationFrame(st.raf); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); };
  }, [strength, light]);

  const css = { position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none', mixBlendMode: 'overlay' };
  return (<><canvas ref={base} aria-hidden="true" style={css} /><canvas ref={live} aria-hidden="true" style={css} /></>);
}
