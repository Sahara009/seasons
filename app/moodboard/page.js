import s from './moodboard.module.css';

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

const REFS = [
  { img: '/img/girl.jpg', title: 'Рисунок цветными карандашами', text: 'Девочка с кошкой и книгой: тёплая бумага, живая линия, никакой глянцевой «рекламности». Он стал фоном главного экрана и задал всю палитру.' },
  { img: '/img/frame.jpg', title: 'Рамка из игрушек', text: 'Старые книжные иллюстрации, расставленные по краю листа, а в середине пусто. Идея: вокруг шум и игра, посередине место для главного.' },
  { img: '/img/mood/art-circles.png', title: 'Art Circles', text: 'Поиск с двумя колёсами обложек по бокам. Из него выросла наша лупа: колёса крутятся в разные стороны, а найденный номер замирает напротив строки.' },
  { img: '/img/mood/review-log.png', title: 'Review log', text: 'Обложка в матовом полупрозрачном кармане. Так оформлена секция «Журналы»: при наведении обложка немного выезжает из кармана.' },
  { img: '/img/spread/flower-l.jpg', title: 'Развороты самих номеров', text: 'Крупные заголовки курсивом, много воздуха, акварельные растения. Мы берём это настроение из настоящих страниц и ничего не придумываем поверх.' },
  { img: '/img/banner.png', title: 'Оригинальный сайт', text: 'Из seasons-project.ru взяты тексты, названия разделов, обложки и баннер. Задача концепта: показать те же материалы в другой подаче.' },
];

const IDEAS = [
  ['Минимум текста', 'Одна мысль на экран. Остальное говорят картинки и движение.'],
  ['Всё можно потрогать', 'Колёса поиска, журнал, который листается нажатием, обложка в кармане: сайт отвечает на руку.'],
  ['Бумага и карандаш', 'Тёплый фон, живая линия, никаких холодных серых и неоновых цветов.'],
  ['Сезоны', 'Янтарь, мох и шалфей берутся из осени и лета, поэтому палитра лежит рядом с обложками номеров.'],
];

export default function Moodboard() {
  return (
    <main className={s.page}>
      <header className={s.top}>
        <p className={s.kick}>мудборд · неофициальный концепт</p>
        <h1 className={s.h1}>Что нас<br /><i>вдохновляло</i></h1>
        <p className={s.lead}>Это короткий разбор того, как собран концепт сайта Seasons of life: откуда взялись настроение, шрифты и цвета.</p>
      </header>

      <section className={s.sec} aria-labelledby="m-ref">
        <h2 id="m-ref" className={s.h2}><span>01</span> Вдохновение</h2>
        <div className={s.refs}>
          {REFS.map((r) => (
            <figure key={r.title} className={s.ref}>
              <span className={s.frame}><img src={r.img} alt="" loading="lazy" /></span>
              <figcaption><b>{r.title}</b>{r.text}</figcaption>
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
        <ul className={s.colors}>
          {COLORS.map((c) => (
            <li key={c.token} className={s.sw} style={{ '--c': `var(${c.token})` }} data-dark={c.dark ? '1' : '0'}>
              <span className={s.chip} />
              <b>{c.name}</b>
              <code>{c.hex}</code>
              <small>{c.role}</small>
            </li>
          ))}
        </ul>
      </section>

      <footer className={s.foot}><a href="/">← на главную</a></footer>
    </main>
  );
}
