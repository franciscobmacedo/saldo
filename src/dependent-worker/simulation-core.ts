import { LocationT, SituationCodesT, SituationUtils, getPeriodForMonth } from "@/config/schemas";
import { TaxRetentionTable } from "@/tables/tax-retention";
import {
  validateNumberOfHolders,
  validateMarriedAndNumberOfHolders,
  validateDependents,
  validatePartnerDisabled,
  validateLunchAllowanceMode,
  validateOneHalfMonthTwelfthsLumpSumMonth,
  validateYear,
  validateYouthIrsForDependentWorker,
} from "@/dependent-worker/validators";
import {
  MonthName,
  MonthlyBreakdownResult,
  OneHalfMonthTwelfthsLumpSumMonth,
  SimulateDependentWorkerOptions,
  Twelfths,
} from "@/dependent-worker/schemas";
import {
  calculateMonthlyYouthIrsExemption,
  getYouthIrsRules,
  isSupportedYouthIrsYear,
  YOUTH_IRS_PAYMENTS_PER_YEAR,
} from "@/youth-irs";
import { IAS_PER_YEAR } from "@/data/ias-data";
import type { SupportedTaxRankYear } from "@/data/supported-tax-rank-years";
import { LunchAllowance } from "@/dependent-worker/lunch-allowance";
import {
  getPartnerExtraDeduction,
  getTwelfthsIncome,
  getIsencaoHorarioTwelfthsContribution,
  getDisabledDependentExtraDeduction,
} from "@/dependent-worker/calculations";
import {
  HOLIDAY_ALLOWANCE_MONTH,
  buildTwelfthsLumpSumByMonth,
  getSubsidyLumpSumFractions,
} from "@/dependent-worker/monthly-breakdown";

export type SharedDependentWorkerSimulationOptions = Omit<
  SimulateDependentWorkerOptions,
  "income"
>;

interface ResolvedDependentWorkerSharedOptions {
  year: number;
  married: boolean;
  disabled: boolean;
  partnerDisabled: boolean;
  location: LocationT;
  numberOfHolders: number | null;
  numberOfDependents: number | null;
  numberOfDependentsDisabled: number | null;
  socialSecurityContributionRate: number;
  twelfths: Twelfths;
  lunchAllowanceDailyValue: number;
  lunchAllowanceMode: "cupon" | "salary";
  lunchAllowanceDaysCount: number;
  includeLunchAllowanceInJune: boolean;
  oneHalfMonthTwelfthsLumpSumMonth: OneHalfMonthTwelfthsLumpSumMonth;
  isencaoHorarioMonthly: number;
  benefitsOfYouthIrs: boolean;
  yearOfYouthIrs: number;
}

export interface DependentWorkerSharedSimulationContext
  extends ResolvedDependentWorkerSharedOptions {
  lunchAllowance: LunchAllowance;
  partnerExtraDeduction: number;
  situationCode: SituationCodesT;
  // null when IRS Jovem is not applied or the simulation year falls outside
  // the supported range for which Youth IRS rules are tabulated.
  youthIrsRules: { maxDiscountPercentage: number; maxDiscountIasMultiplier: number } | null;
  youthIrsTaxYear: SupportedTaxRankYear;
  youthIrsMonthlyExemptCap: number;
}

export interface DependentWorkerSimulationContext
  extends DependentWorkerSharedSimulationContext {
  income: number;
  twelfthsIncome: number;
  twelfthsLumpSumByMonth: Record<MonthName, number>;
  yearlyLunchAllowance: number;
  yearlyGrossSalary: number;
}

function resolveDependentWorkerSharedOptions({
  year,
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
  isencaoHorarioMonthly = 0,
  benefitsOfYouthIrs = false,
  yearOfYouthIrs = 1,
}: SharedDependentWorkerSimulationOptions): ResolvedDependentWorkerSharedOptions {
  return {
    year,
    married,
    disabled,
    partnerDisabled,
    location,
    numberOfHolders,
    numberOfDependents,
    numberOfDependentsDisabled,
    socialSecurityContributionRate,
    twelfths,
    lunchAllowanceDailyValue,
    lunchAllowanceMode,
    lunchAllowanceDaysCount,
    includeLunchAllowanceInJune,
    oneHalfMonthTwelfthsLumpSumMonth,
    isencaoHorarioMonthly,
    benefitsOfYouthIrs,
    yearOfYouthIrs,
  };
}

export function prepareDependentWorkerSharedContext(
  options: SharedDependentWorkerSimulationOptions
): DependentWorkerSharedSimulationContext {
  const resolvedOptions = resolveDependentWorkerSharedOptions(options);
  const {
    year,
    married,
    disabled,
    partnerDisabled,
    numberOfHolders,
    numberOfDependents,
    numberOfDependentsDisabled,
    lunchAllowanceDailyValue,
    lunchAllowanceMode,
    lunchAllowanceDaysCount,
    twelfths,
    oneHalfMonthTwelfthsLumpSumMonth,
  } = resolvedOptions;

  const lunchAllowance = new LunchAllowance(
    lunchAllowanceDailyValue,
    lunchAllowanceMode,
    lunchAllowanceDaysCount
  );

  validateNumberOfHolders(numberOfHolders);
  validateMarriedAndNumberOfHolders(married, numberOfHolders);
  validatePartnerDisabled(married, partnerDisabled);
  validateDependents(numberOfDependents, numberOfDependentsDisabled);
  validateLunchAllowanceMode(lunchAllowanceMode);
  validateOneHalfMonthTwelfthsLumpSumMonth(oneHalfMonthTwelfthsLumpSumMonth);
  validateYear(year);
  validateYouthIrsForDependentWorker(
    resolvedOptions.benefitsOfYouthIrs,
    resolvedOptions.yearOfYouthIrs,
    year
  );

  const partnerExtraDeduction = getPartnerExtraDeduction(
    married,
    numberOfHolders,
    partnerDisabled
  );

  const situation = SituationUtils.getSituation(
    married,
    disabled,
    partnerDisabled,
    numberOfHolders,
    numberOfDependents === null ? undefined : numberOfDependents
  );

  if (!situation) {
    throw new Error(
      `Could not determine situation for the given parameters: married=${married}, disabled=${disabled}, numberOfHolders=${numberOfHolders}, numberOfDependents=${numberOfDependents}`
    );
  }

  // The supported tax-rank years drive the Youth IRS rules table. For years
  // outside that range we silently skip the exemption — the rest of the
  // simulator still works with retention tables loaded by period.
  const youthIrsTaxYear: SupportedTaxRankYear = isSupportedYouthIrsYear(year)
    ? year
    : 2025;
  const youthIrsRules =
    resolvedOptions.benefitsOfYouthIrs && isSupportedYouthIrsYear(year)
      ? getYouthIrsRules(youthIrsTaxYear, resolvedOptions.yearOfYouthIrs)
      : null;
  const youthIrsMonthlyExemptCap = youthIrsRules
    ? (youthIrsRules.maxDiscountIasMultiplier * IAS_PER_YEAR[youthIrsTaxYear]) /
      YOUTH_IRS_PAYMENTS_PER_YEAR
    : 0;

  return {
    ...resolvedOptions,
    lunchAllowance,
    partnerExtraDeduction,
    situationCode: situation.code,
    youthIrsRules,
    youthIrsTaxYear,
    youthIrsMonthlyExemptCap,
  };
}

export function prepareDependentWorkerIncomeContext(
  sharedContext: DependentWorkerSharedSimulationContext,
  income: number
): DependentWorkerSimulationContext {
  const iht = sharedContext.isencaoHorarioMonthly;

  const subsidyLumpFractions = getSubsidyLumpSumFractions(
    sharedContext.twelfths,
    sharedContext.oneHalfMonthTwelfthsLumpSumMonth
  );
  const feriasInTwelfthsFraction = 1 - subsidyLumpFractions.ferias;

  const twelfthsIncome =
    getTwelfthsIncome(income, sharedContext.twelfths) +
    getIsencaoHorarioTwelfthsContribution(iht, feriasInTwelfthsFraction);

  // The férias subsídio includes IHT; the natal subsídio does not.
  const twelfthsLumpSumByMonth = buildTwelfthsLumpSumByMonth(
    income + iht,
    income,
    sharedContext.twelfths,
    sharedContext.oneHalfMonthTwelfthsLumpSumMonth
  );

  const yearlyLunchAllowance =
    sharedContext.lunchAllowance.monthlyValue *
    (sharedContext.includeLunchAllowanceInJune ? 12 : 11);
  // Annual: 12 months base + 1 férias + 1 natal of base, plus 12 months IHT
  // + 1 férias of IHT (no natal) = income*14 + iht*13.
  const yearlyGrossSalary = income * 14 + iht * 13 + yearlyLunchAllowance;

  return {
    ...sharedContext,
    income,
    twelfthsIncome,
    twelfthsLumpSumByMonth,
    yearlyLunchAllowance,
    yearlyGrossSalary,
  };
}

export function calculateDependentWorkerMonthBreakdown(
  context: DependentWorkerSimulationContext,
  month: MonthName,
  monthIndex: number
): MonthlyBreakdownResult {
  const period = getPeriodForMonth(context.year, monthIndex);
  const taxRetentionTable = TaxRetentionTable.load(
    period,
    context.location,
    context.situationCode
  );
  const monthExtraDeduction =
    context.partnerExtraDeduction +
    getDisabledDependentExtraDeduction(
      taxRetentionTable,
      context.numberOfDependentsDisabled || 0
    );

  const includeLunchAllowance =
    month !== HOLIDAY_ALLOWANCE_MONTH || context.includeLunchAllowanceInJune;

  const monthLunchGross = includeLunchAllowance
    ? context.lunchAllowance.monthlyValue
    : 0;
  const monthLunchTaxable = includeLunchAllowance
    ? context.lunchAllowance.taxableMonthlyValue
    : 0;
  const monthLunchTaxFree = includeLunchAllowance
    ? context.lunchAllowance.taxFreeMonthlyValue
    : 0;

  // IHT is taxed and SS-deducted exactly like base salary, so it joins the
  // base-salary stream for monthly tax/SS calculations. Its asymmetric
  // contribution to subsídios is already baked into context.twelfthsIncome
  // and context.twelfthsLumpSumByMonth upstream.
  const monthBaseSalaryWithIht = context.income + context.isencaoHorarioMonthly;

  const monthTaxableIncome = monthBaseSalaryWithIht + monthLunchTaxable;
  const monthTwelfthsDistributed = context.twelfthsIncome;
  const monthTwelfthsLumpSum = context.twelfthsLumpSumByMonth[month];
  const monthTwelfthsTotal = monthTwelfthsDistributed + monthTwelfthsLumpSum;

  const monthRetentionIncome = monthTaxableIncome + monthTwelfthsTotal;
  const monthGrossIncome = monthRetentionIncome + monthLunchTaxFree;
  const monthGrossBaseSalary = monthBaseSalaryWithIht;
  const monthGrossBaseSalaryAndLunchAllowance =
    monthBaseSalaryWithIht + monthLunchGross;

  const monthBracket = taxRetentionTable.find_bracket(monthTaxableIncome);

  const monthTaxBeforeYouthIrs = monthBracket.calculate_tax(
    monthTaxableIncome,
    monthTwelfthsTotal,
    context.numberOfDependents || 0,
    monthExtraDeduction
  );

  // IRS Jovem (Despacho 9971-A/2024 alínea g)): bracket lookup uses the full
  // remuneration; the resulting effective rate is then applied only to the
  // non-exempt portion. The exempt amount per payment is capped at
  // (multiplier × IAS) / 14.
  const youthIrsExemptIncome = context.youthIrsRules
    ? calculateMonthlyYouthIrsExemption(
        true,
        monthRetentionIncome,
        context.youthIrsTaxYear,
        context.yearOfYouthIrs
      )
    : 0;
  const youthIrsNonExemptFraction =
    monthRetentionIncome > 0
      ? 1 - youthIrsExemptIncome / monthRetentionIncome
      : 1;
  const monthTax = monthTaxBeforeYouthIrs * youthIrsNonExemptFraction;

  const monthSocialSecurityBase =
    monthBaseSalaryWithIht * context.socialSecurityContributionRate;
  const monthSocialSecurityLunchAllowance =
    monthLunchTaxable * context.socialSecurityContributionRate;
  const monthSocialSecurityTwelfths =
    monthTwelfthsTotal * context.socialSecurityContributionRate;
  const monthSocialSecurity =
    monthSocialSecurityBase +
    monthSocialSecurityLunchAllowance +
    monthSocialSecurityTwelfths;

  const monthIrsBase =
    monthRetentionIncome === 0
      ? 0
      : monthTax * (monthBaseSalaryWithIht / monthRetentionIncome);
  const monthIrsLunchAllowance =
    monthRetentionIncome === 0
      ? 0
      : monthTax * (monthLunchTaxable / monthRetentionIncome);
  const monthIrsTwelfths =
    monthRetentionIncome === 0
      ? 0
      : monthTax * (monthTwelfthsTotal / monthRetentionIncome);

  const monthBaseNetIncome =
    monthBaseSalaryWithIht - monthIrsBase - monthSocialSecurityBase;
  const monthTwelfthsNet =
    monthTwelfthsTotal - monthIrsTwelfths - monthSocialSecurityTwelfths;
  const monthLunchAllowanceNet =
    monthLunchGross - monthIrsLunchAllowance - monthSocialSecurityLunchAllowance;

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
    youthIrs: {
      applied: context.youthIrsRules !== null,
      yearOfBenefit: context.yearOfYouthIrs,
      exemptionPercentage: context.youthIrsRules?.maxDiscountPercentage ?? 0,
      monthlyExemptCap: context.youthIrsMonthlyExemptCap,
      exemptIncome: youthIrsExemptIncome,
    },
  };
}
