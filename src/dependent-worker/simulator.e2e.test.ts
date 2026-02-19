import { describe, it, expect } from "vitest";
import { simulateDependentWorker } from "@/dependent-worker/simulator";
import { Twelfths, MonthName } from "@/dependent-worker/schemas";

const defaultYear = 2025;

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

describe("simulateDependentWorker - End-to-End", () => {
  describe("Real tax calculations with actual data", () => {
    it("should calculate correctly for single person in continent with €900 income", () => {
      const result = simulateDependentWorker({
        year: defaultYear,
        income: 900,
        married: false,
        disabled: false,
        partnerDisabled: false,
        location: "continent",
        numberOfHolders: 1,
        numberOfDependents: 0,
        numberOfDependentsDisabled: 0,
        socialSecurityContributionRate: 0.11,
        twelfths: Twelfths.NONE,
        lunchAllowanceDailyValue: 10.2,
        lunchAllowanceMode: "cupon",
        lunchAllowanceDaysCount: 22,
      });

      const january = getMonth(result, "january");

      expect(result).not.toHaveProperty("monthly");
      expect(result).not.toHaveProperty("bracket");
      expect(result).not.toHaveProperty("taxRetentionTable");
      expect(result).toHaveProperty("yearly");
      expect(result).toHaveProperty("socialSecurityContributionRate");
      expect(result).toHaveProperty("monthlyBreakdown");

      expect(january.period).toBe("2025-01-01_2025-07-31");
      expect(january.taxableIncomeForIrsCalculation).toBeGreaterThanOrEqual(900);
      expect(january.grossIncome.totalWithLunchAllowanceAndSubsidyTwelfthsAmount).toBeGreaterThanOrEqual(
        january.taxableIncomeForIrsCalculation
      );
      expect(january.irsWithholdingTax.totalAmount).toBeGreaterThanOrEqual(0);
      expect(january.socialSecurityContribution.totalAmount).toBeCloseTo(
        january.incomeSubjectToIrsAndSocialSecurity * 0.11,
        2
      );
      expect(january.bracket).toBeDefined();
      expect(january.taxRetentionTable).toBeDefined();
      expect(january.netIncome.totalAmount).toBeLessThan(
        january.grossIncome.totalWithLunchAllowanceAndSubsidyTwelfthsAmount
      );
      expect(result.yearly.totalGrossIncomeAmount).toBe(
        900 * 14 + january.lunchAllowance.grossAmount * 11
      );
    });

    it("should calculate correctly for married couple with dependents", () => {
      const result = simulateDependentWorker({
        year: defaultYear,
        income: 2000,
        married: true,
        numberOfHolders: 1,
        numberOfDependents: 2,
        disabled: false,
        location: "continent",
      });

      const singleResult = simulateDependentWorker({
        year: defaultYear,
        income: 2000,
        married: false,
        disabled: false,
        location: "continent",
      });

      const resultJanuary = getMonth(result, "january");
      const singleJanuary = getMonth(singleResult, "january");

      expect(resultJanuary.irsWithholdingTax.totalAmount).toBeLessThan(
        singleJanuary.irsWithholdingTax.totalAmount
      );
      expect(resultJanuary.netIncome.totalAmount).toBeGreaterThan(
        singleJanuary.netIncome.totalAmount
      );
    });

    it("should apply disabled dependent deduction correctly", () => {
      const withDisabledDependent = simulateDependentWorker({
        year: defaultYear,
        income: 1500,
        married: true,
        numberOfHolders: 1,
        numberOfDependents: 2,
        numberOfDependentsDisabled: 1,
        location: "continent",
      });

      const withoutDisabledDependent = simulateDependentWorker({
        year: defaultYear,
        income: 1500,
        married: true,
        numberOfHolders: 1,
        numberOfDependents: 2,
        numberOfDependentsDisabled: 0,
        location: "continent",
      });

      const withDisabledJanuary = getMonth(withDisabledDependent, "january");
      const withoutDisabledJanuary = getMonth(withoutDisabledDependent, "january");

      expect(withDisabledJanuary.irsWithholdingTax.totalAmount).toBeLessThan(
        withoutDisabledJanuary.irsWithholdingTax.totalAmount
      );
      expect(withDisabledJanuary.netIncome.totalAmount).toBeGreaterThan(
        withoutDisabledJanuary.netIncome.totalAmount
      );
    });

    it("should apply partner disability deduction correctly", () => {
      const withDisabledPartner = simulateDependentWorker({
        year: defaultYear,
        income: 1500,
        married: true,
        numberOfHolders: 1,
        partnerDisabled: true,
        location: "continent",
      });

      const withoutDisabledPartner = simulateDependentWorker({
        year: defaultYear,
        income: 1500,
        married: true,
        numberOfHolders: 1,
        partnerDisabled: false,
        location: "continent",
      });

      const withDisabledJanuary = getMonth(withDisabledPartner, "january");
      const withoutDisabledJanuary = getMonth(withoutDisabledPartner, "january");

      expect(withDisabledJanuary.irsWithholdingTax.totalAmount).toBeLessThan(
        withoutDisabledJanuary.irsWithholdingTax.totalAmount
      );
      expect(withDisabledJanuary.netIncome.totalAmount).toBeGreaterThan(
        withoutDisabledJanuary.netIncome.totalAmount
      );

      const taxDifference =
        withoutDisabledJanuary.irsWithholdingTax.totalAmount -
        withDisabledJanuary.irsWithholdingTax.totalAmount;
      expect(taxDifference).toBeGreaterThan(110);
    });
  });

  describe("Regional variations", () => {
    const baseParams = {
      year: defaultYear,
      income: 1500,
      married: false,
      disabled: false,
    };

    it("should produce different results for different regions", () => {
      const continent = simulateDependentWorker({
        ...baseParams,
        location: "continent" as const,
      });

      const azores = simulateDependentWorker({
        ...baseParams,
        location: "azores" as const,
      });

      const madeira = simulateDependentWorker({
        ...baseParams,
        location: "madeira" as const,
      });

      const continentJanuary = getMonth(continent, "january");
      const azoresJanuary = getMonth(azores, "january");
      const madeiraJanuary = getMonth(madeira, "january");

      const uniqueTaxes = new Set([
        continentJanuary.irsWithholdingTax.totalAmount,
        azoresJanuary.irsWithholdingTax.totalAmount,
        madeiraJanuary.irsWithholdingTax.totalAmount,
      ]);

      expect(uniqueTaxes.size).toBeGreaterThan(1);
    });
  });

  describe("Twelfths impact", () => {
    const baseParams = {
      year: defaultYear,
      income: 1800,
      married: false,
      disabled: false,
      location: "continent" as const,
    };

    it("should show different tax burden based on twelfths", () => {
      const noTwelfths = simulateDependentWorker({
        ...baseParams,
        twelfths: Twelfths.NONE,
      });

      const oneMonth = simulateDependentWorker({
        ...baseParams,
        twelfths: Twelfths.ONE_MONTH,
      });

      const twoMonths = simulateDependentWorker({
        ...baseParams,
        twelfths: Twelfths.TWO_MONTHS,
      });

      const noTwelfthsJanuary = getMonth(noTwelfths, "january");
      const oneMonthJanuary = getMonth(oneMonth, "january");
      const twoMonthsJanuary = getMonth(twoMonths, "january");

      expect(twoMonthsJanuary.irsWithholdingTax.totalAmount).toBeGreaterThan(
        oneMonthJanuary.irsWithholdingTax.totalAmount
      );
      expect(oneMonthJanuary.irsWithholdingTax.totalAmount).toBeGreaterThan(
        noTwelfthsJanuary.irsWithholdingTax.totalAmount
      );

      expect(twoMonthsJanuary.netIncome.totalAmount).toBeGreaterThan(
        oneMonthJanuary.netIncome.totalAmount
      );
      expect(oneMonthJanuary.netIncome.totalAmount).toBeGreaterThan(
        noTwelfthsJanuary.netIncome.totalAmount
      );

      const yearlyNets = [
        noTwelfths.yearly.totalNetIncomeAmount,
        oneMonth.yearly.totalNetIncomeAmount,
        twoMonths.yearly.totalNetIncomeAmount,
      ];

      expect(yearlyNets.every((value) => value > 0)).toBe(true);
      expect(new Set(yearlyNets).size).toBeGreaterThan(1);
    });
  });

  describe("Custom lunch allowance", () => {
    it("should handle custom lunch allowance correctly", () => {
      const withCustomLunch = simulateDependentWorker({
        year: defaultYear,
        income: 1200,
        lunchAllowanceDailyValue: 12,
        lunchAllowanceMode: "cupon",
        lunchAllowanceDaysCount: 20,
        location: "continent",
      });

      const withDefaultLunch = simulateDependentWorker({
        year: defaultYear,
        income: 1200,
        location: "continent",
      });

      const customJanuary = getMonth(withCustomLunch, "january");
      const defaultJanuary = getMonth(withDefaultLunch, "january");

      expect(customJanuary.lunchAllowance.grossAmount).toBe(240);
      expect(customJanuary.taxableIncomeForIrsCalculation).not.toBe(
        defaultJanuary.taxableIncomeForIrsCalculation
      );
    });

    it("should reconcile yearly net with sum of monthly net values when lunch allowance is taxable", () => {
      const result = simulateDependentWorker({
        year: defaultYear,
        income: 1200,
        lunchAllowanceDailyValue: 12,
        lunchAllowanceMode: "salary",
        lunchAllowanceDaysCount: 22,
        includeLunchAllowanceInJune: true,
        twelfths: Twelfths.ONE_MONTH,
        location: "continent",
      });

      const expectedYearlyNetSalary = result.monthlyBreakdown.reduce(
        (sum, month) => sum + month.netIncome.totalAmount,
        0
      );
      expect(result.yearly.totalNetIncomeAmount).toBeCloseTo(
        expectedYearlyNetSalary
      );
    });
  });

  describe("Year-based period transitions", () => {
    it("should assign each month to the correct 2025 retention period", () => {
      const result = simulateDependentWorker({
        year: defaultYear,
        income: 1500,
        married: false,
        location: "continent",
      });

      expect(getMonth(result, "january").period).toBe("2025-01-01_2025-07-31");
      expect(getMonth(result, "july").period).toBe("2025-01-01_2025-07-31");
      expect(getMonth(result, "august").period).toBe("2025-08-01_2025-09-30");
      expect(getMonth(result, "september").period).toBe("2025-08-01_2025-09-30");
      expect(getMonth(result, "october").period).toBe("2025-10-01_2025-12-31");
      expect(getMonth(result, "december").period).toBe("2025-10-01_2025-12-31");
    });
  });

  describe("High income brackets", () => {
    it("should handle high income correctly", () => {
      const highIncome = simulateDependentWorker({
        year: defaultYear,
        income: 10000,
        married: false,
        disabled: false,
        location: "continent",
      });

      const january = getMonth(highIncome, "january");

      expect(january.irsWithholdingTax.totalAmount).toBeGreaterThan(3000);
      expect(
        january.irsWithholdingTax.totalAmount /
          january.taxableIncomeForIrsCalculation
      ).toBeGreaterThan(0.3);
    });
  });

  describe("Edge cases and boundary conditions", () => {
    it("should handle minimum income correctly", () => {
      const minIncome = simulateDependentWorker({
        year: defaultYear,
        income: 500,
        married: false,
        disabled: false,
        location: "continent",
      });

      const january = getMonth(minIncome, "january");

      expect(january.irsWithholdingTax.totalAmount).toBeGreaterThanOrEqual(0);
      expect(january.netIncome.totalAmount).toBeGreaterThan(0);
    });

    it("should handle tax bracket boundaries", () => {
      const result = simulateDependentWorker({
        year: defaultYear,
        income: 857,
        married: true,
        numberOfHolders: 1,
        disabled: false,
        location: "continent",
      });

      const january = getMonth(result, "january");

      expect(january.irsWithholdingTax.totalAmount).toBeGreaterThanOrEqual(0);
      expect(january.netIncome.totalAmount).toBeGreaterThan(0);
    });
  });
});
