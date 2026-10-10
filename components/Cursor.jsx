'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Курсор: за мышью тянется линия, как от карандаша, и почти сразу бледнеет и исчезает.
// Штрих серый, как грифель.
// Кольцо появляется только над ссылками и кнопками. На тач-экранах всё скрыто.
const LIFE = 800; // сколько живёт штрих, мс

export default function Cursor() {
  const ring = useRef(null);
  const cv = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = ring.current;
    const c = cv.current;
    const ctx = c.getContext('2d');

    let w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const pts = [];
    let raf = 0;
    let down = false;

    const draw = (now) => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      // кривая через середины отрезков: линия получается гладкой, а не ломаной
      for (let i = 2; i < pts.length; i++) {
        const a = pts[i - 2], b = pts[i - 1], d = pts[i];
        if (d.t - b.t > 120) continue; // курсор постоял: штрих рвётся, как при отрыве карандаша
        const life = 1 - (now - b.t) / LIFE;
        if (life <= 0) continue;
        const mx1 = (a.x + b.x) / 2, my1 = (a.y + b.y) / 2;
        const mx2 = (b.x + d.x) / 2, my2 = (b.y + d.y) / 2;
        const speed = Math.hypot(d.x - b.x, d.y - b.y);
        // чем быстрее движение, тем тоньше линия, как у настоящего карандаша
        const lw = (down ? 3.4 : 2.4) * (0.55 + 0.45 * life) * (1 - Math.min(speed, 40) / 120);
        ctx.strokeStyle = `rgba(92,90,84,${0.85 * life})`;
        ctx.lineWidth = lw;
        ctx.beginPath(); ctx.moveTo(mx1, my1); ctx.quadraticCurveTo(b.x, b.y, mx2, my2); ctx.stroke();
        // вторая, едва заметная линия со сдвигом даёт зернистость графита
        ctx.strokeStyle = `rgba(92,90,84,${0.3 * life})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(mx1 + 0.9, my1 - 0.7); ctx.quadraticCurveTo(b.x + 0.9, b.y - 0.7, mx2 + 0.9, my2 - 0.7); ctx.stroke();
      }
      if (pts.length) raf = requestAnimationFrame(draw);
    };

    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
    const move = (e) => {
      const hit = e.target.closest?.('a, button, input, [data-cursor]');
      el.classList.toggle('on', !!hit);
      el.classList.toggle('big', !!hit);
      x(e.clientX); y(e.clientY);
      if (reduce) return;
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (pts.length > 400) pts.splice(0, 100);
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const leave = () => { el.classList.remove('on', 'big'); pts.length = 0; };
    const dn = () => { down = true; };
    const up = () => { down = false; };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', dn);
    window.addEventListener('pointerup', up);
    window.addEventListener('resize', resize);
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', dn);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('resize', resize);
      document.documentElement.removeEventListener('mouseleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <canvas ref={cv} className="pencil" aria-hidden="true" />
      <div ref={ring} className="ring" aria-hidden="true" />
    </>
  );
}
