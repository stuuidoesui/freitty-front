import type { ReactNode } from 'react';

export const SegmentedControl = <T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { id: T; label: ReactNode }[];
}) => {
  return (
    <fieldset className="m-0 flex min-w-0 rounded-md border-0 bg-gray-100 p-0.5">
      <legend className="sr-only">{label}</legend>
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold ${selected ? 'bg-white text-navy' : 'text-muted'}`}
          >
            {option.label}
          </button>
        );
      })}
    </fieldset>
  );
};
