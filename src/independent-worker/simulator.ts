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
  validateYearBusinessDays,
  validateSsDiscount,
  validateMaxExpensesTax,
  validateExpenses,
  validateSsTax,
  validateCurrentTaxRankYear,
  validateRnhTax,
  validateYearOfYouthIrs,
} from "./validators";
import { SUPPORTED_TAX_RANK_YEARS, TAX_RANKS } from "@/data/tax-ranks-data";
import { resolveYearBusinessDays } from "./consts";


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
  inputIncome: number | number[];
  inputFrequency: FrequencyChoices;
  yearBusinessDays: number;
  nrDaysOff: number;
  grossIncome: CurrencyByFrequency;
  monthlyIncomes: number[];
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
  yearBusinessDays,
  nrDaysOff,
  grossIncome,
  monthlyIncomes,
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
  const effectiveBusinessDays = yearBusinessDays - nrDaysOff;

  const isVariable = Array.isArray(inputIncome);

  const getSsBaseMonthlyBeforeDiscountAndCap = (): number | number[] => {
    if (!isVariable) return grossIncome.month * 0.7;
    return monthlyIncomes.map(m => m * 0.7);
  };
  const getSsBaseMonthlyAfterDiscountBeforeCap = (beforeCap: number | number[]): number | number[] => {
    if (!isVariable) return (beforeCap as number) * (1 + ssDiscount);
    return (beforeCap as number[]).map(m => m * (1 + ssDiscount));
  };
  const getSsBaseMonthlyAfterCap = (beforeCap: number | number[]): number | number[] => {
    if (!isVariable) return Math.min(maxSsIncome, (beforeCap as number));
    return (beforeCap as number[]).map(m => Math.min(maxSsIncome, m));
  };
  const getSsContributionMonthlyBeforeMinimum = (afterCap: number | number[]): number | number[] => {
    if (!isVariable) return ssTax * (afterCap as number);
    return (afterCap as number[]).map(m => ssTax * m);
  };
  const getSsContributionMonthlyAfterMinimum = (beforeMin: number | number[]): number | number[] => {
    if (!isVariable) return workerWithinFirst12Months ? 0 : Math.max(beforeMin as number, 20);
    return (beforeMin as number[]).map(m => workerWithinFirst12Months ? 0 : Math.max(m, 20));
  };

  const ssBaseMonthlyBeforeDiscountAndCap = getSsBaseMonthlyBeforeDiscountAndCap();
  const ssBaseMonthlyAfterDiscountBeforeCap = getSsBaseMonthlyAfterDiscountBeforeCap(ssBaseMonthlyBeforeDiscountAndCap);
  const ssBaseMonthlyAfterCap = getSsBaseMonthlyAfterCap(ssBaseMonthlyAfterDiscountBeforeCap);
  const ssContributionMonthlyBeforeMinimum = getSsContributionMonthlyBeforeMinimum(ssBaseMonthlyAfterCap);
  const ssContributionMonthlyAfterMinimum = getSsContributionMonthlyAfterMinimum(ssContributionMonthlyBeforeMinimum);

  const ssContributionAnnualAfterMinimum = isVariable
    ? (ssContributionMonthlyAfterMinimum as number[]).reduce((a, b) => a + b, 0)
    : workerWithinFirst12Months
      ? 0
      : Math.max(12 * (ssContributionMonthlyBeforeMinimum as number), 20 * 12);

  const minimumContributionApplied = isVariable
    ? !workerWithinFirst12Months && (ssContributionMonthlyAfterMinimum as number[]).some((m, idx) => m > (ssContributionMonthlyBeforeMinimum as number[])[idx])
    : !workerWithinFirst12Months && (ssContributionMonthlyAfterMinimum as number) > (ssContributionMonthlyBeforeMinimum as number);

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
  yearBusinessDays,
  nrDaysOff = 0, // relevant for daily income frequency
  ssDiscount = 0,
  maxExpensesTax = 15,
  expenses = 0,
  ssTax = 0.214,
  irsRetentionRate = 0.23,
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
  validateCurrentTaxRankYear(currentTaxRankYear);
  if (irsRetentionRate < 0 || irsRetentionRate > 1) {
    throw new Error("IRS retention rate must be between 0 and 1");
  }
  const resolvedYearBusinessDays = resolveYearBusinessDays(
    currentTaxRankYear,
    yearBusinessDays
  );
  validateYearBusinessDays(resolvedYearBusinessDays);
  validateNrDaysOff(nrDaysOff, resolvedYearBusinessDays);
  validateSsDiscount(ssDiscount);
  validateMaxExpensesTax(maxExpensesTax);
  validateExpenses(expenses);
  validateSsTax(ssTax);
  validateRnhTax(rnhTax);
  validateYearOfYouthIrs(yearOfYouthIrs, currentTaxRankYear);

  const workerWithinFirstFinancialYear = isWithinFirstFinancialYear(dateOfOpeningActivity);
  const workerWithinSecondFinancialYear = isWithinSecondFinancialYear(dateOfOpeningActivity);
  const workerWithinFirst12Months = isWithinFirst12Months(dateOfOpeningActivity);

  // Calculate gross income based on frequency
  const grossIncome = calculateGrossIncome(
    income,
    incomeFrequency,
    nrDaysOff,
    resolvedYearBusinessDays
  );

  // Get current IAS value
  const currentIas = IAS_PER_YEAR[currentTaxRankYear];
  const maxSsIncome = 12 * currentIas;

  const isVariable = Array.isArray(income);
  const monthlyIncomes = isVariable ? (income as number[]) : Array(12).fill(grossIncome.month);

  // Calculate social security payments
  const { totals: ssPay, monthly: ssMonthlyList } = calculateSsPay(
    monthlyIncomes,
    ssTax,
    ssDiscount,
    maxSsIncome,
    workerWithinFirst12Months,
    nrDaysOff,
    resolvedYearBusinessDays
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
    taxTableUsed,
    resolvedYearBusinessDays
  );

  // Calculate net income
  const netIncome = calculateNetIncome(
    grossIncome,
    irsPay,
    ssPay,
    resolvedYearBusinessDays
  );
  const marginalRate = rnh ? rnhTax : taxRank.normalTax;
  const normalizedInternals = buildNormalizedInternals({
    inputIncome: income,
    inputFrequency: incomeFrequency,
    yearBusinessDays: resolvedYearBusinessDays,
    nrDaysOff,
    grossIncome,
    monthlyIncomes,
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
    grossMonthly: isVariable ? monthlyIncomes : grossIncome.month,
    grossAnnual: grossIncome.year,
    taxableIncomeAnnual: taxableIncome,
    irsAnnual: irsPay.year,
    irsRetentionRate,
    ssMonthly: isVariable ? ssMonthlyList : ssPay.month,
    marginalRate,
  });

  // Calculate IRS retention (what's withheld at source from clients)
  const irsRetentionAnnual = grossIncome.year * irsRetentionRate;
  const irsRetentionPay: CurrencyByFrequency = {
    year: irsRetentionAnnual,
    month: irsRetentionAnnual / 12,
    day: irsRetentionAnnual / (resolvedYearBusinessDays - nrDaysOff),
  };

  return {
    grossIncome,
    yearBusinessDays: resolvedYearBusinessDays,
    taxableIncome,
    ssPay,
    specificDeductions,
    expenses,
    expensesNeeded,
    youthIrsDiscount,
    irsPay,
    irsRetentionRate,
    irsRetentionPay,
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
