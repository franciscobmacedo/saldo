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
  dateOfOpeningAcivity?: Date | null;
  benefitsOfYouthIrs?: boolean;
  yearOfYouthIrs?: number;
}
