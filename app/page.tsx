import Empty from '@/components/empty';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PostCard from '@/features/posts/components/post-card';
import { getLatestPublishedPosts } from '@/features/posts/queries';
import { getTags } from '@/features/tags/queries';
import { hasAtLeastOneUser } from '@/features/users/queries';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const runtime = 'edge';

export default async function Home() {
  const hasUser = await hasAtLeastOneUser();
  if (!hasUser) {
    redirect('/setup');
  }

  const [latestPosts, tags] = await Promise.all([getLatestPublishedPosts(), getTags()]);

  return (
    <main className="container mx-auto py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* 文章列表 */}
        <div className="lg:col-span-2">
          {latestPosts.length === 0 ? (
            <Empty
              title="No Posts Yet"
              description="It looks like there are no posts available. Start writing and share your thoughts!"
            />
          ) : (
            <div className="space-y-6">
              {latestPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* 标签列表 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.length === 0 ? (
                  <Empty
                    title="No Tags Available"
                    description="No tags have been created yet. Add some to organize your content!"
                  />
                ) : (
                  tags.map((tag) => (
                    <Link key={tag.id} href={`/tags/${tag.name}`}>
                      <Badge variant="secondary" className="hover:bg-primary/10 cursor-pointer transition-colors">
                        #{tag.name}
                      </Badge>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
