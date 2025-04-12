import PageError from '@/components/page-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { updatePostViews } from '@/features/posts/actions';
import PostBody from '@/features/posts/components/post-body';
import TableOfContents from '@/features/posts/components/table-of-contents';
import { getPostBySlug } from '@/features/posts/queries';
import { auth } from '@/lib/auth';
import { getMarkdownHeadings } from '@/lib/utils';
import { format } from 'date-fns';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';

interface PostSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PostSlugPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return <PageError message="Post not found" />;
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      title: post.title,
      description: post.excerpt,
      url: `${process.env.BASE_URL}/posts/${post.slug}`,
      images: [post.cover],
    },
  };
}

const PostSlugPage = async ({ params }: PostSlugPageProps) => {
  const session = await auth();

  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return <PageError message="Post not found" />;
  }

  await updatePostViews(slug);

  return (
    <main className="space-y-8">
      <section className="space-y-2">
        <header className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          {session && (
            <Link href={`/dashboard/posts/${post.slug}`}>
              <Button variant="secondary" size="sm">
                <PencilIcon className="size-4" />
                Edit
              </Button>
            </Link>
          )}
        </header>
        <p className="text-sm text-gray-500 italic">{post.publishedAt ? format(post.publishedAt, 'yyyy-MM-dd') : ''}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
      </section>
      <div className="flex justify-between gap-10">
        <article className="prose dark:prose-invert prose-code:before:hidden prose-code:after:hidden max-w-none">
          <PostBody content={post.content} />
        </article>
        <aside className="sticky top-20 hidden max-h-screen w-1/5 shrink-0 md:block">
          <TableOfContents headings={getMarkdownHeadings(post?.content)} />
        </aside>
      </div>
    </main>
  );
};

export default PostSlugPage;
