import { SituationUtils, getYearFromPeriod } from "@/config/schemas";
import { TaxRetentionTable } from "@/tables/tax-retention";
import {
  validateNumberOfHolders,
  validateMarriedAndNumberOfHolders,
  validateDependents,
  validatePartnerDisabled,
  validateLunchAllowanceMode,
  validateOneHalfMonthTwelfthsLumpSumMonth,
  validatePeriod,
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
  income,
  married = false,
  disabled = false,
  partnerDisabled = false,
  location = "continent",
  numberOfHolders = null,
  numberOfDependents = null,
  numberOfDependentsDisabled = null,
  period = "2025-01-01_2025-07-31", // Default to first period of 2025
  socialSecurityTaxRate = 0.11,
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
  validatePeriod(period);
  

  // Partner with disability results in extra deduction
  let extraDeduction = getPartnerExtraDeduction(
    married,
    numberOfHolders,
    partnerDisabled
  );

  // Holidays and Christmas income distributed over the year
  const twelfthsIncome = getTwelfthsIncome(income, twelfths);

  // Income for tax calculation
  const taxableIncome = income + lunchAllowance.taxableMonthlyValue;

  // Income for gross salary and social security
  const retentionIncome = taxableIncome + twelfthsIncome;

  // Gross salary per month
  const grossIncome = retentionIncome + lunchAllowance.taxFreeMonthlyValue;

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

  // Load the corresponding tax retention table
  const year = getYearFromPeriod(period);
  const taxRetentionTable = TaxRetentionTable.load(
    period,
    location,
    situation.code,
    year
  );
  // console.log('taxRetentionTable', taxRetentionTable);

  // Find the tax bracket for the taxable income
  const bracket = taxRetentionTable.find_bracket(taxableIncome);
  // console.log('bracket', bracket);
  if (!bracket) {
    throw new Error(
      `Could not find tax bracket for taxable income: ${taxableIncome} in table ${situation.code} for location ${location}`
    );
  }

  // Extra deduction for dependents with disability
  extraDeduction += getDisabledDependentExtraDeduction(
    taxRetentionTable,
    numberOfDependentsDisabled || 0
  );

  // Calculate IRS, social security tax and net salary
  const irsTax = bracket.calculate_tax(
    taxableIncome,
    twelfthsIncome,
    numberOfDependents || 0,
    extraDeduction
  );
  const socialSecurityTax = retentionIncome * socialSecurityTaxRate;
  const netSalary = grossIncome - irsTax - socialSecurityTax;

  // Split per Doutor Finanças: Rendimento líquido (base+twelfths) | Subsídio de alimentação | Salário líquido (total)
  const baseRetentionIncome = income + twelfthsIncome;
  const netIncome =
    retentionIncome === 0
      ? baseRetentionIncome
      : baseRetentionIncome -
        (irsTax + socialSecurityTax) * (baseRetentionIncome / retentionIncome);

  const lunchAllowanceNet =
    retentionIncome === 0
      ? lunchAllowance.monthlyValue
      : lunchAllowance.monthlyValue -
        (irsTax + socialSecurityTax) *
          (lunchAllowance.taxableMonthlyValue / retentionIncome);

  const yearlyLunchAllowance = lunchAllowance.monthlyValue * (includeLunchAllowanceInJune ? 12 : 11);

  const yearlyGrossSalary = income * 14 + yearlyLunchAllowance;

  const twelfthsLumpSumByMonth = buildTwelfthsLumpSumByMonth(
    income,
    twelfths,
    oneHalfMonthTwelfthsLumpSumMonth
  );

  const monthlyBreakdown: MonthlyBreakdownResult[] = MONTHS.map((month) => {
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

    const monthBracket = taxRetentionTable.find_bracket(monthTaxableIncome);
    if (!monthBracket) {
      throw new Error(
        `Could not find tax bracket for monthly taxable income: ${monthTaxableIncome}`
      );
    }

    const monthTax = monthBracket.calculate_tax(
      monthTaxableIncome,
      monthTwelfthsTotal,
      numberOfDependents || 0,
      extraDeduction
    );

    const monthSocialSecurityBase = income * socialSecurityTaxRate;
    const monthSocialSecurityLunchAllowance =
      monthLunchTaxable * socialSecurityTaxRate;
    const monthSocialSecurityTwelfths = monthTwelfthsTotal * socialSecurityTaxRate;
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
      gross: monthGrossIncome,
      irsTax: {
        total: monthTax,
        base: monthIrsBase,
        lunchAllowance: monthIrsLunchAllowance,
        twelfths: monthIrsTwelfths,
      },
      socialSecurityTax: {
        total: monthSocialSecurity,
        base: monthSocialSecurityBase,
        lunchAllowance: monthSocialSecurityLunchAllowance,
        twelfths: monthSocialSecurityTwelfths,
      },
      net: {
        base: monthBaseNetIncome,
        twelfths: monthTwelfthsNet,
        lunchAllowance: monthLunchAllowanceNet,
        salary: monthNetSalary,
      },
      lunchAllowance: {
        gross: monthLunchGross,
        taxable: monthLunchTaxable,
        taxFree: monthLunchTaxFree,
        included: includeLunchAllowance,
      },
      twelfths: {
        distributed: monthTwelfthsDistributed,
        lumpSum: monthTwelfthsLumpSum,
        total: monthTwelfthsTotal,
      },
    };
  });

  const yearlyNetSalary = monthlyBreakdown.reduce(
    (total, month) => total + month.net.salary,
    0
  );

  return {
    taxableIncome,
    irsTax: irsTax,
    socialSecurityTax,
    socialSecurityTaxRate,
    gross: {
      monthly: grossIncome,
      yearly: yearlyGrossSalary,
    },
    net: {
      base: netIncome,
      salary: netSalary,
      yearly: yearlyNetSalary,
    },
    monthlyBreakdown,
    lunchAllowance: {
      gross: lunchAllowance.monthlyValue,
      net: lunchAllowanceNet,
      taxable: lunchAllowance.taxableMonthlyValue,
      taxFree: lunchAllowance.taxFreeMonthlyValue,
    },
    bracket: bracket.toJSON(),
    taxRetentionTable: taxRetentionTable.toJSON(),
  };
}
