import { FrequencyChoices } from "../../../../src/independent-worker/schemas";
import { IndependentWorkerTestScenario } from "../../types";

export const incomeLevelScenarios: IndependentWorkerTestScenario[] = [
  // Low Income Scenarios (€5,000 - €15,000)
  {
    name: "Very low income independent worker with €5,000 yearly income",
    observations: "Testing minimum thresholds and lower tax brackets",
    params: {
      income: 5000,
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
    },
  },
  {
    name: "Low income independent worker with €10,000 yearly income",
    observations: "Testing lower tax brackets and minimum income scenarios",
    params: {
      income: 10000,
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
    },
  },

  // Medium Income Scenarios (€20,000 - €35,000)
  {
    name: "Senior freelancer with €35,000 yearly income",
    observations: "Testing medium-high income scenarios and tax bracket transitions",
    params: {
      income: 35000,
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
    },
  },

  // High Income Scenarios (€40,000 - €80,000)
  {
    name: "Premium consultant with €60,000 yearly income",
    observations: "Testing higher tax brackets and premium income scenarios",
    params: {
      income: 60000,
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
    },
  },
  {
    name: "Top earner independent worker with €80,000 yearly income",
    observations: "Testing maximum income scenarios and higher tax brackets",
    params: {
      income: 80000,
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
    },
  },

  // Maximum Income Scenarios (€100,000+)
  {
    name: "Very high income independent worker with €100,000 yearly income",
    observations: "Testing caps and limits for very high income scenarios",
    params: {
      income: 100000,
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
    },
  },
  {
    name: "Maximum income independent worker with €150,000 yearly income",
    observations: "Boundary testing for maximum income scenarios and tax bracket limits",
    params: {
      income: 150000,
      incomeFrequency: FrequencyChoices.Year,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      dateOfOpeningActivity: null,
      benefitsOfYouthIrs: false,
    },
  },
];

