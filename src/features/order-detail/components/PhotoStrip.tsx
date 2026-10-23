import { Camera } from 'lucide-react';

export const PhotoStrip = ({ count }: { count: number }) => {
  if (count <= 0) return <p className="mt-1.5 text-2xs text-muted">No photos</p>;
  const shown = Math.min(count, 2);
  const extra = count - shown;
  return (
    <div className="mt-1.5 flex gap-1" aria-label={`${count} photos`}>
      {Array.from({ length: shown }, (_, index) => (
        <div
          key={index}
          className="flex h-[34px] w-[34px] items-center justify-center rounded bg-gray-200 text-sm"
        >
          <Camera className="size-4 text-muted" aria-hidden="true" />
        </div>
      ))}
      {extra > 0 ? (
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded bg-gray-200 text-2xs text-muted">
          +{extra}
        </div>
      ) : null}
    </div>
  );
};
