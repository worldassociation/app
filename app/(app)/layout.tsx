import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ThemeProvider } from 'next-themes';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class">
        <main className="flex w-full flex-col pb-[60px] md:pb-0">
          <div className="w-[100dvw] bg-primary py-2 text-center text-sm text-primary-foreground">
            Public preview. Available for demo and test purposes.
          </div>
          <div className="mx-auto flex w-full max-w-7xl flex-col">
            <Header />
            {children}
            <Footer />
          </div>
        </main>
        <BottomNav />
      </ThemeProvider>
    </>
  );
}
