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
  income: number;
  married?: boolean;
  disabled?: boolean;
  partnerDisabled?: boolean;
  location?: LocationT;
  numberOfHolders?: number | null;
  numberOfDependents?: number | null;
  numberOfDependentsDisabled?: number | null;
  period?: PeriodT;
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

export type MonthlyDependentWorkerSummary = Omit<
  MonthlyBreakdownResult,
  "month"
>;

export interface DependentWorkerResult {
  /** Most complete month with all salary components (without month name) */
  monthly: MonthlyDependentWorkerSummary;
  yearly: YearlyDependentWorkerSummary;
  socialSecurityContributionRate: number;
  monthlyBreakdown: MonthlyBreakdownResult[];

  bracket: {
    signal: "max" | "min";
    limit: number;
    max_marginal_rate: number;
    deduction: number;
    var1_deduction: number;
    var2_deduction: number;
    dependent_aditional_deduction: number;
    effective_mensal_rate: number;
  };
  taxRetentionTable: {
    situation: string;
    description: string;
    brackets: {
      signal: "max" | "min";
      limit: number;
      max_marginal_rate: number;
      deduction: number;
      var1_deduction: number;
      var2_deduction: number;
      dependent_aditional_deduction: number;
      effective_mensal_rate: number;
    }[];
    dependent_disabled_addition_deduction?: number;
  };
}
