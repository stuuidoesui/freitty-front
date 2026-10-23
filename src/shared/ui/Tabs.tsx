export const Tabs = <T extends string>({
  label,
  value,
  onChange,
  tabs,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  tabs: { id: T; label: string; count?: number | string; tone?: 'danger' | 'neutral' }[];
}) => {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="mb-4 flex gap-1 overflow-x-auto border-b border-line"
    >
      {tabs.map((tab) => {
        const selected = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={`-mb-px px-4 py-2.5 text-[13px] font-semibold ${
              selected
                ? 'border-b-2 border-brand text-navy-deep'
                : 'border-b-2 border-transparent text-muted'
            }`}
          >
            {tab.label}
            {tab.count != null ? (
              <span
                className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${
                  tab.tone === 'danger' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
