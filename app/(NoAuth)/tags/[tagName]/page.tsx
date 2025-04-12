import PageError from '@/components/page-error';
import PostCard from '@/features/posts/components/post-card';
import { getPostsByTag } from '@/features/posts/queries';

export const runtime = 'edge';

interface TagPageProps {
  params: Promise<{
    tagName: string;
  }>;
}

const TagPage = async ({ params }: TagPageProps) => {
  const { tagName } = await params;
  const posts = await getPostsByTag(tagName);

  if (!posts) {
    return <PageError message="Posts not found" />;
  }

  return (
    <div className="container space-y-6">
      <h1 className="text-center text-3xl font-bold">#{decodeURIComponent(tagName)}</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default TagPage;
