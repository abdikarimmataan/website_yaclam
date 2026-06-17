/** Home list order is 1-based (1, 2, 3, …). */
export function hasValidSortOrder(value?: number): boolean {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1;
}

export function normalizeSortOrder(value?: number): number {
  return Math.floor(Number(value));
}

/** Ascending sortOrder for listings; keeps every course (including sortOrder 0). */
export function sortCoursesForListing<
  T extends { sortOrder?: number; updated_at?: string; created_at?: string },
>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    const orderDiff = Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0);
    if (orderDiff !== 0) return orderDiff;
    const timeA = new Date(String(a.updated_at ?? a.created_at ?? 0)).getTime();
    const timeB = new Date(String(b.updated_at ?? b.created_at ?? 0)).getTime();
    return (Number.isFinite(timeB) ? timeB : 0) - (Number.isFinite(timeA) ? timeA : 0);
  });
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
