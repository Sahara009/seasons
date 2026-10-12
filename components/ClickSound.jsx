'use client';

import { useEffect } from 'react';

// Звук на каждый щелчок по странице: затвор камеры и мягкая печатная машинка звучат по очереди.
const FILES = ['/sound/shutter.wav', '/sound/type.wav'];

export default function ClickSound() {
  useEffect(() => {
    const bank = FILES.map((src) => { const a = new Audio(src); a.preload = 'auto'; a.volume = 0.5; return a; });
    let n = 0;
    const on = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      const base = bank[n % bank.length]; n += 1;
      try {
        const a = base.cloneNode(); // клон, чтобы быстрые щелчки не обрывали друг друга
        a.volume = base.volume;
        a.play().catch(() => {});
      } catch (err) { /* без звука тоже работает */ }
    };
    document.addEventListener('pointerdown', on, true);
    return () => document.removeEventListener('pointerdown', on, true);
  }, []);
  return null;
}
