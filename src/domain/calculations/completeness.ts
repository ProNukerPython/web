export type WeightedComponent = {
  weight: number;
  isPresent: boolean;
};

/**
 * Returns completeness as an integer percent 0–100.
 * Components are weighted by importance; missing weight totals reduce the score.
 */
export function copyCompletenessPercent(
  components: readonly WeightedComponent[],
): number {
  if (components.length === 0) {
    return 0;
  }

  let totalWeight = 0;
  let presentWeight = 0;

  for (const component of components) {
    if (!Number.isInteger(component.weight) || component.weight < 0) {
      throw new Error("component weight must be a non-negative integer");
    }
    totalWeight += component.weight;
    if (component.isPresent) {
      presentWeight += component.weight;
    }
  }

  if (totalWeight === 0) {
    return 0;
  }

  return Math.round((presentWeight / totalWeight) * 100);
}
