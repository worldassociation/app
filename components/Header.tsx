import Link from 'next/link';
import NavMenu from './NavMenu';
import LogInButton from './LogInButton';
import ThemeSwitcher from './ThemeSwitcher';
import { Github } from 'lucide-react';
import { GITHUB_LINK } from '@/lib/links';

export default function Header() {
  return (
    <header className="flex w-[100dvw] items-center justify-between px-4 py-3 xl:w-[80rem]">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center">
          <div className="box-border size-[30px] rounded-full border-[5px] border-foreground"></div>
        </Link>
        <NavMenu />
        <Link
          className="block text-[13px] font-medium md:hidden"
          href="/learn-more"
        >
          Learn more
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <a
          className="block md:hidden"
          href={GITHUB_LINK}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="-ml-[11px] rounded-full p-[11px] hover:bg-muted">
            <Github className="size-[18px]" strokeWidth={1} />
          </button>
        </a>
        <LogInButton />
      </div>
    </header>
  );
}
