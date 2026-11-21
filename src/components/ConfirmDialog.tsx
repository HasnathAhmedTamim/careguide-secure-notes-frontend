import { Loader2 } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => undefined : onClose}
      title={title}
      description={description}
      className="max-w-md"
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" disabled={loading} onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="destructive" disabled={loading} onClick={onConfirm}>
            {loading ? <Loader2 className="animate-spin" /> : null}
            {loading ? 'Deleting...' : confirmLabel}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
    </Modal>
  );
}
