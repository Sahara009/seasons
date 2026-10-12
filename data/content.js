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
  { label: 'О проекте', href: `${SITE}/about/` },
  { label: 'Рекламодателям', href: `${SITE}/advertisment/` },
  { label: 'Креативное бюро', href: `${SITE}/creative/` },
  { label: 'Конкурс Makers', href: `${SITE}/category/makers/` },
  { label: 'Команда', href: `${SITE}/team/` },
  { label: 'Контакты', href: `${SITE}/contacts/` },
  { label: 'Пространство Seasons в Москве', href: `${SITE}/prostranstvo-seasons-v-moskve/` },
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

// size: s | m | l — размер заголовка; tone — цвет «листка»; image — фото, если есть
export const posts = [
  { title: 'Кофе, яблоки, алыча: разговор с Диной Рубиной', label: 'люди', date: '19.09.2026', tags: ['people'], href: `${SITE}/dina-rubina/`, image: '/img/c77.jpg' },
  { title: 'Про воспоминания: колонка психолога и арт-терапевта Филиппа Жевлакова', label: 'душа и тело', tags: ['soul', 'people'], href: S('Про воспоминания: колонка психолога и арт-терапевта Филиппа Жевлакова'), image: '/img/b-jevlakov.jpg' },
  { title: 'Соль земли: гостевой дом в здании бывшей земской больницы', label: 'люди · путешествия', date: '30.09.2026', tags: ['people', 'travel'], href: `${SITE}/sol-zemli/`, tone: 'sage' },
  { title: '«Гений — это бессмертный вариант простого человека»: к 85-летию Довлатова', label: 'люди', tags: ['people', 'culture'], href: S('Гений — это бессмертный вариант простого человека Довлатов'), image: '/img/b-dovlatov.jpg' },
  { title: 'Сладкий октябрь: что готовить из сливы', label: 'еда', tags: ['food'], href: `${SITE}/sladkij-oktyabr-chto-gotovit-iz-slivy/`, tone: 'seasonSoft' },
  { title: 'Сотовая связь. Четыре рецепта с медом', label: 'еда', tags: ['food'], href: S('Сотовая связь. Четыре рецепта с медом'), image: '/img/b-honey.jpg' },
  { title: 'Что читать осенью: выбор команды Seasons', label: 'книги', tags: ['culture'], href: `${SITE}/chto-chitat-osenyu-vybor-komandy-seasons/`, image: '/img/b-books.jpg' },
  { title: 'Идеальные фильмы для осенних вечеров', label: 'кино', tags: ['culture'], href: `${SITE}/idealnye-filmy-dlya-osennih-vecherov/`, image: '/img/b-films.jpg' },
  { title: 'После прочтения съесть: в прокат выходит фильм «Тони»', label: 'еда · кино', tags: ['food', 'culture'], href: S('После прочтения съесть: в прокат выходит фильм «Тони»'), image: '/img/b-toni.jpg' },
  { title: 'Стихи об осени, которые интересно учить с детьми', label: 'дети', tags: ['kids'], href: `${SITE}/stihi-ob-oseni-kotorye-interesno-uchit-s-detmi/`, tone: 'seasonSoft' },
  { title: 'Кружковорот: как составить расписание для ребенка и везде успеть', label: 'дети', tags: ['kids'], href: S('Кружковорот: как составить расписание для ребенка и везде успеть'), image: '/img/b-krujok.jpg' },
  { title: '5 спокойных мультфильмов для детей', label: 'дети · кино', tags: ['kids', 'culture'], href: S('5 спокойных мультфильмов для детей'), image: '/img/b-cartoons.jpg' },
  { title: '«Девочка и Единорог»: рождественская сказка в студии Seasons', label: 'дети · события', tags: ['kids', 'design'], href: S('«Девочка и Единорог»: рождественская сказка в студии Seasons'), image: '/img/b-unicorn.jpg' },
  { title: 'Небанальный Петербург за один день', label: 'путешествия', tags: ['travel'], href: `${SITE}/nebanalnyj-peterburg-za-odin-den/`, tone: 'sage' },
  { title: '«То, что осталось в саду». Выставка в студии Seasons', label: 'дизайн · события', tags: ['design'], href: `${SITE}/daria-kalabkina-alina-gavrilova-vystavka/`, image: '/img/b-garden.jpg' },
  { title: 'Работа над ошибками: почему это важная часть любого пути', label: 'истории', tags: ['soul', 'people'], href: S('Работа над ошибками: почему это важная часть любого пути'), image: '/img/b-errors.jpg' },
  { title: 'Море красоты: вишлист команды Seasons на More Amore', label: 'душа и тело', tags: ['soul', 'design'], href: S('Море красоты: вишлист команды Seasons на More Amore'), image: '/img/b-amore.jpg' },
  { title: 'Тыква: с фермы на стол', label: 'еда', tags: ['food'], href: `${SITE}/oranzhevyj-hit-sezona-chto-gotovit-iz-tykvy/`, tone: 'milk' },
  { title: 'Гончарная мастерская на набережной Москва-реки', label: 'душа и тело', tags: ['soul', 'people'], href: `${SITE}/goncharnaya-mastersaya-chalet-studio/`, tone: 'olive' },
];

export const socials = [
  { label: 'telegram', href: 'https://t.me/seasons' },
  { label: 'вконтакте', href: 'https://vk.com/seasons.project' },
  { label: 'pinterest', href: 'https://www.pinterest.ru/seasonsproject/' },
];
