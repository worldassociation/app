'use client';

import { ArrowUpRight, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import ThemeToggle from './ThemeToggle';
import {
  DISCORD_LINK,
  GITHUB_LINK,
  GUILD_LINK,
  TELEGRAM_LINK
} from '@/lib/links';

export default function NavDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hidden max-md:block">
        <Menu className="mx-[7px] my-3 size-4 text-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56 py-2">
        <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer">
          <DropdownMenuItem>
            <p className="ml-2">Discord</p>
            <ArrowUpRight className="ml-1 size-3" />
          </DropdownMenuItem>
        </a>
        <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer">
          <DropdownMenuItem>
            <p className="ml-2">Telegram</p>
            <ArrowUpRight className="ml-1 size-3" />
          </DropdownMenuItem>
        </a>
        <a href={GUILD_LINK} target="_blank" rel="noopener noreferrer">
          <DropdownMenuItem>
            <p className="ml-2">Guild</p>
            <ArrowUpRight className="ml-1 size-3" />
          </DropdownMenuItem>
        </a>
        <DropdownMenuSeparator />
        <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer">
          <DropdownMenuItem>
            <p className="ml-2">GitHub</p>
            <ArrowUpRight className="ml-1 size-3" />
          </DropdownMenuItem>
        </a>
        <DropdownMenuSeparator />
        <div className="h flex items-center justify-between py-1.5 pl-2 pr-4">
          <p className="pointer-events-none px-2 text-sm">Dark mode</p>
          <ThemeToggle />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
