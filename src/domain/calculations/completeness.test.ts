import { describe, expect, it } from "vitest";
import { copyCompletenessPercent } from "./completeness";

describe("copyCompletenessPercent", () => {
  it("returns 0 for empty list", () => {
    expect(copyCompletenessPercent([])).toBe(0);
  });

  it("weights components by importance", () => {
    expect(
      copyCompletenessPercent([
        { weight: 3, isPresent: true },
        { weight: 1, isPresent: false },
      ]),
    ).toBe(75);
  });

  it("returns 100 when all present", () => {
    expect(
      copyCompletenessPercent([
        { weight: 2, isPresent: true },
        { weight: 2, isPresent: true },
      ]),
    ).toBe(100);
  });
});
