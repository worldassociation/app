import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { DISCORD_LINK, GUILD_LINK, TELEGRAM_LINK } from '@/lib/links';
import Link from 'next/link';

export default function NavMenu() {
  return (
    <NavigationMenu className="block max-md:hidden">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Get started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-xl bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="box-border size-[30px] rounded-full border-[5px] border-foreground"></div>
                    <div className="my-2 text-[17px] font-extrabold leading-5">
                      World Association
                    </div>
                    <p className="text-[13px] leading-tight text-muted-foreground">
                      The organization of global democracy.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/get-started" title="Overview">
                Explore our core services.
              </ListItem>
              <ListItem href="/voter-id" title="Global Voter ID">
                Participate in global democracy.
              </ListItem>
              <ListItem href="/basic-income" title="Global Basic Income">
                Get money for being human.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Community</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem title="Overview" href="/community">
                Discover ways to engage with the community.
              </ListItem>
              <ListItem title="Discord" href={DISCORD_LINK} isExternal>
                Join our Discord for real-time discussions, collaborations, and
                updates.
              </ListItem>
              <ListItem title="Guild" href={GUILD_LINK} isExternal>
                Get access to special Discord roles, human-only Telegram groups,
                and more.
              </ListItem>
              <ListItem title="Telegram" href={TELEGRAM_LINK} isExternal>
                Stay updated and connect with the community on Telegram.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Governance</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem title="Overview" href="/governance">
                Learn more about our decision-making processes.
              </ListItem>

              <ListItem
                title="Constitution"
                href="https://github.com/blaisekonya/constitution"
                isExternal
              >
                Review our constitution and contribute to its ongoing evolution.
              </ListItem>

              <ListItem
                title="World Polls"
                href="https://snapshot.org/#/polls.worldassociation.eth"
                isExternal
              >
                Experiment with global democracy by creating and voting in
                global polls.
              </ListItem>

              <ListItem
                title="World Petitions"
                href="https://snapshot.org/#/petitions.worldassociation.eth"
                isExternal
              >
                Create and sign anonymous yet verifiably democratic global
                petitions.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/learn-more" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Learn more
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { isExternal?: boolean }
>(({ className, title, children, isExternal, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
          {...(isExternal
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          <div className="flex items-center text-[13px] font-medium leading-none">
            {title}
          </div>
          <p className="line-clamp-2 text-[13px] leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
