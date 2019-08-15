export const notNull = <T>(t: T | null | undefined): t is T => !!t;

export function allCombinations<T, R>(
  items: T[],
  mapper: (a: T, b: T) => R
): R[] {
  const results: R[] = [];

  for (let iA = 0; iA < items.length; iA++) {
    const a = items[iA];

    for (let iB = iA + 1; iB < items.length; iB++) {
      const b = items[iB];

      results.push(mapper(a, b));
    }
  }

  return results;
}
