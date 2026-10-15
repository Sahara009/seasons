'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import s from './Search.module.css';
import { posts, actual, nav, navSmall, issues } from '@/data/content';

const norm = (x) => x.toLowerCase().replace(/ё/g, 'е');
const INDEX = [
  ...posts.map((p) => ({ title: p.title, kind: p.label, href: p.href })),
  ...actual.filter((a) => !posts.some((p) => p.href === a.href)).map((a) => ({ title: a.title, kind: a.tag, href: a.href })),
  ...[...nav, ...navSmall].map((n) => ({ title: n.label, kind: 'раздел', href: n.href })),
];

const N = 16; // мест на колесе, обложки повторяются
const slotAngle = (i) => (i * 360) / N;
const issueHay = (i) => norm(`${i.no} №${i.no} ${i.season} ${i.theme} ${i.link ? i.link.label : ''}`);
const findIssue = (q) => {
  const w = norm(q.trim()).replace(/№/g, '').split(/\s+/).filter(Boolean);
  if (!w.length) return -1;
  return issues.findIndex((i) => { const h = issueHay(i).replace(/№/g, ''); return w.every((x) => h.includes(x)); });
};

// Лупа рядом с бургером. Посередине строка поиска, по бокам два колеса с обложками.
// При наборе колёса крутятся в разные стороны, а когда номер найден, он замирает на уровне строки и увеличивается.
export default function Search() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const layer = useRef(null);
  const input = useRef(null);
  const btn = useRef(null);
  const first = useRef(true);
  const wheel = useRef({ rotL: 0, rotR: 0, speed: 6, lock: 0, sel: -1, locked: false });
  const itemsL = useRef([]);
  const itemsR = useRef([]);
  const [hit, setHit] = useState(-1);

  const res = useMemo(() => {
    const w = norm(q.trim());
    if (!w) return [];
    return INDEX.filter((i) => norm(i.title + ' ' + i.kind).includes(w)).slice(0, 3);
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

  // отрисовка колёс: пока слой открыт, каждый кадр ставим обложки на дугу
  useEffect(() => {
    if (!open) return;
    const W = wheel.current, el = layer.current;
    const draw = () => {
      const vw = el.clientWidth, vh = el.clientHeight;
      const small = vw < 700;
      W.small = small;
      if (small) {
        // телефон: одно колесо, центр над экраном, видна только нижняя дуга; строка поиска под ней
        const R = Math.min(vw * 0.62, vh * 0.34);
        const h = Math.min(92, vh * 0.12), w = h * 0.78;
        const cx = vw / 2, cyW = vh * 0.2 - R * 0.55;
        const nodes = itemsL.current;
        for (let i = 0; i < N; i++) {
          const n = nodes[i]; if (!n) continue;
          const th = ((slotAngle(i) + W.rotL) * Math.PI) / 180;
          const c = Math.cos(th), sn = Math.sin(th);
          const vis = Math.max(0, Math.min(1, sn * 3 - 0.2));
          const mine = W.sel >= 0 && i % issues.length === W.sel;
          const k = W.lock;
          const sc = mine ? 1 + 0.5 * k * Math.max(0, sn) ** 8 : 1 - 0.12 * k;
          n.style.width = w + 'px'; n.style.height = h + 'px';
          n.style.opacity = String(vis * (mine ? 1 : 1 - 0.65 * k));
          n.style.zIndex = mine && k > 0.5 ? 3 : 1;
          n.style.transform = `translate(${cx + R * c - w / 2}px, ${cyW + R * sn - h / 2}px) rotate(${-c * 18}deg) scale(${sc})`;
        }
        itemsR.current.forEach((n) => { if (n) n.style.opacity = '0'; });
        el.style.setProperty('--fy', `${cyW + R + h * 0.85 + 34}px`);
        return;
      }
      const R = small ? Math.min(vw * 0.42, vh * 0.3) : Math.min(vh * 0.47, vw * 0.3);
      const h = small ? 78 : Math.min(vh * 0.2, 150), w = h * 0.78;
      const cy = vh * 0.46;
      const place = (nodes, side) => {
        for (let i = 0; i < N; i++) {
          const n = nodes[i]; if (!n) continue;
          const th = ((slotAngle(i) + (side < 0 ? W.rotL : W.rotR + 11.25)) * Math.PI) / 180;
          const cx = side < 0 ? -R * 0.12 : vw + R * 0.12; // центры колёс за краями экрана, видно по полукругу с каждой стороны
          const c = Math.cos(th), sn = Math.sin(th);
          const vis = Math.max(0, Math.min(1, c * -side * 3 - 0.3)); // левое колесо видно правой половиной, правое левой
          const mine = W.sel >= 0 && i % issues.length === W.sel;
          const k = W.lock;
          const sc = mine ? 1 + 0.55 * k * Math.max(0, c * -side) ** 6 : 1 - 0.12 * k;
          const dim = mine ? 1 : 1 - 0.65 * k;
          n.style.width = w + 'px'; n.style.height = h + 'px';
          n.style.opacity = String(vis * dim);
          n.style.zIndex = mine && k > 0.5 ? 3 : 1;
          n.style.transform = `translate(${cx + R * c - w / 2}px, ${cy + R * sn - h / 2}px) rotate(${(Math.atan2(sn, c) * 180) / Math.PI * 0.0 + sn * 14 * side * -1}deg) scale(${sc})`;
        }
      };
      place(itemsL.current, -1); place(itemsR.current, 1);
    };
    let last = performance.now();
    const tick = () => {
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!W.locked) { W.rotL += W.speed * dt; W.rotR -= W.speed * dt; }
      draw();
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [open]);

  // запрос: колёса раскручиваются, если номер найден, они останавливаются на нём
  useEffect(() => {
    const W = wheel.current;
    gsap.killTweensOf(W);
    const m = findIssue(q);
    setHit(m);
    if (!q.trim()) {
      W.locked = false; W.sel = -1;
      gsap.to(W, { lock: 0, speed: 6, duration: 0.8, ease: 'power2.out', overwrite: true });
      return;
    }
    if (m < 0) {
      // ничего не нашлось: колёса плавно останавливаются
      W.locked = false; W.sel = -1;
      gsap.to(W, { lock: 0, speed: 0, duration: 1.1, ease: 'power3.out', overwrite: true });
      return;
    }
    // ждём, пока допечатают, и сажаем нужную обложку напротив строки
    const id = setTimeout(() => {
      W.sel = m; W.locked = true; W.lock = 0;
      let tl = (W.small ? 90 : 0) - slotAngle(m); while (tl < W.rotL + 540) tl += 360;
      let tr = 180 - slotAngle(m) - 11.25; while (tr > W.rotR - 540) tr -= 360;
      gsap.timeline({ defaults: { overwrite: false } })
        .to(W, { rotL: tl, rotR: tr, duration: 2.2, ease: 'power4.out' }, 0)
        .to(W, { lock: 1, duration: 0.8, ease: 'back.out(2)' }, 1.6);
    }, 380);
    return () => clearTimeout(id);
  }, [q]);

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

      <div ref={layer} className={s.layer} role="dialog" aria-label="Поиск" data-lenis-prevent aria-hidden={!open}>
        <button className={s.close} data-in onClick={() => setOpen(false)} aria-label="Закрыть поиск" tabIndex={open ? 0 : -1}>×</button>
        <div className={s.field} data-in>
          <input
            ref={input} className={s.input} type="search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="найти…" aria-label="Что искать" tabIndex={open ? 0 : -1}
            autoComplete="off" spellCheck="false"
          />
          <span className={s.under} />
        </div>

        <div className={s.wheel} aria-hidden="true">
          {[itemsL, itemsR].map((refs, side) => Array.from({ length: N }, (_, i) => (
            <img key={side + '-' + i} ref={(n) => { refs.current[i] = n; }} className={s.cov} src={issues[i % issues.length].cover} alt="" draggable="false" />
          )))}
        </div>

        <p className={s.cap} data-hit={hit >= 0 ? '1' : '0'} data-none={q.trim() && hit < 0 && !res.length ? '1' : '0'}>
          {hit >= 0 ? <><b>№{issues[hit].no}</b> {issues[hit].season} · {issues[hit].theme}</> : q.trim() ? (res.length ? 'такого номера нет, но в статьях есть' : 'ничего не нашлось') : 'номер, сезон или тема'}
        </p>

        <ol className={s.list}>
          {res.map((r) => (
            <li key={r.href} data-res>
              <a href={r.href} target="_blank" rel="noopener" tabIndex={open ? 0 : -1}>
                <span className={s.t}>{r.title}</span>
                <span className={s.k}>{r.kind}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
