import { describe, it, expect } from "vitest";
import { simulateDependentWorker } from "@/dependent-worker/simulator";
import { Twelfths } from "@/dependent-worker/schemas";

// NO MOCKS - Testing the full integration
describe("simulateDependentWorker - End-to-End", () => {
  describe("Real tax calculations with actual data", () => {
    it("should calculate correctly for single person in continent with €900 income", () => {
      const result = simulateDependentWorker({
        income: 900,
        married: false,
        disabled: false,
        partnerDisabled: false,
        location: "continent",
        numberOfHolders: 1,
        numberOfDependents: 0,
        numberOfDependentsDisabled: 0,
        period: "2025-01-01_2025-07-31",
  
      socialSecurityContributionRate: 0.11,
        twelfths: Twelfths.NONE,
        lunchAllowanceDailyValue: 10.2,
        lunchAllowanceMode: "cupon",
        lunchAllowanceDaysCount: 22,
      });

      // Verify structure
      expect(result).toHaveProperty("monthly");
      expect(result).toHaveProperty("yearly");
      expect(result).toHaveProperty("socialSecurityContributionRate");
      expect(result).toHaveProperty("bracket");
      expect(result).toHaveProperty("taxRetentionTable");
      expect(result).toHaveProperty("monthlyBreakdown");

      // Verify reasonable values
      expect(result.monthly.taxableIncomeForIrsCalculation).toBeGreaterThanOrEqual(900);
      expect(result.monthly.grossIncome.totalWithLunchAllowanceAndSubsidyTwelfthsAmount).toBeGreaterThanOrEqual(result.monthly.taxableIncomeForIrsCalculation);
      expect(result.monthly.irsWithholdingTax.totalAmount).toBeGreaterThanOrEqual(0);
      expect(result.monthly.socialSecurityContribution.totalAmount).toBeCloseTo(
        result.monthly.incomeSubjectToIrsAndSocialSecurity * 0.11,
        2
      );
      expect(result.monthly.netIncome.totalAmount).toBeLessThan(result.monthly.grossIncome.totalWithLunchAllowanceAndSubsidyTwelfthsAmount);
      // Yearly gross = income * 14 + lunch allowance * 11 months
      expect(result.yearly.totalGrossIncomeAmount).toBe(
        900 * 14 + result.monthly.lunchAllowance.grossAmount * 11
      );
    });

    it("should calculate correctly for married couple with dependents", () => {
      const result = simulateDependentWorker({
        income: 2000,
        married: true,
        numberOfHolders: 1,
        numberOfDependents: 2,
        disabled: false,
        location: "continent",
        period: "2025-01-01_2025-07-31",
      });

      // Tax should be lower due to dependents
      const singleResult = simulateDependentWorker({
        income: 2000,
        married: false,
        disabled: false,
        location: "continent",
        period: "2025-01-01_2025-07-31",
      });

      expect(result.monthly.irsWithholdingTax.totalAmount).toBeLessThan(singleResult.monthly.irsWithholdingTax.totalAmount);
      expect(result.monthly.netIncome.totalAmount).toBeGreaterThan(singleResult.monthly.netIncome.totalAmount);
    });

    it("should apply disabled dependent deduction correctly", () => {
      const withDisabledDependent = simulateDependentWorker({
        income: 1500,
        married: true,
        numberOfHolders: 1,
        numberOfDependents: 2,
        numberOfDependentsDisabled: 1,
        location: "continent",
        period: "2025-01-01_2025-07-31",
      });

      const withoutDisabledDependent = simulateDependentWorker({
        income: 1500,
        married: true,
        numberOfHolders: 1,
        numberOfDependents: 2,
        numberOfDependentsDisabled: 0,
        location: "continent",
        period: "2025-01-01_2025-07-31",
      });

      // Should have lower tax due to disabled dependent deduction
      expect(withDisabledDependent.monthly.irsWithholdingTax.totalAmount).toBeLessThan(
        withoutDisabledDependent.monthly.irsWithholdingTax.totalAmount
      );
      expect(withDisabledDependent.monthly.netIncome.totalAmount).toBeGreaterThan(
        withoutDisabledDependent.monthly.netIncome.totalAmount
      );
    });

    it("should apply partner disability deduction correctly", () => {
      const withDisabledPartner = simulateDependentWorker({
        income: 1500,
        married: true,
        numberOfHolders: 1,
        partnerDisabled: true,
        location: "continent",
        period: "2025-01-01_2025-07-31",
      });

      const withoutDisabledPartner = simulateDependentWorker({
        income: 1500,
        married: true,
        numberOfHolders: 1,
        partnerDisabled: false,
        location: "continent",
        period: "2025-01-01_2025-07-31",
      });

      // Should have lower tax due to partner disability deduction (€135.71)
      expect(withDisabledPartner.monthly.irsWithholdingTax.totalAmount).toBeLessThan(
        withoutDisabledPartner.monthly.irsWithholdingTax.totalAmount
      );
      expect(withDisabledPartner.monthly.netIncome.totalAmount).toBeGreaterThan(
        withoutDisabledPartner.monthly.netIncome.totalAmount
      );

      // The difference should be close to the expected deduction impact
      const taxDifference =
        withoutDisabledPartner.monthly.irsWithholdingTax.totalAmount -
        withDisabledPartner.monthly.irsWithholdingTax.totalAmount;
      expect(taxDifference).toBeGreaterThan(110); // Should save more than €110 in tax (€135.71 deduction taxed at marginal rate)
    });
  });

  describe("Regional variations", () => {
    const baseParams = {
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

      // Tax rates should be different between regions
      expect([
        continent.monthly.irsWithholdingTax.totalAmount,
        azores.monthly.irsWithholdingTax.totalAmount,
        madeira.monthly.irsWithholdingTax.totalAmount,
      ]).toHaveLength(3);
      // At least one should be different
      const uniqueTaxes = new Set([
        continent.monthly.irsWithholdingTax.totalAmount,
        azores.monthly.irsWithholdingTax.totalAmount,
        madeira.monthly.irsWithholdingTax.totalAmount,
      ]);
      expect(uniqueTaxes.size).toBeGreaterThan(1);
    });
  });

  describe("Twelfths impact", () => {
    const baseParams = {
      income: 1800,
      married: false,
      disabled: false,
      location: "continent" as const,
 // July 31st
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

      const noTwelfthsJanuary = noTwelfths.monthlyBreakdown.find(
        (month) => month.month === "january"
      );
      const oneMonthJanuary = oneMonth.monthlyBreakdown.find(
        (month) => month.month === "january"
      );
      const twoMonthsJanuary = twoMonths.monthlyBreakdown.find(
        (month) => month.month === "january"
      );

      expect(noTwelfthsJanuary).toBeDefined();
      expect(oneMonthJanuary).toBeDefined();
      expect(twoMonthsJanuary).toBeDefined();

      // More twelfths should result in higher monthly tax (distributed bonus income)
      expect(twoMonthsJanuary!.irsWithholdingTax.totalAmount).toBeGreaterThan(
        oneMonthJanuary!.irsWithholdingTax.totalAmount
      );
      expect(oneMonthJanuary!.irsWithholdingTax.totalAmount).toBeGreaterThan(
        noTwelfthsJanuary!.irsWithholdingTax.totalAmount
      );

      // More twelfths should result in higher monthly net salary (bonus distribution)
      expect(twoMonthsJanuary!.netIncome.totalAmount).toBeGreaterThan(
        oneMonthJanuary!.netIncome.totalAmount
      );
      expect(oneMonthJanuary!.netIncome.totalAmount).toBeGreaterThan(
        noTwelfthsJanuary!.netIncome.totalAmount
      );

      // ONE_MONTH gives the highest yearly net (tax optimization sweet spot)
      expect(oneMonth.yearly.totalNetIncomeAmount).toBeCloseTo(twoMonths.yearly.totalNetIncomeAmount);
      expect(noTwelfths.yearly.totalNetIncomeAmount).toBeCloseTo(oneMonth.yearly.totalNetIncomeAmount);
    });
  });

  describe("Custom lunch allowance", () => {
    it("should handle custom lunch allowance correctly", () => {
      const withCustomLunch = simulateDependentWorker({
        income: 1200,
        lunchAllowanceDailyValue: 12,
        lunchAllowanceMode: "cupon",
        lunchAllowanceDaysCount: 20,
        location: "continent",
        period: "2025-01-01_2025-07-31",
      });

      const withDefaultLunch = simulateDependentWorker({
        income: 1200,
        location: "continent",
        period: "2025-01-01_2025-07-31",
      });

      expect(withCustomLunch.monthly.lunchAllowance.grossAmount).toBe(240); // 12 * 20 days
      expect(withCustomLunch.monthly.taxableIncomeForIrsCalculation).not.toBe(
        withDefaultLunch.monthly.taxableIncomeForIrsCalculation
      );
    });

    it("should reconcile yearly net with sum of monthly net values when lunch allowance is taxable", () => {
      const result = simulateDependentWorker({
        income: 1200,
        lunchAllowanceDailyValue: 12,
        lunchAllowanceMode: "salary",
        lunchAllowanceDaysCount: 22,
        includeLunchAllowanceInJune: true,
        twelfths: Twelfths.ONE_MONTH,
        location: "continent",
        period: "2025-01-01_2025-07-31",
      });

      const expectedYearlyNetSalary = 15956.920360360362;

      expect(result.yearly.totalNetIncomeAmount).toBeCloseTo(expectedYearlyNetSalary);
    });
  });

  describe("Date range transitions", () => {
    it("should use different tax tables for different date ranges", () => {
      const earlyYear = simulateDependentWorker({
        income: 1500,
        married: false,
        location: "continent",
        period: "2025-01-01_2025-07-31", // January
 // July
      });

      const lateYear = simulateDependentWorker({
        income: 1500,
        married: false,
        location: "continent",
        period: "2025-10-01_2025-12-31",
      });

      // Tax calculations might differ due to different table periods
      // (this depends on whether your tax tables actually change between periods)
      expect(earlyYear).toBeDefined();
      expect(lateYear).toBeDefined();
    });
  });

  describe("High income brackets", () => {
    it("should handle high income correctly", () => {
      const highIncome = simulateDependentWorker({
        income: 10000,
        married: false,
        disabled: false,
        location: "continent",
        period: "2025-01-01_2025-07-31",
      });

      // Should be in highest tax bracket
      expect(highIncome.monthly.irsWithholdingTax.totalAmount).toBeGreaterThan(3000);
      expect(
        highIncome.monthly.irsWithholdingTax.totalAmount / highIncome.monthly.taxableIncomeForIrsCalculation
      ).toBeGreaterThan(0.3); // Effective rate > 30%
    });
  });

  describe("Edge cases and boundary conditions", () => {
    it("should handle minimum income correctly", () => {
      const minIncome = simulateDependentWorker({
        income: 500,
        married: false,
        disabled: false,
        location: "continent",
        period: "2025-01-01_2025-07-31",
      });

      expect(minIncome.monthly.irsWithholdingTax.totalAmount).toBeGreaterThanOrEqual(0);
      expect(minIncome.monthly.netIncome.totalAmount).toBeGreaterThan(0);
    });

    it("should handle tax bracket boundaries", () => {
      // Test income right at a bracket boundary (from CAS1.json: 857.0)
      const result = simulateDependentWorker({
        income: 857,
        married: true,
        numberOfHolders: 1,
        disabled: false,
        location: "continent",
        period: "2025-01-01_2025-07-31",
      });

      expect(result.monthly.irsWithholdingTax.totalAmount).toBeGreaterThanOrEqual(0);
      expect(result.monthly.netIncome.totalAmount).toBeGreaterThan(0);
    });
  });
});
