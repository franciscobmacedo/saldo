import {
  FrequencyChoices,
  IndependentWorkerReceipt,
} from "./schemas";
import { SUPPORTED_TAX_RANK_YEARS } from "@/data/tax-ranks-data";

export function validateIncome(income: number | number[] | IndependentWorkerReceipt[][]): void {
  if (Array.isArray(income)) {
    if (income.length !== 12) {
      throw new Error("Income array must have exactly 12 elements");
    }
    income.forEach((val) => {
      if (Array.isArray(val)) {
        val.forEach((receipt) => {
          if (!Number.isFinite(receipt.income)) {
            throw new Error("Receipt income must be a valid number");
          }
          if (receipt.income < 0) {
            throw new Error("Receipt income must be greater than or equal to 0");
          }
          if (receipt.retention !== undefined) {
            if (!Number.isFinite(receipt.retention)) {
              throw new Error("Receipt retention must be a valid number");
            }
            if (receipt.retention < 0 || receipt.retention > 1) {
              throw new Error("Receipt retention must be between 0 and 1");
            }
          }
        });
      } else {
        if (!Number.isFinite(val as number)) {
          throw new Error("Income must be a valid number");
        }
        if ((val as number) < 0) {
          throw new Error("Income must be greater than or equal to 0");
        }
      }
    });
  } else {
    if (!Number.isFinite(income)) {
      throw new Error("Income must be a valid number");
    }
    if (income < 0) {
      throw new Error("Income must be greater than or equal to 0");
    }
  }
}

export function validateIncomeFrequency(frequency: FrequencyChoices): void {
  if (!Object.values(FrequencyChoices).includes(frequency)) {
    throw new Error(`Invalid income frequency: ${frequency}. Must be one of: ${Object.values(FrequencyChoices).join(", ")}`);
  }
}

export function validateYearBusinessDays(yearBusinessDays: number): void {
  if (!Number.isFinite(yearBusinessDays)) {
    throw new Error("Year business days must be a valid number");
  }
  if (!Number.isInteger(yearBusinessDays)) {
    throw new Error("Year business days must be an integer");
  }
  if (yearBusinessDays <= 0) {
    throw new Error("Year business days must be greater than 0");
  }
}

export function validateNrDaysOff(
  nrDaysOff: number,
  yearBusinessDays: number
): void {
  if (nrDaysOff < 0) {
    throw new Error("Number of days off cannot be negative");
  }
  if (!Number.isInteger(nrDaysOff)) {
    throw new Error("Number of days off must be an integer");
  }
  if (nrDaysOff >= yearBusinessDays) {
    throw new Error(
      `Number of days off cannot be greater than or equal to ${yearBusinessDays}`
    );
  }
}

export function validateSsDiscount(ssDiscount: number): void {
  if (!Number.isFinite(ssDiscount)) {
    throw new Error("SS discount must be a valid number");
  }
  // Allow reasonable range for SS discount (-25% to +25%)
  if (ssDiscount < -0.25 || ssDiscount > 0.25) {
    throw new Error("SS discount must be between -0.25 and 0.25");
  }
}


export function validateMaxExpensesTax(maxExpensesTax: number): void {
  if (maxExpensesTax < 0) {
    throw new Error("Max expenses tax cannot be negative");
  }
  if (!Number.isFinite(maxExpensesTax)) {
    throw new Error("Max expenses tax must be a valid number");
  }
}

export function validateExpenses(expenses: number): void {
  if (expenses < 0) {
    throw new Error("Expenses cannot be negative");
  }
  if (!Number.isFinite(expenses)) {
    throw new Error("Expenses must be a valid number");
  }
}

export function validateSsTax(ssTax: number): void {
  if (ssTax < 0) {
    throw new Error("SS tax cannot be negative");
  }
  if (!Number.isFinite(ssTax)) {
    throw new Error("SS tax must be a valid number");
  }
}

export function validateCurrentTaxRankYear(year: typeof SUPPORTED_TAX_RANK_YEARS[number]): void {
  if (!SUPPORTED_TAX_RANK_YEARS.includes(year)) {
    throw new Error(`Invalid tax rank year: ${year}. Must be one of: ${SUPPORTED_TAX_RANK_YEARS.join(", ")}`);
  }
}

export function validateRnhTax(rnhTax: number): void {
  if (rnhTax < 0) {
    throw new Error("RNH tax cannot be negative");
  }
  if (!Number.isFinite(rnhTax)) {
    throw new Error("RNH tax must be a valid number");
  }
}

export function validateYearOfYouthIrs(
  year: number,
  currentTaxRankYear: typeof SUPPORTED_TAX_RANK_YEARS[number]
): void {
  const validRange = currentTaxRankYear >= 2025 ? 10 : 5;
  if (year < 1 || year > validRange) {
    throw new Error(`Year of youth IRS must be between 1 and ${validRange} for tax year ${currentTaxRankYear}`);
  }
  if (!Number.isInteger(year)) {
    throw new Error("Year of youth IRS must be an integer");
  }
}

export function validateFirstAndSecondYear(firstYear: boolean, secondYear: boolean): void {
  if (firstYear && secondYear) {
    throw new Error("Cannot be both first year and second year at the same time");
  }
}
