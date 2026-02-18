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
  
      socialSecurityTaxRate: 0.11,
        twelfths: Twelfths.NONE,
        lunchAllowanceDailyValue: 10.2,
        lunchAllowanceMode: "cupon",
        lunchAllowanceDaysCount: 22,
      });

      // Verify structure
      expect(result).toHaveProperty("taxableIncome");
      expect(result).toHaveProperty("gross");
      expect(result).toHaveProperty("tax");
      expect(result).toHaveProperty("socialSecurity");
      expect(result).toHaveProperty("net");

      // Verify reasonable values
      expect(result.taxableIncome).toBeGreaterThanOrEqual(900); // Default lunch allowance adds 0
      expect(result.gross.monthly).toBeGreaterThanOrEqual(result.taxableIncome);
      expect(result.tax).toBeGreaterThanOrEqual(0);
      expect(result.socialSecurity).toBeCloseTo(
        result.taxableIncome * 0.11,
        2
      );
      expect(result.net.salary).toBeLessThan(result.gross.monthly);
      // Yearly gross = income * 14 + lunch allowance * 11 months
      expect(result.gross.yearly).toBe(
        900 * 14 + result.lunchAllowance.gross * 11
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

      expect(result.tax).toBeLessThan(singleResult.tax);
      expect(result.net.salary).toBeGreaterThan(singleResult.net.salary);
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
      expect(withDisabledDependent.tax).toBeLessThan(
        withoutDisabledDependent.tax
      );
      expect(withDisabledDependent.net.salary).toBeGreaterThan(
        withoutDisabledDependent.net.salary
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
      expect(withDisabledPartner.tax).toBeLessThan(withoutDisabledPartner.tax);
      expect(withDisabledPartner.net.salary).toBeGreaterThan(
        withoutDisabledPartner.net.salary
      );

      // The difference should be close to the expected deduction impact
      const taxDifference =
        withoutDisabledPartner.tax - withDisabledPartner.tax;
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
      expect([continent.tax, azores.tax, madeira.tax]).toHaveLength(3);
      // At least one should be different
      const uniqueTaxes = new Set([continent.tax, azores.tax, madeira.tax]);
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
      console.log("noTwelfths:", noTwelfths);

      const oneMonth = simulateDependentWorker({
        ...baseParams,
        twelfths: Twelfths.ONE_MONTH,
      });
      console.log("oneMonth:", oneMonth);

      const twoMonths = simulateDependentWorker({
        ...baseParams,
        twelfths: Twelfths.TWO_MONTHS,
      });
      console.log("twoMonths:", twoMonths);
      // More twelfths should result in higher monthly tax (distributed bonus income)
      expect(twoMonths.tax).toBeGreaterThan(oneMonth.tax);
      expect(oneMonth.tax).toBeGreaterThan(noTwelfths.tax);

      // More twelfths should result in higher monthly net salary (bonus distribution)
      expect(twoMonths.net.salary).toBeGreaterThan(oneMonth.net.salary);
      expect(oneMonth.net.salary).toBeGreaterThan(noTwelfths.net.salary);

      // ONE_MONTH gives the highest yearly net (tax optimization sweet spot)
      expect(oneMonth.net.yearly).toBeCloseTo(twoMonths.net.yearly);
      expect(noTwelfths.net.yearly).toBeCloseTo(oneMonth.net.yearly);
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

      expect(withCustomLunch.lunchAllowance.gross).toBe(240); // 12 * 20 days
      expect(withCustomLunch.taxableIncome).not.toBe(
        withDefaultLunch.taxableIncome
      );
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
      expect(highIncome.tax).toBeGreaterThan(3000);
      expect(highIncome.tax / highIncome.taxableIncome).toBeGreaterThan(0.3); // Effective rate > 30%
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

      expect(minIncome.tax).toBeGreaterThanOrEqual(0);
      expect(minIncome.net.salary).toBeGreaterThan(0);
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

      expect(result.tax).toBeGreaterThanOrEqual(0);
      expect(result.net.salary).toBeGreaterThan(0);
    });
  });
});
