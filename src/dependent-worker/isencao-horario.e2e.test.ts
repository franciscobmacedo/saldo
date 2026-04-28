import { describe, it, expect } from "vitest";
import { simulateDependentWorker } from "@/dependent-worker/simulator";
import { Twelfths, MonthName } from "@/dependent-worker/schemas";

const baseOptions = {
  year: 2025,
  income: 1500,
  married: false,
  disabled: false,
  partnerDisabled: false,
  location: "continent" as const,
  numberOfHolders: 1,
  numberOfDependents: 0,
  numberOfDependentsDisabled: 0,
  socialSecurityContributionRate: 0.11,
  lunchAllowanceDailyValue: 0,
  lunchAllowanceMode: "salary" as const,
  lunchAllowanceDaysCount: 0,
};

function monthOf(
  r: ReturnType<typeof simulateDependentWorker>,
  m: MonthName
) {
  const found = r.monthlyBreakdown.find((b) => b.month === m);
  if (!found) throw new Error(`month not found: ${m}`);
  return found;
}

describe("simulateDependentWorker — isenção de horário", () => {
  it("annual gross with IHT equals income*14 + iht*13 (12 months + férias only)", () => {
    const iht = 300;
    const withIht = simulateDependentWorker({
      ...baseOptions,
      twelfths: Twelfths.NONE,
      isencaoHorarioMonthly: iht,
    });
    const without = simulateDependentWorker({
      ...baseOptions,
      twelfths: Twelfths.NONE,
    });

    expect(withIht.yearly.totalGrossIncomeAmount).toBeCloseTo(
      without.yearly.totalGrossIncomeAmount + iht * 13,
      2
    );
  });

  it("June lump sum (férias) includes IHT, December lump sum (natal) does not — Twelfths.NONE", () => {
    const iht = 200;
    const r = simulateDependentWorker({
      ...baseOptions,
      twelfths: Twelfths.NONE,
      isencaoHorarioMonthly: iht,
    });

    const june = monthOf(r, "june");
    const december = monthOf(r, "december");

    expect(june.subsidyTwelfths.lumpSumAmount).toBeCloseTo(
      baseOptions.income + iht,
      2
    );
    expect(december.subsidyTwelfths.lumpSumAmount).toBeCloseTo(
      baseOptions.income,
      2
    );
  });

  it("monthly distributed twelfths include IHT férias-share — Twelfths.TWO_MONTHS", () => {
    const iht = 240;
    const r = simulateDependentWorker({
      ...baseOptions,
      twelfths: Twelfths.TWO_MONTHS,
      isencaoHorarioMonthly: iht,
    });

    const january = monthOf(r, "january");
    // Base twelfths: 1500 * 2/12 = 250
    // IHT férias-share twelfths: 240 * 1 (TWO_MONTHS → 100% twelfths) / 12 = 20
    // Natal share: 0 (IHT excluded)
    expect(january.subsidyTwelfths.distributedMonthlyAmount).toBeCloseTo(
      250 + 20,
      2
    );
    expect(january.subsidyTwelfths.lumpSumAmount).toBeCloseTo(0, 2);
  });

  it("ONE_HALF_MONTH with lumpSumMonth=june: IHT splits 50/50 between June lump and twelfths", () => {
    const iht = 240;
    const r = simulateDependentWorker({
      ...baseOptions,
      twelfths: Twelfths.ONE_HALF_MONTH,
      oneHalfMonthTwelfthsLumpSumMonth: "june",
      isencaoHorarioMonthly: iht,
    });

    const january = monthOf(r, "january");
    const june = monthOf(r, "june");
    const december = monthOf(r, "december");

    // Férias: 50% lump in June (= (income+iht) * 0.5), 50% in twelfths
    // IHT distributed twelfths: 240 * 0.5 / 12 = 10
    expect(january.subsidyTwelfths.distributedMonthlyAmount).toBeCloseTo(
      (baseOptions.income * 0.5) / 12 + 10,
      2
    );
    expect(june.subsidyTwelfths.lumpSumAmount).toBeCloseTo(
      (baseOptions.income + iht) * 0.5,
      2
    );
    // Natal full lump in December — no IHT
    expect(december.subsidyTwelfths.lumpSumAmount).toBeCloseTo(
      baseOptions.income,
      2
    );
  });

  it("ONE_HALF_MONTH with lumpSumMonth=december: IHT goes entirely into June lump", () => {
    const iht = 200;
    const r = simulateDependentWorker({
      ...baseOptions,
      twelfths: Twelfths.ONE_HALF_MONTH,
      oneHalfMonthTwelfthsLumpSumMonth: "december",
      isencaoHorarioMonthly: iht,
    });

    const january = monthOf(r, "january");
    const june = monthOf(r, "june");

    // Férias 100% lump → no IHT in monthly twelfths from férias
    // Natal twelfths still distributed (50% of natal in twelfths)
    expect(january.subsidyTwelfths.distributedMonthlyAmount).toBeCloseTo(
      (baseOptions.income * 0.5) / 12,
      2
    );
    // June lump: full férias = income + iht
    expect(june.subsidyTwelfths.lumpSumAmount).toBeCloseTo(
      baseOptions.income + iht,
      2
    );
  });

  it("monthly base salary stream includes IHT for IRS and SS", () => {
    const iht = 300;
    const without = simulateDependentWorker({
      ...baseOptions,
      twelfths: Twelfths.TWO_MONTHS,
    });
    const withIht = simulateDependentWorker({
      ...baseOptions,
      twelfths: Twelfths.TWO_MONTHS,
      isencaoHorarioMonthly: iht,
    });

    const janWithout = monthOf(without, "january");
    const janWith = monthOf(withIht, "january");

    // SS on the base+IHT stream: 300 * 0.11 = 33 extra per month
    expect(
      janWith.socialSecurityContribution.fromBaseSalaryAmount -
        janWithout.socialSecurityContribution.fromBaseSalaryAmount
    ).toBeCloseTo(33, 2);

    // Gross base salary for January reflects base + IHT
    expect(janWith.grossIncome.baseSalaryAmount).toBeCloseTo(
      baseOptions.income + iht,
      2
    );
  });

  it("defaults to 0 (no behavior change when option omitted)", () => {
    const a = simulateDependentWorker({
      ...baseOptions,
      twelfths: Twelfths.TWO_MONTHS,
    });
    const b = simulateDependentWorker({
      ...baseOptions,
      twelfths: Twelfths.TWO_MONTHS,
      isencaoHorarioMonthly: 0,
    });
    expect(a.yearly.totalGrossIncomeAmount).toBeCloseTo(
      b.yearly.totalGrossIncomeAmount,
      2
    );
    expect(a.yearly.totalNetIncomeAmount).toBeCloseTo(
      b.yearly.totalNetIncomeAmount,
      2
    );
  });
});
