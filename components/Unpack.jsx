'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './Unpack.module.css';
import { currentIssue } from '@/data/content';

// «Номер приехал из типографии»: фото из поста Seasons лежат стопкой посередине,
// при прокрутке стопка раскладывается в коллаж. В центре остаётся обложка и кнопка «купить».
const PH = [
  { src: '/img/n81/dasha.jpg', cap: 'Даша на дереве', at: [1, 2, 15, -5] },
  { src: '/img/n81/leto.jpg', cap: 'В тени лета', at: [19, 6, 15, 4] },
  { src: '/img/n81/sunset.jpg', cap: 'Настроение', at: [66, 3, 15, -3] },
  { src: '/img/n81/kostroma.jpg', cap: 'Кострома', at: [84, 7, 15, 5] },
  { src: '/img/n81/mesta.jpg', cap: 'Места, которых нет', at: [3, 52, 15, 3] },
  { src: '/img/n81/barhat.jpg', cap: 'Бархат XVII века', at: [20, 49, 15, -4] },
  { src: '/img/n81/poems.jpg', cap: 'Рождественский', at: [65, 50, 15, 5] },
  { src: '/img/n81/reader.jpg', cap: 'Прямой с/цвет', at: [83, 53, 15, -2] },
];

export default function Unpack() {
  const root = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', () => {
      const cards = q('[data-card]');
      // из раскладки в стопку посередине, с разными наклонами
      const toCenter = (c) => {
        const st = q('[data-stage]')[0].getBoundingClientRect();
        const b = c.getBoundingClientRect();
        return { x: st.left + st.width / 2 - (b.left + b.width / 2), y: st.top + st.height / 2 - (b.top + b.height / 2) };
      };
      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
      cards.forEach((c, i) => {
        tl.from(c, { x: () => toCenter(c).x, y: () => toCenter(c).y, rotate: () => gsap.utils.random(-14, 14), scale: 0.7, duration: 1 }, i * 0.08);
      });
      tl.from(q('[data-center]'), { scale: 0.85, rotate: -6, duration: 0.8 }, 0)
        .from(q('[data-cta]'), { autoAlpha: 0, y: 20, duration: 0.4 }, 0.9);
      ScrollTrigger.create({ trigger: el, start: 'top top', end: '+=' + window.innerHeight * 1.2, pin: true, scrub: 0.7, animation: tl, invalidateOnRefresh: true, anticipatePin: 1 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className={s.sec} aria-labelledby="h-unpack">
      <div className={s.head}>
        <p className="tag">свежий номер · №{currentIssue.number}</p>
        <h2 id="h-unpack" className={s.h}>Осень приехала <i>из типографии</i></h2>
      </div>

      <div data-stage className={s.stage}>
        {PH.map((p) => (
          <figure key={p.src} data-card className={s.card} style={{ left: `${p.at[0]}%`, top: `${p.at[1]}%`, width: `${p.at[2]}%`, '--r': `${p.at[3]}deg` }}>
            <img src={p.src} alt="" loading="lazy" />
          </figure>
        ))}

        <div data-center className={s.center}>
          <img src="/img/n81/cover.jpg" alt={`Seasons of life №${currentIssue.number}, ${currentIssue.season}`} />
          <div data-cta className={s.cta}>
            <span className={s.theme}>тема номера — «{currentIssue.theme}»</span>
            <a href={currentIssue.shop} target="_blank" rel="noopener">купить за 700 ₽ →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
