import { redirect } from 'next/navigation';
import SetupPageClient from './client';
import { hasAtLeastOneUser } from '@/features/users/queries';

export const runtime = 'edge';

export default async function SetupPage() {
  const hasUser = await hasAtLeastOneUser();

  if (hasUser) {
    redirect('/');
  }

  return <SetupPageClient />;
}
