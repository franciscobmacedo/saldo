import { FrequencyChoices } from "../../../../src/independent-worker/schemas";
import { IndependentWorkerTestScenario } from "../../types";
import { YEAR_BUSINESS_DAYS } from "../../../../src/independent-worker/consts";

export const errorScenarios: IndependentWorkerTestScenario[] = [
  // ============================================================
  // INVALID INPUT HANDLING - Boundary Values
  // ============================================================
  
  // Minimum valid income (just above zero)
  {
    name: "Minimum valid income: €0.01 yearly",
    observations: "Testing minimum income boundary - should handle very small values gracefully",
    params: {
      income: 0.01,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Minimum valid income: €1.00 yearly",
    observations: "Testing minimum realistic income - should calculate correctly",
    params: {
      income: 1.00,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Minimum valid income: €100 yearly",
    observations: "Testing very low income - should handle minimum thresholds",
    params: {
      income: 100,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // Maximum valid days off (just below limit)
  {
    name: "Maximum valid days off: 247 days (just below 248 limit)",
    observations: "Testing maximum days off boundary - should handle edge case gracefully",
    params: {
      income: 100,
      incomeFrequency: FrequencyChoices.Day,
      nrDaysOff: 247, // Just below YEAR_BUSINESS_DAYS (248)
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "High days off: 200 days with daily rate",
    observations: "Testing high days off scenario - should calculate correctly",
    params: {
      income: 150,
      incomeFrequency: FrequencyChoices.Day,
      nrDaysOff: 200,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // Maximum valid SS discount boundaries
  {
    name: "Maximum SS discount: 25% (0.25)",
    observations: "Testing maximum SS discount boundary - should handle upper limit",
    params: {
      income: 30000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0.25, // Maximum allowed
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Minimum SS discount: -25% (-0.25)",
    observations: "Testing minimum SS discount boundary - should handle lower limit",
    params: {
      income: 30000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: -0.25, // Minimum allowed
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // Maximum Youth IRS year boundaries
  {
    name: "Maximum Youth IRS year: 10 (for 2025)",
    observations: "Testing maximum Youth IRS year boundary for 2025 - should handle correctly",
    params: {
      income: 20000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 10, // Maximum for 2025
    },
  },
  {
    name: "Minimum Youth IRS year: 1",
    observations: "Testing minimum Youth IRS year boundary - should handle correctly",
    params: {
      income: 20000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 1, // Minimum
    },
  },

  // ============================================================
  // EDGE CASE ERROR CONDITIONS
  // ============================================================

  // Very high income scenarios (testing calculation limits)
  {
    name: "Very high income: €200,000 yearly",
    observations: "Testing very high income - should handle large numbers correctly",
    params: {
      income: 200000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Extremely high income: €500,000 yearly",
    observations: "Testing extremely high income - should handle very large numbers",
    params: {
      income: 500000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Very high income with RNH: €300,000 yearly",
    observations: "Testing very high income with RNH - should handle large numbers with RNH",
    params: {
      income: 300000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: true,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // Very high expenses scenarios
  {
    name: "Very high expenses: €50,000 on €100,000 income",
    observations: "Testing very high expenses - should handle large expense values",
    params: {
      income: 100000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 50000, // 50% of income
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Expenses equal to income: €30,000 expenses on €30,000 income",
    observations: "Testing expenses equal to income - edge case for taxable income calculation",
    params: {
      income: 30000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 30000, // 100% of income
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Expenses higher than simplified: €10,000 expenses on €20,000 income",
    observations: "Testing expenses significantly higher than simplified regime - should use organized",
    params: {
      income: 20000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 10000, // Higher than 15% simplified (€3,000)
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  
  
  // Date edge cases
  {
    name: "Activity opening on January 1st of current year",
    observations: "Testing activity opening on first day of year - should handle date boundary",
    params: {
      income: 30000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 0, 1), // January 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Activity opening on December 31st of previous year",
    observations: "Testing activity opening on last day of previous year - should handle second year benefits",
    params: {
      income: 30000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2024, 11, 31), // December 31, 2024
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Activity opening exactly 12 months ago",
    observations: "Testing activity opening exactly at 12-month boundary - should handle SS discount edge case",
    params: {
      income: 30000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: (() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());
      })(),
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // ============================================================
  // GRACEFUL DEGRADATION TESTING
  // ============================================================

  // Zero and near-zero scenarios
  {
    name: "Zero days off with daily rate",
    observations: "Testing zero days off with daily rate - maximum working days",
    params: {
      income: 150,
      incomeFrequency: FrequencyChoices.Day,
      nrDaysOff: 0, // Zero days off = all business days
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // Tax year variations
  {
    name: "2024 tax year with standard income",
    observations: "Testing 2024 tax year - should handle different tax years correctly",
    params: {
      income: 30000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2024,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "2023 tax year with standard income",
    observations: "Testing 2023 tax year - should handle historical tax years correctly",
    params: {
      income: 30000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2023,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "2024 tax year with maximum Youth IRS year (5)",
    observations: "Testing 2024 tax year with maximum Youth IRS year (5) - should handle different limits",
    params: {
      income: 20000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2024,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 5, // Maximum for 2024
    },
  },
];

