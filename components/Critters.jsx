'use client';

import { useEffect, useRef } from 'react';
import s from './Critters.module.css';

// Зверьки из акварельного листа гуляют по всему первому экрану: вверх, вниз, вокруг журнала.
// Ходят вприпрыжку, останавливаются отдохнуть. У каждого своё настроение при виде курсора:
// ball и hedge любопытные, подходят и приплясывают, horse и furry пугливые, убегают,
// cloud невозмутимый, но подпрыгивает от неожиданности. Клик по зверьку: прыжок с кувырком.
// Дальние (выше по экрану) меньше и медленнее, ближние крупнее.
const CRITTERS = [
  { id: 'ball',  w: 92,  face: 1,  mode: 'curious', speed: 54 },
  { id: 'horse', w: 108, face: 1,  mode: 'shy',     speed: 64 },
  { id: 'cloud', w: 150, face: 1,  mode: 'calm',    speed: 30 },
  { id: 'furry', w: 118, face: -1, mode: 'shy',     speed: 72 },
  { id: 'hedge', w: 96,  face: -1, mode: 'curious', speed: 46 },
];
const G = 2600; // «гравитация» для прыжков, px/с²
const rnd = (a, b) => a + Math.random() * (b - a);

export default function Critters() {
  const layer = useRef(null);
  const els = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const host = layer.current;
    const touch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let W = host.clientWidth, H = host.clientHeight;
    const mouse = { x: -999, y: -999 }; // в координатах окна
    const top = () => Math.max(110, H * 0.3);   // выше этой линии не ходят (там логотип)
    const bot = () => H - 14;

    const st = CRITTERS.map((c, i) => {
      const w = touch ? c.w * 0.7 : c.w;
      const o = {
        c, w, el: els.current[i], aspect: 1,
        x: rnd(0, Math.max(10, W - w)), y: rnd(top() + 40, bot()), tx: 0, ty: 0,
        vx: 0, vy: 0, dir: Math.random() < 0.5 ? -1 : 1, phase: rnd(0, 6), pause: rnd(0.2, 2.5),
        yJ: 0, vyJ: 0, spin: 0, spinV: 0, cool: 0, wait: 0, pendingJump: false, sc: 1,
      };
      o.el.style.width = w + 'px';
      return o;
    });
    const visible = touch ? 3 : st.length;
    st.forEach((o, i) => { o.el.style.display = i < visible ? '' : 'none'; });
    const pick = (o) => { o.tx = rnd(0, Math.max(10, W - o.w)); o.ty = rnd(top(), bot()); };
    st.forEach(pick);

    const depth = (y) => 0.62 + 0.5 * Math.min(1, Math.max(0, (y - top()) / Math.max(1, bot() - top())));
    const jump = (o, v = 760, spin = false) => {
      if (o.yJ < -2) return;
      o.vyJ = -v;
      if (spin) o.spinV = o.dir * 360 / (2 * v / G);
    };
    const local = () => { const r = host.getBoundingClientRect(); return { x: mouse.x - r.left, y: mouse.y - r.top }; };

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onResize = () => { W = host.clientWidth; H = host.clientHeight; };
    const onDown = (e) => {
      const r = host.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      for (const o of st) {
        if (o.el.style.display === 'none') continue;
        const hh = o.w * o.aspect * o.sc;
        const d = Math.hypot(mx - (o.x + o.w / 2), my - (o.y - hh / 2));
        if (d < o.w * o.sc * 0.7) jump(o, 980, true);                      // клик по зверьку: кувырок
        else if (d < 320) { o.wait = rnd(0.05, 0.2); o.pendingJump = true; } // рядом: вздрогнул
      }
    };
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY, dy = Math.abs(y - lastY); lastY = y;
      if (dy > 90) st.forEach((o) => { if (!o.pendingJump) { o.wait = rnd(0, 0.3); o.pendingJump = true; } });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });

    let raf = 0, last = performance.now(), on = true;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const m = local();
      for (const o of st) {
        if (o.el.style.display === 'none') continue;
        const { c } = o;
        if (o.el.naturalWidth) o.aspect = o.el.naturalHeight / o.el.naturalWidth;
        o.sc = depth(o.y);
        const hh = o.w * o.aspect * o.sc;
        const cx = o.x + o.w / 2, cy = o.y - hh / 2;
        const dist = Math.hypot(m.x - cx, m.y - cy);
        const spd = c.speed * o.sc;
        let gait = 1, excited = false, tx = o.tx, ty = o.ty, goNow = false;

        o.cool -= dt;
        if (!touch) {
          if (c.mode === 'shy' && dist < 230) {
            // убегает прочь от курсора
            const ax = cx - m.x, ay = (o.y - m.y) * 0.8, l = Math.hypot(ax, ay) || 1;
            tx = Math.min(W - o.w, Math.max(0, o.x + (ax / l) * 320)); ty = Math.min(bot(), Math.max(top(), o.y + (ay / l) * 220));
            o.tx = tx; o.ty = ty; goNow = true; gait = 2.2; o.pause = 0;
            if (Math.hypot(tx - o.x, ty - o.y) < 30 && o.cool <= 0) { jump(o, 820); o.cool = 0.5; } // загнали в угол
          } else if (c.mode === 'curious' && dist < 380) {
            // идёт к курсору, вблизи приплясывает
            tx = Math.min(W - o.w, Math.max(0, m.x - o.w / 2)); ty = Math.min(bot(), Math.max(top(), m.y + hh / 2));
            o.tx = tx; o.ty = ty; goNow = true; gait = 1.5; o.pause = 0;
            if (dist < 100) { excited = true; tx = o.x; ty = o.y; if (o.cool <= 0) { jump(o, 420); o.cool = 0.45; } }
          } else if (c.mode === 'calm' && dist < 130 && o.cool <= 0) {
            jump(o, 700); o.cool = 4;
          }
        }

        let vx = 0, vy = 0;
        if (o.pause > 0 && !goNow) { o.pause -= dt; }
        else {
          const dx = tx - o.x, dy = ty - o.y, l = Math.hypot(dx, dy);
          if (excited) { /* стоит и пляшет */ }
          else if (l < 8) { if (!goNow) { o.pause = rnd(1, 3); pick(o); } }
          else { vx = (dx / l) * spd * gait; vy = (dy / l) * spd * gait * 0.7; }
        }
        o.vx += (vx - o.vx) * Math.min(1, dt * 7); o.vy += (vy - o.vy) * Math.min(1, dt * 7);
        o.x = Math.min(W - o.w, Math.max(0, o.x + o.vx * dt));
        o.y = Math.min(bot(), Math.max(top(), o.y + o.vy * dt));
        if (Math.abs(o.vx) > 4) o.dir = o.vx > 0 ? 1 : -1;
        else if (excited) o.dir = m.x > cx ? 1 : -1;
        const moving = Math.hypot(o.vx, o.vy) > 6;

        if (o.pendingJump) { o.wait -= dt; if (o.wait <= 0) { o.pendingJump = false; jump(o, rnd(560, 760)); } }

        // походка вприпрыжку: пока идёт, подпрыгивает с приседанием на земле; в покое дышит
        o.phase += dt * (moving ? 9 * gait : excited ? 14 : 2.2);
        const k = Math.abs(Math.sin(o.phase));
        const hop = moving ? k * 11 * (gait > 1.4 ? 1.5 : 1) * o.sc : excited ? k * 10 : 0;
        const crouch = moving || excited ? Math.pow(1 - k, 5) : 0;
        const breathe = !moving && !excited ? Math.sin(o.phase) * 0.018 : 0;
        const sy = 1 - 0.11 * crouch + breathe, sx = 1 + 0.09 * crouch - breathe;

        if (o.vyJ !== 0 || o.yJ < 0) {
          o.vyJ += G * dt; o.yJ += o.vyJ * dt;
          if (o.yJ >= 0) { o.yJ = 0; o.vyJ = 0; o.spin = 0; o.spinV = 0; } else o.spin += o.spinV * dt;
        }
        const air = o.yJ < -2;
        const rot = (moving ? Math.sin(o.phase) * 5 : excited ? Math.sin(o.phase * 2) * 7 : 0) + o.spin;
        const stretch = air ? 1 + Math.min(0.12, Math.abs(o.vyJ) / 9000) : 1;
        const hImg = o.w * o.aspect;

        o.el.style.zIndex = Math.round(o.y);
        o.el.style.transform =
          `translate3d(${o.x.toFixed(1)}px, ${(o.y - hImg + o.yJ - hop).toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${(o.dir * c.face * sx * o.sc).toFixed(3)}, ${(sy * stretch * o.sc).toFixed(3)})`;
      }
      if (on) raf = requestAnimationFrame(tick);
    };
    const run = (v) => { on = v && !document.hidden; cancelAnimationFrame(raf); if (on) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    run(true);

    // не тратим ресурсы, пока первый экран не виден
    const io = new IntersectionObserver(([e]) => run(e.isIntersecting), { threshold: 0 });
    io.observe(host);
    const vis = () => run(!document.hidden);
    document.addEventListener('visibilitychange', vis);

    return () => {
      on = false; cancelAnimationFrame(raf); io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);

  return (
    <div ref={layer} className={s.layer} aria-hidden="true">
      {CRITTERS.map((c, i) => (
        <img key={c.id} ref={(el) => { els.current[i] = el; }} className={s.critter} src={`/img/crit/${c.id}.png`} alt="" draggable="false" />
      ))}
    </div>
  );
}
