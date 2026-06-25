export const DEFAULT_FEATURED_GRID_ROWS = 2;
export const DEFAULT_FEATURED_GRID_COLUMNS = 3;
export const MIN_FEATURED_GRID = 1;
export const MAX_FEATURED_GRID = 6;

export function clampGridDimension(value: unknown, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(MAX_FEATURED_GRID, Math.max(MIN_FEATURED_GRID, Math.floor(n)));
}

export function featuredCardsPerPage(rows: number, columns: number): number {
  return rows * columns;
}

const COLS_CLASS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

const ROWS_CLASS: Record<number, string> = {
  1: "lg:grid-rows-1",
  2: "lg:grid-rows-[1fr_2fr]",
  3: "lg:grid-rows-3",
  4: "lg:grid-rows-4",
  5: "lg:grid-rows-5",
  6: "lg:grid-rows-6",
};

export function featuredGridColsClass(columns: number): string {
  return COLS_CLASS[columns] ?? COLS_CLASS[DEFAULT_FEATURED_GRID_COLUMNS];
}

export function featuredGridRowsClass(rows: number): string {
  return ROWS_CLASS[rows] ?? ROWS_CLASS[DEFAULT_FEATURED_GRID_ROWS];
}

export function featuredGridMinHeight(rows: number): string {
  const heights: Record<number, string> = {
    1: "lg:min-h-[360px]",
    2: "lg:min-h-[744px]",
    3: "lg:min-h-[1128px]",
    4: "lg:min-h-[1512px]",
    5: "lg:min-h-[1896px]",
    6: "lg:min-h-[2280px]",
  };
  return heights[rows] ?? heights[DEFAULT_FEATURED_GRID_ROWS];
}
