'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './Hero.module.css';
import Magazine from './Magazine';
import Critters from './Critters';
import { currentIssue, issues } from '@/data/content';


// Первый экран в три такта, всё от прокрутки:
// 1) журнал лежит на столе корешком к нам, посередине большой логотип;
// 2) логотип уезжает в левый верхний угол на своё место, журнал поднимается и встаёт;
// 3) журнал листается, пока экран закреплён.
export default function Hero() {
  const root = useRef(null);
  const mag = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 860px)').matches;
    const q = gsap.utils.selector(el);
    const logo = q('[data-logo]')[0];
    const wrap = q('[data-bookwrap]')[0];
    const rig = q('[data-rig]')[0];
    const spine = q('[data-spine]')[0];
    const hint = q('[data-hint]');
    const fades = q('[data-fade]');

    // сколько прокрутки отдаём: 30% на подъём журнала, остальное на листание
    const dist = () => window.innerHeight * (mobile ? 9 : 8);
    const INTRO = 0.3;

    // положение большого логотипа в центре, посчитанное относительно его места в углу
    const bigLogo = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w0 = logo.offsetWidth;
      const h0 = logo.offsetHeight;
      const rect = logo.parentElement.getBoundingClientRect();
      const W = Math.min(vw * (mobile ? 0.78 : 0.56), 780);
      const S = W / w0;
      return { x: (vw - W) / 2 - rect.left, y: vh * 0.34 - (h0 * S) / 2 - rect.top, scale: S };
    };

    const ctx = gsap.context(() => {
      gsap.set(logo, { autoAlpha: 1, transformOrigin: '0 0' });
      gsap.set(rig, { transformPerspective: 1600, transformOrigin: '50% 100%' });

      // один триггер на всё: экран закреплён, вступление играет в первых 30% прокрутки, дальше листается журнал
      const tilt = mobile ? 68 : 66;
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
      const T = INTRO;
      tl.fromTo(logo,
        { x: () => bigLogo().x, y: () => bigLogo().y, scale: () => bigLogo().scale },
        { x: 0, y: 0, scale: 1, duration: T, ease: 'power3.inOut', immediateRender: true }, 0)
        .fromTo(rig,
          { rotationX: tilt, y: () => window.innerHeight * 0.17, scale: 1.22 },
          { rotationX: 0, y: 0, scale: 1, duration: T * 0.9, ease: 'power2.inOut', immediateRender: true }, T * 0.1)
        .fromTo(spine, { scaleY: 1, opacity: 1 }, { scaleY: 0, opacity: 0, duration: T * 0.6, ease: 'power2.in', immediateRender: true }, 0)
        .to(hint, { autoAlpha: 0, duration: T * 0.15 }, 0)
        .set({}, {}, 1);

      ScrollTrigger.create({
        trigger: el, start: 'top top', end: () => '+=' + dist(),
        pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        animation: reduce ? undefined : tl, scrub: reduce ? false : 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          wrap.dataset.live = p > INTRO ? '1' : '0';
          const q2 = (p - INTRO) / (0.93 - INTRO);
          mag.current?.setProgress(q2);
        },
      });

      if (reduce) {
        gsap.set(rig, { rotationX: 0, y: 0, scale: 1 });
        gsap.set(spine, { scaleY: 0, opacity: 0 });
        gsap.set(fades, { autoAlpha: 1 });
        gsap.set(hint, { autoAlpha: 0 });
        return;
      }

      // 0. при загрузке журнал «ложится» на стол снизу
      gsap.from(wrap, { y: 220, duration: 1.4, ease: 'power3.out', delay: 0.2 });
      gsap.fromTo(fades, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 1 });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.hero} aria-label={`Seasons of life №${currentIssue.number}`}>
      <a className={s.logo} href="#top" aria-label="Seasons of life, на главную">
        <img data-logo className={s.logoImg} src="/img/logo-moss.png" alt="Seasons of life" style={{ opacity: 0 }} />
      </a>

      <Critters />

      <div className={s.stage}>
        <div className={s.bookWrap} data-bookwrap data-live="0">
          <div className={s.rig} data-rig>
            <div className={s.bookBox}>
              <Magazine ref={mag} cover={currentIssue} issues={issues} />
              {/* корешок: нижняя грань лежащего журнала, видна, пока он лежит */}
              <div className={s.spine} data-spine aria-hidden="true">
                <img src="/img/logo-white.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <h1 className="visually-hidden">Seasons of life №{currentIssue.number}, {currentIssue.season}: {currentIssue.theme}</h1>
      </div>

      <span className={s.hint} data-hint data-fade style={{ opacity: 0 }}>листайте вниз ↓</span>
    </section>
  );
}
