import { describe, it, expect, beforeEach, vi } from "vitest";
import { simulateIndependentWorker } from "@/independent-worker/simulator";
import { FrequencyChoices } from "@/independent-worker/schemas";

// Mock the calculation functions to control their output for tests
vi.mock("@/independent-worker/calculations", () => ({
  calculateGrossIncome: vi.fn((income: number, frequency: string, nrDaysOff: number) => {
    const year = frequency === FrequencyChoices.Year ? income : 
                 frequency === FrequencyChoices.Month ? income * 12 :
                 income * (248 - nrDaysOff); // YEAR_BUSINESS_DAYS - nrDaysOff
    return {
      year,
      month: year / 12,
      day: year / (248 - nrDaysOff)
    };
  }),
  calculateSsPay: vi.fn((grossIncome: any, ssTax: number, ssDiscount: number, maxSsIncome: number, ssFirstYear: boolean, nrDaysOff: number) => {
    if (ssFirstYear) {
      return { year: 0, month: 0, day: 0 };
    }
    const monthSS = ssTax * Math.min(maxSsIncome, grossIncome.month * 0.7 * (1 + ssDiscount));
    const yearSSPay = Math.max(12 * monthSS, 20 * 12);
    return {
      year: yearSSPay,
      month: Math.max(monthSS, 20),
      day: yearSSPay / (248 - nrDaysOff)
    };
  }),
  calculateSpecificDeductions: vi.fn((ssPay: any, grossIncome: any) => {
    return Math.max(4104, Math.min(ssPay.year, 0.1 * grossIncome.year));
  }),
  calculateMaxExpenses: vi.fn((grossIncome: any, maxExpensesTax: number) => {
    return (maxExpensesTax / 100) * grossIncome.year;
  }),
  calculateExpensesNeeded: vi.fn((maxExpenses: number, specificDeductions: number) => {
    const expenses = maxExpenses - specificDeductions;
    return expenses > 0 ? expenses : 0;
  }),
  calculateTaxableIncome: vi.fn((grossIncome: any, youthIrsDiscount: number, firstYear: boolean, secondYear: boolean, expensesNeeded: number, expenses: number) => {
    const expensesMissing = expensesNeeded > expenses ? expensesNeeded - expenses : 0;
    return (grossIncome.year - youthIrsDiscount) * (firstYear ? 0.375 : secondYear ? 0.5625 : 0.75) + expensesMissing;
  }),
  calculateYouthIrsDiscount: vi.fn((benefitsOfYouthIrs: boolean, grossIncome: any, currentTaxRankYear: number, yearOfYouthIrs: number, currentIas: number) => {
    if (!benefitsOfYouthIrs) return 0;
    // Mock calculation
    return Math.min(grossIncome.year * 0.5, currentIas * 12.5);
  }),
  findTaxRank: vi.fn((taxableIncome: number, currentTaxRankYear: number) => {
    // Mock tax rank for testing
    return {
      id: 1,
      min: 0,
      max: 10000,
      normalTax: 0.13,
      averageTax: 0.13
    };
  }),
  calculateIrsPay: vi.fn((taxableIncome: number, taxRank: any, rnh: boolean, rnhTax: number, nrDaysOff: number, _taxRanks: any[]) => {
    let yearIRS: number;
    if (rnh) {
      yearIRS = taxableIncome * rnhTax;
    } else {
      yearIRS = taxableIncome * taxRank.normalTax;
    }
    return {
      year: Math.max(yearIRS, 0),
      month: Math.max(yearIRS / 12, 0),
      day: Math.max(yearIRS, 0) / (248 - nrDaysOff)
    };
  }),
  calculateNetIncome: vi.fn((grossIncome: any, irsPay: any, ssPay: any) => {
    return {
      year: grossIncome.year - irsPay.year - ssPay.year,
      month: grossIncome.month - irsPay.month - ssPay.month,
      day: (grossIncome.year - irsPay.year - ssPay.year) / 248
    };
  }),
  TAX_RANKS: {},
  YOUTH_IRS: {}
}));

describe("simulateIndependentWorker", () => {
  const baseIncome = 30000;

  it("should calculate for a basic scenario with defaults", () => {
    const result = simulateIndependentWorker({ income: baseIncome });
    
    expect(result).toBeDefined();
    expect(result.grossIncome).toBeDefined();
    expect(result.grossIncome.year).toBe(baseIncome);
    expect(result.taxableIncome).toBeDefined();
    expect(result.ssPay).toBeDefined();
    expect(result.irsPay).toBeDefined();
    expect(result.netIncome).toBeDefined();
    expect(result.taxRank).toBeDefined();
    expect(result.currentIas).toBe(537.13); // 2026 IAS value (default year)
    expect(result.ssTax).toBe(0.214);
    expect(result.maxExpensesTax).toBe(15);
    expect(result.workerWithinFirstFinancialYear).toBe(false);
    expect(result.workerWithinSecondFinancialYear).toBe(false);
    expect(result.workerWithinFirst12Months).toBe(false);
    expect(result.rnh).toBe(false);
    expect(result.rnhTax).toBe(0.2);
    expect(result.benefitsOfYouthIrs).toBe(false);
    expect(result.yearOfYouthIrs).toBe(1);
  });

  it("should calculate for monthly income frequency", () => {
    const monthlyIncome = 2500;
    const result = simulateIndependentWorker({
      income: monthlyIncome,
      incomeFrequency: FrequencyChoices.Month,
    });

    expect(result).toBeDefined();
    expect(result.grossIncome.month).toBe(monthlyIncome);
    expect(result.grossIncome.year).toBe(monthlyIncome * 12);
  });

  it("should calculate for daily income frequency", () => {
    const dailyIncome = 100;
    const result = simulateIndependentWorker({
      income: dailyIncome,
      incomeFrequency: FrequencyChoices.Day,
    });

    expect(result).toBeDefined();
    expect(result.grossIncome.day).toBe(dailyIncome);
    expect(result.grossIncome.year).toBe(dailyIncome * 248); // YEAR_BUSINESS_DAYS
  });

  it("should handle first year scenario", () => {
    // Set dateOfOpeningAcivity to a date in the current year
    const dateInCurrentYear = new Date();
    const result = simulateIndependentWorker({
      income: baseIncome,
      dateOfOpeningAcivity: dateInCurrentYear,
    });

    expect(result.workerWithinFirstFinancialYear).toBe(true);
    expect(result.workerWithinSecondFinancialYear).toBe(false);
  });

  it("should handle second year scenario", () => {
    // Set dateOfOpeningAcivity to a date in the previous year
    const dateInPreviousYear = new Date(new Date().getFullYear() - 1, 6, 1);
    const result = simulateIndependentWorker({
      income: baseIncome,
      dateOfOpeningAcivity: dateInPreviousYear,
    });

    expect(result.workerWithinFirstFinancialYear).toBe(false);
    expect(result.workerWithinSecondFinancialYear).toBe(true);
  });

  it("should handle RNH scenario", () => {
    const result = simulateIndependentWorker({
      income: baseIncome,
      rnh: true,
      rnhTax: 0.2,
    });

    expect(result.rnh).toBe(true);
    expect(result.rnhTax).toBe(0.2);
  });

  it("should handle youth IRS benefits", () => {
    const result = simulateIndependentWorker({
      income: baseIncome,
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 2,
    });

    expect(result.benefitsOfYouthIrs).toBe(true);
    expect(result.yearOfYouthIrs).toBe(2);
  });

  it("should handle SS first year exemption", () => {
    // Set dateOfOpeningAcivity to a date within the last 12 months
    const dateWithinLast12Months = new Date();
    const result = simulateIndependentWorker({
      income: baseIncome,
      dateOfOpeningAcivity: dateWithinLast12Months,
    });

    expect(result.workerWithinFirst12Months).toBe(true);
    expect(result.ssPay.year).toBe(0);
    expect(result.ssPay.month).toBe(0);
    expect(result.ssPay.day).toBe(0);
  });

    it("should handle custom expenses", () => {
      const customExpenses = 5000;
      const result = simulateIndependentWorker({
        income: baseIncome,
        expenses: customExpenses,
      });

      expect(result.expenses).toBe(customExpenses);
    });

  it("should handle different tax years", () => {
    const result2023 = simulateIndependentWorker({
      income: baseIncome,
      currentTaxRankYear: 2023,
    });

    const result2024 = simulateIndependentWorker({
      income: baseIncome,
      currentTaxRankYear: 2024,
    });

    const result2025 = simulateIndependentWorker({
      income: baseIncome,
      currentTaxRankYear: 2025,
    });
    const result2026 = simulateIndependentWorker({
      income: baseIncome,
      currentTaxRankYear: 2026,
    });

    expect(result2023.currentIas).toBe(480.43);
    expect(result2024.currentIas).toBe(509.26);
    expect(result2025.currentIas).toBe(522.50);
    expect(result2026.currentIas).toBe(537.13);
  });

  it("should handle custom SS discount", () => {
    const result = simulateIndependentWorker({
      income: baseIncome,
      ssDiscount: 0.1,
    });

    expect(result).toBeDefined();
  });

  it("should handle custom expenses tax rates", () => {
    const result = simulateIndependentWorker({
      income: baseIncome,
      maxExpensesTax: 25,
    });

    expect(result.maxExpensesTax).toBe(25);
  });

  it("should handle custom SS tax rate", () => {
    const result = simulateIndependentWorker({
      income: baseIncome,
      ssTax: 0.25,
    });

    expect(result.ssTax).toBe(0.25);
  });

    it("should handle custom number of days off", () => {
      const result = simulateIndependentWorker({
        income: baseIncome,
        nrDaysOff: 5,
      });

      expect(result).toBeDefined();
    });
});
