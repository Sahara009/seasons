'use client';

import { useEffect, useRef } from 'react';
import s from './Flipbook.module.css';
import { SITE } from '@/data/content';

// Журнал на библиотеке page-flip: обложка → развороты «подпись + обложка номера» → задняя обложка.
// Когда секция появляется на экране, журнал сам раскрывается и листает три разворота,
// дальше листают жестом (тянуть за угол / свайп) или стрелками на клавиатуре.
export default function Flipbook({ cover, issues }) {
  const wrap = useRef(null);
  const book = useRef(null);
  const pf = useRef(null);

  useEffect(() => {
    if (pf.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let io;
    let timer;
    let alive = true;

    (async () => {
      const { PageFlip } = await import('page-flip');
      if (!alive || !book.current) return;

      const flip = new PageFlip(book.current, {
        width: 320, height: 396, size: 'stretch',
        minWidth: 150, maxWidth: 340, minHeight: 186, maxHeight: 421,
        showCover: true, usePortrait: true, mobileScrollSupport: true,
        maxShadowOpacity: 0.35, flippingTime: reduce ? 0 : 950,
      });
      flip.loadFromHTML(book.current.querySelectorAll('.page'));
      pf.current = flip;

      const total = flip.getPageCount();
      const place = () => {
        const land = flip.getOrientation() === 'landscape';
        const i = flip.getCurrentPageIndex();
        wrap.current?.classList.toggle(s.atFront, land && i === 0);
        wrap.current?.classList.toggle(s.atBack, land && i >= total - 1);
      };
      flip.on('flip', place);
      flip.on('changeOrientation', place);
      place();

      // автолистание один раз, когда журнал впервые виден
      let touched = false;
      const stop = () => { touched = true; clearTimeout(timer); };
      ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((ev) => wrap.current?.addEventListener(ev, stop, { passive: true }));
      if (!reduce) {
        io = new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          let n = 0;
          const step = () => {
            if (touched || n >= 3) return;
            n += 1;
            flip.flipNext('top');
            timer = setTimeout(step, n === 1 ? 3000 : 2600);
          };
          timer = setTimeout(step, 1400);
        }, { threshold: 0.55 });
        io.observe(wrap.current);
      }
    })();

    return () => { alive = false; clearTimeout(timer); io?.disconnect(); };
  }, []);

  const onKey = (e) => {
    if (!pf.current) return;
    if (e.key === 'ArrowRight') { pf.current.flipNext(); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { pf.current.flipPrev(); e.preventDefault(); }
  };

  return (
    <div
      ref={wrap}
      className={`${s.wrap} ${s.atFront}`}
      tabIndex={0}
      onKeyDown={onKey}
      aria-label="Журнал: тяните за угол страницы или листайте стрелками"
    >
      <div ref={book} className={s.book}>
        <div className={`page ${s.page}`} data-density="hard">
          <img src={cover.cover} alt={`Обложка Seasons of life №${cover.number}, ${cover.season}`} />
        </div>

        {issues.flatMap((it) => [
          <div key={`t${it.no}`} className={`page ${s.page}`}>
            <div className={s.caption}>
              <span className={s.no}>[ №{it.no} ]</span>
              <h3>{it.season}</h3>
              <p>{it.theme}</p>
              <a href={it.link?.href ?? `${SITE}/journal/about/`} target="_blank" rel="noopener">
                {it.link?.label ?? 'о журнале'} →
              </a>
            </div>
          </div>,
          <div key={`c${it.no}`} className={`page ${s.page}`}>
            <img src={it.cover} alt={`Обложка №${it.no}`} loading="lazy" />
          </div>,
        ])}

        <div className={`page ${s.page}`} data-density="hard">
          <div className={s.back}>
            <span className="mono">[ с 2003 года ]</span>
            <h3>Все номера — в&nbsp;магазине Seasons</h3>
            <a href={`${SITE}/shop/`} target="_blank" rel="noopener">перейти →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
