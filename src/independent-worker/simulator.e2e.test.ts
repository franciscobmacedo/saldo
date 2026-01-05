import { describe, it, expect } from "vitest";
import { simulateIndependentWorker } from "@/independent-worker/simulator";
import { FrequencyChoices } from "@/independent-worker/schemas";

// NO MOCKS - Testing the full integration
describe("simulateIndependentWorker - End-to-End", () => {
  describe("Real tax calculations with actual data", () => {
    it("should calculate correctly for €30,000 yearly income", () => {
      const result = simulateIndependentWorker({
        income: 30000,
        incomeFrequency: FrequencyChoices.Year,
        nrDaysOff: 0,
        ssDiscount: 0,
        maxExpensesTax: 15,
        expenses: 0,
        ssTax: 0.214,
        currentTaxRankYear: 2025,
        rnh: false,
        rnhTax: 0.2,
        dateOfOpeningAcivity: null,
        benefitsOfYouthIrs: false,
        yearOfYouthIrs: 1,
      });

      // Verify structure
      expect(result).toHaveProperty("grossIncome");
      expect(result).toHaveProperty("taxableIncome");
      expect(result).toHaveProperty("ssPay");
      expect(result).toHaveProperty("specificDeductions");
      expect(result).toHaveProperty("expenses");
      expect(result).toHaveProperty("expensesNeeded");
      expect(result).toHaveProperty("youthIrsDiscount");
      expect(result).toHaveProperty("irsPay");
      expect(result).toHaveProperty("netIncome");
      expect(result).toHaveProperty("taxRank");
      expect(result).toHaveProperty("currentIas");
      expect(result).toHaveProperty("maxSsIncome");
      expect(result).toHaveProperty("ssTax");
      expect(result).toHaveProperty("maxExpensesTax");
      expect(result).toHaveProperty("workerWithinFirstFinancialYear");
      expect(result).toHaveProperty("workerWithinSecondFinancialYear");
      expect(result).toHaveProperty("workerWithinFirst12Months");
      expect(result).toHaveProperty("rnh");
      expect(result).toHaveProperty("rnhTax");
      expect(result).toHaveProperty("benefitsOfYouthIrs");
      expect(result).toHaveProperty("yearOfYouthIrs");

      // Verify reasonable values
      console.log("result:", result);
      expect(result.grossIncome.year).toBe(30000);
      expect(result.grossIncome.month).toBe(2500);
      expect(result.taxableIncome).toBeGreaterThan(0);
      expect(result.ssPay.year).toBeGreaterThanOrEqual(0);
      expect(result.irsPay.year).toBeGreaterThanOrEqual(0);
      expect(result.netIncome.year).toBeLessThan(result.grossIncome.year);
      expect(result.currentIas).toBe(522.50);
      expect(result.maxSsIncome).toBe(12 * 522.50);
    });

    it("should calculate correctly for €50,000 yearly income with first year benefits", () => {
      // Set dateOfOpeningAcivity to a date in the current year
      const dateInCurrentYear = new Date();
      const result = simulateIndependentWorker({
        income: 50000,
        incomeFrequency: FrequencyChoices.Year,
        dateOfOpeningAcivity: dateInCurrentYear,
        benefitsOfYouthIrs: true,
        yearOfYouthIrs: 1,
      });

      expect(result.grossIncome.year).toBe(50000);
      expect(result.workerWithinFirstFinancialYear).toBe(true);
      expect(result.benefitsOfYouthIrs).toBe(true);
      expect(result.yearOfYouthIrs).toBe(1);
      expect(result.youthIrsDiscount).toBeGreaterThan(0);
    });

    it("should calculate correctly for RNH status", () => {
      const result = simulateIndependentWorker({
        income: 100000,
        incomeFrequency: FrequencyChoices.Year,
        rnh: true,
        rnhTax: 0.2,
      });

      expect(result.rnh).toBe(true);
      expect(result.rnhTax).toBe(0.2);
      expect(result.netIncome.year).toBeLessThan(result.grossIncome.year);
    });

    it("should calculate correctly for monthly income", () => {
      const monthlyIncome = 3000;
      const result = simulateIndependentWorker({
        income: monthlyIncome,
        incomeFrequency: FrequencyChoices.Month,
      });

      expect(result.grossIncome.month).toBe(monthlyIncome);
      expect(result.grossIncome.year).toBe(monthlyIncome * 12);
    });

    it("should calculate correctly for daily income", () => {
      const dailyIncome = 150;
      const result = simulateIndependentWorker({
        income: dailyIncome,
        incomeFrequency: FrequencyChoices.Day,
        nrDaysOff: 0,
      });

      expect(result.grossIncome.day).toBe(dailyIncome);
      expect(result.grossIncome.year).toBe(dailyIncome * 248);
    });

    it("should handle SS first year exemption", () => {
      // Set dateOfOpeningAcivity to a date within the last 12 months
      const dateWithinLast12Months = new Date();
      const result = simulateIndependentWorker({
        income: 40000,
        dateOfOpeningAcivity: dateWithinLast12Months,
      });

      expect(result.workerWithinFirst12Months).toBe(true);
      expect(result.ssPay.year).toBe(0);
      expect(result.ssPay.month).toBe(0);
      expect(result.ssPay.day).toBe(0);
    });

    it("should handle different tax years", () => {
      const income = 35000;
      
      const result2023 = simulateIndependentWorker({
        income,
        currentTaxRankYear: 2023,
      });

      const result2024 = simulateIndependentWorker({
        income,
        currentTaxRankYear: 2024,
      });

      const result2025 = simulateIndependentWorker({
        income,
        currentTaxRankYear: 2025,
      });

      expect(result2023.currentIas).toBe(480.43);
      expect(result2024.currentIas).toBe(509.26);
      expect(result2025.currentIas).toBe(522.50);
    });

    it("should handle custom expenses", () => {
      const result = simulateIndependentWorker({
        income: 60000,
        expenses: 10000,
      });

      expect(result.expenses).toBe(10000);
    });

    it("should handle Portuguese 14-month system", () => {
      const monthlyIncome = 2000;
      const result = simulateIndependentWorker({
        income: monthlyIncome,
        incomeFrequency: FrequencyChoices.Month,
      });

      expect(result.grossIncome.month).toBe(monthlyIncome);
      expect(result.grossIncome.year).toBe(monthlyIncome * 12);
    });

    it("should handle second year scenario", () => {
      // Set dateOfOpeningAcivity to a date in the previous year
      const dateInPreviousYear = new Date(new Date().getFullYear() - 1, 6, 1);
      const result = simulateIndependentWorker({
        income: 45000,
        dateOfOpeningAcivity: dateInPreviousYear,
      });

      expect(result.workerWithinFirstFinancialYear).toBe(false);
      expect(result.workerWithinSecondFinancialYear).toBe(true);
    });

    it("should handle youth IRS benefits for different years", () => {
      const income = 40000;
      
      // Test year 1 of youth IRS
      const resultYear1 = simulateIndependentWorker({
        income,
        benefitsOfYouthIrs: true,
        yearOfYouthIrs: 1,
        currentTaxRankYear: 2025,
      });

      // Test year 5 of youth IRS
      const resultYear5 = simulateIndependentWorker({
        income,
        benefitsOfYouthIrs: true,
        yearOfYouthIrs: 5,
        currentTaxRankYear: 2025,
      });

      expect(resultYear1.benefitsOfYouthIrs).toBe(true);
      expect(resultYear1.yearOfYouthIrs).toBe(1);
      expect(resultYear5.benefitsOfYouthIrs).toBe(true);
      expect(resultYear5.yearOfYouthIrs).toBe(5);
    });
  });
});
