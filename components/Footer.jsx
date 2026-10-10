'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './Footer.module.css';
import { socials } from '@/data/content';

// Вырезки, которые падают на дно подвала и остаются лежать кучей
const PILE = [
  { id: 'branch', x: '4%',  w: 'clamp(150px, 24vw, 380px)', r: -8,  b: '-2%' },
  { id: 'leaf',   x: '27%', w: 'clamp(46px, 6vw, 96px)',    r: 24,  b: '6%' },
  { id: 'carrot', x: '38%', w: 'clamp(60px, 9vw, 150px)',   r: -14, b: '-3%' },
  { id: 'apple',  x: '55%', w: 'clamp(76px, 12vw, 200px)',  r: 10,  b: '-4%' },
  { id: 'orange', x: '72%', w: 'clamp(80px, 13vw, 220px)',  r: -22, b: '0%' },
  { id: 'lemon',  x: '88%', w: 'clamp(46px, 7vw, 120px)',   r: 30,  b: '4%' },
];

export default function Footer() {
  const root = useRef(null);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = root.current;
    const ctx = gsap.context(() => {
      // вырезки падают, когда подвал показывается
      gsap.fromTo('[data-drop]',
        { y: () => -el.offsetHeight * 1.1, rotate: () => gsap.utils.random(-160, 160), autoAlpha: 0 },
        { y: 0, rotate: (i) => PILE[i].r, autoAlpha: 1, duration: 1.5, ease: 'bounce.out', stagger: { each: 0.12, from: 'random' },
          scrollTrigger: { trigger: el, start: 'top 55%', toggleActions: 'play none none reverse' } });
      // огромный логотип въезжает
      gsap.fromTo('[data-mark]', { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 70%' } });
    }, el);
    return () => ctx.revert();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setMsg(/.+@.+\..+/.test(email.trim())
      ? 'Это концепт: письмо никуда не отправлено.'
      : 'Проверьте адрес: в нём нет «@» или домена.');
  };

  return (
    <footer ref={root} className={s.footer}>
      <div className={s.top}>
        <h2 className={s.title}>Письма <em>от редакции</em></h2>
        <form className={s.form} onSubmit={submit} noValidate>
          <label className="visually-hidden" htmlFor="email">e-mail</label>
          <input id="email" type="email" placeholder="ваш e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" aria-label="Подписаться">Подписаться<i aria-hidden="true">→</i></button>
        </form>
        <div className={s.msg} aria-live="polite">{msg}</div>
      </div>

      <img data-mark className={s.mark} src="/img/logo-white.png" alt="Seasons of life" />

      <div className={s.pile} aria-hidden="true">
        {PILE.map((p) => (
          <div key={p.id} className={s.drop} style={{ left: p.x, width: p.w, bottom: p.b }}>
            <img data-drop className="cut-shadow" src={`/img/cut/${p.id}.png`} alt="" style={{ transform: `rotate(${p.r}deg)` }} />
          </div>
        ))}
      </div>

      <div className={s.bottom}>
        <span className={s.links}>
          {socials.map((x) => <a key={x.href} href={x.href} target="_blank" rel="noopener">{x.label}</a>)}
        </span>
        <span className={s.disclaimer}>Неофициальный концепт редизайна. Не является сайтом Seasons Project.</span>
        <a href="https://gatito-code.ru" target="_blank" rel="noopener">gatito-code.ru</a>
      </div>
    </footer>
  );
}
