'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './Issues.module.css';
import { currentIssue, issues, SITE } from '@/data/content';

const ALL = [
  { no: currentIssue.number, season: currentIssue.season, theme: currentIssue.theme, cover: currentIssue.cover },
  ...issues,
];

// фон секции меняется вместе с сезоном выпуска
const TINT = { осень: '#5E4224', весна: '#4F6137', лето: '#2F4A9A', зима: '#2B3A55' };
const tintOf = (season) => TINT[(season.match(/осень|весна|лето|зима/i) || ['осень'])[0].toLowerCase()];

// у каждой обложки в стопке свой небрежный наклон
const ROT = [-3, 4, -5, 3, -2, 5, -4, 2];
const N_Z = ALL.length;
const level = (l) => ({ scale: 1 - 0.05 * Math.min(l, 3), y: 16 * Math.min(l, 3) });

export default function Issues() {
  const root = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const q = gsap.utils.selector(el);
    const covers = q('[data-cover]');
    const texts = q('[data-text]');
    const nums = q('[data-num]');
    const pin = q('[data-pin]')[0];
    const N = covers.length;

    const ctx = gsap.context(() => {
      gsap.set(covers, { rotate: (i) => ROT[i % ROT.length], scale: (i) => level(i).scale, y: (i) => level(i).y, transformOrigin: '50% 80%' });
      gsap.set([...texts.slice(1), ...nums.slice(1)], { autoAlpha: 0, yPercent: 30 });
      gsap.set(pin, { backgroundColor: tintOf(ALL[0].season) });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pin, start: 'top top', end: () => '+=' + (N - 1) * window.innerHeight * 0.8,
          pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
        },
      });

      for (let i = 0; i < N - 1; i++) {
        // верхняя обложка слетает со стопки вправо
        tl.to(covers[i], { xPercent: 150, yPercent: -8, rotate: 26, duration: 1, ease: 'power2.in' }, i)
          .to([texts[i], nums[i]], { autoAlpha: 0, yPercent: -30, duration: 0.4, ease: 'power2.in' }, i)
          .to(pin, { backgroundColor: tintOf(ALL[i + 1].season), duration: 1 }, i);
        // остальная стопка подтягивается на уровень выше
        for (let j = i + 1; j < Math.min(N, i + 5); j++) {
          const l = level(j - i - 1);
          tl.to(covers[j], { scale: l.scale, y: l.y, rotate: j === i + 1 ? ROT[(j + 3) % ROT.length] * 0.35 : ROT[j % ROT.length], duration: 1, ease: 'power2.out' }, i);
        }
        // новый текст и номер выплывают
        tl.fromTo([texts[i + 1], nums[i + 1]], { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: 0.5, ease: 'power2.out' }, i + 0.5);
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.sec} id="issues" aria-label="Номера журнала">
      <div className={s.pin} data-pin>
        <div className={s.nums} aria-hidden="true">
          {ALL.map((it) => <span key={it.no} data-num className={s.num}>{it.no}</span>)}
        </div>

        <div className={s.info}>
          {ALL.map((it) => (
            <div key={it.no} data-text className={s.text}>
              <span className={s.season}>{it.season}</span>
              <span className={s.theme}>{it.theme}</span>
              <a className={s.link} href={it.link?.href ?? `${SITE}/shop/`} target="_blank" rel="noopener">
                {it.link?.label ?? 'смотреть в магазине'}<i aria-hidden="true">→</i>
              </a>
            </div>
          ))}
        </div>

        <div className={s.deck}>
          {ALL.map((it, i) => (
            <div key={it.no} data-cover className={s.cover} style={{ zIndex: N_Z - i }}>
              <img src={it.cover} alt={`Обложка №${it.no}, ${it.season}`} loading={i < 2 ? 'eager' : 'lazy'} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
