'use client';

import { useEffect, useRef, useState } from 'react';
import s from './Music.module.css';

// Фоновая музыка с кнопкой слева снизу. Браузеры не дают включать звук сам по себе,
// поэтому музыка стартует только по нажатию. Громкость плавно нарастает и затихает.
// Файл кладётся в public/sound/soundtrack.mp3; если его нет, кнопка не показывается.
const SRC = '/sound/soundtrack.mp3';
const VOLUME = 0.35;

export default function Music() {
  const audio = useRef(null);
  const fade = useRef(0);
  const [on, setOn] = useState(false);
  const [ok, setOk] = useState(true);

  const ramp = (to, done) => {
    const a = audio.current; cancelAnimationFrame(fade.current);
    const from = a.volume, t0 = performance.now(), dur = 900;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      a.volume = from + (to - from) * k;
      if (k < 1) fade.current = requestAnimationFrame(step); else if (done) done();
    };
    fade.current = requestAnimationFrame(step);
  };

  const toggle = () => {
    const a = audio.current; if (!a) return;
    if (on) { setOn(false); ramp(0, () => a.pause()); }
    else {
      a.volume = 0;
      a.play().then(() => { setOn(true); ramp(VOLUME); }).catch(() => setOn(false));
    }
  };

  // если вкладку свернули, музыку ставим на паузу, вернули — продолжаем
  useEffect(() => {
    const vis = () => {
      const a = audio.current; if (!a || !on) return;
      if (document.hidden) a.pause(); else a.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', vis);
    return () => document.removeEventListener('visibilitychange', vis);
  }, [on]);

  useEffect(() => () => cancelAnimationFrame(fade.current), []);

  if (!ok) return null;
  return (
    <>
      <audio ref={audio} src={SRC} loop preload="none" onError={() => setOk(false)} />
      <button type="button" className={s.btn} data-on={on ? '1' : '0'} onClick={toggle}
        aria-pressed={on} aria-label={on ? 'Выключить музыку' : 'Включить музыку'}>
        <span className={s.bars} aria-hidden="true"><i /><i /><i /><i /></span>
        <span className={s.label}>{on ? 'музыка вкл' : 'музыка'}</span>
      </button>
    </>
  );
}
