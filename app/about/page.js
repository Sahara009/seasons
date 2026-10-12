import About from '@/components/About';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'О проекте — Seasons Project, концепт',
  description: 'Как журнал Seasons of life вырос в целый мир: журналы, школа, фестивали, мейкеры.',
};

export default function Page() {
  return (
    <>
      <main><About /></main>
      <Footer />
    </>
  );
}
