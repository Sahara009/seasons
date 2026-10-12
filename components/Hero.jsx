'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './Hero.module.css';
import Magazine from './Magazine';
import { currentIssue, issues } from '@/data/content';

// Первый экран на фото с диваном и подушками. Всё от прокрутки, экран закреплён:
// 1) посередине большой логотип, фото слегка размыто;
// 2) логотип уезжает на своё место (его держит Header), фото становится чётким;
// 3) журнал выходит из руки девушки на фото, вытягивается к нам и встаёт по центру, фото затухает. Дальше его листают нажатием.
export default function Hero() {
  const root = useRef(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 860px)').matches;
    const q = gsap.utils.selector(el);
    const logo = document.querySelector('[data-logo]');
    const header = document.querySelector('[data-header]');
    const bg = q('[data-bg]')[0];
    const photoA = q('[data-a]')[0];
    const photoB = q('[data-b]')[0];
    const handImg = q('[data-hand]')[0];
    const shade = q('[data-shade]')[0];
    const wrap = q('[data-bookwrap]')[0];
    const rig = q('[data-rig]')[0];
    const side = q('[data-side]');
    const hint = q('[data-hint]');
    if (!logo || !header) return;

    const dist = () => window.innerHeight * (mobile ? 2 : 1.8);

    // большой логотип по центру экрана, посчитанный относительно его места в углу
    const bigLogo = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w0 = logo.offsetWidth;
      const h0 = logo.offsetHeight;
      const rect = logo.offsetParent.getBoundingClientRect();
      const W = Math.min(vw * (mobile ? 0.8 : 0.46), 700);
      const S = W / w0;
      return { x: (vw - W) / 2 - (rect.left + logo.offsetLeft), y: vh * (mobile ? 0.36 : 0.42) - (h0 * S) / 2 - (rect.top + logo.offsetTop), scale: S };
    };

    // Где на фото журнал в руке: центр, высота и наклон в пикселях исходного кадра 1672×941
    const IW = 1672, IH = 941, MAG = { x: 1191, y: 789, h: 255, rot: -16 };
    // переводим точку кадра в координаты экрана так же, как это делает object-fit: cover
    const inHand = () => {
      const BW = el.clientWidth + 60, BH = el.clientHeight + 60;
      const pos = getComputedStyle(photoA).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
      const k = Math.max(BW / IW, BH / IH);
      const ox = -30 + (BW - IW * k) * (isNaN(pos[0]) ? 0.5 : pos[0]);
      const oy = -30 + (BH - IH * k) * (isNaN(pos[1]) ? 0.5 : pos[1]);
      const box = q('[data-bookwrap]')[0];
      const cx = box.offsetLeft + box.offsetWidth / 2, cy = box.offsetTop + box.offsetHeight / 2;
      return { x: ox + MAG.x * k - cx, y: oy + MAG.y * k - cy, scale: (MAG.h * k) / Math.max(1, rig.offsetHeight), k };
    };

    const ctx = gsap.context(() => {
      gsap.set(logo, { transformOrigin: '0 0' });
      gsap.set(rig, { transformPerspective: 1400, transformOrigin: '50% 50%' });

      if (reduce) {
        header.style.setProperty('--pill', '1');
        logo.dataset.ready = '1';
        wrap.dataset.live = '1';
        gsap.set(shade, { opacity: 1 });
        gsap.set(photoA, { opacity: 0 }); gsap.set(photoB, { opacity: 1 });
        gsap.set(rig, { autoAlpha: 1 });
        gsap.set(hint, { autoAlpha: 0 });
        gsap.set(side, { autoAlpha: 1 });
        return;
      }

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
      tl.fromTo(logo,
        { x: () => bigLogo().x, y: () => bigLogo().y, scale: () => bigLogo().scale },
        { x: 0, y: 0, scale: 1, duration: 0.42, ease: 'power3.inOut', immediateRender: true }, 0)
        // большой логотип белый, а подлетая к шапке, становится своим зелёным
        .fromTo(logo, { filter: 'brightness(0) invert(1)' }, { filter: 'brightness(1) invert(0)', duration: 0.22, ease: 'power1.in', immediateRender: true }, 0.16)
        .fromTo(header, { '--pill': 0 }, { '--pill': 1, duration: 0.1, immediateRender: true }, 0.34)
        .to(hint, { autoAlpha: 0, duration: 0.08 }, 0)
        // сначала фото проясняется, пока логотип уезжает
        .fromTo(bg, { filter: 'blur(7px)' }, { filter: 'blur(0px)', duration: 0.38, immediateRender: true }, 0)
        // журнал «выходит» из руки: под ним подменяем фото на кадр без журнала, а сверху держим пальцы,
        // поэтому подмена не видна; дальше журнал вытягивается к нам и встаёт по центру
        .set(photoA, { opacity: 0 }, 0.4)
        .set(photoB, { opacity: 1 }, 0.4)
        .set(handImg, { opacity: 1 }, 0.4)
        .fromTo(rig, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001, immediateRender: true }, 0.4)
        // сначала журнал выскальзывает вниз из-под пальцев (пальцы пока поверх него)
        .fromTo(rig,
          { x: () => inHand().x, y: () => inHand().y, scale: () => inHand().scale, rotation: MAG.rot, rotationY: -32 },
          { x: () => inHand().x + 6 * inHand().k, y: () => inHand().y + 78 * inHand().k, scale: () => inHand().scale * 1.06, rotation: -12, rotationY: -26, duration: 0.09, ease: 'power1.inOut', immediateRender: false }, 0.4)
        // когда верх журнала ниже кончиков пальцев, рука больше не нужна поверх: дальше журнал ближе к нам, чем рука
        .set(handImg, { opacity: 0 }, 0.49)
        // и только потом летит к нам в центр
        .to(rig, { x: 0, y: 0, scale: 1, rotation: 0, rotationY: 0, duration: 0.33, ease: 'power3.inOut' }, 0.49)
        // фото затухает, чтобы смотрели на журнал
        .fromTo(shade, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: true }, 0.48)
        .to(bg, { filter: 'blur(3px)', duration: 0.3 }, 0.48)
        .fromTo(side, { x: 30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.15, immediateRender: true }, 0.74)
        .set({}, {}, 1);

      ScrollTrigger.create({
        trigger: el, start: 'top top', end: () => '+=' + dist(),
        pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        animation: tl, scrub: 0.6,
        // журнал можно листать, когда он лёг на место
        onUpdate: (self) => { wrap.dataset.live = self.progress > 0.84 ? '1' : '0'; },
      });
      logo.dataset.ready = '1';
      gsap.fromTo(hint, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', delay: 1.4 });
    }, el);

    return () => { ctx.revert(); header.style.removeProperty('--pill'); };
  }, []);

  return (
    <section ref={root} data-hero className={s.hero} aria-label={`Seasons of life №${currentIssue.number}`}>
      <div data-bg className={s.bg}>
        <img data-a className={s.photo} src="/img/hero-hold.jpg" alt="" />
        <img data-b className={s.photo} src="/img/hero-empty.jpg" alt="" style={{ opacity: 0 }} />
      </div>
      <span data-shade className={s.shade} aria-hidden="true" />

      <div className={s.bookWrap} data-bookwrap data-live="0">
        <div className={s.rig} data-rig>
          <Magazine cover={currentIssue} issues={issues} onFlip={() => setTouched(true)} />

          <div className={s.finger} data-gone={touched ? '1' : '0'} aria-hidden="true">
            <span className={s.ring} />
            <svg viewBox="0 0 64 80" width="64" height="80">
              <path d="M24 6c-4 0-7 3-7 7v28l-5-5c-3-3-8-1-8 3 0 2 1 4 2 5l14 21c3 5 7 7 13 7h12c9 0 15-6 15-15V38c0-3-2-5-5-5-1 0-3 .5-4 1.5C50 32 48 31 46 31c-2 0-4 1-5 2.5C40 32 38 31 37 31V13c0-4-3-7-7-7z" fill="#F3D2B8" stroke="#3F4B2E" strokeWidth="2.2" strokeLinejoin="round" />
              <path d="M37 31v8M46 31v8" stroke="#3F4B2E" strokeWidth="1.8" strokeLinecap="round" opacity=".55" />
            </svg>
          </div>
        </div>
      </div>

      {/* пальцы поверх журнала, пока он ещё в руке */}
      <div className={s.handBox} aria-hidden="true"><img data-hand className={s.photo} src="/img/hero-hand.png" alt="" style={{ opacity: 0 }} /></div>

      <p className={s.side}><span data-side>№{currentIssue.number} · {currentIssue.season} · {currentIssue.theme}</span></p>

      <h1 className="visually-hidden">Seasons of life №{currentIssue.number}, {currentIssue.season}: {currentIssue.theme}</h1>
      <span className={s.hint} data-hint style={{ opacity: 0 }}>листайте вниз ↓</span>
    </section>
  );
}
