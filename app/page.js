import Hero from '@/components/Hero';
import Menu from '@/components/Menu';
import Search from '@/components/Search';
import Banner from '@/components/Banner';
import Actual from '@/components/Actual';
import Shelf from '@/components/Shelf';
import Blog from '@/components/Blog';
import Footer from '@/components/Footer';

// Один длинный «стол»: журнал, который листается скроллом → акварель с горизонтальной лентой → список материалов → синий подвал
export default function Home() {
  return (
    <>
      <Menu />
      <Search />
      <main id="top">
        <Hero />
        <Banner />
        <Actual />
        <Shelf />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
