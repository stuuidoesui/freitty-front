import { Link } from 'react-router-dom';

export const Breadcrumbs = ({ items }: { items: { label: string; to?: string }[] }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-2 text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? <span aria-hidden="true">›</span> : null}
              {item.to && !last ? (
                <Link to={item.to} className="text-link">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={last ? 'text-navy' : undefined}
                  aria-current={last ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
