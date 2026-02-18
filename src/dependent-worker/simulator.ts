import { SituationUtils, getYearFromPeriod } from "@/config/schemas";
import { TaxRetentionTable } from "@/tables/tax-retention";
import {
  validateNumberOfHolders,
  validateMarriedAndNumberOfHolders,
  validateDependents,
  validatePartnerDisabled,
  validateLunchAllowanceMode,
  validatePeriod,
} from "@/dependent-worker/validators";
import {
  Twelfths,
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

  // Calculate the tax, social security and net salary
  const tax = bracket.calculate_tax(
    taxableIncome,
    twelfthsIncome,
    numberOfDependents || 0,
    extraDeduction
  );
  const socialSecurity = retentionIncome * socialSecurityTaxRate;
  const netSalary = grossIncome - tax - socialSecurity;

  // Split per Doutor Finanças: Rendimento líquido (base+twelfths) | Subsídio de alimentação | Salário líquido (total)
  const baseRetentionIncome = income + twelfthsIncome;
  const netIncome =
    retentionIncome === 0
      ? baseRetentionIncome
      : baseRetentionIncome -
        (tax + socialSecurity) * (baseRetentionIncome / retentionIncome);

  const lunchAllowanceNet =
    retentionIncome === 0
      ? lunchAllowance.monthlyValue
      : lunchAllowance.monthlyValue -
        (tax + socialSecurity) *
          (lunchAllowance.taxableMonthlyValue / retentionIncome);

  const yearlyLunchAllowance = lunchAllowance.monthlyValue * 11;

  const yearlyGrossSalary = income * 14 + yearlyLunchAllowance;

  // Calculate yearly net salary correctly by simulating what the base monthly salary would be
  // without twelfths distribution and then multiplying by 14 months
  const baseMonthlyTaxableIncome = income + lunchAllowance.taxableMonthlyValue;
  const baseMonthlyGrossIncome = baseMonthlyTaxableIncome + lunchAllowance.taxFreeMonthlyValue;
  
  // Calculate tax for base monthly income (without twelfths distribution)
  const baseBracket = taxRetentionTable.find_bracket(baseMonthlyTaxableIncome);
  if (!baseBracket) {
    throw new Error(
      `Could not find tax bracket for base taxable income: ${baseMonthlyTaxableIncome}`
    );
  }
  
  const baseMonthlyTax = baseBracket.calculate_tax(
    baseMonthlyTaxableIncome,
    0, // No twelfths for base calculation
    numberOfDependents || 0,
    extraDeduction
  );
  
  const baseMonthlySocialSecurity = baseMonthlyTaxableIncome * socialSecurityTaxRate;
  const baseMonthlyNet = baseMonthlyGrossIncome - baseMonthlyTax - baseMonthlySocialSecurity;
  
  const yearlyNetSalary = baseMonthlyNet * 14;

  return {
    taxableIncome,
    tax,
    socialSecurity,
    socialSecurityTax: socialSecurityTaxRate,
    gross: {
      monthly: grossIncome,
      yearly: yearlyGrossSalary,
    },
    net: {
      base: netIncome,
      salary: netSalary,
      yearly: yearlyNetSalary,
    },
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
