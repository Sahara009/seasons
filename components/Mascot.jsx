'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import s from './Mascot.module.css';

// Котик-оператор — маскот подвала: в наушниках, с ноутбуком, на связи.
// Её можно таскать и гладить (водить мышкой по шёрстке — летят сердечки).
// По нажатию она спрашивает «есть вопросик?», берёт курсор в рот и несёт его к полю e-mail.
const LINES = { ask: 'есть вопросик?', go: 'несу к письму…', here: 'пиши сюда, ответим!', pet: ['мурр', 'ещё!', 'на связи', 'хорошо…'] };

export default function Mascot() {
  const box = useRef(null);   // двигается целиком
  const body = useRef(null);  // качается, сжимается, разворачивается
  const st = useRef({ down: false, moved: 0, sx: 0, sy: 0, ox: 0, oy: 0, pet: 0, busy: false, lastX: 0 });
  const [say, setSay] = useState('');
  const [carry, setCarry] = useState(false);
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    // спокойное покачивание, будто дышит
    const bob = gsap.to(body.current, { y: -6, rotate: 2, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    return () => bob.kill();
  }, []);

  const talk = (t, ms = 1800) => {
    setSay(t);
    clearTimeout(st.current.sayT);
    if (ms) st.current.sayT = setTimeout(() => setSay(''), ms);
  };
  const face = () => {}; // котик всегда смотрит на нас

  const heart = (x, y) => {
    const id = Math.random();
    setHearts((h) => [...h, { id, x, y }]);
    setTimeout(() => setHearts((h) => h.filter((k) => k.id !== id)), 1200);
  };

  // унести курсор к полю e-mail
  const fetchCursor = () => {
    const S = st.current;
    const input = document.getElementById('email');
    if (!input || S.busy) return;
    S.busy = true;
    talk(LINES.ask, 0);
    const b = box.current.getBoundingClientRect();
    const r = input.getBoundingClientRect();
    const cur = { x: +gsap.getProperty(box.current, 'x'), y: +gsap.getProperty(box.current, 'y') };
    // рот под носом: подводим его к началу поля
    const dropX = r.left + Math.min(170, r.width * 0.35);
    const tx = cur.x + dropX - (b.left + b.width * 0.415);
    const ty = cur.y + (r.top + r.height / 2) - (b.top + b.height * 0.38);
    gsap.timeline({
      onComplete: () => {
        setCarry(false);
        document.documentElement.classList.remove('no-cursor');
        input.focus({ preventScroll: true });
        talk(LINES.here, 2200);
        // постояла и пошла обратно на своё место
        gsap.timeline({ delay: 2.4, onComplete: () => { S.busy = false; } })
          .call(() => face(1))
          .to(box.current, { x: 0, y: 0, duration: 1.4, ease: 'power1.inOut' })
          .to(body.current, { y: -14, duration: 0.17, yoyo: true, repeat: 7, ease: 'sine.out' }, 0);
      },
    })
      .call(() => { setCarry(true); document.documentElement.classList.add('no-cursor'); }, null, 0.9)
      .to(body.current, { scaleY: 0.86, duration: 0.12, yoyo: true, repeat: 1 }, 0.85)
      .call(() => { talk(LINES.go, 0); face(-1); }, null, 1.15)
      // идёт вприпрыжку
      .to(box.current, { x: tx, duration: 1.5, ease: 'power1.inOut' }, 1.2)
      .to(box.current, { y: ty, duration: 1.5, ease: 'power2.inOut' }, 1.2)
      .to(body.current, { y: -18, duration: 0.18, yoyo: true, repeat: 7, ease: 'sine.out' }, 1.2)
      .call(() => face(-1), null, 2.7);
  };

  const onDown = (e) => {
    const S = st.current;
    if (S.busy) return;
    S.down = true; S.moved = 0; S.sx = e.clientX; S.sy = e.clientY;
    S.ox = +gsap.getProperty(box.current, 'x'); S.oy = +gsap.getProperty(box.current, 'y'); S.lastX = e.clientX;
    box.current.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    const S = st.current;
    if (S.busy) return;
    if (S.down) {
      const dx = e.clientX - S.sx, dy = e.clientY - S.sy;
      S.moved = Math.max(S.moved, Math.hypot(dx, dy));
      if (S.moved > 5) {
        gsap.set(box.current, { x: S.ox + dx, y: S.oy + dy });
        gsap.to(box.current, { rotate: gsap.utils.clamp(-25, 25, (e.clientX - S.lastX) * 2), duration: 0.3 });
        S.lastX = e.clientX;
      }
      return;
    }
    // гладим: чем дольше водишь по шёрстке, тем больше сердечек
    S.pet += Math.abs(e.movementX || 0) + Math.abs(e.movementY || 0);
    if (S.pet > 110) {
      S.pet = 0;
      const b = box.current.getBoundingClientRect();
      heart(e.clientX - b.left, e.clientY - b.top);
      gsap.fromTo(body.current, { scaleY: 0.92 }, { scaleY: 1, duration: 0.5, ease: 'elastic.out(1, .4)' });
      if (Math.random() < 0.35) talk(LINES.pet[Math.floor(Math.random() * LINES.pet.length)], 900);
    }
  };
  const onUp = () => {
    const S = st.current;
    if (!S.down) return;
    S.down = false;
    gsap.to(box.current, { rotate: 0, duration: 0.6, ease: 'elastic.out(1, .4)' });
    if (S.moved <= 5) fetchCursor();
  };

  return (
    <div
      ref={box} className={s.box} role="button" tabIndex={0} aria-label="Котик: нажмите, если есть вопрос"
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fetchCursor(); } }}
    >
      {say && <span className={s.bubble}>{say}</span>}
      <div ref={body} className={s.body}>
        <img src="/img/mascot-cat.png" alt="" draggable="false" />
        {carry && (
          <svg className={s.cursor} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 2l7.5 19 2.6-7.9L21 10.5z" fill="#fff" stroke="#24231E" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {hearts.map((h) => <span key={h.id} className={s.heart} style={{ left: h.x, top: h.y }}>♥</span>)}
    </div>
  );
}
