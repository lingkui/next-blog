'use client';

import PageError from '@/components/page-error';
import PageLoader from '@/components/page-loader';
import { useGetLLMConfigStatus } from '@/features/ai/api/use-get-llm-config-status';
import { useGetPost } from '@/features/posts/api/use-get-post';
import UpdatePostForm from '@/features/posts/components/update-post-form';
import { usePostSlug } from '@/features/posts/hooks/use-post-slug';

const DashBoardPostIdPageClient = () => {
  const slug = usePostSlug();
  const { data: initialData, isLoading } = useGetPost({ slug });
  const { data: isLLMReady } = useGetLLMConfigStatus();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!initialData) {
    return <PageError message="Post not found" />;
  }

  return <UpdatePostForm initialData={initialData} isLLMReady={isLLMReady} />;
};

export default DashBoardPostIdPageClient;
