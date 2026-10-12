'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './Shelf.module.css';
import { currentIssue, issues, SITE } from '@/data/content';

const ALL = [
  { no: currentIssue.number, season: currentIssue.season, cover: currentIssue.cover, href: currentIssue.shop },
  ...issues.map((i) => ({ no: i.no, season: i.season.toLowerCase(), cover: i.cover, href: `${SITE}/journal/about/` })),
];

// Архив журналов: ровная сетка по три в ряд; каждая обложка стоит в матовом прозрачном кармане и при наведении выезжает из него
export default function Shelf() {
  const root = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = root.current;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-tile]', { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.06, scrollTrigger: { trigger: '[data-grid]', start: 'top 80%' } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.sec} id="journals" aria-labelledby="h-journals">
      <h2 className={s.h} id="h-journals">Журналы</h2>
      <div className={s.grid} data-grid>
        {ALL.map((m) => (
          <a key={m.no} data-tile className={s.tile} href={m.href} target="_blank" rel="noopener" aria-label={`Журнал Seasons of life №${m.no}, ${m.season}`}>
            <span className={s.stage}>
              <img data-cover className={s.cover} src={m.cover} alt="" loading="lazy" />
              <span className={s.sleeve} aria-hidden="true" />
            </span>
            <span className={s.cap}><b>№{m.no}</b> {m.season}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
