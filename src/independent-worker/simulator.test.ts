import { describe, it, expect, vi } from "vitest";
import { simulateIndependentWorker } from "@/independent-worker/simulator";
import { FrequencyChoices } from "@/independent-worker/schemas";
import { TAX_RANKS } from "@/data/tax-ranks-data";
import { YEAR_BUSINESS_DAYS_BY_TAX_YEAR } from "@/independent-worker/consts";

// Mock the calculation functions to control their output for tests
vi.mock("@/independent-worker/calculations", () => ({
  calculateGrossIncome: vi.fn((
    income: number,
    frequency: string,
    nrDaysOff: number,
    yearBusinessDays: number = 248
  ) => {
    const year = frequency === FrequencyChoices.Year ? income :
      frequency === FrequencyChoices.Month ? income * 12 :
        income * (yearBusinessDays - nrDaysOff);
    return {
      year,
      month: year / 12,
      day: year / (yearBusinessDays - nrDaysOff)
    };
  }),
  calculateSsPay: vi.fn((
    monthlyIncomes: number[],
    ssTax: number,
    ssDiscount: number,
    maxSsIncome: number,
    ssFirstYear: boolean,
    nrDaysOff: number,
    yearBusinessDays: number = 248
  ) => {
    if (ssFirstYear) {
      return { totals: { year: 0, month: 0, day: 0 }, monthly: Array(12).fill(0) };
    }
    const qAvg = monthlyIncomes[0]; // simplistic mock for tests
    const monthSS = ssTax * Math.min(maxSsIncome, qAvg * 0.7 * (1 + ssDiscount));
    const finalSS = Math.max(monthSS, 20);
    const yearSSPay = 12 * finalSS;
    return {
      totals: {
        year: yearSSPay,
        month: finalSS,
        day: yearSSPay / (yearBusinessDays - nrDaysOff)
      },
      monthly: Array(12).fill(finalSS)
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
  calculateIrsPay: vi.fn((
    taxableIncome: number,
    taxRank: any,
    rnh: boolean,
    rnhTax: number,
    nrDaysOff: number,
    _taxRanks: any[],
    yearBusinessDays: number = 248
  ) => {
    let yearIRS: number;
    if (rnh) {
      yearIRS = taxableIncome * rnhTax;
    } else {
      yearIRS = taxableIncome * taxRank.normalTax;
    }
    return {
      year: Math.max(yearIRS, 0),
      month: Math.max(yearIRS / 12, 0),
      day: Math.max(yearIRS, 0) / (yearBusinessDays - nrDaysOff)
    };
  }),
  calculateTaxIncomeAvg: vi.fn((taxRank: any, taxableIncome: number) => {
    if (taxRank.id <= 1) {
      return taxableIncome;
    }
    return taxRank.max ?? taxRank.min;
  }),
  calculateTaxIncomeNormal: vi.fn((taxRank: any, taxableIncome: number) => {
    if (taxRank.id <= 1) {
      return 0;
    }
    return taxableIncome - (taxRank.max ?? taxRank.min);
  }),
  calculateNetIncome: vi.fn((
    grossIncome: any,
    irsPay: any,
    ssPay: any,
    yearBusinessDays: number = 248
  ) => {
    return {
      year: grossIncome.year - irsPay.year - ssPay.year,
      month: grossIncome.month - irsPay.month - ssPay.month,
      day: (grossIncome.year - irsPay.year - ssPay.year) / yearBusinessDays
    };
  }),
  TAX_RANKS: {},
  YOUTH_IRS: {}
}));

describe("simulateIndependentWorker", () => {
  const baseIncome = 30000;
  const defaultYearBusinessDays = YEAR_BUSINESS_DAYS_BY_TAX_YEAR[2026];

  it("should calculate for a basic scenario with defaults", () => {
    const result = simulateIndependentWorker({ income: baseIncome });

    expect(result).toBeDefined();
    expect(result.grossIncome).toBeDefined();
    expect(result.grossIncome.year).toBe(baseIncome);
    expect(result.taxableIncome).toBeDefined();
    expect(result.ssPay).toBeDefined();
    expect(result.irsPay).toBeDefined();
    expect(result.netIncome).toBeDefined();
    expect(result.taxTableUsed).toBeDefined();
    expect(result.taxTableUsed.length).toBeGreaterThan(0);
    expect(result.taxRank).toBeDefined();
    expect(result.monthlyBreakdown).toBeDefined();
    expect(result.monthlyBreakdown).toHaveLength(12);
    expect(result.normalizedInternals).toBeDefined();
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
    expect(result.yearBusinessDays).toBe(defaultYearBusinessDays);
    expect(result.normalizedInternals.effectiveBusinessDays).toBe(
      defaultYearBusinessDays
    );
  });

  it("should expose a month-by-month breakdown consistent with monthly totals", () => {
    const result = simulateIndependentWorker({ income: baseIncome });

    const january = result.monthlyBreakdown.find((item) => item.month === "january");
    expect(january).toBeDefined();
    expect(january?.grossIncome).toBeCloseTo(result.grossIncome.month);
    expect(january?.taxableIncome).toBeCloseTo(result.taxableIncome / 12);
    expect(january?.irsPay).toBeCloseTo(result.irsPay.month);
    expect(january?.ssPay).toBeCloseTo(result.ssPay.month);
    expect(january?.netIncome).toBeCloseTo(result.netIncome.month);
    expect(january?.totalTax).toBeCloseTo(result.irsPay.month + result.ssPay.month);
    expect(january?.overallTaxBurden).toBeCloseTo(
      (result.irsPay.month + result.ssPay.month) / result.grossIncome.month
    );
  });

  it("should expose normalized internals for SS and taxable-income composition", () => {
    const result = simulateIndependentWorker({
      income: baseIncome,
      ssDiscount: 0.1,
      nrDaysOff: 8,
      expenses: 100,
    });

    expect(result.normalizedInternals.effectiveBusinessDays).toBe(
      defaultYearBusinessDays - 8
    );
    expect(result.normalizedInternals.normalization.inputIncome).toBe(baseIncome);
    expect(result.normalizedInternals.normalization.inputFrequency).toBe(
      FrequencyChoices.Year
    );

    expect(
      result.normalizedInternals.socialSecurity.baseMonthlyBeforeDiscountAndCap as number
    ).toBeCloseTo(result.grossIncome.month * 0.7);
    expect(
      result.normalizedInternals.socialSecurity.baseMonthlyAfterDiscountBeforeCap as number
    ).toBeCloseTo(result.grossIncome.month * 0.7 * 1.1);
    expect(
      result.normalizedInternals.socialSecurity.contributionMonthlyBeforeMinimum as number
    ).toBeCloseTo(
      (result.normalizedInternals.socialSecurity.baseMonthlyAfterCap as number) * result.ssTax
    );

    expect(result.normalizedInternals.taxableIncome.coefficientApplied).toBe(0.75);
    expect(
      result.normalizedInternals.taxableIncome.baseAnnualAfterYouthIrsDiscount
    ).toBeCloseTo(result.grossIncome.year - result.youthIrsDiscount);
    expect(
      result.normalizedInternals.taxableIncome.valueFromCoefficient +
      result.normalizedInternals.taxableIncome.valueFromExpensesMissing
    ).toBeCloseTo(result.taxableIncome);
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
    expect(result.grossIncome.year).toBe(dailyIncome * defaultYearBusinessDays);
  });

  it("should handle first year scenario", () => {
    // Set dateOfOpeningActivity to a date in the current year
    const dateInCurrentYear = new Date();
    const result = simulateIndependentWorker({
      income: baseIncome,
      dateOfOpeningActivity: dateInCurrentYear,
    });

    expect(result.workerWithinFirstFinancialYear).toBe(true);
    expect(result.workerWithinSecondFinancialYear).toBe(false);
  });

  it("should handle second year scenario", () => {
    // Set dateOfOpeningActivity to a date in the previous year
    const dateInPreviousYear = new Date(new Date().getFullYear() - 1, 6, 1);
    const result = simulateIndependentWorker({
      income: baseIncome,
      dateOfOpeningActivity: dateInPreviousYear,
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
    // Set dateOfOpeningActivity to a date within the last 12 months
    const dateWithinLast12Months = new Date();
    const result = simulateIndependentWorker({
      income: baseIncome,
      dateOfOpeningActivity: dateWithinLast12Months,
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
    expect(result2023.yearBusinessDays).toBe(YEAR_BUSINESS_DAYS_BY_TAX_YEAR[2023]);
    expect(result2024.yearBusinessDays).toBe(YEAR_BUSINESS_DAYS_BY_TAX_YEAR[2024]);
    expect(result2025.yearBusinessDays).toBe(YEAR_BUSINESS_DAYS_BY_TAX_YEAR[2025]);
    expect(result2026.yearBusinessDays).toBe(YEAR_BUSINESS_DAYS_BY_TAX_YEAR[2026]);
    expect(result2023.taxTableUsed).toEqual(TAX_RANKS[2023]);
    expect(result2024.taxTableUsed).toEqual(TAX_RANKS[2024]);
    expect(result2025.taxTableUsed).toEqual(TAX_RANKS[2025]);
    expect(result2026.taxTableUsed).toEqual(TAX_RANKS[2026]);
  });

  it("should allow overriding year business days", () => {
    const result = simulateIndependentWorker({
      income: 200,
      incomeFrequency: FrequencyChoices.Day,
      yearBusinessDays: 240,
    });

    expect(result.yearBusinessDays).toBe(240);
    expect(result.grossIncome.year).toBe(200 * 240);
    expect(result.normalizedInternals.effectiveBusinessDays).toBe(240);
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
