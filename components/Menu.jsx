'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import s from './Menu.module.css';
import { nav } from '@/data/content';

// Круглая кнопка в углу. Меню раскрывается кругом из неё на весь экран, пункты выезжают из-под масок.
export default function Menu() {
  const [open, setOpen] = useState(false);
  const layer = useRef(null);
  const burger = useRef(null);
  const first = useRef(true);

  useEffect(() => {
    const el = layer.current;
    if (!el) return;
    if (first.current) { first.current = false; return; } // не играть анимацию при первом рендере

    const lenis = window.__lenis;
    if (lenis) open ? lenis.stop() : lenis.start();
    document.documentElement.style.overflow = open && !lenis ? 'hidden' : '';

    const links = el.querySelectorAll('[data-link]');
    const deco = el.querySelectorAll('[data-deco]');
    gsap.killTweensOf([el, links, deco]);

    if (open) {
      gsap.set(el, { visibility: 'visible' });
      gsap.fromTo(el, { clipPath: 'circle(0px at calc(100% - 52px) 52px)' }, { clipPath: 'circle(170vmax at calc(100% - 52px) 52px)', duration: 1.1, ease: 'power3.inOut' });
      gsap.fromTo(links, { yPercent: 115, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: 0.06, delay: 0.4 });
      gsap.fromTo(deco, { y: -300, rotate: -90, autoAlpha: 0 }, { y: 0, rotate: (i, t) => Number(t.dataset.deco), autoAlpha: 1, duration: 1.3, ease: 'bounce.out', stagger: 0.12, delay: 0.5 });
      const t = setTimeout(() => el.querySelector('a')?.focus({ preventScroll: true }), 600);
      const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); burger.current?.focus(); } };
      window.addEventListener('keydown', onKey);
      return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
    }
    gsap.to(el, { clipPath: 'circle(0px at calc(100% - 52px) 52px)', duration: 0.8, ease: 'power3.inOut', onComplete: () => gsap.set(el, { visibility: 'hidden' }) });
  }, [open]);

  return (
    <>
      <button
        ref={burger}
        className={`${s.burger} ${open ? s.isOpen : ''}`}
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span /><span />
      </button>

      <div ref={layer} className={s.layer} id="site-menu" aria-hidden={!open} data-lenis-prevent>
        <nav className={s.nav} aria-label="Разделы">
          {nav.map((item) => (
            <span key={item.href} className={s.mask}>
              <a data-link className={s.big} href={item.href} {...(item.internal ? {} : { target: '_blank', rel: 'noopener' })} tabIndex={open ? 0 : -1}>{item.label}</a>
            </span>
          ))}
        </nav>
        <img data-deco="12" className={`${s.deco} ${s.d1} cut-shadow`} src="/img/cut/apple.png" alt="" />
        <img data-deco="-18" className={`${s.deco} ${s.d2} cut-shadow`} src="/img/cut/leaf.png" alt="" />
        <img data-deco="24" className={`${s.deco} ${s.d3} cut-shadow`} src="/img/cut/plum.png" alt="" />
      </div>
    </>
  );
}
