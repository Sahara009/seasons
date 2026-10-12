import School from '@/components/School';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Школа Seasons — концепт',
  description: 'Курсы и мастер-классы для взрослых и детей за длинным общим столом.',
};

export default function Page() {
  return (
    <>
      <main><School /></main>
      <Footer />
    </>
  );
}
