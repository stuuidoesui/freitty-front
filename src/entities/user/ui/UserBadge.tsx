import { roleLabel } from '@/entities/user/lib/labels';
import type { UserRef, UserRole } from '@/shared/api/types';
import { Avatar } from '@/shared/ui/Avatar';

const roleTone: Record<UserRole, string> = {
  ADMIN: 'bg-violet-100 text-violet-800',
  DISPATCHER: 'bg-blue-100 text-blue-800',
  FLOOR_LEAD: 'bg-blue-100 text-blue-800',
  DRIVER: 'bg-blue-100 text-blue-800',
};

export const UserBadge = ({ user, size = 'md' }: { user: UserRef; size?: 'sm' | 'md' }) => {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-0.5 pr-2 pl-0.5 text-[10.5px] font-bold text-navy">
        <Avatar code={user.code} color={user.avatarColor} size={size === 'sm' ? 'sm' : 'md'} />
        {user.name}
      </span>
      <span
        className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide uppercase ${roleTone[user.role]}`}
      >
        {roleLabel(user.role)}
      </span>
    </span>
  );
};
