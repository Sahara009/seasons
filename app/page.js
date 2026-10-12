import Hero from '@/components/Hero';
import Actual from '@/components/Actual';
import Shelf from '@/components/Shelf';
import Blog from '@/components/Blog';
import Footer from '@/components/Footer';

// Один длинный «стол»: заставка на рисунке → свежий номер, который листается нажатием → акварель с горизонтальной лентой → список материалов → синий подвал
export default function Home() {
  return (
    <>
      <main id="top">
        <Hero />
        <Actual />
        <Shelf />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
