'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './Blog.module.css';
import { posts, rubrics } from '@/data/content';

const TONES = { sage: '#B9C3A3', seasonSoft: '#EBC394', milk: '#FBF7EC', season: '#DE9A4B', olive: '#D8D5A6' };
const CUT_CYCLE = ['leaf', 'apple', 'blueleaf', 'olive', 'orange', 'branch'];

// Рубрики в винительном падеже, чтобы фраза читалась: «Хочу почитать про людей»
const ACC = { all: 'всё подряд', people: 'людей', food: 'еду', culture: 'культуру', travel: 'путешествия', kids: 'детей', design: 'дизайн', soul: 'душу и тело' };
const INK = ['#3F4B2E', '#C8782A', '#2F4A9A', '#DE9A4B', '#3F4B2E', '#C8782A', '#2F4A9A', '#DE9A4B'];

// Блог: фраза «Хочу почитать про …», где рубрика крутится как барабан слот-машины,
// а под ней карандашом дорисовывается подчёркивание. Ниже огромные заголовки списком.
export default function Blog() {
  const root = useRef(null);
  const list = useRef(null);
  const peek = useRef(null);
  const win = useRef(null);
  const col = useRef(null);
  const scrib = useRef(null);
  const words = useRef([]);
  const firstRun = useRef(true);
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(null);
  const [soon, setSoon] = useState(null); // клик по материалу пока заглушка

  const filter = rubrics[idx].id;
  const shown = posts.filter((p) => filter === 'all' || p.tags.includes(filter));
  const next = () => { setHover(null); setIdx((i) => (i + 1) % rubrics.length); };
  const pick = (i) => { setHover(null); setIdx(i); };

  // барабан: сдвигаем колонку слов, подгоняем ширину окна под слово, рисуем подчёркивание заново
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = !firstRun.current && !reduce;
    firstRun.current = false;

    const place = (anim) => {
      const w = words.current[idx];
      const w0 = words.current[0];
      if (!w || !w0) return;
      const to = anim ? gsap.to : gsap.set;
      const lineH = w0.offsetHeight;
      to(col.current, { y: -idx * lineH, ...(anim ? { duration: 1, ease: 'back.out(1.5)' } : {}) });
      to(win.current, { width: w.offsetWidth, ...(anim ? { duration: 0.8, ease: 'power3.inOut' } : {}) });
    };
    place(animate);

    // подчёркивание «рисуется» карандашом
    const path = scrib.current;
    if (path) {
      // vector-effect: non-scaling-stroke считает штрихи в пикселях экрана, поэтому длину берём из ширины нового слова (окно ещё растёт)
      const len = Math.ceil(words.current[idx].offsetWidth * 1.12) + 40;
      path.style.stroke = INK[idx % INK.length];
      path.style.strokeDasharray = len;
      if (animate) gsap.fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out', delay: 0.25, overwrite: true });
      else path.style.strokeDashoffset = 0;
    }

    // пересчёт после загрузки шрифтов и при изменении окна
    const again = () => place(false);
    window.addEventListener('resize', again);
    document.fonts?.ready.then(again);
    return () => window.removeEventListener('resize', again);
  }, [idx]);

  // появление фразы при скролле
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-ask]', { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'power4.out', stagger: 0.12, scrollTrigger: { trigger: '[data-ask]', start: 'top 85%' } });
    }, root);
    return () => ctx.revert();
  }, []);

  // при смене рубрики строки перелистываются заново
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rows = list.current?.querySelectorAll('[data-row]');
    if (!rows?.length) return;
    const tw = gsap.fromTo(rows, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.06 });
    gsap.fromTo(list.current.querySelectorAll('[data-line]'), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.out', stagger: 0.06 });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => tw.kill();
  }, [filter]);

  // превью следует за курсором и наклоняется по скорости
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = peek.current;
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    const r = gsap.quickTo(el, 'rotate', { duration: 0.6, ease: 'power3' });
    let last = 0;
    const move = (e) => {
      x(e.clientX + 36); y(e.clientY - 150);
      r(gsap.utils.clamp(-14, 14, (e.clientX - last) * 0.6)); last = e.clientX;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useEffect(() => {
    const el = peek.current;
    if (!el) return;
    gsap.to(el, { autoAlpha: hover != null ? 1 : 0, scale: hover != null ? 1 : 0.7, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
  }, [hover]);

  const item = hover != null ? shown[hover] : null;
  const bg = item?.tone ? TONES[item.tone] : '#F6F0E2';

  return (
    <section ref={root} className={s.sec} id="blog" aria-labelledby="h-blog">
      <h2 className="visually-hidden" id="h-blog">Читать</h2>

      <div className={s.ask}>
        <span className={s.q} data-ask>Хочу почитать про</span>
        <button
          type="button"
          className={s.reel}
          data-ask
          data-cursor
          onClick={next}
          aria-label={`Рубрика: ${ACC[filter]}. Нажмите, чтобы выбрать следующую`}
        >
          <span ref={win} className={s.win}>
            <span ref={col} className={s.col}>
              {rubrics.map((r, i) => (
                <span key={r.id} ref={(el) => { words.current[i] = el; }} className={s.w} style={{ color: INK[i % INK.length] }}>{ACC[r.id]}</span>
              ))}
            </span>
          </span>
          <svg className={s.scribble} viewBox="0 0 400 26" preserveAspectRatio="none" aria-hidden="true">
            <path ref={scrib} d="M3 15 C 50 4, 96 24, 160 13 S 280 5, 330 15 S 380 20, 397 9" />
          </svg>
        </button>
      </div>

      <ol className={s.topics} aria-label="Все рубрики">
        {rubrics.map((r, i) => (
          <li key={r.id}>
            <button type="button" className={`${s.topic} ${i === idx ? s.on : ''}`} aria-pressed={i === idx} onClick={() => pick(i)}>
              <span className={s.tn}>{String(i + 1).padStart(2, '0')}</span>
              <span className={s.tl}>{r.label}</span>
            </button>
          </li>
        ))}
      </ol>

      <ol ref={list} className={s.list}>
        {shown.map((p, i) => (
          <li key={p.href} data-row className={s.row} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
            <span data-line className={s.line} aria-hidden="true" />
            <a href={p.href} className={s.link} onClick={(e) => { e.preventDefault(); setSoon(i); }} aria-describedby={soon === i ? 'soon-note' : undefined}>
              <span className={s.n}>{String(i + 1).padStart(2, '0')}</span>
              <span className={s.t}>{p.title}</span>
              <span className={s.l}>{p.label}{p.date ? ` · ${p.date}` : ''}</span>
              <span className={s.go} aria-hidden="true">{soon === i ? <small className={s.soonTag}>скоро</small> : '↗'}</span>
            </a>
          </li>
        ))}
      </ol>

      <p id="soon-note" className="visually-hidden" aria-live="polite">{soon != null ? 'Материал скоро появится' : ''}</p>

      {/* листок-превью за курсором */}
      <div ref={peek} className={s.peek} aria-hidden="true" style={{ opacity: 0, visibility: 'hidden', background: bg }}>
        {item?.image
          ? <img src={item.image} alt="" />
          : <img className={`${s.peekCut} cut-shadow`} src={`/img/cut/${CUT_CYCLE[(hover ?? 0) % CUT_CYCLE.length]}.png`} alt="" />}
        {item && <span className={s.peekTitle}>{item.label}</span>}
      </div>
    </section>
  );
}
