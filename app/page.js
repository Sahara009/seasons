import Hero from '@/components/Hero';
import World from '@/components/World';
import Shelf from '@/components/Shelf';
import Blog from '@/components/Blog';
import Footer from '@/components/Footer';

// Заставка с журналом из руки → мир Seasons (журналы, школа, события) → архив номеров → блог → подвал
export default function Home() {
  return (
    <>
      <main id="top">
        <Hero />
        <World />
        <Shelf />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
