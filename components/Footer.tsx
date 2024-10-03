import { GITHUB_LINK } from '@/lib/links';

export default function Footer() {
  return (
    <section className="hidden w-full flex-row justify-between gap-2 px-4 py-3 md:flex">
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
          .
        </p>
      </aside>
      <a
        href={GITHUB_LINK}
        target="_blank"
        rel="noreferrer"
        className="text-[13px] font-medium leading-5 text-muted-foreground"
      >
        GitHub
      </a>
    </section>
  );
}
