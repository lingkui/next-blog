'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PostDeleteDialog from '@/features/posts/components/post-delete-dialog';
import { Post } from '@/features/posts/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <Link href={row.original.slug === 'about' ? `/about` : `/posts/${row.original.slug}`}>
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: 'views',
    header: 'Views',
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        {row.original.tags.map((tag) => (
          <Badge key={tag.id} variant="outline">
            {tag.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => format(row.original.createdAt, 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'published' ? 'success' : 'secondary'}>
        {row.original.status === 'published' ? 'Published' : 'Draft'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const post = row.original;

      return (
        <>
          <Button className="mr-2" variant="outline" size="sm" asChild>
            <Link href={`/dashboard/posts/${post.slug}`}>
              <PencilIcon className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          <PostDeleteDialog slug={post.slug} />
        </>
      );
    },
  },
];
