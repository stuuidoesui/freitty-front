export const cargoUnitSummary = (
  lines: { unit: 'STANDARD' | 'XL'; unitSize: string | null }[],
): string => {
  if (lines.length === 0) return '—';
  return lines
    .map(
      (line) =>
        `${line.unit === 'XL' ? 'XL' : 'Standard'}${line.unitSize ? ` · ${line.unitSize}` : ''}`,
    )
    .join(' · ');
};
