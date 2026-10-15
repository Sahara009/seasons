import s from './Events.module.css';
import Grain from './Grain';
import { SITE } from '@/data/content';

// Афиша как билеты: слева событие, справа отрывной корешок с датой. При наведении корешок надрывается.
// Данные — с seasons-project.ru, раздел «События», осень 2026.
const EVENTS = [
  { kind: 'выставка', t: '«То, что осталось в саду»', d: 'Текстиль Даши Калабкиной и акварели Алины Гавриловой по мотивам осеннего номера: пространство детских воспоминаний и места, которых больше нет.',
    when: 'будни 11:00–19:00', where: 'Садовая-Самотечная, 2/12, вход с Лихова пер.', day: '18.09', till: '01.11', price: 'вход свободный', href: `${SITE}/daria-kalabkina-alina-gavrilova-vystavka/` },
  { kind: 'поп-ап', t: 'Маркет «Воспоминания»', d: 'Локальные бренды в студии Seasons: винтаж, одежда, украшения, ароматы, керамика и вещи для дома. Розыгрыш бокса «Воспоминания».',
    when: '12:00–21:00', where: 'студия Seasons, Лихов пер., 12/2, 1 этаж', day: '31.10', till: '01.11', price: 'вход свободный', href: `${SITE}/pop-ap-lokalnyh-brendov-v-studii-seasons/` },
  { kind: 'спектакль', t: '«Девочка и Единорог»', d: 'Рождественская сказка в средневековом духе: мастерские, театр теней и чаепитие. Для детей 5–9 лет вместе с родителем, не больше 10 семей.',
    when: '12, 13, 18–20 декабря, 3–4 января', where: 'студия Seasons, м. Цветной бульвар', day: '12.12', till: '04.01', price: 'дети 7 000 ₽ · взрослые 3 000 ₽', href: `${SITE}/devochka-i-edinorog/` },
];

export default function Events() {
  return (
    <section className={s.sec} aria-labelledby="h-ev">
      <Grain />
      <p className="tag">афиша</p>
      <h2 id="h-ev" className={s.h}>Куда прийти <i>этой осенью</i></h2>
      <ul className={s.list}>
        {EVENTS.map((e) => (
          <li key={e.t}>
            <a className={s.ticket} href={e.href} target="_blank" rel="noopener">
              <div className={s.main}>
                <span className={s.kind}>{e.kind}</span>
                <h3>{e.t}</h3>
                <p>{e.d}</p>
                <dl>
                  <div><dt>когда</dt><dd>{e.when}</dd></div>
                  <div><dt>где</dt><dd>{e.where}</dd></div>
                </dl>
              </div>
              <div className={s.stub}>
                <b>{e.day}</b>
                <span>— {e.till}</span>
                <small>{e.price}</small>
                <em>подробнее →</em>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
