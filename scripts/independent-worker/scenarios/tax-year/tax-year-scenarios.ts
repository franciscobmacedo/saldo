import { FrequencyChoices } from "../../../../src/independent-worker/schemas";
import { IndependentWorkerTestScenario } from "../../types";

/**
 * Tax Year Scenarios
 * 
 * These scenarios test the same income levels and configurations across different tax years
 * (2023, 2024, 2025) to enable year-over-year comparison and validate tax table changes.
 * 
 * Key scenarios replicated across tax years:
 * - Low income scenarios (€15,000, €20,000)
 * - Medium income scenarios (€30,000)
 * - High income scenarios (€50,000)
 * - Expense scenarios (€25,000 with expenses)
 * - Youth IRS scenarios (€15,000 with Youth IRS)
 * - RNH scenarios (€40,000 with RNH)
 * - Frequency variations (monthly, daily)
 */

export const taxYearScenarios: IndependentWorkerTestScenario[] = [
  // ============================================================
  // 2024 TAX TABLES (Previous Year)
  // ============================================================
  
  // Low Income Scenarios - 2024
  {
    name: "2024: Low income independent worker with €15,000 yearly income",
    observations: "2024 tax tables - Testing lower tax brackets with previous year's rates",
    params: {
      income: 15000,
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
    name: "2024: Basic independent worker with €20,000 yearly income",
    observations: "2024 tax tables - Standard scenario with default parameters for a mid-level freelancer",
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
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  
  // Medium Income Scenarios - 2024
  {
    name: "2024: Basic independent worker with €30,000 yearly income",
    observations: "2024 tax tables - Higher income scenario to test different tax brackets",
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
  
  // High Income Scenarios - 2024
  {
    name: "2024: Independent worker with €50,000 yearly income",
    observations: "2024 tax tables - High income scenario to test higher tax brackets",
    params: {
      income: 50000,
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
  
  // Expense Scenarios - 2024
  {
    name: "2024: Independent worker with €25,000 yearly income and €3,000 expenses",
    observations: "2024 tax tables - Scenario with declared expenses to test expense deductions",
    params: {
      income: 25000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 3000,
      ssTax: 0.214,
      currentTaxRankYear: 2024,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  
  // Monthly Frequency - 2024
  {
    name: "2024: Independent worker with €2,000 monthly income",
    observations: "2024 tax tables - Monthly frequency scenario for regular monthly contractors",
    params: {
      income: 2000,
      incomeFrequency: FrequencyChoices.Month,
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
  
  // Daily Frequency - 2024
  {
    name: "2024: Independent worker with €100 daily income",
    observations: "2024 tax tables - Daily frequency scenario for daily contractors with some days off",
    params: {
      income: 100,
      incomeFrequency: FrequencyChoices.Day,
      nrDaysOff: 30,
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
  
  // Youth IRS - 2024
  {
    name: "2024: Young independent worker with €15,000 yearly income and Youth IRS benefits",
    observations: "2024 tax tables - Scenario with Youth IRS benefits for workers under 35",
    params: {
      income: 15000,
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
      yearOfYouthIrs: 2,
    },
  },
  
  // RNH - 2024
  {
    name: "2024: Independent worker with €40,000 yearly income under RNH regime",
    observations: "2024 tax tables - Scenario with RNH (Resident Non-Habitual) tax benefits",
    params: {
      income: 40000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2024,
      rnh: true,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // ============================================================
  // 2023 TAX TABLES (Historical)
  // ============================================================
  
  // Low Income Scenarios - 2023
  {
    name: "2023: Low income independent worker with €15,000 yearly income",
    observations: "2023 tax tables - Historical comparison - Testing lower tax brackets",
    params: {
      income: 15000,
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
    name: "2023: Basic independent worker with €20,000 yearly income",
    observations: "2023 tax tables - Historical comparison - Standard scenario for a mid-level freelancer",
    params: {
      income: 20000,
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
  
  // Medium Income Scenarios - 2023
  {
    name: "2023: Basic independent worker with €30,000 yearly income",
    observations: "2023 tax tables - Historical comparison - Higher income scenario to test different tax brackets",
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
  
  // High Income Scenarios - 2023
  {
    name: "2023: Independent worker with €50,000 yearly income",
    observations: "2023 tax tables - Historical comparison - High income scenario to test higher tax brackets",
    params: {
      income: 50000,
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
  
  // Expense Scenarios - 2023
  {
    name: "2023: Independent worker with €25,000 yearly income and €3,000 expenses",
    observations: "2023 tax tables - Historical comparison - Scenario with declared expenses to test expense deductions",
    params: {
      income: 25000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 3000,
      ssTax: 0.214,
      currentTaxRankYear: 2023,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  
  // Monthly Frequency - 2023
  {
    name: "2023: Independent worker with €2,000 monthly income",
    observations: "2023 tax tables - Historical comparison - Monthly frequency scenario for regular monthly contractors",
    params: {
      income: 2000,
      incomeFrequency: FrequencyChoices.Month,
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
  
  // Daily Frequency - 2023
  {
    name: "2023: Independent worker with €100 daily income",
    observations: "2023 tax tables - Historical comparison - Daily frequency scenario for daily contractors with some days off",
    params: {
      income: 100,
      incomeFrequency: FrequencyChoices.Day,
      nrDaysOff: 30,
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
  
  // Youth IRS - 2023
  {
    name: "2023: Young independent worker with €15,000 yearly income and Youth IRS benefits",
    observations: "2023 tax tables - Historical comparison - Scenario with Youth IRS benefits for workers under 35",
    params: {
      income: 15000,
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
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 2,
    },
  },
  
  // RNH - 2023
  {
    name: "2023: Independent worker with €40,000 yearly income under RNH regime",
    observations: "2023 tax tables - Historical comparison - Scenario with RNH (Resident Non-Habitual) tax benefits",
    params: {
      income: 40000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2023,
      rnh: true,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // ============================================================
  // YEAR-OVER-YEAR CHANGE IMPACT ANALYSIS
  // ============================================================
  // These scenarios help analyze the impact of tax table changes
  // across different income levels and configurations
  
  // Low Income Year-over-Year Comparison
  {
    name: "Year-over-year comparison: €15,000 income (2023 vs 2024 vs 2025)",
    observations: "Comparing tax impact across years for low income - helps identify tax bracket changes",
    params: {
      income: 15000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025, // Note: Run this scenario 3 times with 2023, 2024, 2025
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  
  // Medium Income Year-over-Year Comparison
  {
    name: "Year-over-year comparison: €30,000 income (2023 vs 2024 vs 2025)",
    observations: "Comparing tax impact across years for medium income - helps identify tax bracket changes",
    params: {
      income: 30000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025, // Note: Run this scenario 3 times with 2023, 2024, 2025
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  
  // High Income Year-over-Year Comparison
  {
    name: "Year-over-year comparison: €50,000 income (2023 vs 2024 vs 2025)",
    observations: "Comparing tax impact across years for high income - helps identify tax bracket changes",
    params: {
      income: 50000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025, // Note: Run this scenario 3 times with 2023, 2024, 2025
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  
  // Youth IRS Year-over-Year Comparison
  {
    name: "Year-over-year comparison: €15,000 income with Youth IRS (2023 vs 2024 vs 2025)",
    observations: "Comparing Youth IRS benefits impact across years - helps identify benefit changes",
    params: {
      income: 15000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025, // Note: Run this scenario 3 times with 2023, 2024, 2025
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 2,
    },
  },
  
  // RNH Year-over-Year Comparison
  {
    name: "Year-over-year comparison: €40,000 income with RNH (2023 vs 2024 vs 2025)",
    observations: "Comparing RNH regime impact across years - helps identify RNH tax rate changes",
    params: {
      income: 40000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025, // Note: Run this scenario 3 times with 2023, 2024, 2025
      rnh: true,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  
  // Expense Scenario Year-over-Year Comparison
  {
    name: "Year-over-year comparison: €25,000 income with €3,000 expenses (2023 vs 2024 vs 2025)",
    observations: "Comparing expense deduction impact across years - helps identify deduction changes",
    params: {
      income: 25000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 3000,
      ssTax: 0.214,
      currentTaxRankYear: 2025, // Note: Run this scenario 3 times with 2023, 2024, 2025
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
];

