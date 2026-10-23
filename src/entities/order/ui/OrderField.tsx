export const OrderField = ({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) => {
  return (
    <div className={wide ? 'col-span-2' : undefined}>
      <div className="text-muted">{label}</div>
      <div className="font-semibold text-navy">{value}</div>
    </div>
  );
};
