import { DISCORD_LINK, GITHUB_LINK, TELEGRAM_LINK } from '@/lib/links';
import { ArrowUpRight } from 'lucide-react';

const docLinks = [
  { href: DISCORD_LINK, title: 'Discord' },
  { href: TELEGRAM_LINK, title: 'Telegram' }
];

export default function Footer() {
  return (
    <section className="hidden w-full flex-row justify-between gap-2 p-5 md:flex">
      <aside className="flex items-center">
        <p className="text-[13px] leading-5 text-muted-foreground">
          Built with love by{' '}
          <a
            href="https://github.com/blaisekonya"
            target="_blank"
            rel="noreferrer"
            className="font-semibold"
          >
            blaisekonya
          </a>
          . The source code is available on{' '}
          <a
            href={GITHUB_LINK}
            target="_blank"
            rel="noreferrer"
            className="font-semibold"
          >
            GitHub
          </a>
          .
        </p>
      </aside>
      <ul className="flex max-w-full flex-row flex-wrap justify-start gap-6">
        {docLinks.map(({ href, title }) => (
          <li className="flex" key={href}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              title={title}
              className="flex items-center"
            >
              <p className="text-[13px] font-medium leading-5 text-muted-foreground">
                {title}
              </p>
              <ArrowUpRight className="ml-1 size-3 text-muted-foreground" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
