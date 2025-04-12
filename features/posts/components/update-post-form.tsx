'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select.tsx';
import Editor from '@/features/posts/components/editor';
import { useGetTags } from '@/features/tags/api/use-get-tags';
import TagsManageDialog from '@/features/tags/components/tags-manage-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ArrowLeftIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUpdatePost } from '../api/use-update-post';
import { useUpdatePostStatus } from '../api/use-update-post-status';
import { usePostSlug } from '../hooks/use-post-slug';
import { createPostSchema } from '../schemas';
import { Post } from '../types';

interface UpdatePostFormProps {
  initialData: Post;
}

type PostStatus = 'draft' | 'published';

const UpdatePostForm = ({ initialData }: UpdatePostFormProps) => {
  const router = useRouter();

  const slug = usePostSlug();

  const { data: tags } = useGetTags();
  const [maxCount, setMaxCount] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMaxCount(2);
      } else if (window.innerWidth >= 1024) {
        // lg breakpoint
        setMaxCount(1);
      } else if (window.innerWidth >= 768) {
        // md breakpoint
        setMaxCount(6);
      } else {
        setMaxCount(3);
      }
    };

    // 初始设置
    handleResize();

    // 添加事件监听
    window.addEventListener('resize', handleResize);

    // 清理事件监听
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: initialData.title,
      slug: initialData.slug,
      excerpt: initialData.excerpt || '',
      status: initialData.status,
      cover: initialData.cover || '',
      content: initialData.content,
      tags: initialData.tags.map((tag) => tag.id),
    },
  });

  const { mutate: updatePost, isPending } = useUpdatePost();
  const { mutate: updatePostStatus } = useUpdatePostStatus();

  function onSubmit(values: z.infer<typeof createPostSchema>) {
    updatePost({
      param: { slug },
      json: values,
    });
  }

  function onStatusChange(status: PostStatus, onChange: (value: PostStatus) => void) {
    onChange(status);
    updatePostStatus({
      param: { slug },
      query: { status },
    });
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Edit Article</h1>
        </div>
        <div className="text-muted-foreground mt-2 text-sm">
          Last updated: {format(initialData.updatedAt, 'yyyy-MM-dd HH:mm:ss')}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} placeholder="Enter title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="slug"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} placeholder="Enter slug" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="excerpt"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="Enter excerpt" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <FormField
              name="cover"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder="Enter cover image URL"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="tags"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tags
                    <TagsManageDialog tags={tags ?? []} />
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      {...field}
                      options={tags?.map((tag) => ({ label: tag.name, value: tag.id })) ?? []}
                      defaultValue={field.value}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select tags"
                      variant="inverted"
                      maxCount={maxCount}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex rounded-md shadow-sm" role="group">
                      <Button
                        type="button"
                        variant={field.value === 'draft' ? 'default' : 'ghost'}
                        onClick={() => onStatusChange('draft', field.onChange)}
                        className="rounded-l-md border-0"
                      >
                        Draft
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === 'published' ? 'success' : 'ghost'}
                        onClick={() => onStatusChange('published', field.onChange)}
                        className="rounded-r-md border-0"
                      >
                        Published
                      </Button>
                    </div>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : form.getValues('status') === 'published' ? (
                        'Publish'
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Editor {...field} value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default UpdatePostForm;
