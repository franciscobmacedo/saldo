import { describe, it, expect } from "vitest";
import { simulateIndependentWorker } from "@/independent-worker/simulator";

describe("simulateIndependentWorker monthlyBreakdown - End-to-End", () => {
  it("should include 12 ordered month entries with consistent monthly values", () => {
    const result = simulateIndependentWorker({
      income: 36000,
      currentTaxRankYear: 2026,
      rnh: false,
    });

    expect(result.monthlyBreakdown).toHaveLength(12);
    expect(result.monthlyBreakdown[0].month).toBe("january");
    expect(result.monthlyBreakdown[11].month).toBe("december");

    result.monthlyBreakdown.forEach((item) => {
      expect(item.grossIncome).toBeCloseTo(result.grossIncome.month);
      expect(item.taxableIncome).toBeCloseTo(result.taxableIncome / 12);
      expect(item.irsPay).toBeCloseTo(result.irsPay.month);
      expect(item.ssPay).toBeCloseTo(result.ssPay.month);
      expect(item.netIncome).toBeCloseTo(result.netIncome.month);
      expect(item.totalTax).toBeCloseTo(result.irsPay.month + result.ssPay.month);
      expect(item.overallTaxBurden).toBeCloseTo(
        (result.irsPay.month + result.ssPay.month) / result.grossIncome.month
      );
      expect(item.effectiveBracketRate).toBeCloseTo(item.overallTaxBurden);
      expect(item.marginalRate).toBe(result.taxRank.normalTax);
    });
  });

  it("should use rnhTax as marginalRate when RNH is enabled", () => {
    const result = simulateIndependentWorker({
      income: 50000,
      currentTaxRankYear: 2026,
      rnh: true,
      rnhTax: 0.2,
    });

    result.monthlyBreakdown.forEach((item) => {
      expect(item.marginalRate).toBe(0.2);
    });
  });
});
