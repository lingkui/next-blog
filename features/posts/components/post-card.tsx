import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { PublishedPost } from '../types';

interface PostCardProps {
  post: PublishedPost;
  className?: string;
}

export default function PostCard({ post, className }: PostCardProps) {
  return (
    <Card className={cn('group transition-all hover:shadow-lg dark:hover:shadow-gray-800', className)}>
      <Link href={`/posts/${post.slug}`} className="block">
        <CardHeader className="space-y-4">
          {post.cover && (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="space-y-2">
            <CardTitle className="line-clamp-2 text-xl">{post.title}</CardTitle>
            <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                #{tag}
              </Badge>
            ))}
          </div>

          <CardDescription className="text-muted-foreground text-sm">
            {post.publishedAt
              ? formatDistanceToNow(post.publishedAt, {
                  addSuffix: true,
                  locale: enUS,
                })
              : ''}
          </CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}
