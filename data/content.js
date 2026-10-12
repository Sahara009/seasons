// Все тексты главной в одном месте. Заголовки и ссылки взяты с seasons-project.ru (октябрь 2026).

export const SITE = 'https://seasons-project.ru';

export const currentIssue = {
  number: 81,
  season: 'осень 2026',
  theme: 'воспоминания',
  cover: '/img/c81.jpg',
  shop: `${SITE}/shop/`,
};

// Пункты меню ровно как в списке оригинала, плюс наш мудборд
export const nav = [
  { label: 'О проекте', href: '/about', internal: true },
  { label: 'Рекламодателям', href: `${SITE}/advertisment/`, soon: true },
  { label: 'Креативное бюро', href: `${SITE}/creative/`, soon: true },
  { label: 'Конкурс Makers', href: `${SITE}/category/makers/`, soon: true },
  { label: 'Команда', href: `${SITE}/team/`, soon: true },
  { label: 'Контакты', href: `${SITE}/contacts/`, soon: true },
  { label: 'Пространство Seasons в Москве', href: `${SITE}/prostranstvo-seasons-v-moskve/`, soon: true },
  { label: 'Мудборд', href: '/moodboard', internal: true },
];
export const navSmall = [];

// Развороты журнала: слева подпись номера, справа обложка
export const issues = [
  { no: 79, season: 'Весна 2026', theme: 'любовь', cover: '/img/c79.jpg' },
  { no: 77, season: 'Осень 2025', theme: 'Шёлковый путь и Восток', cover: '/img/c77.jpg', link: { label: 'интервью с Диной Рубиной', href: `${SITE}/dina-rubina/` } },
  { no: 76, season: 'Лето 2025', theme: 'тема года — части речи', cover: '/img/c76.jpg' },
  { no: 72, season: 'Лето 2024', theme: 'дорога', cover: '/img/c72.jpg' },
  { no: 71, season: 'Весна 2024', theme: 'тема года — путь героя', cover: '/img/c71.jpg' },
  { no: 69, season: 'Осень 2023', theme: 'тема года — праздник', cover: '/img/c69.jpg' },
  { no: 68, season: 'Лето 2023', theme: 'тема года — праздник', cover: '/img/c68.jpg' },
  { no: 45, season: 'Май–июнь 2018', theme: 'дерево', cover: '/img/c45.jpg' },
];

// ссылка на поиск по сайту оригинала для материалов, чей точный адрес мы не знаем
const S = (title) => `${SITE}/?s=${encodeURIComponent(title)}`;

// image — фото к материалу; без него в карточке цветная плашка с пометкой
export const actual = [
  { tag: 'makers', note: '2026', title: 'The Makers 2026: старт приёма заявок', href: `${SITE}/makers/about/`, tone: 'season', cta: 'читать' },
  { tag: 'душа и тело', title: 'Про воспоминания: колонка психолога и арт-терапевта Филиппа Жевлакова', href: S('Про воспоминания: колонка психолога и арт-терапевта Филиппа Жевлакова'), image: '/img/b-jevlakov.jpg' },
  { tag: 'в москве', note: 'октябрь', title: 'Октябрь в стиле Seasons: куда сходить в Москве и не только', href: `${SITE}/october-v-stile-seasons-kuda-shodit-v-moskve/`, tone: 'sage' },
  { tag: 'дизайн · события', title: '«То, что осталось в саду». Выставка в студии Seasons', href: `${SITE}/daria-kalabkina-alina-gavrilova-vystavka/`, image: '/img/b-garden.jpg' },
  { tag: 'дети · события', title: '«Девочка и Единорог»: рождественская сказка в студии Seasons', href: S('«Девочка и Единорог»: рождественская сказка в студии Seasons'), image: '/img/b-unicorn.jpg' },
  { tag: 'школа', note: 'курс', title: '«Шедевры мировой литературы. Русская классика»', href: `${SITE}/event/istorii-lyubvi/`, tone: 'olive' },
  { tag: 'книги', title: 'Что читать осенью: выбор команды Seasons', href: `${SITE}/chto-chitat-osenyu-vybor-komandy-seasons/`, image: '/img/b-books.jpg' },
  { tag: 'кино', title: 'Идеальные фильмы для осенних вечеров', href: `${SITE}/idealnye-filmy-dlya-osennih-vecherov/`, image: '/img/b-films.jpg' },
];

export const rubrics = [
  { id: 'all', label: 'все' },
  { id: 'people', label: 'люди' },
  { id: 'food', label: 'еда' },
  { id: 'culture', label: 'культура' },
  { id: 'travel', label: 'путешествия' },
  { id: 'kids', label: 'дети' },
  { id: 'design', label: 'дизайн' },
  { id: 'soul', label: 'душа и тело' },
];

// Материалы блога с оригинального сайта. Ссылок пока нет: клик — заглушка
export const posts = [
  { title: 'События Школы Seasons', label: 'школа · события', tags: ['culture'], href: '#post-1', image: '/img/blog/raspisanie.jpg' },
  { title: 'Курс «Шедевры мировой литературы. Русская классика» со Светланой Сидоровой', label: 'школа · курсы', tags: ['culture'], href: '#post-2', image: '/img/blog/shedevry.jpg' },
  { title: 'Русский стиль: как стилизовать и с чем носить', label: 'душа и тело', tags: ['soul', 'design'], href: '#post-3', image: '/img/blog/gloves.jpg' },
  { title: 'Песочница. Три рецепта тарта к воскресному обеду', label: 'еда', tags: ['food'], href: '#post-4', image: '/img/blog/pesochnitsa.jpg' },
  { title: 'Шесть интересных проектов 7 Московской Арт Премии в парке «Зарядье»', label: 'в Москве · культура', tags: ['culture'], href: '#post-5', image: '/img/blog/zaryadye.jpg' },
  { title: 'В Карелию осенью: шхеры, экотропы и северная еда', label: 'путешествия', tags: ['travel', 'food'], href: '#post-6', image: '/img/blog/kareliya.jpg' },
  { title: 'Каждый пишет как он дышит', label: 'душа и тело', tags: ['soul'], href: '#post-7', image: '/img/blog/kazhdyj-pishet.jpg' },
  { title: 'Мальдивы: романтика, личный риф и ужин на песке', label: 'путешествия', tags: ['travel'], href: '#post-8', image: '/img/blog/maldivy.jpg' },
  { title: 'Пять приёмов для уютной спальни: готовим дом к осени', label: 'дизайн', tags: ['design'], href: '#post-9', image: '/img/blog/spalnya.jpg' },
  { title: 'Сладкий октябрь: что готовить из сливы', label: 'еда', tags: ['food'], href: '#post-10', image: '/img/blog/sliva.jpg' },
  { title: 'Что ели наши прадедушки и прабабушки полтора века назад', label: 'еда · книги', tags: ['food', 'culture'], href: '#post-11', image: '/img/blog/pradedushki.jpg' },
  { title: 'Стихи об осени, которые интересно учить с детьми', label: 'дети', tags: ['kids'], href: '#post-12', image: '/img/blog/stihi.jpg' },
  { title: 'Соль земли: гостевой дом в здании бывшей земской больницы', label: 'люди · путешествия', tags: ['people', 'travel'], href: '#post-13', image: '/img/blog/sol-zemli.jpg' },
  { title: 'Без хитростей: три рецепта с Соловецких островов', label: 'еда', tags: ['food', 'travel'], href: '#post-14', image: '/img/blog/solovki.jpg' },
  { title: 'Октябрь в стиле Seasons: куда сходить в Москве и не только', label: 'в Москве · культура', tags: ['culture'], href: '#post-15', image: '/img/blog/oktyabr.jpg' },
  { title: 'Небанальный Петербург за один день', label: 'путешествия', tags: ['travel'], href: '#post-16', image: '/img/blog/piter.jpg' },
  { title: 'Тыква: с фермы на стол', label: 'еда', tags: ['food'], href: '#post-17', image: '/img/blog/tykva.jpg' },
  { title: 'DSCH. К 120-летию Дмитрия Шостаковича', label: 'люди', tags: ['people', 'culture'], href: '#post-18', image: '/img/blog/dsch.jpg' },
  { title: '«С первым осенним холодком жизнь начнётся сначала». 130 лет Фицджеральду', label: 'люди', tags: ['people', 'culture'], href: '#post-19', image: '/img/blog/fitz.jpg' },
  { title: 'Про воспоминания: колонка психолога и арт-терапевта Филиппа Жевлакова', label: 'душа и тело', tags: ['soul'], href: '#post-20', image: '/img/b-jevlakov.jpg' },
  { title: 'Кофе, яблоки, алыча: разговор с Диной Рубиной', label: 'люди', tags: ['people'], href: '#post-21', image: '/img/blog/rubina.jpg' },
  { title: 'Квартира с интересными акцентами в дореволюционном доме на Плющихе', label: 'дизайн', tags: ['design'], href: '#post-22', image: '/img/blog/plyushiha.jpg' },
  { title: 'Падают листья: осенний вишлист команды Seasons', label: 'душа и тело', tags: ['soul', 'design'], href: '#post-23', image: '/img/blog/leaves.jpg' },
  { title: '5 театральных премьер сезона, которые нельзя пропустить', label: 'в Москве · культура', tags: ['culture'], href: '#post-24', image: '/img/blog/teatr.jpg' },
  { title: 'Пельмени, лепёшки, лапша. Пять рецептов из теста', label: 'еда', tags: ['food'], href: '#post-25', image: '/img/blog/testo.jpg' },
  { title: '«То, что осталось в саду». Выставка в студии Seasons', label: 'дизайн · события', tags: ['design', 'culture'], href: '#post-26', image: '/img/blog/sad.jpg' },
  { title: 'Кружковорот: как составить расписание для ребёнка и везде успеть', label: 'дети', tags: ['kids'], href: '#post-27', image: '/img/blog/krujok.jpg' },
  { title: '«Девочка и Единорог»: рождественская сказка в студии Seasons', label: 'дети · события', tags: ['kids'], href: '#post-28', image: '/img/b-unicorn.jpg' },
  { title: 'Дни жатвы: 8 осенних фермерских рецептов', label: 'еда', tags: ['food'], href: '#post-29', image: '/img/blog/zhatva.jpg' },
  { title: '8 новых книг сентября', label: 'книги', tags: ['culture'], href: '#post-30', image: '/img/blog/knigi-sentyabr.jpg' },
  { title: 'Художник, который был верен себе. Памяти Андре Бразилье', label: 'дизайн · люди', tags: ['design', 'people'], href: '#post-31', image: '/img/blog/brazilier.jpg' },
  { title: 'О, Анна: театральный взгляд на Каренину', label: 'книги · культура', tags: ['culture'], href: '#post-32', image: '/img/blog/anna.jpg' },
  { title: 'Вкус осени: что готовить из грибов', label: 'еда', tags: ['food'], href: '#post-33', image: '/img/blog/griby.jpg' },
  { title: 'Почему Шуховскую башню нужно сохранить. Колонка историка архитектуры Айрата Багаутдинова', label: 'в Москве · дизайн', tags: ['design', 'culture'], href: '#post-34', image: '/img/blog/shuhov.jpg' },
  { title: 'Семь весёлых книг о школе и не только', label: 'дети · книги', tags: ['kids', 'culture'], href: '#post-35', image: '/img/blog/knigi-shkola.jpg' },
];

export const socials = [
  { label: 'telegram', href: 'https://t.me/seasons' },
  { label: 'вконтакте', href: 'https://vk.com/seasons.project' },
  { label: 'pinterest', href: 'https://www.pinterest.ru/seasonsproject/' },
];
