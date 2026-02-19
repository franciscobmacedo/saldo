export enum FrequencyChoices {
  Year = "year",
  Month = "month", 
  Day = "day"
}

export interface TaxRank {
  id: number;
  min: number;
  max: number | null;
  normalTax: number;
  averageTax: number | null;
}

export interface YouthIrs {
  maxDiscountPercentage: number;
  maxDiscountIasMultiplier: number;
}

export interface CurrencyByFrequency {
  year: number;
  month: number;
  day: number;
}

export type IndependentMonthName =
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";

export interface IndependentWorkerMonthlyBreakdownResult {
  month: IndependentMonthName;
  grossIncome: number;
  taxableIncome: number;
  irsPay: number;
  ssPay: number;
  netIncome: number;
  totalTax: number;
  overallTaxBurden: number;
  effectiveBracketRate: number | null;
  marginalRate: number;
}

export interface IndependentWorkerNormalizedInternals {
  effectiveBusinessDays: number;
  normalization: {
    inputIncome: number;
    inputFrequency: FrequencyChoices;
    normalizedGrossIncome: CurrencyByFrequency;
  };
  socialSecurity: {
    firstYearExemptionApplied: boolean;
    baseMonthlyBeforeDiscountAndCap: number;
    baseMonthlyAfterDiscountBeforeCap: number;
    baseMonthlyAfterCap: number;
    contributionMonthlyBeforeMinimum: number;
    contributionMonthlyAfterMinimum: number;
    contributionAnnualAfterMinimum: number;
    minimumContributionApplied: boolean;
  };
  taxableIncome: {
    coefficientApplied: number;
    baseAnnualAfterYouthIrsDiscount: number;
    expensesMissing: number;
    valueFromCoefficient: number;
    valueFromExpensesMissing: number;
  };
  irs: {
    rnhApplied: boolean;
    averageRateApplied: number;
    marginalRateApplied: number;
    taxableIncomeAtAverageRate: number;
    taxableIncomeAtMarginalRate: number;
  };
}

export interface IndependentWorkerResult {
  grossIncome: CurrencyByFrequency;
  taxableIncome: number;
  ssPay: CurrencyByFrequency;
  specificDeductions: number;
  expenses: number;
  expensesNeeded: number;
  youthIrsDiscount: number;
  irsPay: CurrencyByFrequency;
  netIncome: CurrencyByFrequency;
  taxTableUsed: TaxRank[];
  taxRank: TaxRank;
  currentIas: number;
  maxSsIncome: number;
  ssTax: number;
  maxExpensesTax: number;
  workerWithinFirstFinancialYear: boolean;
  workerWithinSecondFinancialYear: boolean;
  workerWithinFirst12Months: boolean;
  rnh: boolean;
  rnhTax: number;
  benefitsOfYouthIrs: boolean;
  yearOfYouthIrs: number;
  monthlyBreakdown: IndependentWorkerMonthlyBreakdownResult[];
  normalizedInternals: IndependentWorkerNormalizedInternals;
}

export interface SimulateIndependentWorkerOptions {
  income: number;
  incomeFrequency?: FrequencyChoices;
  nrDaysOff?: number;
  ssDiscount?: number;
  maxExpensesTax?: number;
  expenses?: number;
  ssTax?: number;
  currentTaxRankYear?: 2023 | 2024 | 2025 | 2026;
  rnh?: boolean;
  rnhTax?: number;
  dateOfOpeningActivity?: Date | null;
  benefitsOfYouthIrs?: boolean;
  yearOfYouthIrs?: number;
}

export type SimulateIndependentWorkerMonthlyIncomeSweepOptions =
  Omit<SimulateIndependentWorkerOptions, "income" | "incomeFrequency"> & {
    monthlyIncomes: number[];
    yearlyIncomes?: never;
  };

export type SimulateIndependentWorkerYearlyIncomeSweepOptions =
  Omit<SimulateIndependentWorkerOptions, "income" | "incomeFrequency"> & {
    yearlyIncomes: number[];
    monthlyIncomes?: never;
  };

export type SimulateIndependentWorkerIncomeSweepOptions =
  | SimulateIndependentWorkerMonthlyIncomeSweepOptions
  | SimulateIndependentWorkerYearlyIncomeSweepOptions;

export interface IndependentWorkerIncomeSweepPoint {
  scope: "monthly" | "annual";
  gross: number;
  grossAnnual: number;
  grossMonthly: number;
  net: number;
  totalTax: number;
  netAnnual?: number;
  totalTaxAnnual?: number;
  overallTaxBurden: number;
  effectiveBracketRate: number | null;
  marginalRate: number;
}
