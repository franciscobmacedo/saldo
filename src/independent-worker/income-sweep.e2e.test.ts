import { describe, it, expect } from "vitest";
import { FrequencyChoices } from "@/independent-worker/schemas";
import { simulateIndependentWorker } from "@/independent-worker/simulator";
import {
  simulateIndependentWorkerIncomeSweep,
  simulateIndependentWorkerMonthlyIncomeSweep,
  simulateIndependentWorkerYearlyIncomeSweep,
} from "@/independent-worker/income-sweep";

describe("simulateIndependentWorkerIncomeSweep - End-to-End", () => {
  it("should match monthly simulator results for each income point", () => {
    const monthlyIncomes = [1500, 2500, 3500];
    const sharedOptions = {
      currentTaxRankYear: 2026 as const,
      ssDiscount: 0.05,
      maxExpensesTax: 20,
      expenses: 1500,
      ssTax: 0.214,
      rnh: false,
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 2,
    };

    const points = simulateIndependentWorkerMonthlyIncomeSweep({
      ...sharedOptions,
      monthlyIncomes,
    });

    expect(points).toHaveLength(monthlyIncomes.length);

    monthlyIncomes.forEach((income, index) => {
      const expected = simulateIndependentWorker({
        ...sharedOptions,
        income,
        incomeFrequency: FrequencyChoices.Month,
      });
      const expectedTotalTax = expected.irsPay.month + expected.ssPay.month;
      const point = points[index];

      expect(point.scope).toBe("monthly");
      expect(point.gross).toBeCloseTo(expected.grossIncome.month);
      expect(point.grossAnnual).toBeCloseTo(expected.grossIncome.year);
      expect(point.grossMonthly).toBeCloseTo(expected.grossIncome.month);
      expect(point.net).toBeCloseTo(expected.netIncome.month);
      expect(point.totalTax).toBeCloseTo(expectedTotalTax);
      expect(point.netAnnual).toBeUndefined();
      expect(point.totalTaxAnnual).toBeUndefined();
      expect(point.overallTaxBurden).toBeCloseTo(
        expectedTotalTax / expected.grossIncome.month
      );
      expect(point.effectiveBracketRate).toBeCloseTo(
        expectedTotalTax / expected.grossIncome.month
      );
      expect(point.marginalRate).toBe(expected.taxRank.normalTax);
    });
  });

  it("should return annual totals when yearly incomes are provided", () => {
    const yearlyIncomes = [18000, 30000, 42000];
    const sharedOptions = {
      currentTaxRankYear: 2025 as const,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      rnh: true,
      rnhTax: 0.2,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    };

    const points = simulateIndependentWorkerYearlyIncomeSweep({
      ...sharedOptions,
      yearlyIncomes,
    });

    expect(points).toHaveLength(yearlyIncomes.length);

    yearlyIncomes.forEach((income, index) => {
      const expected = simulateIndependentWorker({
        ...sharedOptions,
        income,
        incomeFrequency: FrequencyChoices.Year,
      });
      const expectedAnnualTax = expected.irsPay.year + expected.ssPay.year;
      const point = points[index];

      expect(point.scope).toBe("annual");
      expect(point.gross).toBeCloseTo(expected.grossIncome.year);
      expect(point.grossAnnual).toBeCloseTo(expected.grossIncome.year);
      expect(point.grossMonthly).toBeCloseTo(expected.grossIncome.month);
      expect(point.net).toBeCloseTo(expected.netIncome.year);
      expect(point.totalTax).toBeCloseTo(expectedAnnualTax);
      expect(point.netAnnual).toBeCloseTo(expected.netIncome.year);
      expect(point.totalTaxAnnual).toBeCloseTo(expectedAnnualTax);
      expect(point.overallTaxBurden).toBeCloseTo(
        expectedAnnualTax / expected.grossIncome.year
      );
      expect(point.effectiveBracketRate).toBeCloseTo(
        expectedAnnualTax / expected.grossIncome.year
      );
      expect(point.marginalRate).toBe(expected.rnhTax);
    });
  });

  it("should throw for invalid monthly incomes input", () => {
    expect(() =>
      simulateIndependentWorkerMonthlyIncomeSweep({
        monthlyIncomes: [],
      })
    ).toThrow("'monthlyIncomes' must contain at least one value");

    expect(() =>
      simulateIndependentWorkerMonthlyIncomeSweep({
        monthlyIncomes: [1200, Number.NaN],
      })
    ).toThrow("'monthlyIncomes[1]' must be a finite number greater than 0");

    expect(() =>
      simulateIndependentWorkerMonthlyIncomeSweep({
        monthlyIncomes: [0],
      })
    ).toThrow("'monthlyIncomes[0]' must be a finite number greater than 0");
  });

  it("should throw for invalid yearly incomes input", () => {
    expect(() =>
      simulateIndependentWorkerYearlyIncomeSweep({
        yearlyIncomes: [],
      })
    ).toThrow("'yearlyIncomes' must contain at least one value");

    expect(() =>
      simulateIndependentWorkerYearlyIncomeSweep({
        yearlyIncomes: [24000, Number.NaN],
      })
    ).toThrow("'yearlyIncomes[1]' must be a finite number greater than 0");
  });

  it("should enforce exactly one income list input", () => {
    expect(() =>
      simulateIndependentWorkerIncomeSweep({} as any)
    ).toThrow("One income list is required: 'monthlyIncomes' or 'yearlyIncomes'");

    expect(() =>
      simulateIndependentWorkerIncomeSweep({
        monthlyIncomes: [1000],
        yearlyIncomes: [12000],
      } as any)
    ).toThrow("Provide only one: 'monthlyIncomes' or 'yearlyIncomes'");
  });
});
