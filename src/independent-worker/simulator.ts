import {
  SimulateIndependentWorkerOptions,
  IndependentWorkerResult,
  FrequencyChoices,
  TaxRank,
  IndependentWorkerNormalizedInternals,
  CurrencyByFrequency,
} from "./schemas";
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
  calculateTaxIncomeAvg,
  calculateTaxIncomeNormal,
} from "./calculations";
import { buildIndependentWorkerMonthlyBreakdown } from "./monthly-breakdown";
import { IAS_PER_YEAR } from "@/data/ias-data";
import {
  validateIncome,
  validateIncomeFrequency,
  validateNrDaysOff,
  validateSsDiscount,
  validateMaxExpensesTax,
  validateExpenses,
  validateSsTax,
  validateCurrentTaxRankYear,
  validateRnhTax,
  validateYearOfYouthIrs,
} from "./validators";
import { SUPPORTED_TAX_RANK_YEARS, TAX_RANKS } from "@/data/tax-ranks-data";
import { YEAR_BUSINESS_DAYS } from "./consts";


const isWithinFirstFinancialYear = (dateOfOpeningActivity: Date | null): boolean => {
  if (!dateOfOpeningActivity) {
    return false;
  }
  // if the date of opening activity is during this year, then the worker is within the first financial year
  return dateOfOpeningActivity.getFullYear() === new Date().getFullYear();
}

const isWithinSecondFinancialYear = (dateOfOpeningActivity: Date | null): boolean => {
  if (!dateOfOpeningActivity) {
    return false;
  }
  // if the date of opening activity is during the last year, then the worker is within the second financial year
  return dateOfOpeningActivity.getFullYear() === new Date().getFullYear() - 1;
}

const isWithinFirst12Months = (dateOfOpeningActivity: Date | null): boolean => {
  if (!dateOfOpeningActivity) {
    return false;
  }

  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());

  return dateOfOpeningActivity >= twelveMonthsAgo;
}

const resolveTaxableCoefficient = (
  workerWithinFirstFinancialYear: boolean,
  workerWithinSecondFinancialYear: boolean
): number => {
  if (workerWithinFirstFinancialYear) {
    return 0.375;
  }
  if (workerWithinSecondFinancialYear) {
    return 0.5625;
  }
  return 0.75;
};

const resolveAverageRate = (taxRank: TaxRank, taxRanks: TaxRank[]): number => {
  if (taxRank.averageTax !== null) {
    return taxRank.averageTax;
  }
  const previousBracket = taxRanks.find((rank) => rank.id === taxRank.id - 1);
  return previousBracket?.averageTax ?? 0;
};

interface BuildNormalizedInternalsOptions {
  inputIncome: number;
  inputFrequency: FrequencyChoices;
  nrDaysOff: number;
  grossIncome: CurrencyByFrequency;
  ssTax: number;
  ssDiscount: number;
  maxSsIncome: number;
  workerWithinFirst12Months: boolean;
  workerWithinFirstFinancialYear: boolean;
  workerWithinSecondFinancialYear: boolean;
  youthIrsDiscount: number;
  expensesNeeded: number;
  expenses: number;
  taxableIncome: number;
  taxRank: TaxRank;
  taxRanks: TaxRank[];
  rnh: boolean;
  rnhTax: number;
}

const buildNormalizedInternals = ({
  inputIncome,
  inputFrequency,
  nrDaysOff,
  grossIncome,
  ssTax,
  ssDiscount,
  maxSsIncome,
  workerWithinFirst12Months,
  workerWithinFirstFinancialYear,
  workerWithinSecondFinancialYear,
  youthIrsDiscount,
  expensesNeeded,
  expenses,
  taxableIncome,
  taxRank,
  taxRanks,
  rnh,
  rnhTax,
}: BuildNormalizedInternalsOptions): IndependentWorkerNormalizedInternals => {
  const effectiveBusinessDays = YEAR_BUSINESS_DAYS - nrDaysOff;

  const ssBaseMonthlyBeforeDiscountAndCap = grossIncome.month * 0.7;
  const ssBaseMonthlyAfterDiscountBeforeCap =
    ssBaseMonthlyBeforeDiscountAndCap * (1 + ssDiscount);
  const ssBaseMonthlyAfterCap = Math.min(
    maxSsIncome,
    ssBaseMonthlyAfterDiscountBeforeCap
  );
  const ssContributionMonthlyBeforeMinimum = ssTax * ssBaseMonthlyAfterCap;
  const ssContributionMonthlyAfterMinimum = workerWithinFirst12Months
    ? 0
    : Math.max(ssContributionMonthlyBeforeMinimum, 20);
  const ssContributionAnnualAfterMinimum = workerWithinFirst12Months
    ? 0
    : Math.max(12 * ssContributionMonthlyBeforeMinimum, 20 * 12);
  const minimumContributionApplied =
    !workerWithinFirst12Months &&
    ssContributionMonthlyAfterMinimum > ssContributionMonthlyBeforeMinimum;

  const coefficientApplied = resolveTaxableCoefficient(
    workerWithinFirstFinancialYear,
    workerWithinSecondFinancialYear
  );
  const taxableBaseAnnualAfterYouthIrsDiscount =
    grossIncome.year - youthIrsDiscount;
  const expensesMissing = expensesNeeded > expenses ? expensesNeeded - expenses : 0;
  const taxableIncomeFromCoefficient =
    taxableBaseAnnualAfterYouthIrsDiscount * coefficientApplied;
  const taxableIncomeFromExpensesMissing = expensesMissing;

  const averageRateApplied = rnh
    ? rnhTax
    : resolveAverageRate(taxRank, taxRanks);
  const marginalRateApplied = rnh ? rnhTax : taxRank.normalTax;
  const taxableIncomeAtAverageRate = rnh
    ? taxableIncome
    : calculateTaxIncomeAvg(taxRank, taxableIncome);
  const taxableIncomeAtMarginalRate = rnh
    ? 0
    : calculateTaxIncomeNormal(taxRank, taxableIncome);

  return {
    effectiveBusinessDays,
    normalization: {
      inputIncome,
      inputFrequency,
      normalizedGrossIncome: grossIncome,
    },
    socialSecurity: {
      firstYearExemptionApplied: workerWithinFirst12Months,
      baseMonthlyBeforeDiscountAndCap: ssBaseMonthlyBeforeDiscountAndCap,
      baseMonthlyAfterDiscountBeforeCap: ssBaseMonthlyAfterDiscountBeforeCap,
      baseMonthlyAfterCap: ssBaseMonthlyAfterCap,
      contributionMonthlyBeforeMinimum: ssContributionMonthlyBeforeMinimum,
      contributionMonthlyAfterMinimum: ssContributionMonthlyAfterMinimum,
      contributionAnnualAfterMinimum: ssContributionAnnualAfterMinimum,
      minimumContributionApplied,
    },
    taxableIncome: {
      coefficientApplied,
      baseAnnualAfterYouthIrsDiscount: taxableBaseAnnualAfterYouthIrsDiscount,
      expensesMissing,
      valueFromCoefficient: taxableIncomeFromCoefficient,
      valueFromExpensesMissing: taxableIncomeFromExpensesMissing,
    },
    irs: {
      rnhApplied: rnh,
      averageRateApplied,
      marginalRateApplied,
      taxableIncomeAtAverageRate,
      taxableIncomeAtMarginalRate,
    },
  };
};

export function simulateIndependentWorker({
  income,
  incomeFrequency = FrequencyChoices.Year,
  nrDaysOff = 0, // relevant for daily income frequency
  ssDiscount = 0,
  maxExpensesTax = 15,
  expenses = 0,
  ssTax = 0.214,
  currentTaxRankYear = SUPPORTED_TAX_RANK_YEARS[SUPPORTED_TAX_RANK_YEARS.length - 1], // latest year
  rnh = false,
  rnhTax = 0.2,
  dateOfOpeningActivity = null,
  benefitsOfYouthIrs = false,
  yearOfYouthIrs = 1,
}: SimulateIndependentWorkerOptions): IndependentWorkerResult {
  // Validate all inputs
  validateIncome(income);
  validateIncomeFrequency(incomeFrequency);
  validateNrDaysOff(nrDaysOff);
  validateSsDiscount(ssDiscount);
  validateMaxExpensesTax(maxExpensesTax);
  validateExpenses(expenses);
  validateSsTax(ssTax);
  validateCurrentTaxRankYear(currentTaxRankYear);
  validateRnhTax(rnhTax);
  validateYearOfYouthIrs(yearOfYouthIrs, currentTaxRankYear);

  const workerWithinFirstFinancialYear = isWithinFirstFinancialYear(dateOfOpeningActivity);
  const workerWithinSecondFinancialYear = isWithinSecondFinancialYear(dateOfOpeningActivity);
  const workerWithinFirst12Months = isWithinFirst12Months(dateOfOpeningActivity);




  // Calculate gross income based on frequency
  const grossIncome = calculateGrossIncome(
    income,
    incomeFrequency,
    nrDaysOff
  );

  // Get current IAS value
  const currentIas = IAS_PER_YEAR[currentTaxRankYear];
  const maxSsIncome = 12 * currentIas;

  // Calculate social security payments
  const ssPay = calculateSsPay(
    grossIncome,
    ssTax,
    ssDiscount,
    maxSsIncome,
    workerWithinFirst12Months,
    nrDaysOff
  );

  // Calculate specific deductions
  const specificDeductions = calculateSpecificDeductions(ssPay, grossIncome);

  // Calculate expenses
  const maxExpenses = calculateMaxExpenses(grossIncome, maxExpensesTax);
  const expensesNeeded = calculateExpensesNeeded(maxExpenses, specificDeductions);

  // Calculate youth IRS discount
  const youthIrsDiscount = calculateYouthIrsDiscount(
    benefitsOfYouthIrs,
    grossIncome,
    currentTaxRankYear,
    yearOfYouthIrs,
    currentIas
  );

  // Calculate taxable income
  const taxableIncome = calculateTaxableIncome(
    grossIncome,
    youthIrsDiscount,
    workerWithinFirstFinancialYear,
    workerWithinSecondFinancialYear,
    expensesNeeded,
    expenses
  );

  const taxTableUsed = TAX_RANKS[currentTaxRankYear].map((rank) => ({ ...rank }));

  // Find tax rank
  const taxRank = findTaxRank(taxableIncome, currentTaxRankYear);

  // Calculate IRS payments
  const irsPay = calculateIrsPay(
    taxableIncome,
    taxRank,
    rnh,
    rnhTax,
    nrDaysOff,
    taxTableUsed
  );

  // Calculate net income
  const netIncome = calculateNetIncome(grossIncome, irsPay, ssPay);
  const marginalRate = rnh ? rnhTax : taxRank.normalTax;
  const normalizedInternals = buildNormalizedInternals({
    inputIncome: income,
    inputFrequency: incomeFrequency,
    nrDaysOff,
    grossIncome,
    ssTax,
    ssDiscount,
    maxSsIncome,
    workerWithinFirst12Months,
    workerWithinFirstFinancialYear,
    workerWithinSecondFinancialYear,
    youthIrsDiscount,
    expensesNeeded,
    expenses,
    taxableIncome,
    taxRank,
    taxRanks: taxTableUsed,
    rnh,
    rnhTax,
  });
  const monthlyBreakdown = buildIndependentWorkerMonthlyBreakdown({
    grossMonthly: grossIncome.month,
    taxableIncomeAnnual: taxableIncome,
    irsMonthly: irsPay.month,
    ssMonthly: ssPay.month,
    netMonthly: netIncome.month,
    marginalRate,
  });

  return {
    grossIncome,
    taxableIncome,
    ssPay,
    specificDeductions,
    expenses,
    expensesNeeded,
    youthIrsDiscount,
    irsPay,
    netIncome,
    taxTableUsed,
    taxRank,
    currentIas,
    maxSsIncome,
    ssTax,
    maxExpensesTax,
    workerWithinFirstFinancialYear,
    workerWithinSecondFinancialYear,
    workerWithinFirst12Months,
    rnh,
    rnhTax,
    benefitsOfYouthIrs,
    yearOfYouthIrs,
    monthlyBreakdown,
    normalizedInternals,
  };
}
