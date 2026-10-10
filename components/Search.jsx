'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import s from './Search.module.css';
import { posts, actual, nav, navSmall, rubrics } from '@/data/content';

const norm = (x) => x.toLowerCase().replace(/ё/g, 'е');
const INDEX = [
  ...posts.map((p) => ({ title: p.title, kind: p.label, href: p.href })),
  ...actual.filter((a) => !posts.some((p) => p.href === a.href)).map((a) => ({ title: a.title, kind: a.tag, href: a.href })),
  ...[...nav, ...navSmall].map((n) => ({ title: n.label, kind: 'раздел', href: n.href })),
];

// Лупа рядом с бургером. Открывает лист бумаги с огромной строкой, результаты находятся по мере набора.
export default function Search() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const layer = useRef(null);
  const input = useRef(null);
  const btn = useRef(null);
  const first = useRef(true);

  const res = useMemo(() => {
    const w = norm(q.trim());
    if (!w) return [];
    return INDEX.filter((i) => norm(i.title + ' ' + i.kind).includes(w)).slice(0, 7);
  }, [q]);

  useEffect(() => {
    const el = layer.current;
    if (first.current) { first.current = false; return; }
    const lenis = window.__lenis;
    if (lenis) open ? lenis.stop() : lenis.start();
    gsap.killTweensOf(el);
    if (open) {
      gsap.set(el, { visibility: 'visible' });
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.inOut' });
      gsap.fromTo(el.querySelectorAll('[data-in]'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.07, delay: 0.35 });
      const t = setTimeout(() => input.current?.focus(), 450);
      const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
      window.addEventListener('keydown', onKey);
      return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
    }
    gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'power3.inOut', onComplete: () => gsap.set(el, { visibility: 'hidden' }) });
  }, [open]);

  // результаты выезжают при каждом наборе
  useEffect(() => {
    if (!open) return;
    const rows = layer.current.querySelectorAll('[data-res]');
    if (rows.length) gsap.fromTo(rows, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', stagger: 0.04, overwrite: true });
  }, [res, open]);

  return (
    <>
      <button ref={btn} className={s.btn} aria-label="Поиск" aria-expanded={open} onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" />
        </svg>
      </button>

      <div ref={layer} className={s.layer} role="dialog" aria-label="Поиск" aria-hidden={!open}>
        <button className={s.close} data-in onClick={() => setOpen(false)} aria-label="Закрыть поиск" tabIndex={open ? 0 : -1}>×</button>
        <div className={s.field} data-in>
          <input
            ref={input} className={s.input} type="search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="найти…" aria-label="Что искать" tabIndex={open ? 0 : -1}
            autoComplete="off" spellCheck="false"
          />
          <span className={s.under} />
        </div>

        <div className={s.chips} data-in>
          {rubrics.filter((r) => r.id !== 'all').map((r) => (
            <button key={r.id} type="button" tabIndex={open ? 0 : -1} onClick={() => { setQ(r.label); input.current?.focus(); }}>{r.label}</button>
          ))}
        </div>

        <ol className={s.list}>
          {res.map((r) => (
            <li key={r.href} data-res>
              <a href={r.href} target="_blank" rel="noopener" tabIndex={open ? 0 : -1}>
                <span className={s.t}>{r.title}</span>
                <span className={s.k}>{r.kind}</span>
              </a>
            </li>
          ))}
          {q.trim() && !res.length && <li className={s.none} data-res>ничего не нашлось</li>}
        </ol>
      </div>
    </>
  );
}
