'use client';

import PageError from '@/components/page-error';
import PageLoader from '@/components/page-loader';
import { useGetPost } from '@/features/posts/api/use-get-post';
import UpdatePostForm from '@/features/posts/components/update-post-form';
import { usePostSlug } from '@/features/posts/hooks/use-post-slug';

const DashBoardPostIdPageClient = () => {
  const slug = usePostSlug();
  const { data: initialData, isLoading } = useGetPost({ slug });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!initialData) {
    return <PageError message="Post not found" />;
  }

  return <UpdatePostForm initialData={initialData} />;
};

export default DashBoardPostIdPageClient;
