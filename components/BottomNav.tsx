'use client';

import { usePathname } from 'next/navigation';
import {
  Book,
  Landmark,
  UserRoundPlus,
  UsersRound
} from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

const links = [
  { href: '/get-started', Icon: UserRoundPlus, label: 'Get started' },
  { href: '/community', Icon: UsersRound, label: 'Community' },
  { href: '/governance', Icon: Landmark, label: 'Governance' },
  { href: '/learn-more', Icon: Book, label: 'Learn more' }
];

const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="z-111 bottom-0 left-0 hidden h-[60px] w-full flex-1 items-center justify-around overflow-y-auto border-t border-border bg-background dark:bg-total dark:shadow-none max-md:fixed max-md:flex">
      {links.map(({ href, Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link key={href} href={href}>
            <div className="flex w-[72px] flex-col items-center justify-center">
              <Icon
                strokeWidth={1}
                size={24}
                className={
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }
              />
              <p
                className={clsx('mt-px text-[11px]', {
                  'text-foreground': isActive,
                  'text-muted-foreground': !isActive
                })}
              >
                {label}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
