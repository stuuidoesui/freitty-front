export const qtyDelta = (order: {
  declaredQty: number | null;
  actualQty: number | null;
}): number | null => {
  if (order.actualQty == null) return null;
  const delta = order.actualQty - (order.declaredQty ?? 0);
  return delta === 0 ? null : delta;
};

export const formatDelta = (delta: number): string => {
  return `${delta > 0 ? '+' : ''}${delta}`;
};
