import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

const tones = {
  info: 'border-amber-200 border-l-amber-500 bg-amber-50 text-amber-900',
  warning: 'border-violet-200 border-l-violet-800 bg-violet-50 text-violet-900',
  note: 'border-purple-200 bg-purple-50 text-violet-800',
} as const;

export const Alert = ({
  tone,
  icon,
  children,
}: {
  tone: keyof typeof tones;
  icon?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-lg border border-l-[3px] px-3.5 py-2.5 text-xs',
        tones[tone],
      )}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <div>{children}</div>
    </div>
  );
};
