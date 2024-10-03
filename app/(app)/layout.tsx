import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ThemeProvider } from 'next-themes';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class">
        <main className="flex w-full max-w-7xl flex-col pb-[60px] md:pb-0">
          <Header />
          {children}
          <Footer />
        </main>
        <BottomNav />
      </ThemeProvider>
    </>
  );
}
