import { EmptyState } from '@/shared/ui/EmptyState';
import { ButtonLink } from '@/shared/ui/Button';

export const NotFound = () => {
  return (
    <EmptyState
      title="Page not found"
      hint="That address is not part of the client cabinet."
      action={<ButtonLink to="/">Back to dashboard</ButtonLink>}
    />
  );
};
