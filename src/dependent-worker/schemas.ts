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
  taxable_income: number;
  gross_income: number;
  tax: number;
  social_security: number;
  social_security_tax: number;
  net_salary: number;
  yearly_net_salary: number;
  yearly_gross_salary: number;
  lunch_allowance: LunchAllowance;
}
