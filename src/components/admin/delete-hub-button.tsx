'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteHub } from '@/hooks/use-hubs';
import type { Hub } from '@/types/api';

export function DeleteHubButton({ hub }: { hub: Hub }) {
  const [open, setOpen] = useState(false);
  const deleteHub = useDeleteHub();

  const confirm = async () => {
    try {
      await deleteHub.mutateAsync(hub.id);
      setOpen(false);
    } catch {
      // The mutation hook already shows an error toast.
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" aria-label={`Delete ${hub.name}`}>
          <Trash2 className="text-alert-600 h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove {hub.name}?</DialogTitle>
          <DialogDescription>
            The hub is soft-deleted and will no longer be offered to customers. Existing shipments
            keep their history.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Keep hub
          </Button>
          <Button variant="destructive" onClick={confirm} disabled={deleteHub.isPending}>
            {deleteHub.isPending ? 'Removing...' : 'Remove hub'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
