import { FrequencyChoices } from "../../../../src/independent-worker/schemas";
import { IndependentWorkerTestScenario } from "../../types";

export const basicIndependentWorkerScenarios: IndependentWorkerTestScenario[] = [
  // Basic yearly income scenarios
  {
    name: "Basic independent worker with €20,000 yearly income",
    observations: "Standard scenario with default parameters for a mid-level freelancer",
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
      dateOfOpeningActivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Basic independent worker with €30,000 yearly income",
    observations: "Higher income scenario to test different tax brackets",
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
      dateOfOpeningActivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Independent worker with €50,000 yearly income",
    observations: "High income scenario to test higher tax brackets",
  
    params: {
      income: 50000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningActivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  
  // Monthly income scenarios
  {
    name: "Independent worker with €2,000 monthly income",
    observations: "Monthly frequency scenario for regular monthly contractors",
    params: {
      income: 2000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningActivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // Daily income scenarios
  {
    name: "Independent worker with €100 daily income",
    observations: "Daily frequency scenario for daily contractors with some days off",
  
    params: {
      income: 100,
      incomeFrequency: FrequencyChoices.Day,
      nrDaysOff: 30,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningActivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // // Scenario with expenses
  {
    name: "Independent worker with €25,000 yearly income and €3,000 expenses",
    observations: "Scenario with declared expenses to test expense deductions",
  
    params: {
      income: 25000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 3000,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningActivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // Youth IRS scenario
  {
    name: "Young independent worker with €15,000 yearly income and Youth IRS benefits",
    observations: "Scenario with Youth IRS benefits for workers under 35",
 
    params: {
      income: 15000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      dateOfOpeningActivity: null,
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 2,
    },
  },

  // RNH scenario
  {
    name: "Independent worker with €40,000 yearly income under RNH regime",
    observations: "Scenario with RNH (Resident Non-Habitual) tax benefits",
  
    params: {
      income: 40000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: true,
      rnhTax: 0.2,
      dateOfOpeningActivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
];
