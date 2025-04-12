import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashBoardPostCreatePageClient from './client';

export const runtime = 'edge';

const DashBoardPostCreatePage = async () => {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <DashBoardPostCreatePageClient />;
};

export default DashBoardPostCreatePage;
