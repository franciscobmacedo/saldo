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
      date_start: Date,
      date_end: Date,
      location: ConfigSchemas.LocationT,
      situation_code: string
    ) {
      return new MockTaxRetentionTable(situation_code, 30);
    }

    find_bracket(taxableIncome: number) {
      return new MockTaxBracket({
        limit: taxableIncome + 1000,
        max_marginal_rate: 0.2,
      });
    }
  }
  return { TaxRetentionTable: MockTaxRetentionTable };
});

describe("simulateDependentWorker", () => {
  const baseIncome = 1000;

  it("should calculate for a basic scenario with defaults", () => {
    const result = simulateDependentWorker({ income: baseIncome });
    expect(result).toBeDefined();
    expect(result.taxable_income).toBe(
      baseIncome + defaultLunchAllowance.taxable_monthly_value
    );
    expect(result.social_security_tax).toEqual(0.11);
    expect(result.lunch_allowance).toEqual(
      new LunchAllowance(10.2, "cupon", 22)
    );
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
    expect(result.taxable_income).toBe(
      incomeVal + defaultLunchAllowance.taxable_monthly_value
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
    expect(result.lunch_allowance.daily_value).toBe(8);
    expect(result.taxable_income).toBe(incomeVal + 44);
  });

  it("should calculate for 'acores' location and no twelfths", () => {
    const incomeVal = 2500;

    const result = simulateDependentWorker({
      income: incomeVal,
      location: "acores",
      twelfths: Twelfths.NONE,
    });
    expect(result).toBeDefined();
    const expectedTwelfthsIncome = (incomeVal * Twelfths.NONE) / 12;
    const expectedTaxable =
      incomeVal + defaultLunchAllowance.taxable_monthly_value;
    const expectedRetentionIncome = expectedTaxable + expectedTwelfthsIncome;
    expect(result.gross_income).toBe(
      expectedRetentionIncome + defaultLunchAllowance.tax_free_monthly_value
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

  // Example test for checking yearly values (highly dependent on mocked calculations)
  it("should calculate yearly gross and net salaries correctly based on (mocked) monthly values", () => {
    const income = 1200;
    const twelfths = Twelfths.ONE_MONTH; // example
    const result = simulateDependentWorker({ income, twelfths });

    const expectedYearlyGrossSalary = 19268.4;

    const expectedYearlyNetSalary = 16413.6;

    expect(result.yearly_gross_salary).toBeCloseTo(expectedYearlyGrossSalary);
    expect(result.yearly_net_salary).toBeCloseTo(expectedYearlyNetSalary);
  });
});
