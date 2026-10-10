'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './Shelf.module.css';
import { currentIssue, issues, SITE } from '@/data/content';

// Цвет подложки под каждой обложкой, как на оригинальной странице журналов
const TINT = { 81: '#E8D3B0', 79: '#DDE3B8', 77: '#E3E0DA', 76: '#EBD2C4', 72: '#CFE3EA', 71: '#EFE3D6', 69: '#D6E4D2', 68: '#DCE7C9', 45: '#F3D9DC' };

const ALL = [
  { no: currentIssue.number, season: currentIssue.season, cover: currentIssue.cover, href: currentIssue.shop },
  ...issues.map((i) => ({ no: i.no, season: i.season.toLowerCase(), cover: i.cover, href: `${SITE}/journal/about/` })),
];

// Архив журналов: три колонки плывут с разной скоростью, обложки при наведении поворачиваются к курсору
export default function Shelf() {
  const root = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = root.current;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-tile]', { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: '[data-grid]', start: 'top 80%' } });
      // колонки едут с разной скоростью: получается глубина
      mm.add('(min-width: 861px)', () => {
        const speeds = [-60, 90, -30];
        gsap.utils.toArray('[data-col]').forEach((col, i) => {
          gsap.fromTo(col, { y: -speeds[i] }, { y: speeds[i], ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
        });
      });
    }, el);

    // наклон обложки к курсору
    const tiles = [...el.querySelectorAll('[data-cover]')];
    const offs = [];
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      tiles.forEach((c) => {
        gsap.set(c, { transformPerspective: 800 });
        const rx = gsap.quickTo(c, 'rotationY', { duration: 0.5, ease: 'power3' });
        const ry = gsap.quickTo(c, 'rotationX', { duration: 0.5, ease: 'power3' });
        const lift = gsap.quickTo(c, 'y', { duration: 0.5, ease: 'power3' });
        const sc = gsap.quickTo(c, 'scale', { duration: 0.5, ease: 'power3' });
        const host = c.parentElement;
        const mv = (e) => {
          const r = host.getBoundingClientRect();
          rx(((e.clientX - r.left) / r.width - 0.5) * 26);
          ry(-((e.clientY - r.top) / r.height - 0.5) * 22);
          lift(-14); sc(1.06);
        };
        const lv = () => { rx(0); ry(0); lift(0); sc(1); };
        host.addEventListener('pointermove', mv);
        host.addEventListener('pointerleave', lv);
        offs.push(() => { host.removeEventListener('pointermove', mv); host.removeEventListener('pointerleave', lv); });
      });
    }
    return () => { offs.forEach((f) => f()); mm.revert(); ctx.revert(); };
  }, []);

  const cols = [0, 1, 2].map((c) => ALL.map((m, i) => ({ ...m, i })).filter((m) => m.i % 3 === c));

  return (
    <section ref={root} className={s.sec} id="journals" aria-labelledby="h-journals">
      <h2 className={s.h} id="h-journals">Журналы</h2>
      <div className={s.grid} data-grid>
        {cols.map((col, ci) => (
          <div key={ci} className={s.col} data-col>
            {col.map((m) => (
              <a key={m.no} data-tile className={s.tile} href={m.href} target="_blank" rel="noopener" aria-label={`Журнал Seasons of life №${m.no}, ${m.season}`} style={{ '--o': m.i }}>
                <span className={s.stage} style={{ background: TINT[m.no] }}>
                  <img data-cover className={s.cover} src={m.cover} alt="" loading="lazy" />
                </span>
                <span className={s.cap}><b>№{m.no}</b> {m.season}</span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
