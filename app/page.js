import Hero from '@/components/Hero';
import World from '@/components/World';
import Shelf from '@/components/Shelf';
import Blog from '@/components/Blog';
import Footer from '@/components/Footer';
import { Tear } from '@/components/Paper';
import Unpack from '@/components/Unpack';
import Events from '@/components/Events';

// Заставка → мир Seasons → свежий номер → архив → афиша → блог → подвал
export default function Home() {
  return (
    <>
      <main id="top">
        <Hero />
        <Tear color="#B9C3A3" seed={2} />
        <World />
        <Tear color="#F6F0E2" seed={3} />
        <Unpack />
        <Tear color="#2B3520" seed={5} />
        <Shelf />
        <Tear color="#B9C3A3" seed={7} />
        <Events />
        <Tear color="#F6F0E2" seed={8} />
        <Blog />
      </main>
      <Tear color="#C8782A" seed={11} />
      <Footer />
    </>
  );
}
