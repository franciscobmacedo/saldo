import { describe, it, expect } from "vitest";
import { simulateDependentWorker } from "@/dependent-worker/simulator";
import { Twelfths, MonthName } from "@/dependent-worker/schemas";
import { IAS_PER_YEAR } from "@/data/ias-data";
import { YOUTH_IRS } from "@/data/youth-irs-data";
import { YOUTH_IRS_PAYMENTS_PER_YEAR } from "@/youth-irs";

const defaultYear = 2025;
const baseOptions = {
  year: defaultYear,
  married: false,
  disabled: false,
  partnerDisabled: false,
  location: "continent" as const,
  numberOfHolders: 1,
  numberOfDependents: 0,
  numberOfDependentsDisabled: 0,
  socialSecurityContributionRate: 0.11,
  twelfths: Twelfths.TWO_MONTHS,
  lunchAllowanceDailyValue: 0,
  lunchAllowanceMode: "cupon" as const,
  lunchAllowanceDaysCount: 22,
};

function getMonth(
  result: ReturnType<typeof simulateDependentWorker>,
  monthName: MonthName
) {
  const month = result.monthlyBreakdown.find((m) => m.month === monthName);
  if (!month) throw new Error(`Month not found: ${monthName}`);
  return month;
}

describe("simulateDependentWorker - IRS Jovem", () => {
  it("does not affect retention when benefitsOfYouthIrs is false", () => {
    const baseline = simulateDependentWorker({ ...baseOptions, income: 1500 });
    const explicit = simulateDependentWorker({
      ...baseOptions,
      income: 1500,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    });

    const baselineJan = getMonth(baseline, "january");
    const explicitJan = getMonth(explicit, "january");
    expect(explicitJan.irsWithholdingTax.totalAmount).toBeCloseTo(
      baselineJan.irsWithholdingTax.totalAmount,
      6
    );
    expect(explicitJan.youthIrs.applied).toBe(false);
    expect(explicitJan.youthIrs.exemptIncome).toBe(0);
  });

  it("fully exempts retention in year 1 (100%) up to IAS cap", () => {
    const income = 1500;
    const result = simulateDependentWorker({
      ...baseOptions,
      income,
      twelfths: Twelfths.NONE,
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 1,
    });

    const january = getMonth(result, "january");
    const cap =
      (YOUTH_IRS[defaultYear][1].maxDiscountIasMultiplier *
        IAS_PER_YEAR[defaultYear]) /
      YOUTH_IRS_PAYMENTS_PER_YEAR;

    // Income (€1500) is below the €2053.04 monthly cap and percentage is 100%,
    // so the entire month's remuneration is exempt and retention drops to 0.
    expect(january.youthIrs.applied).toBe(true);
    expect(january.youthIrs.exemptionPercentage).toBe(1);
    expect(january.youthIrs.monthlyExemptCap).toBeCloseTo(cap, 6);
    expect(january.youthIrs.exemptIncome).toBeCloseTo(income, 6);
    expect(january.irsWithholdingTax.totalAmount).toBeCloseTo(0, 6);
  });

  it("caps the exemption at (multiplier × IAS) / 14 when income exceeds the cap", () => {
    const highIncome = 5000;
    const result = simulateDependentWorker({
      ...baseOptions,
      income: highIncome,
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 1,
    });

    const january = getMonth(result, "january");
    const cap =
      (YOUTH_IRS[defaultYear][1].maxDiscountIasMultiplier *
        IAS_PER_YEAR[defaultYear]) /
      YOUTH_IRS_PAYMENTS_PER_YEAR;

    expect(january.youthIrs.exemptIncome).toBeCloseTo(cap, 6);
    expect(january.youthIrs.exemptIncome).toBeLessThan(highIncome);
  });

  it("scales retention linearly with the year-of-benefit percentage", () => {
    const income = 1500;
    const baseline = simulateDependentWorker({ ...baseOptions, income });
    const baselineTax = getMonth(baseline, "january").irsWithholdingTax.totalAmount;

    // For 2025 the table is: yr1=100, yr2-4=75, yr5-7=50, yr8-10=25.
    // Below the IAS cap (income < €2053), the retention is reduced by exactly
    // the percentage-of-exemption.
    const cases: Array<{ year: number; expectedFactor: number }> = [
      { year: 2, expectedFactor: 1 - 0.75 },
      { year: 5, expectedFactor: 1 - 0.5 },
      { year: 8, expectedFactor: 1 - 0.25 },
    ];

    for (const { year, expectedFactor } of cases) {
      const result = simulateDependentWorker({
        ...baseOptions,
        income,
        benefitsOfYouthIrs: true,
        yearOfYouthIrs: year,
      });
      const tax = getMonth(result, "january").irsWithholdingTax.totalAmount;
      expect(tax).toBeCloseTo(baselineTax * expectedFactor, 4);
    }
  });

  it("never produces a higher retention than without IRS Jovem", () => {
    const income = 2500;
    const baseline = simulateDependentWorker({ ...baseOptions, income });
    const exempt = simulateDependentWorker({
      ...baseOptions,
      income,
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 4,
    });

    for (const month of baseline.monthlyBreakdown.map((m) => m.month)) {
      const baselineTax = getMonth(baseline, month).irsWithholdingTax.totalAmount;
      const exemptTax = getMonth(exempt, month).irsWithholdingTax.totalAmount;
      expect(exemptTax).toBeLessThanOrEqual(baselineTax + 1e-6);
    }
  });

  it("keeps SS contribution unchanged regardless of IRS Jovem", () => {
    const income = 1800;
    const baseline = simulateDependentWorker({ ...baseOptions, income });
    const exempt = simulateDependentWorker({
      ...baseOptions,
      income,
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 1,
    });

    for (const m of baseline.monthlyBreakdown.map((x) => x.month)) {
      expect(getMonth(exempt, m).socialSecurityContribution.totalAmount).toBeCloseTo(
        getMonth(baseline, m).socialSecurityContribution.totalAmount,
        6
      );
    }
  });

  it("reconciles tax components after exemption", () => {
    const result = simulateDependentWorker({
      ...baseOptions,
      income: 3000,
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 4,
    });

    for (const month of result.monthlyBreakdown) {
      expect(month.irsWithholdingTax.totalAmount).toBeCloseTo(
        month.irsWithholdingTax.fromBaseSalaryAmount +
          month.irsWithholdingTax.fromLunchAllowanceAmount +
          month.irsWithholdingTax.fromSubsidyTwelfthsAmount,
        6
      );
      expect(month.netIncome.totalAmount).toBeCloseTo(
        month.grossIncome.totalWithLunchAllowanceAndSubsidyTwelfthsAmount -
          month.irsWithholdingTax.totalAmount -
          month.socialSecurityContribution.totalAmount,
        6
      );
    }
  });

  it("rejects yearOfYouthIrs outside the supported range", () => {
    expect(() =>
      simulateDependentWorker({
        ...baseOptions,
        income: 1500,
        benefitsOfYouthIrs: true,
        yearOfYouthIrs: 0,
      })
    ).toThrow(/Year of youth IRS/);

    expect(() =>
      simulateDependentWorker({
        ...baseOptions,
        income: 1500,
        benefitsOfYouthIrs: true,
        yearOfYouthIrs: 11,
      })
    ).toThrow(/Year of youth IRS/);
  });
});
