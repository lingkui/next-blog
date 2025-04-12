import PageError from '@/components/page-error';
import PostBody from '@/features/posts/components/post-body';
import { getPostBySlug } from '@/features/posts/queries';
import type { Metadata } from 'next';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'About',
  description: 'About me',
};

export default async function About() {
  const post = await getPostBySlug('about');

  if (!post) {
    return <PageError message="Post <About> is not found" />;
  }

  return (
    <article className="prose dark:prose-invert prose-code:before:hidden prose-code:after:hidden max-w-none">
      <PostBody content={post.content} />
    </article>
  );
}
