import { Camera, Copy, MessageSquare, Trash2 } from 'lucide-react';
import type { Operation } from '@/shared/api/types';
import { comingSoon, useToast } from '@/shared/ui/toast/useToast';

export const OperationActions = ({ operation }: { operation: Operation }) => {
  const notify = useToast();
  return (
    <button
      type="button"
      onClick={() => comingSoon(notify, 'Operation actions')}
      className="inline-flex items-center gap-1 whitespace-nowrap text-gray-400"
      aria-label={`Operation actions: ${operation.commentCount} comments and ${operation.photoCount} photos`}
    >
      <MessageSquare className="size-3.5" aria-hidden="true" /> {operation.commentCount}
      <Camera className="size-3.5" aria-hidden="true" /> {operation.photoCount}
      <Copy className="size-3.5" aria-hidden="true" />
      <Trash2 className="size-3.5" aria-hidden="true" />
    </button>
  );
};
