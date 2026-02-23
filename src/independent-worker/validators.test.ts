import { describe, it, expect } from "vitest";
import {
  validateIncome,
  validateIncomeFrequency,
  validateNrDaysOff,
  validateYearBusinessDays,
  validateSsDiscount,
  validateMaxExpensesTax,
  validateExpenses,
  validateSsTax,
  validateCurrentTaxRankYear,
  validateRnhTax,
  validateYearOfYouthIrs,
  validateFirstAndSecondYear,
} from "@/independent-worker/validators";
import { FrequencyChoices } from "@/independent-worker/schemas";
import { YEAR_BUSINESS_DAYS_BY_TAX_YEAR } from "@/independent-worker/consts";

describe("Independent Worker Validators", () => {
  const defaultYearBusinessDays = YEAR_BUSINESS_DAYS_BY_TAX_YEAR[2026];

  describe("validateIncome", () => {
    it("should pass for valid positive income", () => {
      expect(() => validateIncome(1000)).not.toThrow();
      expect(() => validateIncome(0.01)).not.toThrow();
    });

    it("should throw for zero or negative income", () => {
      expect(() => validateIncome(0)).toThrow("Income must be greater than 0");
      expect(() => validateIncome(-100)).toThrow("Income must be greater than 0");
    });

    it("should throw for invalid numbers", () => {
      expect(() => validateIncome(NaN)).toThrow("Income must be a valid number");
      expect(() => validateIncome(Infinity)).toThrow("Income must be a valid number");
      expect(() => validateIncome(-Infinity)).toThrow("Income must be a valid number");
    });
  });

  describe("validateIncomeFrequency", () => {
    it("should pass for valid frequencies", () => {
      expect(() => validateIncomeFrequency(FrequencyChoices.Year)).not.toThrow();
      expect(() => validateIncomeFrequency(FrequencyChoices.Month)).not.toThrow();
      expect(() => validateIncomeFrequency(FrequencyChoices.Day)).not.toThrow();
    });

    it("should throw for invalid frequency", () => {
      expect(() => validateIncomeFrequency("invalid" as any)).toThrow("Invalid income frequency");
    });
  });

  describe("validateNrDaysOff", () => {
    it("should pass for valid non-negative integers", () => {
      expect(() => validateNrDaysOff(0, defaultYearBusinessDays)).not.toThrow();
      expect(() => validateNrDaysOff(5, defaultYearBusinessDays)).not.toThrow();
      expect(() => validateNrDaysOff(20, defaultYearBusinessDays)).not.toThrow();
    });

    it("should throw for negative values", () => {
      expect(() => validateNrDaysOff(-1, defaultYearBusinessDays)).toThrow("Number of days off cannot be negative");
    });

    it("should throw for non-integers", () => {
      expect(() => validateNrDaysOff(5.5, defaultYearBusinessDays)).toThrow("Number of days off must be an integer");
    });

    it("should throw for values >= resolved year business days", () => {
      expect(() => validateNrDaysOff(defaultYearBusinessDays, defaultYearBusinessDays)).toThrow(
        `Number of days off cannot be greater than or equal to ${defaultYearBusinessDays}`
      );
      expect(() => validateNrDaysOff(defaultYearBusinessDays + 1, defaultYearBusinessDays)).toThrow(
        `Number of days off cannot be greater than or equal to ${defaultYearBusinessDays}`
      );
    });

    it("should validate against custom year business days", () => {
      expect(() => validateNrDaysOff(249, 250)).not.toThrow();
      expect(() => validateNrDaysOff(250, 250)).toThrow(
        "Number of days off cannot be greater than or equal to 250"
      );
    });
  });

  describe("validateYearBusinessDays", () => {
    it("should pass for valid year business days", () => {
      expect(() => validateYearBusinessDays(1)).not.toThrow();
      expect(() => validateYearBusinessDays(248)).not.toThrow();
      expect(() => validateYearBusinessDays(252)).not.toThrow();
    });

    it("should throw for invalid values", () => {
      expect(() => validateYearBusinessDays(0)).toThrow(
        "Year business days must be greater than 0"
      );
      expect(() => validateYearBusinessDays(-1)).toThrow(
        "Year business days must be greater than 0"
      );
      expect(() => validateYearBusinessDays(12.5)).toThrow(
        "Year business days must be an integer"
      );
      expect(() => validateYearBusinessDays(Number.NaN)).toThrow(
        "Year business days must be a valid number"
      );
    });
  });

  describe("validateSsDiscount", () => {
    it("should pass for valid discount values", () => {
      expect(() => validateSsDiscount(0)).not.toThrow();
      expect(() => validateSsDiscount(0.1)).not.toThrow();
      expect(() => validateSsDiscount(-0.1)).not.toThrow();
      expect(() => validateSsDiscount(0.25)).not.toThrow();
      expect(() => validateSsDiscount(-0.25)).not.toThrow();
    });

    it("should throw for invalid numbers", () => {
      expect(() => validateSsDiscount(NaN)).toThrow("SS discount must be a valid number");
      expect(() => validateSsDiscount(Infinity)).toThrow("SS discount must be a valid number");
    });

    it("should throw for values outside range", () => {
      expect(() => validateSsDiscount(0.6)).toThrow("SS discount must be between -0.25 and 0.25");
      expect(() => validateSsDiscount(-0.6)).toThrow("SS discount must be between -0.25 and 0.25");
    });
  });

  

  describe("validateMaxExpensesTax", () => {
    it("should pass for valid non-negative values", () => {
      expect(() => validateMaxExpensesTax(0)).not.toThrow();
      expect(() => validateMaxExpensesTax(15)).not.toThrow();
      expect(() => validateMaxExpensesTax(25)).not.toThrow();
    });

    it("should throw for negative values", () => {
      expect(() => validateMaxExpensesTax(-1)).toThrow("Max expenses tax cannot be negative");
    });

    it("should throw for invalid numbers", () => {
      expect(() => validateMaxExpensesTax(NaN)).toThrow("Max expenses tax must be a valid number");
    });
  });

  describe("validateExpenses", () => {
    it("should pass for valid non-negative values", () => {
      expect(() => validateExpenses(0)).not.toThrow();
      expect(() => validateExpenses(1000)).not.toThrow();
      expect(() => validateExpenses(5000)).not.toThrow();
    });

    it("should throw for negative values", () => {
      expect(() => validateExpenses(-1)).toThrow("Expenses cannot be negative");
    });

    it("should throw for invalid numbers", () => {
      expect(() => validateExpenses(NaN)).toThrow("Expenses must be a valid number");
    });
  });

  describe("validateSsTax", () => {
    it("should pass for valid non-negative values", () => {
      expect(() => validateSsTax(0)).not.toThrow();
      expect(() => validateSsTax(0.214)).not.toThrow();
      expect(() => validateSsTax(0.25)).not.toThrow();
    });

    it("should throw for negative values", () => {
      expect(() => validateSsTax(-0.1)).toThrow("SS tax cannot be negative");
    });

    it("should throw for invalid numbers", () => {
      expect(() => validateSsTax(NaN)).toThrow("SS tax must be a valid number");
    });
  });

  describe("validateCurrentTaxRankYear", () => {
    it("should pass for valid years", () => {
      expect(() => validateCurrentTaxRankYear(2023)).not.toThrow();
      expect(() => validateCurrentTaxRankYear(2024)).not.toThrow();
      expect(() => validateCurrentTaxRankYear(2025)).not.toThrow();
      expect(() => validateCurrentTaxRankYear(2026)).not.toThrow();
    });

    it("should throw for invalid years", () => {
      // @ts-expect-error: 2022 is not assignable to the expected type, but we want to test runtime validation
      expect(() => validateCurrentTaxRankYear(2022)).toThrow("Invalid tax rank year");
      // @ts-expect-error: 2027 is not assignable to the expected type, but we want to test runtime validation
      expect(() => validateCurrentTaxRankYear(2027)).toThrow("Invalid tax rank year");
    });
  });

  describe("validateRnhTax", () => {
    it("should pass for valid non-negative values", () => {
      expect(() => validateRnhTax(0)).not.toThrow();
      expect(() => validateRnhTax(0.2)).not.toThrow();
      expect(() => validateRnhTax(0.25)).not.toThrow();
    });

    it("should throw for negative values", () => {
      expect(() => validateRnhTax(-0.1)).toThrow("RNH tax cannot be negative");
    });

    it("should throw for invalid numbers", () => {
      expect(() => validateRnhTax(NaN)).toThrow("RNH tax must be a valid number");
    });
  });

  describe("validateYearOfYouthIrs", () => {
    it("should pass for valid years in 2025", () => {
      expect(() => validateYearOfYouthIrs(1, 2025)).not.toThrow();
      expect(() => validateYearOfYouthIrs(5, 2025)).not.toThrow();
      expect(() => validateYearOfYouthIrs(10, 2025)).not.toThrow();
    });

    it("should pass for valid years in 2026", () => {
      expect(() => validateYearOfYouthIrs(1, 2026)).not.toThrow();
      expect(() => validateYearOfYouthIrs(5, 2026)).not.toThrow();
      expect(() => validateYearOfYouthIrs(10, 2026)).not.toThrow();
    });

    it("should pass for valid years in 2024", () => {
      expect(() => validateYearOfYouthIrs(1, 2024)).not.toThrow();
      expect(() => validateYearOfYouthIrs(5, 2024)).not.toThrow();
    });

    it("should pass for valid years in 2023", () => {
      expect(() => validateYearOfYouthIrs(1, 2023)).not.toThrow();
      expect(() => validateYearOfYouthIrs(5, 2023)).not.toThrow();
    });

    it("should throw for invalid years", () => {
      expect(() => validateYearOfYouthIrs(0, 2025)).toThrow("Year of youth IRS must be between 1 and 10");
      expect(() => validateYearOfYouthIrs(11, 2025)).toThrow("Year of youth IRS must be between 1 and 10");
      expect(() => validateYearOfYouthIrs(11, 2026)).toThrow("Year of youth IRS must be between 1 and 10");
      expect(() => validateYearOfYouthIrs(6, 2024)).toThrow("Year of youth IRS must be between 1 and 5");
    });

    it("should throw for non-integers", () => {
      expect(() => validateYearOfYouthIrs(1.5, 2025)).toThrow("Year of youth IRS must be an integer");
    });
  });

  describe("validateFirstAndSecondYear", () => {
    it("should pass when only first year is true", () => {
      expect(() => validateFirstAndSecondYear(true, false)).not.toThrow();
    });

    it("should pass when only second year is true", () => {
      expect(() => validateFirstAndSecondYear(false, true)).not.toThrow();
    });

    it("should pass when both are false", () => {
      expect(() => validateFirstAndSecondYear(false, false)).not.toThrow();
    });

    it("should throw when both are true", () => {
      expect(() => validateFirstAndSecondYear(true, true)).toThrow("Cannot be both first year and second year at the same time");
    });
  });
});
