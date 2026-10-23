import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

export const NavItem = ({
  to,
  end,
  icon,
  children,
}: {
  to: string;
  end?: boolean;
  icon: ReactNode;
  children: ReactNode;
}) => {
  return (
    <NavLink
      to={to}
      end={end}
      className="flex items-center gap-2.5 border-l-[3px] border-brand bg-sidebar-active px-5 py-2.5 text-sm font-semibold text-white"
    >
      {icon}
      {children}
    </NavLink>
  );
};
