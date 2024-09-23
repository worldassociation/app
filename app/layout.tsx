import './globals.css';
import { Inter } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider';
import OnchainProviders from '@/components/OnchainProviders';
import '@coinbase/onchainkit/styles.css';

export const metadata = {
  title: 'World Association - The democratic United Nations alternative',
  description:
    'Join anonymously, get a basic income, and shape the future of global governance.',
  openGraph: {
    title: 'World Association - The democratic United Nations alternative',
    description:
      'Join anonymously, get a basic income, and shape the future of global governance.'
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
