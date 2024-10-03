import './globals.css';
import { Inter } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider';
import OnchainProviders from '@/components/OnchainProviders';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import '@zkmelabs/widget/dist/style.css';

export const metadata = {
  title: 'World Association',
  description: 'Democratizing global governance.',
  openGraph: {
    title: 'World Association',
    description: 'Democratizing global governance.'
  }
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap'
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${inter.className} flex items-center justify-center antialiased`}
      >
        <OnchainProviders>
          <RootProvider
            search={{
              hotKey: [{ key: 'k', display: <></> }]
            }}
          >
            {children}
          </RootProvider>
        </OnchainProviders>
      </body>
    </html>
  );
}
