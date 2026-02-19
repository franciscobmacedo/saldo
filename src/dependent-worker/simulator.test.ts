import { describe, it, expect, vi } from "vitest";
import { simulateDependentWorker } from "@/dependent-worker/simulator";
import { Twelfths } from "@/dependent-worker/schemas";
import { LunchAllowance } from "@/dependent-worker/lunch-allowance";
import * as ConfigSchemas from "@/config/schemas";
import { TaxRetentionTable as ActualTaxRetentionTable } from "@/tables/tax-retention";

const defaultLunchAllowance = new LunchAllowance(10.2, "cupon", 22);
const defaultYear = 2025;

vi.mock("@/dependent-worker/calculations", () => ({
  getPartnerExtraDeduction: vi.fn(
    (
      married: boolean,
      numberOfHolders: number | null | undefined,
      partnerDisabled: boolean
    ) => {
      if (married && numberOfHolders === 1 && partnerDisabled) return 50;
      return 0;
    }
  ),
  getTwelfthsIncome: vi.fn((income: number, twelfths: Twelfths) => {
    return (income * Number(twelfths)) / 12;
  }),
  getDisabledDependentExtraDeduction: vi.fn(
    (taxRetentionTable: ActualTaxRetentionTable, numDisabled: number) => {
      const baseDeduction =
        taxRetentionTable?.dependent_disabled_addition_deduction || 20;
      return baseDeduction * numDisabled;
    }
  ),
}));

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
        effective_mensal_rate: 0.1,
      };
    }
  }

  class MockTaxRetentionTable {
    dependent_disabled_addition_deduction?: number;

    constructor(
      public situationCode: string,
      public dependentDisabledDeductionVal?: number
    ) {
      this.dependent_disabled_addition_deduction = dependentDisabledDeductionVal;
    }

    static load(
      period: ConfigSchemas.PeriodT,
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

    toJSON() {
      return {
        situation: this.situationCode,
        description: "Mock tax table",
        brackets: [],
        dependent_disabled_addition_deduction:
          this.dependent_disabled_addition_deduction,
      };
    }
  }

  return { TaxRetentionTable: MockTaxRetentionTable };
});

describe("simulateDependentWorker", () => {
  const baseIncome = 1000;

  it("should calculate for a basic scenario", () => {
    const result = simulateDependentWorker({ year: defaultYear, income: baseIncome });

    expect(result).toBeDefined();
    expect(result.socialSecurityContributionRate).toBe(0.11);
    expect(result.monthlyBreakdown).toHaveLength(12);

    const january = result.monthlyBreakdown.find((month) => month.month === "january");
    expect(january).toBeDefined();
    expect(january?.period).toBe("2025-01-01_2025-07-31");
    expect(january?.taxableIncomeForIrsCalculation).toBe(
      baseIncome + defaultLunchAllowance.taxableMonthlyValue
    );
    expect(january?.lunchAllowance).toMatchObject({
      grossAmount: defaultLunchAllowance.monthlyValue,
      taxExemptAmount: defaultLunchAllowance.taxFreeMonthlyValue,
      taxableAmount: defaultLunchAllowance.taxableMonthlyValue,
    });
  });

  it("should calculate for a married individual, 1 holder, 2 dependents", () => {
    const incomeVal = 2000;
    const result = simulateDependentWorker({
      year: defaultYear,
      income: incomeVal,
      married: true,
      numberOfHolders: 1,
      numberOfDependents: 2,
      numberOfDependentsDisabled: 0,
    });

    const january = result.monthlyBreakdown.find((month) => month.month === "january");
    expect(january).toBeDefined();
    expect(january?.taxableIncomeForIrsCalculation).toBe(
      incomeVal + defaultLunchAllowance.taxableMonthlyValue
    );
  });

  it("should calculate with worker disability and custom lunch allowance", () => {
    const incomeVal = 1500;

    const result = simulateDependentWorker({
      year: defaultYear,
      income: incomeVal,
      disabled: true,
      lunchAllowanceDailyValue: 8,
      lunchAllowanceMode: "salary",
      lunchAllowanceDaysCount: 22,
    });

    const january = result.monthlyBreakdown.find((month) => month.month === "january");
    expect(january).toBeDefined();
    expect(january?.lunchAllowance.grossAmount).toBe(8 * 22);
    expect(january?.taxableIncomeForIrsCalculation).toBe(incomeVal + 44);
  });

  it("should calculate for azores location and no twelfths", () => {
    const incomeVal = 2500;
    const result = simulateDependentWorker({
      year: defaultYear,
      income: incomeVal,
      location: "azores",
      twelfths: Twelfths.NONE,
    });

    const expectedTwelfthsIncome = (incomeVal * Twelfths.NONE) / 12;
    const expectedTaxable = incomeVal + defaultLunchAllowance.taxableMonthlyValue;
    const expectedRetentionIncome = expectedTaxable + expectedTwelfthsIncome;

    const january = result.monthlyBreakdown.find((month) => month.month === "january");
    expect(january).toBeDefined();
    expect(january?.grossIncome.totalWithLunchAllowanceAndSubsidyTwelfthsAmount).toBe(
      expectedRetentionIncome + defaultLunchAllowance.taxFreeMonthlyValue
    );
  });

  it("should throw error for invalid numberOfHolders when married", () => {
    expect(() => {
      simulateDependentWorker({
        year: defaultYear,
        income: 1000,
        married: true,
        numberOfHolders: null,
      });
    }).toThrow("'numberOfHolders' is required for married workers");
  });

  it("should throw error for invalid oneHalfMonthTwelfthsLumpSumMonth", () => {
    expect(() => {
      simulateDependentWorker({
        year: defaultYear,
        income: 1000,
        oneHalfMonthTwelfthsLumpSumMonth: "july" as any,
      });
    }).toThrow("'oneHalfMonthTwelfthsLumpSumMonth' must be 'june' or 'december'");
  });

  it("should throw error for unsupported year", () => {
    expect(() => {
      simulateDependentWorker({
        year: 2024,
        income: 1000,
      });
    }).toThrow("No retention tax periods found for year: 2024");
  });

  it("should throw error if situation cannot be determined", () => {
    const getSituationSpy = vi.spyOn(ConfigSchemas.SituationUtils, "getSituation");
    getSituationSpy.mockReturnValueOnce(undefined);

    expect(() => {
      simulateDependentWorker({
        year: defaultYear,
        income: 1000,
        married: true,
        numberOfHolders: 1,
        disabled: false,
        numberOfDependents: 1,
      });
    }).toThrow(/Could not determine situation for the given parameters/);

    getSituationSpy.mockRestore();
  });

  it("should calculate yearly gross and reconcile yearly net with monthly breakdown", () => {
    const income = 1200;
    const twelfths = Twelfths.ONE_MONTH;
    const result = simulateDependentWorker({ year: defaultYear, income, twelfths });

    const expectedYearlyGrossSalary = 19268.4;
    const expectedYearlyNetSalary = 15740.4;

    expect(result.yearly.totalGrossIncomeAmount).toBeCloseTo(expectedYearlyGrossSalary);
    expect(result.yearly.totalNetIncomeAmount).toBeCloseTo(expectedYearlyNetSalary);
  });

  it("should include a 12-month breakdown and map months to the correct period", () => {
    const result = simulateDependentWorker({ year: defaultYear, income: 1200 });

    expect(result.monthlyBreakdown).toHaveLength(12);
    expect(result.monthlyBreakdown[0].month).toBe("january");
    expect(result.monthlyBreakdown[11].month).toBe("december");

    const january = result.monthlyBreakdown.find((month) => month.month === "january");
    const august = result.monthlyBreakdown.find((month) => month.month === "august");
    const october = result.monthlyBreakdown.find((month) => month.month === "october");

    expect(january?.period).toBe("2025-01-01_2025-07-31");
    expect(august?.period).toBe("2025-08-01_2025-09-30");
    expect(october?.period).toBe("2025-10-01_2025-12-31");
  });

  it("should exclude June lunch allowance by default", () => {
    const result = simulateDependentWorker({ year: defaultYear, income: 1200 });

    const june = result.monthlyBreakdown.find((month) => month.month === "june");
    expect(june).toBeDefined();
    expect(june?.lunchAllowance.isPaidInThisMonth).toBe(false);
    expect(june?.lunchAllowance.grossAmount).toBe(0);
  });

  it("should include June lunch allowance when includeLunchAllowanceInJune is true", () => {
    const result = simulateDependentWorker({
      year: defaultYear,
      income: 1200,
      includeLunchAllowanceInJune: true,
    });

    const june = result.monthlyBreakdown.find((month) => month.month === "june");
    expect(june).toBeDefined();
    expect(june?.lunchAllowance.isPaidInThisMonth).toBe(true);
    expect(june?.lunchAllowance.grossAmount).toBe(defaultLunchAllowance.monthlyValue);
  });

  it("should expose monthly component nets and tax splits that reconcile with totals", () => {
    const result = simulateDependentWorker({
      year: defaultYear,
      income: 1200,
      twelfths: Twelfths.ONE_MONTH,
      lunchAllowanceDailyValue: 12,
      lunchAllowanceMode: "salary",
      lunchAllowanceDaysCount: 22,
      includeLunchAllowanceInJune: true,
    });

    const january = result.monthlyBreakdown.find((month) => month.month === "january");
    expect(january).toBeDefined();

    expect(january?.netIncome.fromBaseSalaryAmount).toBeTypeOf("number");
    expect(january?.netIncome.fromLunchAllowanceAmount).toBeTypeOf("number");
    expect(january?.netIncome.fromSubsidyTwelfthsAmount).toBeTypeOf("number");

    expect(january?.irsWithholdingTax.totalAmount).toBeCloseTo(
      (january?.irsWithholdingTax.fromBaseSalaryAmount || 0) +
        (january?.irsWithholdingTax.fromLunchAllowanceAmount || 0) +
        (january?.irsWithholdingTax.fromSubsidyTwelfthsAmount || 0)
    );

    expect(january?.socialSecurityContribution.totalAmount).toBeCloseTo(
      (january?.socialSecurityContribution.fromBaseSalaryAmount || 0) +
        (january?.socialSecurityContribution.fromLunchAllowanceAmount || 0) +
        (january?.socialSecurityContribution.fromSubsidyTwelfthsAmount || 0)
    );

    expect(january?.netIncome.totalAmount).toBeCloseTo(
      (january?.netIncome.fromBaseSalaryAmount || 0) +
        (january?.netIncome.fromLunchAllowanceAmount || 0) +
        (january?.netIncome.fromSubsidyTwelfthsAmount || 0)
    );
  });

  it("should keep monthly net.base segregated from twelfths", () => {
    const withTwelfths = simulateDependentWorker({
      year: defaultYear,
      income: 1200,
      twelfths: Twelfths.ONE_MONTH,
    });

    const june = withTwelfths.monthlyBreakdown.find((month) => month.month === "june");
    expect(june).toBeDefined();
    expect(june?.netIncome.fromSubsidyTwelfthsAmount).toBeGreaterThan(0);
    expect(june?.netIncome.fromBaseSalaryAmount).toBeCloseTo(
      june?.netIncome.totalAmount! -
        june?.netIncome.fromSubsidyTwelfthsAmount! -
        june?.netIncome.fromLunchAllowanceAmount!
    );
  });

  it("should allow choosing where the ONE_HALF_MONTH lump-sum remainder is paid", () => {
    const income = 1200;

    const defaultPlacement = simulateDependentWorker({
      year: defaultYear,
      income,
      twelfths: Twelfths.ONE_HALF_MONTH,
    });
    const junePlacement = simulateDependentWorker({
      year: defaultYear,
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

    expect(defaultJune?.subsidyTwelfths.lumpSumAmount).toBeCloseTo(income);
    expect(defaultDecember?.subsidyTwelfths.lumpSumAmount).toBeCloseTo(income * 0.5);
    expect(juneJune?.subsidyTwelfths.lumpSumAmount).toBeCloseTo(income * 0.5);
    expect(juneDecember?.subsidyTwelfths.lumpSumAmount).toBeCloseTo(income);
  });
});
