import Container from '@/components/container';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { Providers as QueryProvider } from '@/components/query-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://bytespark.me'),
  title: {
    template: "%s | Sunny's Blog",
    default: "Sunny's Blog",
  },
  description: 'Think, Write, Code',
  icons: {
    icon: '/logo.png',
  },
  keywords: ['Blog', 'Next.js', 'React', 'Vue', 'TypeScript', 'JavaScript'],
  authors: [{ name: 'Sunny', url: 'https://github.com/sdrpsps' }],
  creator: 'Sunny',
  openGraph: {
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <Header />
            <Container>{children}</Container>
            <Footer />
          </QueryProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
