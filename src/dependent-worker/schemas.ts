import { LunchAllowance } from "./lunch-allowance";
import { LocationT, PeriodT } from "@/config/schemas";

export enum Twelfths {
  NONE = 0, // No twelfths
  ONE_HALF_MONTH = 0.5, // 1x50% - One allowance at 50% (half month)
  ONE_MONTH = 1, // 2x50% - Two allowances at 50% each (one month total)
  TWO_MONTHS = 2, // 2x100% - Two allowances at 100% each (two months total)
}


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
    socialSecurityTaxRate?: number;
    twelfths?: Twelfths;
    lunchAllowanceDailyValue?: number;
    lunchAllowanceMode?: "cupon" | "salary";
    lunchAllowanceDaysCount?: number;
  }
  

export interface DependentWorkerResult {
  taxableIncome: number;
  grossIncome: number;
  tax: number;
  socialSecurity: number;
  socialSecurityTax: number;
  netSalary: number;
  yearlyNetSalary: number;
  yearlyGrossSalary: number;
  lunchAllowance: LunchAllowance;
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
