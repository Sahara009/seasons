'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './About.module.css';
import { about } from '@/data/about';

// «О проекте» как маленькая вселенная:
// лента-коллаж из разворотов; счётчики; орбита, где вокруг журнала крутятся все его проекты;
// дорога по годам, по которой катится яблоко; облако героев; цитата, которая проявляется по словам.
const fmt = (n) => n.toLocaleString('ru-RU');
const TINTS = ['#DE9A4B', '#B9C3A3', '#EBC394', '#D8D5A6', '#C8782A', '#2F4A9A'];

export default function About() {
  const root = useRef(null);
  const orbit = useRef(null);
  const ang = useRef({ a: 0, hold: false });
  const [sel, setSel] = useState(0);
  const [hero, setHero] = useState(-1);
  const peek = useRef(null);
  const moveHero = (e) => {
    const b = e.currentTarget.closest('section').getBoundingClientRect();
    gsap.to(peek.current, { x: e.clientX - b.left + 24, y: e.clientY - b.top - 120, duration: 0.35, ease: 'power3.out' });
  };
  const showHero = (i, e) => { setHero(i); moveHero(e); };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const q = gsap.utils.selector(el);

    // планеты по эллипсу; всё время чуть поворачиваются, наведение останавливает
    const planets = q('[data-planet]');
    const N = planets.length;
    const place = () => {
      const box = orbit.current; if (!box) return;
      const W = box.clientWidth, H = box.clientHeight;
      const rx = W * 0.4, ry = H * 0.36;
      planets.forEach((p, i) => {
        const t = (ang.current.a + (i / N) * 360) * Math.PI / 180;
        const x = Math.cos(t) * rx, y = Math.sin(t) * ry;
        const depth = (Math.sin(t) + 1) / 2; // ниже = ближе к нам
        p.style.transform = `translate(${x}px, ${y}px) scale(${0.72 + depth * 0.38})`;
        p.style.zIndex = String(Math.round(depth * 100));
        p.style.filter = `saturate(${0.55 + depth * 0.45})`;
      });
    };
    let last = performance.now();
    const tick = () => {
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!ang.current.hold && !reduce) ang.current.a += dt * 6;
      place();
    };
    gsap.ticker.add(tick);

    const ctx = gsap.context(() => {
      if (reduce) return;
      // счётчики
      q('[data-count]').forEach((n) => {
        const to = +n.dataset.count, o = { v: to > 1900 && to < 2100 ? 1990 : 0 };
        gsap.to(o, { v: to, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: n, start: 'top 85%' },
          onUpdate: () => { n.textContent = (to > 1900 && to < 2100) ? Math.round(o.v) : fmt(Math.round(o.v)); } });
      });
      // дорога по годам: экран закрепляется, лента едет вбок, яблоко катится по нитке
      const mm = gsap.matchMedia();
      mm.add('(min-width: 861px)', () => {
        const track = q('[data-track]')[0];
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const tl = gsap.timeline({ scrollTrigger: { trigger: q('[data-road]')[0], start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1 } });
        tl.to(track, { x: () => -dist(), ease: 'none' }, 0)
          .fromTo(q('[data-apple]'), { left: '2%', rotate: 0 }, { left: '96%', rotate: 1080, ease: 'none' }, 0)
          .fromTo(q('[data-thread]'), { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);
      });
      // цитата проявляется по словам
      gsap.fromTo(q('[data-w]'), { opacity: 0.12 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: q('[data-quote]')[0], start: 'top 75%', end: 'bottom 55%', scrub: true } });
      // всё остальное мягко поднимается
      q('[data-up]').forEach((n) => gsap.fromTo(n, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: n, start: 'top 85%' } }));
    }, el);

    return () => { gsap.ticker.remove(tick); ctx.revert(); };
  }, []);

  const it = about.orbit[sel];

  return (
    <div ref={root} className={s.page}>
      {/* 1. лента-коллаж и заголовок */}
      <header className={s.hero}>
        <div className={s.band} aria-hidden="true">
          {/* две половины коллажа едут навстречу друг другу */}
          {['a', 'b'].map((r) => (
            <div key={r} className={`${s.bandRun} ${r === 'b' ? s.rev : ''}`}>
              {[0, 1, 2, 3].map((i) => <img key={i} src={`/img/about/collage-${r}.jpg`} alt="" />)}
            </div>
          ))}
        </div>
        <div className={s.heroText}>
          <p className={s.kick}>о проекте · с марта 2003</p>
          <h1 className={s.h1}>Из журнала <i>в целый мир</i></h1>
          <p className={s.lead}>{about.lead}</p>
        </div>
      </header>

      {/* 2. счётчики */}
      <section className={s.nums} aria-label="Seasons в цифрах">
        {about.numbers.map((n) => (
          <div key={n.label} className={s.num} data-up>
            <b><span data-count={n.n}>{n.n > 1900 && n.n < 2100 ? n.n : fmt(n.n)}</span>{n.plus ? '+' : ''}</b>
            <span>{n.label}</span>
          </div>
        ))}
      </section>

      {/* 3. орбита проектов */}
      <section className={s.orbitSec} aria-labelledby="h-orbit">
        <h2 id="h-orbit" className={s.h2} data-up>Что <i>вокруг</i> журнала</h2>
        <p className={s.hint} data-up>нажмите на планету</p>
        <div className={s.orbitWrap}>
          <div ref={orbit} className={s.orbit} onMouseEnter={() => { ang.current.hold = true; }} onMouseLeave={() => { ang.current.hold = false; }}>
            <span className={s.ring} aria-hidden="true" />
            <div className={s.sun}><img src="/img/logo-moss.png" alt="Seasons Project" /></div>
            {about.orbit.map((p, i) => (
              <button key={p.id} type="button" data-planet className={s.planet} data-on={sel === i ? '1' : '0'} onClick={() => setSel(i)} aria-pressed={sel === i}>
                <img src={p.img} alt="" />
                <span>{p.t}</span>
              </button>
            ))}
          </div>
          <article key={it.id} className={s.info} aria-live="polite">
            <p className={s.kick}>{String(sel + 1).padStart(2, '0')} / {String(about.orbit.length).padStart(2, '0')}</p>
            <h3>{it.t}</h3>
            <ul className={s.facts}>{it.facts.map((f) => <li key={f}>{f}</li>)}</ul>
            <p className={s.text}>{it.text}</p>
            {it.tags && <p className={s.tags}>{it.tags.map((t) => <span key={t}>{t}</span>)}</p>}
            <a href={it.href} {...(it.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}>подробнее →</a>
          </article>
        </div>
      </section>

      {/* 4. дорога по годам */}
      <section className={s.road} data-road aria-labelledby="h-road">
        <h2 id="h-road" className={s.roadH}>Дорога <i>длиной в 23 года</i></h2>
        <div className={s.line}>
          <span className={s.threadBg} />
          <span data-thread className={s.thread} />
          <img data-apple className={s.apple} src="/img/cut/apple.png" alt="" />
        </div>
        <ol className={s.track} data-track>
          {about.timeline.map((t, i) => (
            <li key={t.y} className={s.stop} data-alt={i % 2 ? '1' : '0'}>
              <span className={s.year}>{t.y}</span>
              <span className={s.pic}><img src={t.img} alt="" loading="lazy" /></span>
              <b>{t.t}</b>
              <p>{t.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. герои */}
      <section className={s.heroes} aria-labelledby="h-heroes">
        <h2 id="h-heroes" className={s.h2} data-up>Герои <i>Seasons</i></h2>
        <p className={s.heroesLead} data-up>Люди, которые ищут свой путь и своими маленькими делами меняют большой мир. Среди героев журнала:</p>
        <ul className={s.cloud}>
          {about.heroes.map((h, i) => (
            <li key={h.n} style={{ '--r': `${((i * 37) % 11) - 5}deg`, '--s': `${0.8 + ((i * 53) % 7) / 10}` }} data-up
              onMouseEnter={(e) => showHero(i, e)} onMouseMove={moveHero} onMouseLeave={() => setHero(-1)}>{h.n}</li>
          ))}
        </ul>
        {/* карточка героя летит за курсором */}
        <div ref={peek} className={s.peek} data-on={hero >= 0 ? '1' : '0'} aria-hidden="true">
          {hero >= 0 && (about.heroes[hero].img
            ? <img src={about.heroes[hero].img} alt="" />
            : <span className={s.peekStub} style={{ '--t': TINTS[hero % TINTS.length] }}>{about.heroes[hero].n.split(' ').map((w) => w[0]).join('')}</span>)}
          {hero >= 0 && <small>{about.heroes[hero].r}</small>}
        </div>
      </section>

      {/* 6. цитата */}
      <section className={s.quote} data-quote>
        <p>{about.quote.split(' ').map((w, i) => <span key={i} data-w>{w} </span>)}</p>
      </section>

      <a className={s.home} href="/">← на главную</a>
    </div>
  );
}
