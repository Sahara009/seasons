'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import s from './World.module.css';
import Grain from './Grain';
import { SITE } from '@/data/content';

// Мир Seasons как вращающийся стеллаж с открытками.
// Четыре стороны стеллажа = четыре раздела, на каждой стороне по четыре открытки в проволочных кармашках.
// Стеллаж медленно крутится; наведение останавливает его и выдвигает открытку к зрителю,
// справа появляется подпись раздела. Стеллаж можно крутить мышью или пальцем.
const SECTIONS = [
  { id: 'journal', no: '01', t: 'Журнал Seasons of life', line: 'Четыре номера в год о жизни по сезонам: люди, еда, дом, путешествия.', href: '#journals', cta: 'все номера',
    imgs: ['/img/c81.jpg', '/img/c79.jpg', '/img/c77.jpg', '/img/c76.jpg'] },
  { id: 'afternoon', no: '02', t: 'Журнал Afternoon', line: 'Журнал для новых взрослых 45+, который команда Seasons выпускает с 2023 года.', href: `${SITE}/?s=Afternoon`, cta: 'на сайте Seasons', ext: true,
    imgs: ['/img/about/aft0.jpg', '/img/about/aft1.jpg', '/img/about/aft2.jpg', '/img/spread/flower-r.jpg'] },
  { id: 'school', no: '03', t: 'Школа Seasons', line: 'С 2009 года: курсы и мастерские для взрослых и детей за длинным общим столом.', href: '/school', cta: 'зайти в школу',
    imgs: ['/img/school/room.jpg', '/img/school/cake.jpg', '/img/school/kids.jpg', '/img/school/flowers.jpg'] },
  { id: 'events', no: '04', t: 'События', line: 'Фестивали, ярмарки, встречи и выставки в студии Seasons.', href: `${SITE}/category/festivals/`, cta: 'афиша', ext: true,
    imgs: ['/img/about/fest.jpg', '/img/about/farm1.jpg', '/img/about/flacon.jpg', '/img/b-garden.jpg'] },
];
const TIERS = 4;
const SPEED = 9; // градусов в секунду, когда никто не трогает

export default function World() {
  const stage = useRef(null);
  const spin = useRef(null);
  const st = useRef({ a: 0, v: SPEED, hold: false, drag: false, lastX: 0, moved: 0 });
  const [front, setFront] = useState(0);
  const [hot, setHot] = useState(null); // { s, i } — открытка под курсором

  useEffect(() => {
    const S = st.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) S.v = 0;
    // подгоняем размер стеллажа под экран
    const fit = () => {
      const k = Math.min(1, (window.innerHeight * 0.74) / 820, (window.innerWidth * (window.innerWidth < 860 ? 0.95 : 0.5)) / 440);
      stage.current.style.setProperty('--k', k.toFixed(3));
    };
    fit();
    window.addEventListener('resize', fit);

    let last = performance.now();
    const tick = () => {
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!S.drag) {
        const target = S.hold || reduce ? 0 : SPEED;
        S.v += (target - S.v) * Math.min(1, dt * 3);
        S.a += S.v * dt;
      }
      spin.current.style.transform = `rotateX(-7deg) rotateY(${S.a}deg)`;
      // какая сторона сейчас смотрит на нас
      const f = ((Math.round((22 - S.a) / 90) % 4) + 4) % 4;
      setFront((p) => (p === f ? p : f));
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); window.removeEventListener('resize', fit); };
  }, []);

  // крутить мышью или пальцем
  const down = (e) => { const S = st.current; S.drag = true; S.lastX = e.clientX; S.moved = 0; gsap.killTweensOf(S); };
  const move = (e) => {
    const S = st.current; if (!S.drag) return;
    const dx = e.clientX - S.lastX; S.lastX = e.clientX; S.moved += Math.abs(dx);
    S.a += dx * 0.45; S.v = dx * 20;
  };
  const up = () => { st.current.drag = false; };

  // повернуть стеллаж нужной стороной к зрителю
  const turnTo = (f) => {
    const S = st.current;
    let tgt = -f * 90 + 22;
    while (tgt - S.a > 180) tgt -= 360;
    while (S.a - tgt > 180) tgt += 360;
    S.hold = true;
    gsap.to(S, { a: tgt, duration: 0.9, ease: 'power3.out', overwrite: true });
  };

  const active = hot ? hot.s : front;
  const sec = SECTIONS[active];

  return (
    <section className={s.sec} aria-labelledby="h-world">
      <Grain />
      <p className="tag">01 · разделы</p>
      <h2 id="h-world" className={s.h}>Мир <i>Seasons</i></h2>

      <div className={s.wrap}>
        <div
          ref={stage} className={s.stage}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} onPointerCancel={up}
          onMouseEnter={() => { st.current.hold = true; }} onMouseLeave={() => { st.current.hold = false; setHot(null); }}
        >
          <div className={s.rack}>
            <div ref={spin} className={s.spin}>
              {/* стойка: две скрещённые плоскости, чтобы с любой стороны выглядела трубой */}
              <span className={s.pole} />
              <span className={`${s.pole} ${s.pole2}`} />
              {SECTIONS.map((sc, f) => (
                Array.from({ length: TIERS }, (_, i) => {
                  const on = hot && hot.s === f && hot.i === i;
                  return (
                    <div key={sc.id + i} className={s.slot} style={{ '--f': f, '--i': i }}>
                      <span className={s.rod} />
                      <a
                        className={s.card} data-on={on ? '1' : '0'} data-dim={hot && !on ? '1' : '0'}
                        href={sc.href} {...(sc.ext ? { target: '_blank', rel: 'noopener' } : {})}
                        aria-label={`${sc.t}: ${sc.cta}`}
                        onMouseEnter={() => setHot({ s: f, i })}
                        onFocus={() => { setHot({ s: f, i }); turnTo(f); }}
                        onClick={(e) => { if (st.current.moved > 6) e.preventDefault(); }}
                        draggable="false"
                      >
                        <img src={sc.imgs[i]} alt="" draggable="false" />
                      </a>
                      <span className={s.basket} />
                    </div>
                  );
                })
              ))}
              {/* ножки крестом */}
              <span className={s.leg} />
              <span className={`${s.leg} ${s.leg2}`} />
            </div>
          </div>
          <span className={s.dragHint}>← крутите стеллаж →</span>
        </div>

        <aside className={s.info} aria-live="polite">
          <ol className={s.list}>
            {SECTIONS.map((sc, f) => (
              <li key={sc.id}>
                <button type="button" data-on={active === f ? '1' : '0'} onMouseEnter={() => turnTo(f)} onFocus={() => turnTo(f)} onClick={() => turnTo(f)} onMouseLeave={() => { st.current.hold = false; }}>
                  <span>{sc.no}</span>{sc.t}
                </button>
              </li>
            ))}
          </ol>
          <div key={sec.id} className={s.card2}>
            <p className={s.no}>{sec.no}</p>
            <h3>{sec.t}</h3>
            <p className={s.line}>{sec.line}</p>
            <a href={sec.href} {...(sec.ext ? { target: '_blank', rel: 'noopener' } : {})}>{sec.cta} →</a>
          </div>
        </aside>
      </div>
    </section>
  );
}
