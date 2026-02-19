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
}

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
