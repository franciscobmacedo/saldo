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
  irsRetention: number;
  ssPay: number;
  netIncome: number;
  totalTax: number;
  overallTaxBurden: number;
  effectiveBracketRate: number | null;
  marginalRate: number;
}

export interface IndependentWorkerReceipt {
  income: number;
  retention?: number;
}

export interface IndependentWorkerNormalizedInternals {
  effectiveBusinessDays: number;
  normalization: {
    inputIncome: number | number[] | IndependentWorkerReceipt[][];
    inputFrequency: FrequencyChoices;
    normalizedGrossIncome: CurrencyByFrequency;
  };
  socialSecurity: {
    firstYearExemptionApplied: boolean;
    /**
     * True when previousYearQ4MonthlyIncome was NOT provided and Jan/Feb/Mar SS
     * is estimated from current-year Q4 (Oct/Nov/Dec) due to
     * approximateQ1FromCurrentYearQ4 being enabled.
     */
    ssQ1Approximated: boolean;
    baseMonthlyBeforeDiscountAndCap: number | number[];
    baseMonthlyAfterDiscountBeforeCap: number | number[];
    baseMonthlyAfterCap: number | number[];
    contributionMonthlyBeforeMinimum: number | number[];
    contributionMonthlyAfterMinimum: number | number[];
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
  yearBusinessDays: number;
  taxableIncome: number;
  ssPay: CurrencyByFrequency;
  specificDeductions: number;
  expenses: number;
  expensesNeeded: number;
  youthIrsDiscount: number;
  irsPay: CurrencyByFrequency;
  irsRetentionRate: number;
  irsRetentionPay: CurrencyByFrequency;
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
  /**
   * True when previousYearQ4MonthlyIncome was NOT provided and Jan/Feb/Mar SS
   * is estimated from current-year Q4 (Oct/Nov/Dec) due to
   * approximateQ1FromCurrentYearQ4 being enabled.
   */
  ssQ1Approximated: boolean;
  monthlyBreakdown: IndependentWorkerMonthlyBreakdownResult[];
  normalizedInternals: IndependentWorkerNormalizedInternals;
}

export interface SimulateIndependentWorkerOptions {
  income: number | number[] | IndependentWorkerReceipt[][];
  incomeFrequency?: FrequencyChoices;
  yearBusinessDays?: number;
  nrDaysOff?: number;
  ssDiscount?: number;
  maxExpensesTax?: number;
  expenses?: number;
  ssTax?: number;
  irsRetentionRate?: number;
  currentTaxRankYear?: 2023 | 2024 | 2025 | 2026;
  rnh?: boolean;
  rnhTax?: number;
  dateOfOpeningActivity?: Date | null;
  benefitsOfYouthIrs?: boolean;
  yearOfYouthIrs?: number;
  /**
   * Average monthly gross income earned in October, November, and December of the
   * **previous** year.  When provided, this is used to compute the exact SS
   * contribution due in January, February, and March (which is always based on
   * the previous quarter's income under Portuguese SS rules).
   *
   * When omitted, Jan/Feb/Mar SS defaults to 0, unless
   * `approximateQ1FromCurrentYearQ4` is enabled.
   */
  previousYearQ4MonthlyIncome?: number;
  /**
   * If true and previousYearQ4MonthlyIncome is omitted, estimate Jan/Feb/Mar SS
   * from the current simulated year's Q4 (Oct/Nov/Dec) average and set
   * `ssQ1Approximated = true`.
   *
   * If false (default) and previousYearQ4MonthlyIncome is omitted, Jan/Feb/Mar SS is 0.
   */
  approximateQ1FromCurrentYearQ4?: boolean;
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
