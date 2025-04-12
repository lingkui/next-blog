import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardPageClient from './client';

export const runtime = 'edge';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <DashboardPageClient />;
}
