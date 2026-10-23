import { Badge } from '@/shared/ui/Badge';

export const ServiceBadges = ({ services }: { services: string[] }) => {
  return (
    <span className="flex flex-wrap gap-1">
      {services.map((service, index) => (
        <Badge key={service} variant={index === 0 ? 'prog' : 'consol'}>
          {service}
        </Badge>
      ))}
    </span>
  );
};
