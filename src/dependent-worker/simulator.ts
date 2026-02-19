import { SituationUtils, getPeriodForMonth } from "@/config/schemas";
import { TaxRetentionTable } from "@/tables/tax-retention";
import {
  validateNumberOfHolders,
  validateMarriedAndNumberOfHolders,
  validateDependents,
  validatePartnerDisabled,
  validateLunchAllowanceMode,
  validateOneHalfMonthTwelfthsLumpSumMonth,
  validateYear,
} from "@/dependent-worker/validators";
import {
  Twelfths,
  MonthlyBreakdownResult,
  DependentWorkerResult,
  SimulateDependentWorkerOptions,
} from "@/dependent-worker/schemas";
import {
  LunchAllowance,
} from "@/dependent-worker/lunch-allowance";
import {
  getPartnerExtraDeduction,
  getTwelfthsIncome,
  getDisabledDependentExtraDeduction,
} from "@/dependent-worker/calculations";
import {
  MONTHS,
  HOLIDAY_ALLOWANCE_MONTH,
  buildTwelfthsLumpSumByMonth,
} from "@/dependent-worker/monthly-breakdown";

export function simulateDependentWorker({
  year,
  income,
  married = false,
  disabled = false,
  partnerDisabled = false,
  location = "continent",
  numberOfHolders = null,
  numberOfDependents = null,
  numberOfDependentsDisabled = null,
  socialSecurityContributionRate = 0.11,
  twelfths = Twelfths.TWO_MONTHS,
  lunchAllowanceDailyValue = 10.2,
  lunchAllowanceMode = "cupon",
  lunchAllowanceDaysCount = 22,
  includeLunchAllowanceInJune = false,
  oneHalfMonthTwelfthsLumpSumMonth = "december",
}: SimulateDependentWorkerOptions): DependentWorkerResult {
  const lunchAllowance = new LunchAllowance(
    lunchAllowanceDailyValue,
    lunchAllowanceMode,
    lunchAllowanceDaysCount
  );
  // Validate input
  validateNumberOfHolders(numberOfHolders);
  validateMarriedAndNumberOfHolders(married, numberOfHolders);
  validatePartnerDisabled(married, partnerDisabled);
  validateDependents(numberOfDependents, numberOfDependentsDisabled);
  validateLunchAllowanceMode(lunchAllowanceMode);
  validateOneHalfMonthTwelfthsLumpSumMonth(oneHalfMonthTwelfthsLumpSumMonth);
  validateYear(year);

  // Partner with disability results in extra deduction
  const partnerExtraDeduction = getPartnerExtraDeduction(
    married,
    numberOfHolders,
    partnerDisabled
  );

  // Holidays and Christmas income distributed over the year
  const twelfthsIncome = getTwelfthsIncome(income, twelfths);

  // The situation to determine the tax bracket
  // Use disability tables if either the worker or their partner is disabled
  const situation = SituationUtils.getSituation(
    married,
    disabled,
    partnerDisabled,
    numberOfHolders,
    numberOfDependents === null ? undefined : numberOfDependents // Python None is undefined here
  );

  if (!situation) {
    throw new Error(
      `Could not determine situation for the given parameters: married=${married}, disabled=${disabled}, numberOfHolders=${numberOfHolders}, numberOfDependents=${numberOfDependents}`
    );
  }

  const yearlyLunchAllowance =
    lunchAllowance.monthlyValue * (includeLunchAllowanceInJune ? 12 : 11);

  const yearlyGrossSalary = income * 14 + yearlyLunchAllowance;

  const twelfthsLumpSumByMonth = buildTwelfthsLumpSumByMonth(
    income,
    twelfths,
    oneHalfMonthTwelfthsLumpSumMonth
  );

  const monthlyBreakdown: MonthlyBreakdownResult[] = MONTHS.map((month, monthIndex) => {
    const period = getPeriodForMonth(year, monthIndex);
    const taxRetentionTable = TaxRetentionTable.load(
      period,
      location,
      situation.code
    );
    const monthExtraDeduction =
      partnerExtraDeduction +
      getDisabledDependentExtraDeduction(
        taxRetentionTable,
        numberOfDependentsDisabled || 0
      );

    const includeLunchAllowance =
      month !== HOLIDAY_ALLOWANCE_MONTH || includeLunchAllowanceInJune;

    const monthLunchGross = includeLunchAllowance ? lunchAllowance.monthlyValue : 0;
    const monthLunchTaxable = includeLunchAllowance
      ? lunchAllowance.taxableMonthlyValue
      : 0;
    const monthLunchTaxFree = includeLunchAllowance
      ? lunchAllowance.taxFreeMonthlyValue
      : 0;

    const monthTaxableIncome = income + monthLunchTaxable;
    const monthTwelfthsDistributed = twelfthsIncome;
    const monthTwelfthsLumpSum = twelfthsLumpSumByMonth[month];
    const monthTwelfthsTotal = monthTwelfthsDistributed + monthTwelfthsLumpSum;

    const monthRetentionIncome = monthTaxableIncome + monthTwelfthsTotal;
    const monthGrossIncome = monthRetentionIncome + monthLunchTaxFree;
    const monthGrossBaseSalary = income;
    const monthGrossBaseSalaryAndLunchAllowance = income + monthLunchGross;

    const monthBracket = taxRetentionTable.find_bracket(monthTaxableIncome);

    const monthTax = monthBracket.calculate_tax(
      monthTaxableIncome,
      monthTwelfthsTotal,
      numberOfDependents || 0,
      monthExtraDeduction
    );

    const monthSocialSecurityBase = income * socialSecurityContributionRate;
    const monthSocialSecurityLunchAllowance =
      monthLunchTaxable * socialSecurityContributionRate;
    const monthSocialSecurityTwelfths =
      monthTwelfthsTotal * socialSecurityContributionRate;
    const monthSocialSecurity =
      monthSocialSecurityBase +
      monthSocialSecurityLunchAllowance +
      monthSocialSecurityTwelfths;

    const monthIrsBase =
      monthRetentionIncome === 0
        ? 0
        : monthTax * (income / monthRetentionIncome);
    const monthIrsLunchAllowance =
      monthRetentionIncome === 0
        ? 0
        : monthTax * (monthLunchTaxable / monthRetentionIncome);
    const monthIrsTwelfths =
      monthRetentionIncome === 0
        ? 0
        : monthTax * (monthTwelfthsTotal / monthRetentionIncome);

    const monthBaseNetIncome =
      income - monthIrsBase - monthSocialSecurityBase;
    const monthTwelfthsNet =
      monthTwelfthsTotal - monthIrsTwelfths - monthSocialSecurityTwelfths;
    const monthLunchAllowanceNet =
      monthLunchGross -
      monthIrsLunchAllowance -
      monthSocialSecurityLunchAllowance;

    const monthNetSalary = monthGrossIncome - monthTax - monthSocialSecurity;

    return {
      month,
      period,
      taxableIncomeForIrsCalculation: monthTaxableIncome,
      incomeSubjectToIrsAndSocialSecurity: monthRetentionIncome,
      grossIncome: {
        baseSalaryAmount: monthGrossBaseSalary,
        baseSalaryAndLunchAllowanceAmount: monthGrossBaseSalaryAndLunchAllowance,
        totalWithLunchAllowanceAndSubsidyTwelfthsAmount: monthGrossIncome,
      },
      irsWithholdingTax: {
        totalAmount: monthTax,
        fromBaseSalaryAmount: monthIrsBase,
        fromLunchAllowanceAmount: monthIrsLunchAllowance,
        fromSubsidyTwelfthsAmount: monthIrsTwelfths,
      },
      socialSecurityContribution: {
        totalAmount: monthSocialSecurity,
        fromBaseSalaryAmount: monthSocialSecurityBase,
        fromLunchAllowanceAmount: monthSocialSecurityLunchAllowance,
        fromSubsidyTwelfthsAmount: monthSocialSecurityTwelfths,
      },
      netIncome: {
        totalAmount: monthNetSalary,
        fromBaseSalaryAmount: monthBaseNetIncome,
        fromLunchAllowanceAmount: monthLunchAllowanceNet,
        fromSubsidyTwelfthsAmount: monthTwelfthsNet,
      },
      lunchAllowance: {
        grossAmount: monthLunchGross,
        taxableAmount: monthLunchTaxable,
        taxExemptAmount: monthLunchTaxFree,
        isPaidInThisMonth: includeLunchAllowance,
      },
      subsidyTwelfths: {
        distributedMonthlyAmount: monthTwelfthsDistributed,
        lumpSumAmount: monthTwelfthsLumpSum,
        totalAmount: monthTwelfthsTotal,
      },
      bracket: monthBracket.toJSON(),
      taxRetentionTable: taxRetentionTable.toJSON(),
    };
  });

  const yearlyNetSalary = monthlyBreakdown.reduce(
    (total, month) => total + month.netIncome.totalAmount,
    0
  );

  return {
    yearly: {
      totalGrossIncomeAmount: yearlyGrossSalary,
      totalNetIncomeAmount: yearlyNetSalary,
      totalLunchAllowanceGrossAmount: yearlyLunchAllowance,
    },
    socialSecurityContributionRate,
    monthlyBreakdown,
  };
}
