'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import s from './Subscribe.module.css';
import { SITE } from '@/data/content';

// Подписка как стопка журналов: выбираешь вариант, и номера падают в стопку (или улетают из неё).
// Цены и варианты — как в магазине seasons-project.ru.
const OPTIONS = [
  { id: 'one', t: 'Свежий номер', d: 'Seasons №81, осень 2026', price: 700, covers: ['/img/c81.jpg'] },
  { id: 'aft', t: 'Afternoon', d: 'журнал для новых взрослых, №6', price: 700, covers: ['/img/about/aft0.jpg'] },
  { id: 'year', t: 'Год с Seasons', d: '4 выпуска — по одному на каждый сезон', price: 4500, covers: ['/img/c76.jpg', '/img/c77.jpg', '/img/c79.jpg', '/img/c81.jpg'], tag: 'выгоднее всего' },
];

export default function Subscribe() {
  const [opt, setOpt] = useState(2);
  const stack = useRef(null);
  const price = useRef(null);
  const shown = useRef(0);

  useEffect(() => {
    const items = [...stack.current.querySelectorAll('[data-mag]')];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // новые номера падают сверху на стопку, лишние улетают
    items.forEach((m, i) => {
      gsap.killTweensOf(m);
      if (reduce) { gsap.set(m, { y: 0, autoAlpha: 1, rotate: m.dataset.r }); return; }
      gsap.fromTo(m, { y: -420, rotate: gsap.utils.random(-25, 25), autoAlpha: 0 },
        { y: 0, rotate: Number(m.dataset.r), autoAlpha: 1, duration: 0.9, ease: 'bounce.out', delay: i * 0.14 });
    });
    const o = { v: shown.current };
    gsap.to(o, { v: OPTIONS[opt].price, duration: 0.8, ease: 'power2.out', onUpdate: () => { if (price.current) price.current.textContent = Math.round(o.v).toLocaleString('ru-RU'); } });
    shown.current = OPTIONS[opt].price;
  }, [opt]);

  const cur = OPTIONS[opt];

  return (
    <section className={s.sec} aria-labelledby="h-sub">
      <div className={s.left}>
        <div ref={stack} className={s.stack} aria-hidden="true">
          {cur.covers.map((c, i) => (
            <div key={opt + '-' + i} data-mag data-r={[-3, 4, -6, 2][i]} className={s.mag} style={{ bottom: `${i * 16}px`, left: `${[0, 3, -3, 2][i]}%`, zIndex: i + 1 }}>
              <img src={c} alt="" />
            </div>
          ))}
          <span className={s.floor} />
          <span className={s.count}>{cur.covers.length} × журнал</span>
        </div>
      </div>

      <div className={s.right}>
        <p className="tag">подписка</p>
        <h2 id="h-sub" className={s.h}>Сложите <i>свою стопку</i></h2>
        <ul className={s.opts} role="radiogroup" aria-label="Что выписать">
          {OPTIONS.map((o, i) => (
            <li key={o.id}>
              <button type="button" role="radio" aria-checked={opt === i} data-on={opt === i ? '1' : '0'} onClick={() => setOpt(i)}>
                <span className={s.dot} />
                <span className={s.ot}><b>{o.t}</b>{o.tag && <em>{o.tag}</em>}<small>{o.d}</small></span>
                <span className={s.op}>{o.price.toLocaleString('ru-RU')} ₽</span>
              </button>
            </li>
          ))}
        </ul>
        <div className={s.total}>
          <span>итого</span>
          <b><i ref={price}>{cur.price.toLocaleString('ru-RU')}</i> ₽</b>
        </div>
        <a className={s.buy} href={`${SITE}/shop/`} target="_blank" rel="noopener">оформить в магазине →</a>
      </div>
    </section>
  );
}
