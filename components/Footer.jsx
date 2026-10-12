'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './Footer.module.css';
import Mascot from './Mascot';
import { socials } from '@/data/content';

export default function Footer() {
  const root = useRef(null);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = root.current;
    const ctx = gsap.context(() => {
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

      <Mascot />

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
