import { getCurrentUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Lock, Rss } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import DarkToggle from './dark-toggle';
import SignOutButton from './sign-out-button';
import { Button } from './ui/button';

export default async function Header({ className }: { className?: string }) {
  const user = await getCurrentUser();

  return (
    <header className={cn('z-50 bg-gray-100 dark:bg-gray-800', className)}>
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <h1 className="text-2xl font-bold">Sunny&apos;s Blog</h1>
        </Link>
        <section className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/about">About</Link>
          </Button>
          <DarkToggle />
          <Button variant="outline" size="icon" asChild>
            <Link href="/rss">
              <Rss className="h-4 w-4" />
              <span className="sr-only">RSS</span>
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <Lock className="h-4 w-4" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </Button>
          {user && <SignOutButton />}
        </section>
      </div>
    </header>
  );
}
