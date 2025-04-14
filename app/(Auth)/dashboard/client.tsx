'use client';

import { Button } from '@/components/ui/button';
import LLMConfigDialog from '@/features/ai/components/llm-config-dialog';
import { useGetPosts } from '@/features/posts/api/use-get-posts';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';

export default function DashboardPageClient() {
  const [page, setPage] = useState(1);

  const { data, isFetching } = useGetPosts({ page });

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Articles</h1>
        <div className="flex items-center gap-2">
          <LLMConfigDialog />
          <Button asChild>
            <Link href="/dashboard/posts/create">
              <PlusIcon />
              New Article
            </Link>
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.posts ?? []}
        page={page}
        setPage={setPage}
        total={data?.total ?? 0}
        hasPrev={data?.hasPrev ?? false}
        hasNext={data?.hasNext ?? false}
        isLoading={isFetching}
      />
    </div>
  );
}
