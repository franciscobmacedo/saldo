import { describe, it, expect } from "vitest";
import {
  calculateGrossIncome,
  calculateSsPay,
  calculateSpecificDeductions,
  calculateMaxExpenses,
  calculateExpensesNeeded,
  calculateTaxableIncome,
  calculateYouthIrsDiscount,
  findTaxRank,
  calculateIrsPay,
  calculateNetIncome,
} from "@/independent-worker/calculations";
import { TAX_RANKS } from "@/data/tax-ranks-data";
import { IAS_PER_YEAR } from "@/data/ias-data";
import { YOUTH_IRS } from "@/data/youth-irs-data";
import { FrequencyChoices, TaxRank } from "@/independent-worker/schemas";
import { YEAR_BUSINESS_DAYS_BY_TAX_YEAR } from "@/independent-worker/consts";

describe("Independent Worker Calculations", () => {
  const yearBusinessDays = YEAR_BUSINESS_DAYS_BY_TAX_YEAR[2026];

  describe("calculateGrossIncome", () => {
    it("should calculate yearly income correctly", () => {
      const result = calculateGrossIncome(
        30000,
        FrequencyChoices.Year,
        0,
        yearBusinessDays
      );

      expect(result.year).toBe(30000);
      expect(result.month).toBe(2500);
      expect(result.day).toBeCloseTo(120.97, 2); // 30000 / 248
    });

    it("should calculate monthly income correctly", () => {
      const result = calculateGrossIncome(
        2500,
        FrequencyChoices.Month,
        0,
        yearBusinessDays
      );

      expect(result.year).toBe(30000);
      expect(result.month).toBe(2500);
      expect(result.day).toBeCloseTo(120.97, 2);
    });

    it("should calculate daily income correctly", () => {
      const result = calculateGrossIncome(
        120.97,
        FrequencyChoices.Day,
        0,
        yearBusinessDays
      );

      expect(result.year).toBeCloseTo(30000, -1); // Allow more precision for floating point
      expect(result.month).toBeCloseTo(2500, 0);
      expect(result.day).toBeCloseTo(120.97, 2);
    });

    it("should handle days off correctly", () => {
      const result = calculateGrossIncome(
        30000,
        FrequencyChoices.Year,
        5,
        yearBusinessDays
      );

      expect(result.year).toBe(30000);
      expect(result.month).toBe(2500);
      expect(result.day).toBeCloseTo(123.46, 2); // 30000 / (248 - 5)
    });
  });

  describe("calculateSsPay", () => {
    const grossIncome = { year: 30000, month: 2500, day: 120.97 };
    const maxSsIncome = 12 * 522.50; // 2025 IAS

    it("should calculate SS pay correctly", () => {
      const result = calculateSsPay(
        Array(12).fill(grossIncome.month),
        0.214,
        0,
        maxSsIncome,
        false,
        0,
        yearBusinessDays
      );

      expect(result.totals.year).toBeGreaterThan(0);
      expect(result.totals.month).toBeGreaterThanOrEqual(20);
      expect(result.totals.day).toBeGreaterThan(0);
    });

    it("should return zero for SS first year", () => {
      const result = calculateSsPay(
        Array(12).fill(grossIncome.month),
        0.214,
        0,
        maxSsIncome,
        true,
        0,
        yearBusinessDays
      );

      expect(result.totals.year).toBe(0);
      expect(result.totals.month).toBe(0);
      expect(result.totals.day).toBe(0);
      expect(result.ssQ1Approximated).toBe(false);
    });

    it("should handle SS discount", () => {
      const result = calculateSsPay(
        Array(12).fill(grossIncome.month),
        0.214,
        0.1,
        maxSsIncome,
        false,
        0,
        yearBusinessDays
      );

      expect(result.totals.year).toBeGreaterThan(0);
    });

    it("should set ssQ1Approximated=false when previousYearQ4MonthlyIncome is not provided and approximation is disabled", () => {
      const result = calculateSsPay(
        Array(12).fill(grossIncome.month),
        0.214,
        0,
        maxSsIncome,
        false,
        0,
        yearBusinessDays
        // no previousYearQ4MonthlyIncome
      );

      expect(result.ssQ1Approximated).toBe(false);
      expect(result.monthly[0]).toBe(0);
      expect(result.monthly[1]).toBe(0);
      expect(result.monthly[2]).toBe(0);
    });

    it("should set ssQ1Approximated=false when previousYearQ4MonthlyIncome is provided", () => {
      const result = calculateSsPay(
        Array(12).fill(grossIncome.month),
        0.214,
        0,
        maxSsIncome,
        false,
        0,
        yearBusinessDays,
        1500 // previous year Q4 average
      );

      expect(result.ssQ1Approximated).toBe(false);
    });

    it("should use previousYearQ4MonthlyIncome for Jan/Feb/Mar SS", () => {
      // Jan/Feb/Mar incomes in current year are high (3000/mo)
      const currentYearIncomes = Array(12).fill(3000);
      // But prev year Q4 was low (1000/mo) → Jan/Feb/Mar payment should be lower
      const prevQ4Avg = 1000;

      const resultWithPrevQ4 = calculateSsPay(
        currentYearIncomes, 0.214, 0, maxSsIncome, false, 0, yearBusinessDays, prevQ4Avg
      );
      const resultWithout = calculateSsPay(
        currentYearIncomes, 0.214, 0, maxSsIncome, false, 0, yearBusinessDays
      );

      // With prevQ4 supplied, Jan SS is based on 1000; without it and with
      // approximation disabled, Jan SS is 0.
      const janWithPrev = resultWithPrevQ4.monthly[0];
      const janWithout = resultWithout.monthly[0];
      expect(janWithPrev).toBeGreaterThan(janWithout);
      // Apr–Jun should be identical (both use Q1 of current year)
      expect(resultWithPrevQ4.monthly[3]).toBeCloseTo(resultWithout.monthly[3], 5);
    });

    it("should approximate Jan/Feb/Mar SS from current-year Q4 when flag is enabled", () => {
      const incomes = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        6000, 6000, 6000,
      ];

      const result = calculateSsPay(
        incomes,
        0.214,
        0,
        maxSsIncome,
        false,
        0,
        yearBusinessDays,
        undefined,
        true
      );

      expect(result.ssQ1Approximated).toBe(true);
      expect(result.monthly[0]).toBeGreaterThan(20);
      expect(result.monthly[1]).toBeCloseTo(result.monthly[0], 5);
      expect(result.monthly[2]).toBeCloseTo(result.monthly[0], 5);
    });

    it("should map payment quarters correctly (SS paid 1 quarter after income)", () => {
      // Variable incomes: Q1=0, Q2=0, Q3=0, Q4=6000 → only Q4 is non-trivial
      const incomes = [
        0, 0, 0,    // Q1 (Jan–Mar)
        0, 0, 0,    // Q2 (Apr–Jun)
        0, 0, 0,    // Q3 (Jul–Sep)
        6000, 6000, 6000, // Q4 (Oct–Dec)
      ];
      const result = calculateSsPay(incomes, 0.214, 0, maxSsIncome, false, 0, yearBusinessDays, 0);

      // Jan/Feb/Mar: based on prevQ4 = 0 → minimum 20
      expect(result.monthly[0]).toBe(20);
      expect(result.monthly[1]).toBe(20);
      expect(result.monthly[2]).toBe(20);
      // Apr/May/Jun: based on Q1 = 0 → minimum 20
      expect(result.monthly[3]).toBe(20);
      // Jul/Aug/Sep: based on Q2 = 0 → minimum 20
      expect(result.monthly[6]).toBe(20);
      // Oct/Nov/Dec: based on Q3 (0) → minimum 20 (Q4 is not paid this year)
      expect(result.monthly[9]).toBe(20);
    });
  });

  describe("calculateSpecificDeductions", () => {
    it("should calculate specific deductions correctly", () => {
      const ssPay = { year: 5000, month: 416.67, day: 20.16 };
      const grossIncome = { year: 30000, month: 2500, day: 120.97 };

      const result = calculateSpecificDeductions(ssPay, grossIncome);

      expect(result).toBe(Math.max(4104, Math.min(5000, 3000)));
    });

    it("should use minimum deduction of 4104", () => {
      const ssPay = { year: 1000, month: 83.33, day: 4.03 };
      const grossIncome = { year: 30000, month: 2500, day: 120.97 };

      const result = calculateSpecificDeductions(ssPay, grossIncome);

      expect(result).toBe(4104);
    });
  });

  describe("calculateMaxExpenses", () => {
    it("should calculate max expenses correctly", () => {
      const grossIncome = { year: 30000, month: 2500, day: 120.97 };
      const result = calculateMaxExpenses(grossIncome, 15);

      expect(result).toBe(4500); // 15% of 30000
    });
  });

  describe("calculateExpensesNeeded", () => {
    it("should calculate expenses needed correctly", () => {
      const result = calculateExpensesNeeded(4500, 4104);

      expect(result).toBe(396); // 4500 - 4104
    });

    it("should return zero when max expenses is less than specific deductions", () => {
      const result = calculateExpensesNeeded(3000, 4104);

      expect(result).toBe(0);
    });
  });

  describe("calculateTaxableIncome", () => {
    const grossIncome = { year: 30000, month: 2500, day: 120.97 };

    it("should calculate taxable income for regular scenario", () => {
      const result = calculateTaxableIncome(grossIncome, 0, false, false, 396, 396);

      expect(result).toBeCloseTo(22500, 0); // 30000 * 0.75
    });

    it("should calculate taxable income for first year", () => {
      const result = calculateTaxableIncome(grossIncome, 0, true, false, 396, 396);

      expect(result).toBeCloseTo(11250, 0); // 30000 * 0.375
    });

    it("should calculate taxable income for second year", () => {
      const result = calculateTaxableIncome(grossIncome, 0, false, true, 396, 396);

      expect(result).toBeCloseTo(16875, 0); // 30000 * 0.5625
    });

    it("should handle missing expenses", () => {
      const result = calculateTaxableIncome(grossIncome, 0, false, false, 396, 200);

      expect(result).toBeCloseTo(22696, 0); // (30000 * 0.75) + (396 - 200) = 22500 + 196 = 22696
    });
  });

  describe("calculateYouthIrsDiscount", () => {
    const grossIncome = { year: 30000, month: 2500, day: 120.97 };
    const currentIas = 522.50;

    it("should return zero when benefits are disabled", () => {
      const result = calculateYouthIrsDiscount(false, grossIncome, 2025, 1, currentIas);

      expect(result).toBe(0);
    });

    it("should calculate youth IRS discount correctly", () => {
      const result = calculateYouthIrsDiscount(true, grossIncome, 2025, 1, currentIas);

      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(grossIncome.year);
    });
  });

  describe("findTaxRank", () => {
    it("should find correct tax rank for 2025", () => {
      const result = findTaxRank(10000, 2025);

      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
      expect(result.min).toBeLessThanOrEqual(10000);
      expect(result.max === null || result.max >= 10000).toBe(true);
    });

    it("should find correct tax rank for 2024", () => {
      const result = findTaxRank(15000, 2024);

      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
    });

    it("should find correct tax rank for 2023", () => {
      const result = findTaxRank(20000, 2023);

      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
    });
  });

  describe("calculateIrsPay", () => {
    const taxRank: TaxRank = { id: 1, min: 0, max: 10000, normalTax: 0.13, averageTax: 0.13 };
    const mockTaxRanks: TaxRank[] = [taxRank];

    it("should calculate IRS pay for regular scenario", () => {
      const result = calculateIrsPay(
        10000,
        taxRank,
        false,
        0.2,
        0,
        mockTaxRanks,
        yearBusinessDays
      );

      expect(result.year).toBeCloseTo(1300, 0); // 10000 * 0.13
      expect(result.month).toBeCloseTo(108.33, 2);
      expect(result.day).toBeCloseTo(5.24, 2);
    });

    it("should calculate IRS pay for RNH scenario", () => {
      const result = calculateIrsPay(
        10000,
        taxRank,
        true,
        0.2,
        0,
        mockTaxRanks,
        yearBusinessDays
      );

      expect(result.year).toBeCloseTo(2000, 0); // 10000 * 0.2
      expect(result.month).toBeCloseTo(166.67, 2);
      expect(result.day).toBeCloseTo(8.06, 2);
    });

    it("should calculate IRS pay correctly for the highest bracket (averageTax is null)", () => {
      // Simulate the highest bracket scenario
      const bracket8: TaxRank = { id: 8, min: 44987, max: 83696, normalTax: 0.45, averageTax: 0.35408 };
      const bracket9: TaxRank = { id: 9, min: 83696, max: null, normalTax: 0.48, averageTax: null };
      const taxRanks: TaxRank[] = [bracket8, bracket9];

      // For taxableIncome of 120000:
      // Tax should be: 83696 * 0.35408 + (120000 - 83696) * 0.48
      // = 29637.47 + 17425.92 = 47063.39
      const result = calculateIrsPay(
        120000,
        bracket9,
        false,
        0.2,
        0,
        taxRanks,
        yearBusinessDays
      );

      // Allow small rounding differences (within 5€)
      expect(result.year).toBeCloseTo(47061, -1);
      expect(result.year).toBeGreaterThan(40000); // Should never be 0!
    });
  });

  describe("calculateNetIncome", () => {
    const grossIncome = { year: 30000, month: 2500, day: 120.97 };
    const irsPay = { year: 3000, month: 250, day: 12.10 };
    const ssPay = { year: 2000, month: 166.67, day: 8.06 };

    it("should calculate net income correctly", () => {
      const result = calculateNetIncome(
        grossIncome,
        irsPay,
        ssPay,
        yearBusinessDays
      );

      expect(result.year).toBe(25000); // 30000 - 3000 - 2000
      expect(result.month).toBeCloseTo(2083.33, 2); // 2500 - 250 - 166.67
      expect(result.day).toBeCloseTo(100.81, 2); // 25000 / 248
    });
  });

  describe("Constants", () => {
    it("should have correct IAS values", () => {
      expect(IAS_PER_YEAR[2023]).toBe(480.43);
      expect(IAS_PER_YEAR[2024]).toBe(509.26);
      expect(IAS_PER_YEAR[2025]).toBe(522.50);
    });

    it("should have correct tax ranks structure", () => {
      expect(TAX_RANKS[2025]).toBeDefined();
      expect(TAX_RANKS[2025].length).toBeGreaterThan(0);
      expect(TAX_RANKS[2024]).toBeDefined();
      expect(TAX_RANKS[2023]).toBeDefined();
    });

    it("should have correct youth IRS structure", () => {
      expect(YOUTH_IRS[2025]).toBeDefined();
      expect(YOUTH_IRS[2025][1]).toBeDefined();
      expect(YOUTH_IRS[2025][1].maxDiscountPercentage).toBeGreaterThan(0);
      expect(YOUTH_IRS[2025][1].maxDiscountIasMultiplier).toBeGreaterThan(0);
    });
  });
});
