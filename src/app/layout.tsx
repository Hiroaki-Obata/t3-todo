import '@/styles/globals.css';
import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import { TRPCReactProvider } from '@/trpc/react';
import dynamic from 'next/dynamic';

import { Header } from '@/components/custom/header';
import { Sidebar } from '@/components/custom/sidebar';

export const metadata: Metadata = {
  title: 'T3 Todo',
  description: 'A simple todo app built with T3',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then(
      (mod) => mod.ReactQueryDevtools
    ),
  { ssr: false }
);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 p-4 overflow-y-auto bg-slate-100">
              {children}
            </main>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
