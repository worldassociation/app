'use client';

import { usePathname } from 'next/navigation';
import {
  CircleUserRound,
  Landmark,
  UserRoundCheck,
  UsersRound
} from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownFundLink,
  WalletDropdownLink
} from '@coinbase/onchainkit/wallet';
import { useAccount, useConnect } from 'wagmi';
import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name
} from '@coinbase/onchainkit/identity';
import { coinbaseWallet } from 'wagmi/connectors';

const links = [
  { href: '/membership', Icon: UserRoundCheck, label: 'Membership' },
  { href: '/community', Icon: UsersRound, label: 'Community' },
  { href: '/governance', Icon: Landmark, label: 'Governance' }
];

const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { address } = useAccount();
  const { connect } = useConnect();

  const handleConnect = () => {
    connect({ connector: coinbaseWallet() });
  };

  return (
    <div className="z-111 bottom-0 left-0 hidden h-[60px] w-full flex-1 items-center justify-around overflow-y-auto border-t border-border bg-background dark:bg-total dark:shadow-none max-md:fixed max-md:flex">
      {links.map(({ href, Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link key={href} href={href}>
            <div className="flex w-[72px] flex-col items-center justify-center">
              <Icon
                strokeWidth={1.25}
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
      {address ? (
        <div className="flex flex-col items-center justify-center">
          <Wallet>
            <ConnectWallet className="bg-transparent p-0 hover:bg-transparent">
              <Identity
                address={address}
                className="flex w-[72px] flex-col items-center justify-center bg-transparent py-0 hover:bg-transparent"
              >
                <Avatar className="h-6 w-6 text-muted-foreground" />
                <p className="mt-px text-[11px] text-foreground">
                  {address.slice(0, 6)}
                </p>
              </Identity>
            </ConnectWallet>
            <WalletDropdown className="bg-background">
              <Identity
                className="rounded-md bg-background px-4 pb-2 pt-3 hover:bg-muted"
                address={address}
                hasCopyAddressOnClick={true}
              >
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownLink
                className="onchainkit-wallet-dropdown-link rounded-md bg-background hover:bg-muted"
                icon="wallet"
                href="https://wallet.coinbase.com"
              >
                Go to wallet dashboard
              </WalletDropdownLink>
              <WalletDropdownFundLink className="onchainkit-wallet-dropdown-fund-link rounded-md bg-background hover:bg-muted" />
              <WalletDropdownDisconnect className="onchainkit-wallet-dropdown-disconnect rounded-md bg-background hover:bg-muted" />
            </WalletDropdown>
          </Wallet>
          <p className="mt-px text-[11px] text-muted-foreground">Account</p>
        </div>
      ) : (
        <div
          className="flex w-[72px] cursor-pointer flex-col items-center justify-center"
          onClick={handleConnect}
        >
          <CircleUserRound
            strokeWidth={1}
            size={24}
            className="text-muted-foreground"
          />
          <p className="mt-px text-[11px] text-muted-foreground">Account</p>
        </div>
      )}
    </div>
  );
};

export default BottomNav;
