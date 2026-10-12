'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './School.module.css';
import { school } from '@/data/school';

// Школа Seasons как длинный общий стол:
// заголовок, где «для дураков» зачёркивается от руки; стопка фото, которую можно перетасовать;
// меню курсов как в кафе; бегущие строки того, что уже было; преподаватели как карточки рассадки.
const PHOTOS = [
  { src: '/img/school/cake.jpg', cap: 'гастровечеринка' },
  { src: '/img/school/kids.jpg', cap: 'детская мастерская' },
  { src: '/img/school/flowers.jpg', cap: 'весенний стол' },
];
const TINTS = ['#DE9A4B', '#B9C3A3', '#EBC394', '#D8D5A6', '#ECE4D3'];
const initials = (n) => n.split(' ').map((w) => w[0]).join('');

export default function School() {
  const root = useRef(null);
  const [order, setOrder] = useState([0, 1, 2]);
  const [open, setOpen] = useState(-1);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduce) { gsap.set('[data-strike]', { strokeDashoffset: 0 }); gsap.set('[data-new]', { autoAlpha: 1 }); return; }
      // зачёркивание «для дураков» и новое слово, написанное сверху
      gsap.timeline({ delay: 0.6 })
        .fromTo('[data-strike]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' })
        .fromTo('[data-new]', { autoAlpha: 0, y: 14, rotate: -8 }, { autoAlpha: 1, y: 0, rotate: -4, duration: 0.6, ease: 'back.out(2)' }, '+=0.1');
      // фото зала медленно приближается при прокрутке
      gsap.fromTo('[data-room]', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '[data-room]', start: 'top bottom', end: 'bottom top', scrub: true } });
      // всё остальное мягко поднимается
      gsap.utils.toArray('[data-up]').forEach((n) => gsap.fromTo(n, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: n, start: 'top 85%' } }));
      // карточки рассадки раскладываются по столу
      gsap.fromTo('[data-card]', { y: 60, rotate: () => gsap.utils.random(-14, 14), autoAlpha: 0 }, { y: 0, rotate: () => gsap.utils.random(-3, 3), autoAlpha: 1, duration: 0.8, ease: 'back.out(1.4)', stagger: 0.04, scrollTrigger: { trigger: '[data-table]', start: 'top 75%' } });
    }, el);
    return () => ctx.revert();
  }, []);

  // верхнее фото улетает вбок и ложится под низ стопки
  const shuffle = () => {
    const top = root.current.querySelector(`[data-photo="${order[0]}"]`);
    if (!top || gsap.isTweening(top)) return;
    gsap.to(top, {
      x: 260, rotate: 18, duration: 0.35, ease: 'power2.in',
      onComplete: () => { setOrder((o) => [...o.slice(1), o[0]]); gsap.to(top, { x: 0, rotate: 0, duration: 0.45, ease: 'power3.out' }); },
    });
  };

  return (
    <div ref={root} className={s.page}>
      {/* 1. заголовок на фото зала */}
      <header className={s.hero}>
        <div className={s.roomBox}><img data-room className={s.room} src="/img/school/room.jpg" alt="Длинный общий стол в студии Seasons" /></div>
        <div className={s.heroText}>
          <p className={s.kick}>с {school.since} года</p>
          <h1 className={s.h1}>
            Школа{' '}
            <span className={s.fool}>
              для дураков
              <svg className={s.strike} viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
                <path data-strike pathLength="1" d="M2 13 C 20 8, 40 15, 60 9 S 90 10, 98 7" />
              </svg>
              <em data-new className={s.newWord}>Seasons</em>
            </span>
          </h1>
        </div>
      </header>

      {/* 2. коротко, что это, и стопка фото */}
      <section className={s.about}>
        <div data-up>
          <p className={s.lead}>{school.lead}</p>
          <p className={s.body}>{school.what}</p>
        </div>
        <button type="button" className={s.stack} onClick={shuffle} aria-label="Показать следующее фото">
          {order.map((i, pos) => (
            <figure key={i} data-photo={i} className={s.photo} style={{ zIndex: 3 - pos, '--r': `${[-4, 5, -9][pos]}deg`, '--dx': `${pos * 14}px` }}>
              <img src={PHOTOS[i].src} alt="" />
              <figcaption>{PHOTOS[i].cap}</figcaption>
            </figure>
          ))}
          <span className={s.tap}>нажмите, чтобы перелистнуть</span>
        </button>
      </section>

      {/* 3. меню курсов */}
      <section className={s.menu} aria-labelledby="h-menu">
        <h2 id="h-menu" className={s.h2} data-up>Меню <i>сезона</i></h2>
        <div className={s.cols}>
          {[['для взрослых', school.adults], ['для детей', school.kids]].map(([label, list]) => (
            <div key={label} data-up>
              <p className={s.colHead}>{label}</p>
              <ul className={s.dishes}>
                {list.map((c, i) => (
                  <li key={c.t}>
                    <a href={c.href} target="_blank" rel="noopener">
                      <span className={s.dish}>{c.t}</span>
                      <span className={s.dots} />
                      <span className={s.no}>{String(i + 1).padStart(2, '0')}</span>
                    </a>
                    {c.note && <small>{c.note}</small>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 4. что уже было: две бегущие строки навстречу */}
      <section className={s.past} aria-label="Что уже было в Школе">
        <p className={s.pastHead}>а ещё у нас уже были</p>
        {[0, 1].map((row) => {
          const items = row ? school.past.slice(7) : school.past.slice(0, 8);
          return (
            <div key={row} className={`${s.ticker} ${row ? s.rev : ''}`}>
              <div className={s.run}>
                {[...items, ...items].map((t, i) => <span key={i}>{t}<b>✿</b></span>)}
              </div>
            </div>
          );
        })}
      </section>

      {/* 5. преподаватели как карточки рассадки на столе */}
      <section className={s.teachers} aria-labelledby="h-t">
        <h2 id="h-t" className={s.h2} data-up>Кто <i>за столом</i></h2>
        <p className={s.hintLine} data-up>нажмите на карточку, чтобы узнать, кто это</p>
        <ul className={s.table} data-table>
          {school.teachers.map((t, i) => (
            <li key={t.n} data-card>
              <button type="button" className={s.card} data-open={open === i ? '1' : '0'} onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span className={s.front}>
                  <span className={s.ini} style={{ background: TINTS[i % TINTS.length] }}>{initials(t.n)}</span>
                  <span className={s.name}>{t.n}</span>
                </span>
                <span className={s.back}>{t.r}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* 6. где и как присоединиться */}
      <section className={s.where}>
        <div className={s.ticket} data-up>
          <p className={s.kick}>где мы</p>
          <p className={s.addr}>{school.where.address}</p>
          <p>{school.where.place}</p>
          <p className={s.online}>{school.where.online}</p>
        </div>
        <div className={s.vol} data-up>
          <p className={s.kick}>волонтёрам</p>
          <p>{school.volunteers}</p>
          <a href={`mailto:${school.mail}`}>{school.mail}</a>
        </div>
      </section>

      <a className={s.home} href="/">← на главную</a>
    </div>
  );
}
