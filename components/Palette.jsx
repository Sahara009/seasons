'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from '@/app/moodboard/moodboard.module.css';

// Палитра появляется как фокус:
// белый квадрат → по нему мелькают случайные цвета → остаются только наши → квадрат раскалывается на плитки →
// выезжает белая палитра художника, и плитки ложатся на неё каплями краски: по краю и в середине.
const GRID = 8;
const VB = { w: 600, h: 460 };
// места для красок: часть по краю палитры (в обход выемки для пальца), часть россыпью в середине
const RIM = 7;
const MID = [[285, 172], [408, 214], [338, 300]];
const spot = (i, n) => {
  if (i >= RIM) { const [x, y] = MID[(i - RIM) % MID.length]; return { x: x / VB.w * 100, y: y / VB.h * 100 }; }
  const a = ((196 + (i * 262) / (RIM - 1)) * Math.PI) / 180;
  return { x: (322 + Math.cos(a) * 218) / VB.w * 100, y: (220 + Math.sin(a) * 158) / VB.h * 100 };
};

export default function Palette({ colors }) {
  const root = useRef(null);
  const [on, setOn] = useState(-1);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current;
    const q = gsap.utils.selector(el);
    const chips = q('[data-chip]');
    const texts = q('[data-txt]');
    const board = q('[data-board]')[0];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const stage = q('[data-stage]')[0];
    const square = q('[data-square]')[0];
    const cells = q('[data-cell]');
    const tiles = q('[data-tile]');
    const hexes = colors.map((c) => c.hex);
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    let timer = 0;

    gsap.set(chips, { opacity: 0 });
    gsap.set(texts, { autoAlpha: 0, x: -12 });
    gsap.set(board, { autoAlpha: 0, y: 60, rotate: -14, scale: 0.85 });
    gsap.set(stage, { autoAlpha: 1 });
    gsap.set(square, { scale: 0.6, autoAlpha: 0 });
    gsap.set(tiles, { autoAlpha: 0 });

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

    const COLS = 5, ROWS = Math.ceil(colors.length / COLS);
    let sq = null;
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
      sq = square.getBoundingClientRect();
      layoutTiles(0);
      await gsap.to(tiles, { autoAlpha: 1, duration: 0.35, stagger: { each: 0.04, from: 'random' } });
      gsap.set(square, { autoAlpha: 0 });
      await gsap.to({ g: 0 }, { g: 14, duration: 0.5, ease: 'power2.out', onUpdate() { layoutTiles(this.targets()[0].g); } });
      // выезжает палитра
      await gsap.to(board, { autoAlpha: 1, y: 0, rotate: -4, scale: 1, duration: 0.9, ease: 'back.out(1.4)' });
      // плитки по кругу ложатся на палитру мазками
      const sb = stage.getBoundingClientRect();
      await gsap.to(tiles, {
        left: (i) => chips[i].getBoundingClientRect().left - sb.left,
        top: (i) => chips[i].getBoundingClientRect().top - sb.top,
        width: (i) => chips[i].getBoundingClientRect().width,
        height: (i) => chips[i].getBoundingClientRect().height,
        borderRadius: '50%', rotate: 0,
        duration: 0.9, ease: 'power3.inOut', stagger: 0.09,
      });
      gsap.set(chips, { opacity: 1 });
      gsap.set(stage, { autoAlpha: 0 });
      gsap.fromTo(chips, { scale: 1.25 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, .4)', stagger: 0.04, clearProps: 'scale' });
      gsap.to(texts, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out', stagger: 0.03 });
    };

    const st = ScrollTrigger.create({ trigger: el, start: 'top 65%', once: true, onEnter: run });
    return () => { st.kill(); clearTimeout(timer); };
  }, [colors]);

  return (
    <div ref={root} className={s.palette}>
      <div className={s.easel}>
        {/* белая палитра художника с выемкой для пальца */}
        <div data-board className={s.board}>
          <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className={s.wood} aria-hidden="true">
            <defs>
              <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FFFFFF" /><stop offset=".6" stopColor="#FBFAF6" /><stop offset="1" stopColor="#F1EEE6" />
              </linearGradient>
            </defs>
            <path fillRule="evenodd" fill="url(#wood)" stroke="#E2DCCD" strokeWidth="1.5"
              d="M300 18 C470 18 592 108 586 238 C580 360 468 446 328 440 C248 436 228 388 258 350 C284 318 268 288 228 298 C188 308 158 340 116 330 C36 310 6 238 22 168 C42 78 158 18 300 18 Z M196 246 m-34 0 a34 30 0 1 0 68 0 a34 30 0 1 0 -68 0 Z" />
            <path fill="none" stroke="#E9E4D8" strokeWidth="1" opacity=".7" d="M80 150 C200 110 360 120 520 180 M70 210 C180 190 300 200 420 250 M300 60 C380 70 470 100 540 150" />
          </svg>
          {colors.map((c, i) => {
            const p = spot(i, colors.length);
            return (
              <span key={c.token} data-chip className={s.chip} data-on={on === i ? '1' : '0'}
                style={{ left: `${p.x}%`, top: `${p.y}%`, background: c.hex, '--d': `${-(i * 0.7)}s` }}
                onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(-1)}>
                <i>{c.name}</i>
              </span>
            );
          })}
        </div>
      </div>

      <ol className={s.legend}>
        {colors.map((c, i) => (
          <li key={c.token} data-on={on === i ? '1' : '0'} onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(-1)}>
            <span className={s.dot} style={{ background: c.hex }} />
            <b data-txt>{c.name}</b>
            <code data-txt>{c.hex}</code>
            <small data-txt>{c.role}</small>
          </li>
        ))}
      </ol>

      <div data-stage className={s.stage} aria-hidden="true">
        <div data-square className={s.square}>
          {Array.from({ length: GRID * GRID }, (_, i) => <span key={i} data-cell />)}
        </div>
        {colors.map((c) => <span key={c.token} data-tile className={s.tile} style={{ background: c.hex }} />)}
      </div>
    </div>
  );
}
