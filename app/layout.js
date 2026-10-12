import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import Cursor from '@/components/Cursor';
import Header from '@/components/Header';
import ClickSound from '@/components/ClickSound';
import Menu from '@/components/Menu';
import Search from '@/components/Search';

export const metadata = {
  title: 'Seasons of life — концепт',
  description: 'Неофициальный концепт редизайна seasons-project.ru',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Piazzolla:ital,opsz,wght@0,8..30,300;0,8..30,400;0,8..30,500;1,8..30,300;1,8..30,400;1,8..30,500&family=Onest:wght@400;500&family=Space+Mono:wght@400;700&display=swap"
        />
      </head>
      <body>
        <div className="grain" aria-hidden="true" />
        <SmoothScroll />
        <Cursor />
        <ClickSound />
        <Header />
        <Menu />
        <Search />
        {children}
      </body>
    </html>
  );
}
