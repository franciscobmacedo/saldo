import { LocationT, PeriodT } from "@/config/schemas";

export enum Twelfths {
  NONE = 0, // No twelfths
  ONE_HALF_MONTH = 0.5, // 1x50% - One allowance at 50% (half month)
  ONE_MONTH = 1, // 2x50% - Two allowances at 50% each (one month total)
  TWO_MONTHS = 2, // 2x100% - Two allowances at 100% each (two months total)
}

export type OneHalfMonthTwelfthsLumpSumMonth = "june" | "december";

export type MonthName =
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

export interface SimulateDependentWorkerOptions {
  year: number;
  income: number;
  married?: boolean;
  disabled?: boolean;
  partnerDisabled?: boolean;
  location?: LocationT;
  numberOfHolders?: number | null;
  numberOfDependents?: number | null;
  numberOfDependentsDisabled?: number | null;
  socialSecurityContributionRate?: number;
  twelfths?: Twelfths;
  lunchAllowanceDailyValue?: number;
  lunchAllowanceMode?: "cupon" | "salary";
  lunchAllowanceDaysCount?: number;
  includeLunchAllowanceInJune?: boolean;
  oneHalfMonthTwelfthsLumpSumMonth?: OneHalfMonthTwelfthsLumpSumMonth;
  // Monthly "isenção de horário" supplement (Art. 218.º–219.º + 265.º CT).
  // Taxed and SS-deducted like base salary; counted in subsídio de férias
  // but NOT in subsídio de Natal.
  isencaoHorarioMonthly?: number;
}

export type SimulateDependentWorkerMonthlyIncomeSweepOptions =
  Omit<SimulateDependentWorkerOptions, "income"> & {
    month: MonthName;
  } & {
  monthlyIncomes: number[];
  yearlyIncomes?: never;
};

export type SimulateDependentWorkerYearlyIncomeSweepOptions =
  Omit<SimulateDependentWorkerOptions, "income"> & {
    month: MonthName;
  } & {
  yearlyIncomes: number[];
  monthlyIncomes?: never;
};

export type SimulateDependentWorkerIncomeSweepOptions =
  | SimulateDependentWorkerMonthlyIncomeSweepOptions
  | SimulateDependentWorkerYearlyIncomeSweepOptions;

export interface IncomeComponentAmountBreakdown {
  totalAmount: number;
  fromBaseSalaryAmount: number;
  fromLunchAllowanceAmount: number;
  fromSubsidyTwelfthsAmount: number;
}

export interface GrossIncomeAmountBreakdown {
  baseSalaryAmount: number;
  baseSalaryAndLunchAllowanceAmount: number;
  totalWithLunchAllowanceAndSubsidyTwelfthsAmount: number;
}

export interface LunchAllowanceAmountBreakdown {
  grossAmount: number;
  taxableAmount: number;
  taxExemptAmount: number;
  isPaidInThisMonth: boolean;
}

export interface SubsidyTwelfthsAmountBreakdown {
  distributedMonthlyAmount: number;
  lumpSumAmount: number;
  totalAmount: number;
}

export interface BracketResult {
  signal: "max" | "min";
  limit: number;
  max_marginal_rate: number;
  deduction: number;
  var1_deduction: number;
  var2_deduction: number;
  dependent_aditional_deduction: number;
  effective_mensal_rate: number;
}

export interface TaxRetentionTableResult {
  situation: string;
  description: string;
  brackets: BracketResult[];
  dependent_disabled_addition_deduction?: number;
}

export interface MonthlyBreakdownResult {
  month: MonthName;
  period: PeriodT;
  taxableIncomeForIrsCalculation: number;
  incomeSubjectToIrsAndSocialSecurity: number;
  grossIncome: GrossIncomeAmountBreakdown;
  irsWithholdingTax: IncomeComponentAmountBreakdown;
  socialSecurityContribution: IncomeComponentAmountBreakdown;
  netIncome: IncomeComponentAmountBreakdown;
  lunchAllowance: LunchAllowanceAmountBreakdown;
  subsidyTwelfths: SubsidyTwelfthsAmountBreakdown;
  bracket: BracketResult;
  taxRetentionTable: TaxRetentionTableResult;
}

export interface YearlyDependentWorkerSummary {
  totalGrossIncomeAmount: number;
  totalNetIncomeAmount: number;
  totalLunchAllowanceGrossAmount: number;
}

export interface DependentWorkerResult {
  yearly: YearlyDependentWorkerSummary;
  socialSecurityContributionRate: number;
  monthlyBreakdown: MonthlyBreakdownResult[];
}

export interface IncomeSweepPoint {
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
