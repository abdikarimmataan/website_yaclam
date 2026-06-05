/** Home list order is 1-based (1, 2, 3, …). */
export function hasValidSortOrder(value?: number): boolean {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1;
}

export function normalizeSortOrder(value?: number): number {
  return Math.floor(Number(value));
}

/** Ascending sortOrder for home card lists (1, 2, 3, …). */
export function sortBySortOrder<T extends { sortOrder?: number }>(rows: T[]): T[] {
  const valid = rows.filter((row) => hasValidSortOrder(row.sortOrder));
  const counts = new Map<number, number>();

  for (const row of valid) {
    const order = normalizeSortOrder(row.sortOrder);
    counts.set(order, (counts.get(order) ?? 0) + 1);
  }

  return valid
    .filter((row) => counts.get(normalizeSortOrder(row.sortOrder)) === 1)
    .sort((a, b) => normalizeSortOrder(a.sortOrder) - normalizeSortOrder(b.sortOrder));
}
