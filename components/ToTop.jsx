'use client';

import { useEffect, useRef, useState } from 'react';
import s from './ToTop.module.css';

// Круглая кнопка «наверх» справа снизу. Появляется после первого экрана,
// янтарное кольцо вокруг показывает, сколько страницы уже прочитано.
export default function ToTop() {
  const ring = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const draw = () => {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, window.scrollY / max);
      if (ring.current) ring.current.style.strokeDashoffset = String(1 - p);
      setShow(window.scrollY > window.innerHeight * 0.9);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(draw); };
    draw();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);

  const up = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button type="button" className={s.btn} data-on={show ? '1' : '0'} onClick={up} aria-label="Наверх" tabIndex={show ? 0 : -1}>
      <svg className={s.ring} viewBox="0 0 60 60" aria-hidden="true">
        <circle cx="30" cy="30" r="28" pathLength="1" className={s.track} />
        <circle ref={ring} cx="30" cy="30" r="28" pathLength="1" className={s.bar} />
      </svg>
      <svg className={s.arrow} viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
