'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from '@/app/moodboard/moodboard.module.css';

// Палитра появляется как фокус:
// большой белый квадрат → по нему мелькают случайные цвета → остаются только наши →
// квадрат делится на маленькие и каждый улетает на своё место в сетке.
const GRID = 8; // клеток мерцания по стороне

export default function Palette({ colors }) {
  const root = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current;
    const q = gsap.utils.selector(el);
    const chips = q('[data-chip]');
    const texts = q('[data-txt]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const stage = q('[data-stage]')[0];
    const square = q('[data-square]')[0];
    const cells = q('[data-cell]');
    const tiles = q('[data-tile]');
    const hexes = colors.map((c) => c.hex);
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    let timer = 0;

    gsap.set(chips, { opacity: 0 });
    gsap.set(texts, { autoAlpha: 0, y: 12 });
    gsap.set(stage, { autoAlpha: 1 });
    gsap.set(square, { scale: 0.6, autoAlpha: 0 });
    gsap.set(tiles, { autoAlpha: 0 });
    let sq = null;

    // мерцание: каждые 70 мс несколько клеток вспыхивают цветом и гаснут обратно в белый
    const flicker = (pool, ms) => new Promise((done) => {
      const end = performance.now() + ms;
      const step = () => {
        for (let k = 0; k < 6; k++) {
          const c = pick(cells);
          const col = pool === 'any' ? `hsl(${Math.random() * 360} ${65 + Math.random() * 30}% ${42 + Math.random() * 18}%)` : pick(hexes);
          gsap.fromTo(c, { backgroundColor: col }, { backgroundColor: pool === 'any' ? '#ffffff' : col, duration: pool === 'any' ? 0.5 : 0.25, overwrite: true });
        }
        if (performance.now() < end) timer = setTimeout(step, 70); else done();
      };
      step();
    });

    // где квадрату делиться: сетка 5×2 (как сетка образцов на компьютере)
    const COLS = 5, ROWS = Math.ceil(colors.length / COLS);
    const layoutTiles = (gap) => {
      const r = sq || square.getBoundingClientRect(), sb = stage.getBoundingClientRect();
      const W = r.width, H = r.height, sx = r.left - sb.left, sy = r.top - sb.top;
      const tw = (W - gap * (COLS - 1)) / COLS, th = (H - gap * (ROWS - 1)) / ROWS;
      tiles.forEach((t, i) => gsap.set(t, { left: sx + (i % COLS) * (tw + gap), top: sy + Math.floor(i / COLS) * (th + gap), width: tw, height: th }));
    };

    const run = async () => {
      await gsap.to(square, { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.6)' });
      await flicker('any', 1700);
      await flicker('ours', 1100);
      // наши цвета собираются в квадрат из плиток
      sq = square.getBoundingClientRect();
      layoutTiles(0);
      await gsap.to(tiles, { autoAlpha: 1, duration: 0.35, stagger: { each: 0.04, from: 'random' } });
      gsap.set(square, { autoAlpha: 0 });
      // квадрат делится: между плитками появляются щели
      await gsap.to({ g: 0 }, { g: 14, duration: 0.5, ease: 'power2.out', onUpdate() { layoutTiles(this.targets()[0].g); } });
      // каждая плитка летит на место своего образца
      const sb = stage.getBoundingClientRect();
      await gsap.to(tiles, {
        left: (i) => chips[i].getBoundingClientRect().left - sb.left,
        top: (i) => chips[i].getBoundingClientRect().top - sb.top,
        width: (i) => chips[i].offsetWidth,
        height: (i) => chips[i].offsetHeight,
        borderRadius: 6, rotate: 0,
        duration: 1, ease: 'power3.inOut', stagger: 0.06,
      });
      gsap.set(chips, { opacity: 1 });
      gsap.set(stage, { autoAlpha: 0 });
      gsap.to(texts, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.03 });
    };

    const st = ScrollTrigger.create({ trigger: el, start: 'top 65%', once: true, onEnter: run });
    return () => { st.kill(); clearTimeout(timer); };
  }, [colors]);

  return (
    <div ref={root} className={s.palette}>
      <ul className={s.colors}>
        {colors.map((c) => (
          <li key={c.token} className={s.sw}>
            <span data-chip className={s.chip} style={{ background: c.hex }} />
            <b data-txt>{c.name}</b>
            <code data-txt>{c.hex}</code>
            <small data-txt>{c.role}</small>
          </li>
        ))}
      </ul>

      {/* сцена фокуса поверх сетки */}
      <div data-stage className={s.stage} aria-hidden="true">
        <div data-square className={s.square}>
          {Array.from({ length: GRID * GRID }, (_, i) => <span key={i} data-cell />)}
        </div>
        {colors.map((c) => <span key={c.token} data-tile className={s.tile} style={{ background: c.hex }} />)}
      </div>
    </div>
  );
}
