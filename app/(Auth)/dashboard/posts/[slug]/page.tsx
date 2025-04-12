import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashBoardPostIdPageClient from './client';

export const runtime = 'edge';

const DashBoardPostIdPage = async () => {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <DashBoardPostIdPageClient />;
};

export default DashBoardPostIdPage;
