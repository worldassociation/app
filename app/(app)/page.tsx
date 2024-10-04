import GetStartedButton from '@/components/get-started-button';
import Hero from '@/components/Hero';

function HomePage() {
  return (
    <div className="flex h-full min-h-[calc(100dvh-160px)] flex-col items-center justify-center p-4 md:min-h-[calc(100dvh-144px)]">
      <Hero />
      <GetStartedButton />
    </div>
  );
}

export default HomePage;
