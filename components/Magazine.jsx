'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import s from './Magazine.module.css';
import { SITE } from '@/data/content';

// Журнал на page-flip. Листается нажатием на страницу, тягой за угол или стрелками.
// Через api.setProgress(0..1) его можно листать и от прокрутки, но сейчас так никто не делает.
// развороты из номеров: первая половина левая страница, вторая правая
const SPREADS = ['clown', 'flower', 'threads', 'ship'];

const Magazine = forwardRef(function Magazine({ cover, issues, onFlip }, api) {
  const wrap = useRef(null);
  const book = useRef(null);
  const pf = useRef(null);
  const want = useRef(0);        // желаемое положение, 0..1
  const busy = useRef(false);    // true, пока идёт один переворот
  const timer = useRef(0);

  // сколько «листаний» уже сделано: в ландшафте обложка = 0, каждый разворот +1
  const doneFlips = () => {
    const f = pf.current;
    const i = f.getCurrentPageIndex();
    return f.getOrientation() === 'landscape' ? Math.floor((i + 1) / 2) : i;
  };
  const maxFlips = () => {
    const f = pf.current;
    const n = f.getPageCount();
    return f.getOrientation() === 'landscape' ? Math.floor(n / 2) : n - 1;
  };

  // Листаем по одной странице за раз. Завершение переворота ловим по событию flip,
  // а таймер страхует: если событие не пришло, журнал всё равно не застрянет.
  const step = () => {
    const f = pf.current;
    if (!f || busy.current) return;
    const cur = doneFlips();
    const x = want.current * maxFlips();
    // гистерезис: новая страница начинает листаться, только когда прокрутка заметно ушла за порог,
    // иначе при медленной прокрутке на границе журнал дёргался бы туда-сюда
    let tgt = cur;
    if (x >= cur + 0.55 || x <= cur - 0.55) tgt = Math.round(x);
    if (cur === tgt) return;
    // чем сильнее журнал отстаёт от прокрутки, тем быстрее листает
    const time = Math.max(260, 720 - Math.abs(tgt - cur) * 140);
    try { f.getSettings().flippingTime = time; } catch (e) { /* без этого тоже работает */ }
    busy.current = true;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { busy.current = false; step(); }, time + 300);
    cur < tgt ? f.flipNext('top') : f.flipPrev('top');
  };

  useImperativeHandle(api, () => ({
    setProgress(p) { want.current = Math.min(Math.max(p, 0), 1); step(); },
  }));

  useEffect(() => {
    if (pf.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let alive = true;

    (async () => {
      const mod = await import('page-flip');
      const PageFlip = mod.PageFlip || mod.default?.PageFlip || mod.default;
      if (!alive || !book.current) return;

      const flip = new PageFlip(book.current, {
        width: 320, height: 396, size: 'stretch',
        minWidth: 150, maxWidth: 800, minHeight: 186, maxHeight: 990,
        showCover: true, usePortrait: true, mobileScrollSupport: true,
        maxShadowOpacity: 0.4, flippingTime: reduce ? 0 : 700,
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
      flip.on('flip', () => {
        place();
        onFlip && onFlip();
        if (busy.current) { clearTimeout(timer.current); timer.current = setTimeout(() => { busy.current = false; step(); }, 40); }
      });
      flip.on('changeOrientation', () => { place(); step(); });
      place();
      step();
    })();

    return () => { alive = false; clearTimeout(timer.current); };
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
      aria-label="Журнал: нажмите на страницу или потяните за угол, чтобы листать; стрелки на клавиатуре тоже работают"
    >
      <div ref={book} className={s.book}>
        <div className={`page ${s.page}`} data-density="hard">
          <img src={cover.cover} alt={`Обложка Seasons of life №${cover.number}, ${cover.season}`} />
        </div>

        {SPREADS.flatMap((n) => [
          <div key={`${n}l`} className={`page ${s.page} ${s.pgL}`}><img src={`/img/spread/${n}-l.jpg`} alt="" decoding="async" /></div>,
          <div key={`${n}r`} className={`page ${s.page} ${s.pgR}`}><img src={`/img/spread/${n}-r.jpg`} alt="" decoding="async" /></div>,
        ])}

        {issues.flatMap((it) => [
          <div key={`t${it.no}`} className={`page ${s.page}`}>
            <div className={s.caption}>
              <span className={s.no}>№{it.no}</span>
              <h3>{it.season}</h3>
              <p>{it.theme}</p>
              <a href={it.link?.href ?? `${SITE}/shop/`} target="_blank" rel="noopener">
                {it.link?.label ?? 'смотреть в магазине'} →
              </a>
            </div>
          </div>,
          <div key={`c${it.no}`} className={`page ${s.page}`}>
            <img src={it.cover} alt={`Обложка №${it.no}`} decoding="async" />
          </div>,
        ])}

        <div className={`page ${s.page}`} data-density="hard">
          <div className={s.back}>
            <h3>Все номера — в магазине Seasons</h3>
            <a href={`${SITE}/shop/`} target="_blank" rel="noopener">перейти →</a>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Magazine;
