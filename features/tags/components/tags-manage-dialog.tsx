'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckIcon, Loader2, PencilIcon, PlusIcon, SettingsIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCreateTag } from '../api/use-create-tag';
import { useUpdateTag } from '../api/use-update-tag';
import { Tag } from '../types';
import TagDeleteDialog from './tag-delete-dialog';

interface TagsManageDialogProps {
  tags: Tag[];
}

const TagsManageDialog = ({ tags }: TagsManageDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<{ id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { mutate: createTag, isPending: isCreating } = useCreateTag();
  const { mutate: updateTag, isPending: isUpdating } = useUpdateTag();

  // 添加新标签
  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Tag name is required');
      return;
    }

    createTag(
      { json: { name: newTagName.trim() } },
      {
        onSuccess: () => {
          setNewTagName('');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to create tag');
        },
      },
    );
  };

  // 编辑标签
  const handleEditTag = async (tag: { id: string; name: string }) => {
    if (!tag.name.trim()) {
      toast.error('Tag name is required');
      return;
    }

    updateTag(
      { param: { tagId: tag.id }, json: { name: tag.name.trim() } },
      {
        onSuccess: () => {
          setEditingTag(null);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update tag');
        },
      },
    );
  };

  // 打开对话框时加载标签
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  // 过滤标签列表
  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-4 w-4">
          <SettingsIcon className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tags Manage</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="New tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag();
                }
              }}
            />
            <Button onClick={handleAddTag}>
              <PlusIcon className="mr-2 h-4 w-4" />
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag name</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      {editingTag?.id === tag.id ? (
                        <Input
                          value={editingTag.name}
                          onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleEditTag(editingTag);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        tag.name
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {editingTag?.id === tag.id ? (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => handleEditTag(editingTag)}>
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckIcon className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setEditingTag(null)}>
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => setEditingTag(tag)}>
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <TagDeleteDialog tagId={tag.id} />
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TagsManageDialog;
