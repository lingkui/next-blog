'use client';

import PageError from '@/components/page-error';
import PageLoader from '@/components/page-loader';
import { useGetPost } from '@/features/posts/api/use-get-post';
import CreatePostForm from '@/features/posts/components/create-post-form';
import { usePostSlug } from '@/features/posts/hooks/use-post-slug';

const DashBoardPostCreatePageClient = () => {
  const slug = usePostSlug();
  const { data: initialData, isLoading } = useGetPost({ slug });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!initialData) {
    return <PageError message="Post not found" />;
  }

  return <CreatePostForm />;
};

export default DashBoardPostCreatePageClient;
