'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './Actual.module.css';
import { actual } from '@/data/content';

// Спокойная лента: экран закрепляется, вертикальный скролл двигает карточки вбок, внизу тонкая линия показывает путь.
export default function Actual() {
  const root = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add('(min-width: 861px)', () => {
        const track = q('[data-track]')[0];
        const dist = () => Math.max(track.scrollWidth - window.innerWidth + window.innerWidth * 0.08, 0);
        const st = { trigger: q('[data-pin]')[0], start: 'top top', end: () => '+=' + dist(), invalidateOnRefresh: true };
        gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { ...st, pin: true, scrub: 0.7, anticipatePin: 1 } });
        gsap.fromTo(q('[data-bar]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { ...st, scrub: true } });
      });
    }, el);

    return () => { mm.revert(); ctx.revert(); };
  }, []);

  return (
    <section ref={root} className={s.sec} id="actual" aria-labelledby="h-actual">
      <div className={s.pin} data-pin>
        <h2 className="visually-hidden" id="h-actual">Актуальное</h2>

        <div className={s.track} data-track>
          {actual.map((a, i) => (
            <a key={a.href} className={s.card} href={a.href} target="_blank" rel="noopener">
              <span className={`${s.pic} ${a.image ? '' : s[a.tone] ?? ''}`}>
                {a.image
                  ? <img src={a.image} alt="" loading="eager" />
                  : <span className={s.note}>{a.note}</span>}
              </span>
              <span className={s.tag}>{a.tag}</span>
              <span className={s.title}>{a.title}</span>
            </a>
          ))}
        </div>

        <span className={s.rail} aria-hidden="true"><i data-bar /></span>
      </div>
    </section>
  );
}
