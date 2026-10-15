import s from './moodboard.module.css';
import Palette from '@/components/Palette';

export const metadata = {
  title: 'Мудборд — Seasons of life, концепт',
  description: 'Чем вдохновлялись, какие шрифты и цвета выбраны для концепта сайта Seasons of life.',
};

const COLORS = [
  { name: 'Бумага', token: '--paper', hex: '#F6F0E2', role: 'основной фон страниц', dark: false },
  { name: 'Молоко', token: '--milk', hex: '#FBF7EC', role: 'страницы журнала, плашки, кнопки', dark: false },
  { name: 'Лён', token: '--linen', hex: '#ECE4D3', role: 'дорожка скроллбара, спокойные подложки', dark: false },
  { name: 'Мох', token: '--moss', hex: '#3F4B2E', role: 'логотип, заголовки, круглые кнопки', dark: true },
  { name: 'Глубокий мох', token: '--moss-deep', hex: '#2B3520', role: 'текст на рисунке, тёмные акценты', dark: true },
  { name: 'Янтарь', token: '--season', hex: '#DE9A4B', role: 'главный акцент: линии, ползунок, подсветка', dark: false },
  { name: 'Ember', token: '--ember', hex: '#C8782A', role: 'мелкие акценты на бумаге: номера и подписи', dark: true },
  { name: 'Шалфей', token: '--sage', hex: '#B9C3A3', role: 'спокойный зелёный для блоков и рамок', dark: false },
  { name: 'Слива-синий', token: '--plum', hex: '#2F4A9A', role: 'редкий холодный контраст, как синий в вырезках', dark: true },
  { name: 'Чернила', token: '--ink', hex: '#24231E', role: 'основной текст', dark: true },
];

const FONTS = [
  { name: 'Piazzolla', role: 'заголовки и цитаты', how: 'светлое и курсивное начертания, крупно и с тугим интервалом: слова выглядят написанными, а не набранными', sample: 'Хочу почитать про всё подряд', cls: 'display' },
  { name: 'Onest', role: 'текст и интерфейс', how: 'ровный и спокойный гротеск, чтобы абзацы и кнопки читались без усилий', sample: 'Журнал о жизни по сезонам, который приятно листать.', cls: 'body' },
  { name: 'Space Mono', role: 'подписи и нумерация', how: 'моно-шрифт заглавными для списков тем, номеров и подсказок: как штамп на бирке', sample: '01 · ВСЕ  02 · ЛЮДИ  03 · ЕДА', cls: 'mono' },
];

// Четыре источника вдохновения: у каждого две картинки, вторая проявляется при наведении
const REFS = [
  { a: '/img/mood/rack-a.jpg', b: '/img/mood/rack-b.jpg', title: 'Крутящийся стеллаж', to: 'секция «Мир Seasons»',
    text: 'Металлическая стойка из книжного магазина, которую хочется повернуть рукой. Из неё вырос стеллаж на главной: разделы стоят на полках, а он медленно крутится и разворачивается к тебе нужной стороной.' },
  { a: '/img/mood/shelf-a.jpg', b: '/img/mood/shelf-b.jpg', title: 'Полупрозрачные полки', to: 'каталог журналов',
    text: 'Цветной акрил, через который обложку видно и не видно одновременно. Так появились матовые кармашки в каталоге: журнал выглядывает из вставки и чуть выезжает, когда к нему тянешься.' },
  { a: '/img/mood/soft-a.jpg', b: '/img/mood/soft-b.jpg', title: 'Утонуть в мягком', to: 'первый экран',
    text: 'Журнал не читают на бегу. Его берут, когда можно выдохнуть: в кресле, под пледом, среди подушек, и листают медленно, страница за страницей. Поэтому первый экран мягкий и тихий: ты устраиваешься поудобнее, а журнал сам выходит из рук героини и ложится перед тобой.' },
  { a: '/img/mood/touch-a.jpg', b: '/img/mood/touch-b.jpg', title: 'Потрогать через экран', to: 'звуки, анимации, бумага',
    text: 'Карандаш, бумага под ладонью, песок, по которому от пальца идут круги. Хотелось, чтобы сайт тоже отвечал на касание: щелчок затвора и печатной машинки, журнал, который листается рукой, тёплая бумага вместо пикселей.' },
];

const IDEAS = [
  ['Текст — главный герой', 'Журнал живёт словами, поэтому заголовкам дан простор: крупный курсив, воздух вокруг, ничего не перебивает чтение.'],
  ['Всё можно потрогать', 'Колёса поиска, журнал, который листается нажатием, обложка в кармане: сайт отвечает на руку.'],
  ['Бумага и карандаш', 'Тёплый фон, живая линия, никаких холодных серых и неоновых цветов.'],
  ['Сезоны', 'Янтарь, мох и шалфей берутся из осени и лета, поэтому палитра лежит рядом с обложками номеров.'],
];

export default function Moodboard() {
  return (
    <main className={s.page}>
      <header className={s.top}>
        <p className={s.kick}>мудборд · неофициальный концепт</p>
        <h1 className={s.h1}>Что меня<br /><i>вдохновляло</i></h1>
        <p className={s.lead}>Это короткий разбор того, как собран концепт сайта Seasons of life: откуда взялись настроение, шрифты и цвета.</p>
      </header>

      <section className={s.sec} aria-labelledby="m-ref">
        <h2 id="m-ref" className={s.h2}><span>01</span> Вдохновение</h2>
        <div className={s.refs}>
          {REFS.map((r, i) => (
            <figure key={r.title} className={s.ref} tabIndex={0}>
              <span className={s.frame}>
                <img src={r.a} alt="" loading="lazy" />
                <img className={s.alt} src={r.b} alt="" loading="lazy" />
                <em className={s.no}>{String(i + 1).padStart(2, '0')}</em>
              </span>
              <figcaption>
                <b>{r.title}</b>
                <small>→ {r.to}</small>
                {r.text}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={s.sec} aria-labelledby="m-idea">
        <h2 id="m-idea" className={s.h2}><span>02</span> Принципы</h2>
        <ol className={s.ideas}>
          {IDEAS.map(([t, d], i) => (
            <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><div><b>{t}</b><p>{d}</p></div></li>
          ))}
        </ol>
      </section>

      <section className={s.sec} aria-labelledby="m-font">
        <h2 id="m-font" className={s.h2}><span>03</span> Шрифты</h2>
        <div className={s.fonts}>
          {FONTS.map((f) => (
            <article key={f.name} className={s.font}>
              <p className={`${s.sample} ${s[f.cls]}`}>{f.sample}</p>
              <p className={s.fname}><b>{f.name}</b> · {f.role}</p>
              <p className={s.fhow}>{f.how}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={s.sec} aria-labelledby="m-color">
        <h2 id="m-color" className={s.h2}><span>04</span> Цвета</h2>
        <p className={s.note}>Эти же значения лежат в <code>app/globals.css</code> как переменные, и сайт берёт цвета только оттуда, поэтому палитру можно менять в одном месте.</p>
        <Palette colors={COLORS} />
      </section>

      <footer className={s.foot}><a href="/">← на главную</a></footer>
    </main>
  );
}
