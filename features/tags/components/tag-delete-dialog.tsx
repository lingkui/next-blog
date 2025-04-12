'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TrashIcon } from 'lucide-react';
import { useDeleteTag } from '../api/use-delete-tag';
import { toast } from 'sonner';

interface TagDeleteDialogProps {
  tagId: string;
}

const TagDeleteDialog = ({ tagId }: TagDeleteDialogProps) => {
  const { mutate: deleteTag, isPending: isDeleting } = useDeleteTag();

  const handleDelete = () => {
    deleteTag(
      { param: { tagId } },
      {
        onError: (error) => {
          toast.error(error.message || 'Failed to delete tag');
        },
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Tag</DialogTitle>
          <DialogDescription>Are you sure you want to delete this tag? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagDeleteDialog;
