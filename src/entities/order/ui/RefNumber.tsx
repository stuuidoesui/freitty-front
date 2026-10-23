export const RefNumber = ({ value }: { value: string }) => {
  return (
    <span className="font-mono text-[13px]">
      <span className="mr-1 text-[9px] font-bold tracking-wide text-gray-400 uppercase">
        Ref N:
      </span>
      <span className="font-extrabold text-brand">{value}</span>
    </span>
  );
};
