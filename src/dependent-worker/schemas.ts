import { LunchAllowance } from "./lunch-allowance";
import { LocationT } from "@/config/schemas";

export enum Twelfths {
  NONE = 0, // No twelfths
  ONE_MONTH = 1, // Christmas OR Holiday allowance in twelfths
  TWO_MONTHS = 2, // Christmas AND Holiday allowance in twelfths
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
    dateStart?: Date;
    dateEnd?: Date;
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
}
