'use client';

import { useEffect, useRef } from 'react';

// Индикатор прокрутки: яблоко катится вдоль правого края и вращается
export default function Progress() {
  const apple = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      const h = track.current ? track.current.offsetHeight : 0;
      if (apple.current) apple.current.style.transform = `translateY(${p * (h - 27)}px) rotate(${p * 900}deg)`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={track} className="apple-track" aria-hidden="true">
      <img ref={apple} src="/img/cut/apple.png" alt="" />
    </div>
  );
}
