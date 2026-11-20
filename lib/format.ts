// Separator placed before item `index` in an "A, B, or C" list.
export function listSeparator(index: number, total: number): string {
  if (index === 0) return "";
  if (total === 2) return " or ";
  return index === total - 1 ? ", or " : ", ";
}
