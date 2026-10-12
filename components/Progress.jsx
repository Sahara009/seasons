'use client';

import { useEffect, useRef } from 'react';

// Свой скроллбар справа: яркая дорожка, на ней сердечко-яблоко, которое можно взять и потянуть.
// Родной скроллбар скрыт в globals.css. Сердечко покачивается от скорости прокрутки.
export default function Progress() {
  const track = useRef(null);
  const fill = useRef(null);
  const thumb = useRef(null);

  useEffect(() => {
    let raf = 0, last = window.scrollY, tilt = 0, dragging = false;
    const SIZE = () => (window.innerWidth < 700 ? 42 : 56);

    const max = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const draw = () => {
      raf = 0;
      const p = Math.min(Math.max(window.scrollY / max(), 0), 1);
      const h = track.current.clientHeight;
      const sz = SIZE();
      const v = window.scrollY - last; last = window.scrollY;
      tilt += (Math.max(-40, Math.min(40, v * 1.2)) - tilt) * 0.2;
      fill.current.style.transform = `scaleY(${p})`;
      thumb.current.style.width = sz + 'px';
      thumb.current.style.transform = `translate(-50%, ${p * (h - sz)}px) rotate(${tilt}deg)`;
      if (Math.abs(tilt) > 0.3) raf = requestAnimationFrame(draw);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(draw); };

    const toScroll = (clientY) => {
      const r = track.current.getBoundingClientRect(), sz = SIZE();
      const p = Math.min(Math.max((clientY - r.top - sz / 2) / (r.height - sz), 0), 1);
      const y = p * max();
      if (window.__lenis) window.__lenis.scrollTo(y, { immediate: dragging, duration: 0.8 });
      else window.scrollTo(0, y);
    };
    const down = (e) => { dragging = true; track.current.setPointerCapture(e.pointerId); thumb.current.dataset.drag = '1'; toScroll(e.clientY); };
    const move = (e) => { if (dragging) toScroll(e.clientY); };
    const up = () => { dragging = false; delete thumb.current.dataset.drag; };

    const el = track.current;
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    draw();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    const t = setInterval(on, 800); // страница растёт при загрузке картинок и закреплении блоков
    return () => {
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      window.removeEventListener('scroll', on); window.removeEventListener('resize', on);
      clearInterval(t); cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={track} className="sbar" role="presentation">
      <span ref={fill} className="sbar-fill" />
      <img ref={thumb} className="sbar-thumb" src="/img/cut/apple.png" alt="" draggable="false" />
    </div>
  );
}
