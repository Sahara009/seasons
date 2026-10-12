'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import s from './Header.module.css';

// Шапка: слева логотип без подложки. Когда страницу листают быстро, он покачивается, как подвешенная бирка. Большой логотип на первом экране принадлежит этой же шапке.
export default function Header() {
  const left = useRef(null);

  useEffect(() => {
    // на страницах без заставки логотип и плашка сразу на месте
    if (!document.querySelector('[data-hero]')) {
      document.querySelector('[data-header]')?.style.setProperty('--pill', '1');
      const lg = document.querySelector('[data-logo]'); if (lg) lg.dataset.ready = '1';
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const a = gsap.quickTo(left.current, 'rotation', { duration: 0.6, ease: 'elastic.out(1,.45)' });
    gsap.set(left.current, { transformOrigin: '50% 0%' });
    let last = window.scrollY, t = 0;
    const on = () => {
      const y = window.scrollY, v = y - last; last = y;
      // во время вступления на главном экране логотип едет по плашке, там качать нельзя
      if (y < window.innerHeight * 2.6) { a(0); return; }
      const r = gsap.utils.clamp(-5, 5, v * 0.12);
      a(-r);
      clearTimeout(t); t = setTimeout(() => { a(0); }, 120);
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); clearTimeout(t); };
  }, []);

  return (
    <header className={s.header} data-header style={{ '--pill': 0 }}>
      {/* полоса сверху: размытие и светлая дымка, чтобы логотип, лупа и бургер читались на любом фоне */}
      <span className={s.veil} aria-hidden="true" />
      <a ref={left} className={s.logo} href="/" aria-label="Seasons of life, на главную">
        <img data-logo className={s.logoImg} src="/img/logo-moss.png" alt="Seasons of life" />
      </a>
    </header>
  );
}
