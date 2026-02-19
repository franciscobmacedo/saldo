import { describe, it, expect } from "vitest";
import { simulateDependentWorker } from "@/dependent-worker/simulator";
import {
  simulateDependentWorkerIncomeSweep,
  simulateDependentWorkerMonthlyIncomeSweep,
  simulateDependentWorkerYearlyIncomeSweep,
} from "@/dependent-worker/income-sweep";
import { MonthName, Twelfths } from "@/dependent-worker/schemas";

function getMonth(
  result: ReturnType<typeof simulateDependentWorker>,
  monthName: MonthName
) {
  const month = result.monthlyBreakdown.find((item) => item.month === monthName);
  if (!month) {
    throw new Error(`Month not found in breakdown: ${monthName}`);
  }
  return month;
}

describe("simulateDependentWorkerIncomeSweep - End-to-End", () => {
  it("should match monthly simulator results for each income point", () => {
    const monthlyIncomes = [900, 1400, 2200];
    const sharedOptions = {
      year: 2026,
      month: "january" as const,
      married: true,
      numberOfHolders: 1,
      numberOfDependents: 2,
      numberOfDependentsDisabled: 1,
      location: "azores" as const,
      twelfths: Twelfths.ONE_MONTH,
      lunchAllowanceDailyValue: 11,
      lunchAllowanceMode: "salary" as const,
      lunchAllowanceDaysCount: 20,
      includeLunchAllowanceInJune: true,
    };

    const points = simulateDependentWorkerMonthlyIncomeSweep({
      ...sharedOptions,
      monthlyIncomes,
    });

    expect(points).toHaveLength(monthlyIncomes.length);

    monthlyIncomes.forEach((income, index) => {
      const expected = simulateDependentWorker({
        ...sharedOptions,
        income,
      });
      const expectedJanuary = getMonth(expected, "january");
      const expectedTotalTax =
        expectedJanuary.irsWithholdingTax.totalAmount +
        expectedJanuary.socialSecurityContribution.totalAmount;
      const point = points[index];

      expect(point.scope).toBe("monthly");
      expect(point.gross).toBeCloseTo(
        expectedJanuary.grossIncome.totalWithLunchAllowanceAndSubsidyTwelfthsAmount
      );
      expect(point.grossAnnual).toBeCloseTo(expected.yearly.totalGrossIncomeAmount);
      expect(point.grossMonthly).toBeCloseTo(
        expectedJanuary.grossIncome.totalWithLunchAllowanceAndSubsidyTwelfthsAmount
      );
      expect(point.net).toBeCloseTo(expectedJanuary.netIncome.totalAmount);
      expect(point.totalTax).toBeCloseTo(expectedTotalTax);
      expect(point.overallTaxBurden).toBeCloseTo(
        expectedTotalTax / point.grossMonthly
      );
      expect(point.effectiveBracketRate).toBe(
        expectedJanuary.bracket.effective_mensal_rate
      );
      expect(point.marginalRate).toBe(expectedJanuary.bracket.max_marginal_rate);
      expect(point.netAnnual).toBeUndefined();
      expect(point.totalTaxAnnual).toBeUndefined();
    });
  });

  it("should calculate for the requested month only", () => {
    const income = 1200;
    const result = simulateDependentWorker({
      year: 2026,
      income,
      twelfths: Twelfths.NONE,
      includeLunchAllowanceInJune: false,
      location: "continent",
    });
    const january = getMonth(result, "january");
    const june = getMonth(result, "june");

    const sweepPoint = simulateDependentWorkerMonthlyIncomeSweep({
      year: 2026,
      month: "june",
      monthlyIncomes: [income],
      twelfths: Twelfths.NONE,
      includeLunchAllowanceInJune: false,
      location: "continent",
    })[0];

    expect(sweepPoint.scope).toBe("monthly");
    expect(sweepPoint.gross).toBeCloseTo(
      june.grossIncome.totalWithLunchAllowanceAndSubsidyTwelfthsAmount
    );
    expect(sweepPoint.grossMonthly).toBeCloseTo(
      june.grossIncome.totalWithLunchAllowanceAndSubsidyTwelfthsAmount
    );
    expect(sweepPoint.totalTax).toBeCloseTo(
      june.irsWithholdingTax.totalAmount + june.socialSecurityContribution.totalAmount
    );
    expect(sweepPoint.grossMonthly).not.toBeCloseTo(
      january.grossIncome.totalWithLunchAllowanceAndSubsidyTwelfthsAmount
    );
  });

  it("should throw for invalid monthly incomes input", () => {
    expect(() =>
      simulateDependentWorkerMonthlyIncomeSweep({
        year: 2026,
        month: "january",
        monthlyIncomes: [],
      })
    ).toThrow("'monthlyIncomes' must contain at least one value");

    expect(() =>
      simulateDependentWorkerMonthlyIncomeSweep({
        year: 2026,
        month: "january",
        monthlyIncomes: [1000, Number.NaN],
      })
    ).toThrow("'monthlyIncomes[1]' must be a finite number greater than or equal to 0");
  });

  it("should return annual totals when yearly incomes are provided", () => {
    const monthlyIncomes = [900, 1400, 2200];
    const yearlyIncomes = monthlyIncomes.map((income) => income * 14);
    const sharedOptions = {
      year: 2026,
      month: "october" as const,
      married: false,
      location: "madeira" as const,
      twelfths: Twelfths.ONE_HALF_MONTH,
      oneHalfMonthTwelfthsLumpSumMonth: "december" as const,
      lunchAllowanceDailyValue: 10.2,
      lunchAllowanceMode: "cupon" as const,
      lunchAllowanceDaysCount: 22,
    };

    const yearlySweep = simulateDependentWorkerYearlyIncomeSweep({
      ...sharedOptions,
      yearlyIncomes,
    });

    expect(yearlySweep).toHaveLength(yearlyIncomes.length);

    yearlySweep.forEach((point, index) => {
      const income = monthlyIncomes[index];
      const expected = simulateDependentWorker({
        ...sharedOptions,
        income,
      });
      const expectedMonth = getMonth(expected, "october");
      const expectedAnnualTax =
        expected.yearly.totalGrossIncomeAmount - expected.yearly.totalNetIncomeAmount;

      expect(point.scope).toBe("annual");
      expect(point.gross).toBeCloseTo(expected.yearly.totalGrossIncomeAmount);
      expect(point.grossAnnual).toBeCloseTo(expected.yearly.totalGrossIncomeAmount);
      expect(point.grossMonthly).toBeCloseTo(
        expectedMonth.grossIncome.totalWithLunchAllowanceAndSubsidyTwelfthsAmount
      );
      expect(point.net).toBeCloseTo(expected.yearly.totalNetIncomeAmount);
      expect(point.totalTax).toBeCloseTo(expectedAnnualTax);
      expect(point.netAnnual).toBeCloseTo(expected.yearly.totalNetIncomeAmount);
      expect(point.totalTaxAnnual).toBeCloseTo(expectedAnnualTax);
      expect(point.overallTaxBurden).toBeCloseTo(
        expectedAnnualTax / expected.yearly.totalGrossIncomeAmount
      );
      expect(point.effectiveBracketRate).toBe(
        expectedMonth.bracket.effective_mensal_rate
      );
      expect(point.marginalRate).toBe(expectedMonth.bracket.max_marginal_rate);
    });
  });

  it("should throw for invalid yearly incomes input", () => {
    expect(() =>
      simulateDependentWorkerYearlyIncomeSweep({
        year: 2026,
        month: "january",
        yearlyIncomes: [],
      })
    ).toThrow("'yearlyIncomes' must contain at least one value");

    expect(() =>
      simulateDependentWorkerYearlyIncomeSweep({
        year: 2026,
        month: "january",
        yearlyIncomes: [24000, Number.NaN],
      })
    ).toThrow("'yearlyIncomes[1]' must be a finite number greater than or equal to 0");
  });

  it("should enforce exactly one income list input", () => {
    expect(() =>
      simulateDependentWorkerIncomeSweep({
        year: 2026,
        month: "january",
      } as any)
    ).toThrow("One income list is required: 'monthlyIncomes' or 'yearlyIncomes'");

    expect(() =>
      simulateDependentWorkerIncomeSweep({
        year: 2026,
        month: "january",
        monthlyIncomes: [1000],
        yearlyIncomes: [14000],
      } as any)
    ).toThrow("Provide only one: 'monthlyIncomes' or 'yearlyIncomes'");
  });
});
