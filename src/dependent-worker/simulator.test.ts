import { describe, it, expect, beforeEach, vi } from "vitest";
import { simulateDependentWorker } from "@/dependent-worker/simulator";
import { Twelfths } from "@/dependent-worker/schemas";
import { LunchAllowance } from "@/dependent-worker/lunch-allowance";
import * as ConfigSchemas from "@/config/schemas";
import { TaxRetentionTable as ActualTaxRetentionTable } from "@/tables/tax-retention"; // This import might be used if we were still partially mocking, but now we want the real one.

const defaultLunchAllowance = new LunchAllowance(10.2, "cupon", 22);

// Mock the calculation functions to control their output for tests
vi.mock("@/dependent-worker/calculations", () => ({
  getPartnerExtraDeduction: vi.fn(
    (
      married: boolean,
      numberOfHolders: number | null | undefined,
      partnerDisabled: boolean
    ) => {
      if (married && numberOfHolders === 1 && partnerDisabled) return 50; // Mocked value
      return 0;
    }
  ),
  getTwelfthsIncome: vi.fn((income: number, twelfths: Twelfths) => {
    return (income * Number(twelfths)) / 12; // Using Number(twelfths) as per stub
  }),
  getDisabledDependentExtraDeduction: vi.fn(
    (taxRetentionTable: ActualTaxRetentionTable, numDisabled: number) => {
      const baseDeduction =
        taxRetentionTable?.dependent_disabled_addition_deduction || 20; // Mocked base
      return baseDeduction * numDisabled;
    }
  ),
}));

// Minimal mock for TaxRetentionTable and TaxBracket to avoid actual file loading in unit tests
vi.mock("@/tables/tax-retention", () => {
  class MockTaxBracket {
    constructor(public data: any) {}
    calculate_tax(
      taxable_income: number,
      twelfths_income: number,
      number_of_dependents: number = 0,
      extra_deduction: number = 0
    ): number {
      const basicTax =
        (taxable_income + twelfths_income) * 0.1 -
        extra_deduction -
        number_of_dependents * 10;
      return Math.max(0, basicTax);
    }
    toJSON() {
      return {
        signal: "max",
        limit: this.data.limit || 1000,
        max_marginal_rate: this.data.max_marginal_rate || 0.2,
        deduction: 100,
        var1_deduction: 0,
        var2_deduction: 0,
        dependent_aditional_deduction: 10,
        effective_mensal_rate: 0.1
      };
    }
  }

  class MockTaxRetentionTable {
    dependent_disabled_addition_deduction?: number;
    constructor(
      public situationCode: string,
      public dependentDisabledDeductionVal?: number
    ) {
      this.dependent_disabled_addition_deduction =
        dependentDisabledDeductionVal;
    }

    static load(
      period: ConfigSchemas.PeriodT,
      location: ConfigSchemas.LocationT,
      situation_code: string,
      year: number | string
    ) {
      return new MockTaxRetentionTable(situation_code, 30);
    }

    find_bracket(taxableIncome: number) {
      return new MockTaxBracket({
        limit: taxableIncome + 1000,
        max_marginal_rate: 0.2,
      });
    }
    toJSON() {
      return {
        situation: this.situationCode,
        description: "Mock tax table",
        brackets: [],
        dependent_disabled_addition_deduction: this.dependent_disabled_addition_deduction
      };
    }
  }
  return { TaxRetentionTable: MockTaxRetentionTable };
});

describe("simulateDependentWorker", () => {
  const baseIncome = 1000;

  it("should calculate for a basic scenario with defaults", () => {
    const result = simulateDependentWorker({ income: baseIncome });
    expect(result).toBeDefined();
    expect(result.taxableIncome).toBe(
      baseIncome + defaultLunchAllowance.taxableMonthlyValue
    );
    expect(result.socialSecurityTaxRate).toEqual(0.11);
    expect(result.lunchAllowance).toMatchObject({
      gross: defaultLunchAllowance.monthlyValue,
      taxFree: defaultLunchAllowance.taxFreeMonthlyValue,
      taxable: defaultLunchAllowance.taxableMonthlyValue,
    });
  });

  it("should calculate for a married individual, 1 holder, 2 dependents", () => {
    const incomeVal = 2000;
    const result = simulateDependentWorker({
      income: incomeVal,
      married: true,
      numberOfHolders: 1,
      numberOfDependents: 2,
      numberOfDependentsDisabled: 0,
    });

    expect(result).toBeDefined();
    expect(result.taxableIncome).toBe(
      incomeVal + defaultLunchAllowance.taxableMonthlyValue
    );
  });

  it("should calculate with worker disability and custom lunch allowance", () => {
    const incomeVal = 1500;

    const result = simulateDependentWorker({
      income: incomeVal,
      disabled: true,
      lunchAllowanceDailyValue: 8,
      lunchAllowanceMode: "salary",
      lunchAllowanceDaysCount: 22,
    });
    expect(result).toBeDefined();
    expect(result.lunchAllowance.gross).toBe(8 * 22); // 8/day * 22 days
    expect(result.taxableIncome).toBe(incomeVal + 44);
  });

  it("should calculate for 'azores' location and no twelfths", () => {
    const incomeVal = 2500;

    const result = simulateDependentWorker({
      income: incomeVal,
      location: "azores",
      twelfths: Twelfths.NONE,
    });
    expect(result).toBeDefined();
    const expectedTwelfthsIncome = (incomeVal * Twelfths.NONE) / 12;
    const expectedTaxable =
      incomeVal + defaultLunchAllowance.taxableMonthlyValue;
    const expectedRetentionIncome = expectedTaxable + expectedTwelfthsIncome;
    expect(result.gross.monthly).toBe(
      expectedRetentionIncome + defaultLunchAllowance.taxFreeMonthlyValue
    );
  });

  it("should throw error for invalid numberOfHolders when married", () => {
    expect(() => {
      simulateDependentWorker({
        income: 1000,
        married: true,
        numberOfHolders: null, // Invalid for married
      });
    }).toThrow("'numberOfHolders' is required for married workers");
  });

  it("should throw error for invalid oneHalfMonthTwelfthsLumpSumMonth", () => {
    expect(() => {
      simulateDependentWorker({
        income: 1000,
        oneHalfMonthTwelfthsLumpSumMonth: "july" as any,
      });
    }).toThrow("'oneHalfMonthTwelfthsLumpSumMonth' must be 'june' or 'december'");
  });

  it("should throw error if situation cannot be determined", () => {
    // Spy on SituationUtils.getSituation and make it return undefined for this test
    const getSituationSpy = vi.spyOn(
      ConfigSchemas.SituationUtils,
      "getSituation"
    );
    getSituationSpy.mockReturnValueOnce(undefined);

    expect(() => {
      simulateDependentWorker({
        income: 1000,
        married: true,
        numberOfHolders: 1,
        disabled: false,
        // The specific value of numberOfDependents doesn't strictly matter here due to the mock,
        // but using a common value like 1 or 0 is fine.
        numberOfDependents: 1,
      });
    }).toThrow(/Could not determine situation for the given parameters/);

    // Restore the original implementation after the test
    getSituationSpy.mockRestore();
  });

  it("should calculate yearly gross and net salaries correctly based on (mocked) monthly values", () => {
    const income = 1200;
    const twelfths = Twelfths.ONE_MONTH; // example
    const result = simulateDependentWorker({ income, twelfths });

    const expectedYearlyGrossSalary = 19268.4;

    const expectedYearlyNetSalary = 16413.6;

    expect(result.gross.yearly).toBeCloseTo(expectedYearlyGrossSalary);
    expect(result.net.yearly).toBeCloseTo(expectedYearlyNetSalary);
  });

  it("should include a 12-month breakdown and exclude June lunch allowance by default", () => {
    const result = simulateDependentWorker({ income: 1200 });

    expect(result.monthlyBreakdown).toHaveLength(12);
    expect(result.monthlyBreakdown[0].month).toBe("january");
    expect(result.monthlyBreakdown[11].month).toBe("december");

    const june = result.monthlyBreakdown.find((month) => month.month === "june");
    expect(june).toBeDefined();
    expect(june?.lunchAllowance.included).toBe(false);
    expect(june?.lunchAllowance.gross).toBe(0);
  });

  it("should include June lunch allowance when includeLunchAllowanceInJune is true", () => {
    const result = simulateDependentWorker({
      income: 1200,
      includeLunchAllowanceInJune: true,
    });

    const june = result.monthlyBreakdown.find((month) => month.month === "june");
    expect(june).toBeDefined();
    expect(june?.lunchAllowance.included).toBe(true);
    expect(june?.lunchAllowance.gross).toBe(defaultLunchAllowance.monthlyValue);
  });

  it("should expose monthly component nets and tax splits that reconcile with totals", () => {
    const result = simulateDependentWorker({
      income: 1200,
      twelfths: Twelfths.ONE_MONTH,
      lunchAllowanceDailyValue: 12,
      lunchAllowanceMode: "salary",
      lunchAllowanceDaysCount: 22,
      includeLunchAllowanceInJune: true,
    });

    const january = result.monthlyBreakdown.find((month) => month.month === "january");
    expect(january).toBeDefined();

    expect(january?.net.base).toBeTypeOf("number");
    expect(january?.net.lunchAllowance).toBeTypeOf("number");
    expect(january?.net.twelfths).toBeTypeOf("number");

    expect(january?.irsTax.total).toBeCloseTo(
      (january?.irsTax.base || 0) +
      (january?.irsTax.lunchAllowance || 0) +
      (january?.irsTax.twelfths || 0)
    );

    expect(january?.socialSecurityTax.total).toBeCloseTo(
      (january?.socialSecurityTax.base || 0) +
      (january?.socialSecurityTax.lunchAllowance || 0) +
      (january?.socialSecurityTax.twelfths || 0)
    );

    expect(january?.net.salary).toBeCloseTo(
      (january?.net.base || 0) +
      (january?.net.lunchAllowance || 0) +
      (january?.net.twelfths || 0)
    );
  });

  it("should keep monthly net.base segregated from twelfths", () => {
    const withTwelfths = simulateDependentWorker({
      income: 1200,
      twelfths: Twelfths.ONE_MONTH,
    });

    const june = withTwelfths.monthlyBreakdown.find((month) => month.month === "june");
    expect(june).toBeDefined();
    expect(june?.net.twelfths).toBeGreaterThan(0);
    expect(june?.net.base).toBeCloseTo(june?.net.salary! - june?.net.twelfths! - june?.net.lunchAllowance!);
  });

  it("should allow choosing where the ONE_HALF_MONTH lump-sum remainder is paid", () => {
    const income = 1200;

    const defaultPlacement = simulateDependentWorker({
      income,
      twelfths: Twelfths.ONE_HALF_MONTH,
    });
    const junePlacement = simulateDependentWorker({
      income,
      twelfths: Twelfths.ONE_HALF_MONTH,
      oneHalfMonthTwelfthsLumpSumMonth: "june",
    });

    const defaultJune = defaultPlacement.monthlyBreakdown.find(
      (month) => month.month === "june"
    );
    const defaultDecember = defaultPlacement.monthlyBreakdown.find(
      (month) => month.month === "december"
    );
    const juneJune = junePlacement.monthlyBreakdown.find(
      (month) => month.month === "june"
    );
    const juneDecember = junePlacement.monthlyBreakdown.find(
      (month) => month.month === "december"
    );

    expect(defaultJune?.twelfths.lumpSum).toBeCloseTo(income);
    expect(defaultDecember?.twelfths.lumpSum).toBeCloseTo(income * 0.5);
    expect(juneJune?.twelfths.lumpSum).toBeCloseTo(income * 0.5);
    expect(juneDecember?.twelfths.lumpSum).toBeCloseTo(income);
  });

  describe("period parameter", () => {
    it("should use default period when not specified", () => {
      const result = simulateDependentWorker({ income: 1000 });
      expect(result).toBeDefined();
      expect(result.taxableIncome).toBe(
        1000 + defaultLunchAllowance.taxableMonthlyValue
      );
    });

    it("should work with first period of 2025", () => {
      const result = simulateDependentWorker({
        income: 1000,
        period: "2025-01-01_2025-07-31"
      });
      expect(result).toBeDefined();
      expect(result.taxableIncome).toBe(
        1000 + defaultLunchAllowance.taxableMonthlyValue
      );
    });

    it("should work with second period of 2025", () => {
      const result = simulateDependentWorker({
        income: 1000,
        period: "2025-08-01_2025-09-30"
      });
      expect(result).toBeDefined();
      expect(result.taxableIncome).toBe(
        1000 + defaultLunchAllowance.taxableMonthlyValue
      );
    });

    it("should work with third period of 2025", () => {
      const result = simulateDependentWorker({
        income: 1000,
        period: "2025-10-01_2025-12-31"
      });
      expect(result).toBeDefined();
      expect(result.taxableIncome).toBe(
        1000 + defaultLunchAllowance.taxableMonthlyValue
      );
    });

    it("should throw error for invalid period", () => {
      expect(() => {
        simulateDependentWorker({
          income: 1000,
          period: "2025-01-01_2025-06-30" as any // Invalid period
        });
      }).toThrow("'period' must be one of");
    });
  });
});
