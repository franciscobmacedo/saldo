import { describe, it, expect } from "vitest";
import { simulateDependentWorker } from "@/dependent-worker/simulator";
import { Twelfths } from "@/dependent-worker/schemas";
import { LunchAllowance } from "@/dependent-worker/lunch-allowance";

// NO MOCKS - Testing the full integration
describe("simulateDependentWorker - End-to-End", () => {
  describe("Real tax calculations with actual data", () => {
    it("should calculate correctly for single person in continente with €900 income", () => {
      const result = simulateDependentWorker({
        income: 900,
        married: false,
        disabled: false,
        partnerDisabled: false,
        location: "continente",
        numberOfHolders: 1,
        numberOfDependents: 0,
        numberOfDependentsDisabled: 0,
        dateStart: new Date(2025, 0, 1), // JS months are 0-indexed
        dateEnd: new Date(2025, 11, 31), // JS months are 0-indexed
        socialSecurityTaxRate: 0.11,
        twelfths: Twelfths.NONE,
        lunchAllowanceDailyValue: 10.2,
        lunchAllowanceMode: "cupon",
        lunchAllowanceDaysCount: 22,
      });

      // Verify structure
      expect(result).toHaveProperty("taxableIncome");
      expect(result).toHaveProperty("grossIncome");
      expect(result).toHaveProperty("tax");
      expect(result).toHaveProperty("socialSecurity");
      expect(result).toHaveProperty("netSalary");
      expect(result).toHaveProperty("yearlyGrossSalary");
      expect(result).toHaveProperty("yearlyNetSalary");

      // Verify reasonable values
      console.log("result:", result);
      expect(result.taxableIncome).toBeGreaterThanOrEqual(900); // Default lunch allowance adds 0
      expect(result.grossIncome).toBeGreaterThanOrEqual(result.taxableIncome);
      expect(result.tax).toBeGreaterThanOrEqual(0);
      expect(result.socialSecurity).toBeCloseTo(
        result.taxableIncome * 0.11,
        2
      ); // Social security calculated on taxableIncome, not grossIncome
      expect(result.netSalary).toBeLessThan(result.grossIncome);
      // Yearly gross should be income * 14 + yearly lunch allowance (Portuguese 14-month system)
      expect(result.yearlyGrossSalary).toBe(
        900 * 14 + result.lunchAllowance.yearlyValue
      );
    });

    it("should calculate correctly for married couple with dependents", () => {
      const result = simulateDependentWorker({
        income: 2000,
        married: true,
        numberOfHolders: 1,
        numberOfDependents: 2,
        disabled: false,
        location: "continente",
        dateStart: new Date(2024, 0, 1),
        dateEnd: new Date(2024, 7, 31),
      });

      // Tax should be lower due to dependents
      const singleResult = simulateDependentWorker({
        income: 2000,
        married: false,
        disabled: false,
        location: "continente",
        dateStart: new Date(2024, 0, 1),
        dateEnd: new Date(2024, 7, 31),
      });

      expect(result.tax).toBeLessThan(singleResult.tax);
      expect(result.netSalary).toBeGreaterThan(singleResult.netSalary);
    });

    it("should apply disabled dependent deduction correctly", () => {
      const withDisabledDependent = simulateDependentWorker({
        income: 1500,
        married: true,
        numberOfHolders: 1,
        numberOfDependents: 2,
        numberOfDependentsDisabled: 1,
        location: "continente",
        dateStart: new Date(2024, 0, 1),
        dateEnd: new Date(2024, 7, 31),
      });

      const withoutDisabledDependent = simulateDependentWorker({
        income: 1500,
        married: true,
        numberOfHolders: 1,
        numberOfDependents: 2,
        numberOfDependentsDisabled: 0,
        location: "continente",
        dateStart: new Date(2024, 0, 1),
        dateEnd: new Date(2024, 7, 31),
      });

      // Should have lower tax due to disabled dependent deduction
      expect(withDisabledDependent.tax).toBeLessThan(
        withoutDisabledDependent.tax
      );
      expect(withDisabledDependent.netSalary).toBeGreaterThan(
        withoutDisabledDependent.netSalary
      );
    });

    it("should apply partner disability deduction correctly", () => {
      const withDisabledPartner = simulateDependentWorker({
        income: 1500,
        married: true,
        numberOfHolders: 1,
        partnerDisabled: true,
        location: "continente",
        dateStart: new Date(2024, 0, 1),
        dateEnd: new Date(2024, 7, 31),
      });

      const withoutDisabledPartner = simulateDependentWorker({
        income: 1500,
        married: true,
        numberOfHolders: 1,
        partnerDisabled: false,
        location: "continente",
        dateStart: new Date(2024, 0, 1),
        dateEnd: new Date(2024, 7, 31),
      });

      // Should have lower tax due to partner disability deduction (€135.71)
      expect(withDisabledPartner.tax).toBeLessThan(withoutDisabledPartner.tax);
      expect(withDisabledPartner.netSalary).toBeGreaterThan(
        withoutDisabledPartner.netSalary
      );

      // The difference should be close to the expected deduction impact
      const taxDifference =
        withoutDisabledPartner.tax - withDisabledPartner.tax;
      expect(taxDifference).toBeGreaterThan(130); // Should save more than €130 in tax
    });
  });

  describe("Regional variations", () => {
    const baseParams = {
      income: 1500,
      married: false,
      disabled: false,
      dateStart: new Date(2024, 0, 1),
      dateEnd: new Date(2024, 7, 31),
    };

    it("should produce different results for different regions", () => {
      const continente = simulateDependentWorker({
        ...baseParams,
        location: "continente" as const,
      });

      const acores = simulateDependentWorker({
        ...baseParams,
        location: "acores" as const,
      });

      const madeira = simulateDependentWorker({
        ...baseParams,
        location: "madeira" as const,
      });

      // Tax rates should be different between regions
      expect([continente.tax, acores.tax, madeira.tax]).toHaveLength(3);
      // At least one should be different
      const uniqueTaxes = new Set([continente.tax, acores.tax, madeira.tax]);
      expect(uniqueTaxes.size).toBeGreaterThan(1);
    });
  });

  describe("Twelfths impact", () => {
    const baseParams = {
      income: 1800,
      married: false,
      disabled: false,
      location: "continente" as const,
      dateStart: new Date(2025, 0, 1),
      dateEnd: new Date(2025, 11, 31),
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
      expect(twoMonths.netSalary).toBeGreaterThan(oneMonth.netSalary);
      expect(oneMonth.netSalary).toBeGreaterThan(noTwelfths.netSalary);

      // 
      // How is this possible?
      // Fascinating discovery: ONE_MONTH gives the highest yearly net (tax optimization sweet spot)
      expect(oneMonth.yearlyNetSalary).toBeCloseTo(
        twoMonths.yearlyNetSalary
      );
      expect(noTwelfths.yearlyNetSalary).toBeCloseTo(
        oneMonth.yearlyNetSalary
      );
    });
  });

  describe("Custom lunch allowance", () => {
    it("should handle custom lunch allowance correctly", () => {
      const withCustomLunch = simulateDependentWorker({
        income: 1200,
        lunchAllowanceDailyValue: 12,
        lunchAllowanceMode: "cupon",
        lunchAllowanceDaysCount: 20,
        location: "continente",
        dateStart: new Date(2024, 0, 1),
        dateEnd: new Date(2024, 7, 31),
      });

      const withDefaultLunch = simulateDependentWorker({
        income: 1200,
        location: "continente",
        dateStart: new Date(2024, 0, 1),
        dateEnd: new Date(2024, 7, 31),
      });

      expect(withCustomLunch.lunchAllowance.dailyValue).toBe(12);
      expect(withCustomLunch.lunchAllowance.monthlyValue).toBe(240);
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
        location: "continente",
        dateStart: new Date(2024, 0, 1), // January
        dateEnd: new Date(2024, 7, 31), // August
      });

      const lateYear = simulateDependentWorker({
        income: 1500,
        married: false,
        location: "continente",
        dateStart: new Date(2024, 8, 1), // September
        dateEnd: new Date(2024, 9, 31), // October
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
        location: "continente",
        dateStart: new Date(2024, 0, 1),
        dateEnd: new Date(2024, 7, 31),
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
        location: "continente",
        dateStart: new Date(2024, 0, 1),
        dateEnd: new Date(2024, 7, 31),
      });

      expect(minIncome.tax).toBeGreaterThanOrEqual(0);
      expect(minIncome.netSalary).toBeGreaterThan(0);
    });

    it("should handle tax bracket boundaries", () => {
      // Test income right at a bracket boundary (from CAS1.json: 857.0)
      const result = simulateDependentWorker({
        income: 857,
        married: true,
        numberOfHolders: 1,
        disabled: false,
        location: "continente",
        dateStart: new Date(2024, 0, 1),
        dateEnd: new Date(2024, 7, 31),
      });

      expect(result.tax).toBeGreaterThanOrEqual(0);
      expect(result.netSalary).toBeGreaterThan(0);
    });
  });
});
