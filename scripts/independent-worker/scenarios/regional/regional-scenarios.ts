import { FrequencyChoices } from "../../../../src/independent-worker/schemas";
import { IndependentWorkerTestScenario } from "../../types";

export const regionalScenarios: IndependentWorkerTestScenario[] = [
  // ============================================================
  // FULL YEAR 2025 SCENARIOS
  // ============================================================
  
  {
    name: "Full year 2025 - €30,000 yearly income",
    observations: "Standard full year scenario with 2025 tax tables",
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
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Full year 2025 - €50,000 yearly income",
    observations: "High income full year scenario with 2025 tax tables",
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
      dateOfOpeningAcivity: null,
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Full year 2025 - Activity opened January 1st",
    observations: "Activity opened at start of year - full year benefits",
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

  // ============================================================
  // JANUARY-JULY 2025 PERIOD SCENARIOS
  // ============================================================
  
  // Activity opened in January - represents Jan-July period (7 months)
  {
    name: "January-July 2025 period - Activity opened January 1st with €2,000/month",
    observations: "First 7 months of 2025 - €14,000 yearly equivalent (7 months × €2,000)",
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
      dateOfOpeningAcivity: new Date(2025, 0, 1), // January 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "January-July 2025 period - Activity opened January 15th with €3,000/month",
    observations: "First 7 months of 2025 - €21,000 yearly equivalent (7 months × €3,000)",
    params: {
      income: 3000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 0, 15), // January 15, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "January-July 2025 period - Activity opened mid-January with €4,000/month",
    observations: "First 7 months of 2025 - €28,000 yearly equivalent (7 months × €4,000)",
    params: {
      income: 4000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 0, 10), // January 10, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "January-July 2025 period - Low income €1,500/month",
    observations: "First 7 months of 2025 - €10,500 yearly equivalent (7 months × €1,500)",
    params: {
      income: 1500,
      incomeFrequency: FrequencyChoices.Month,
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
    name: "January-July 2025 period - High income €5,000/month",
    observations: "First 7 months of 2025 - €35,000 yearly equivalent (7 months × €5,000)",
    params: {
      income: 5000,
      incomeFrequency: FrequencyChoices.Month,
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
    name: "January-July 2025 period - Daily rate €100/day with 10 days off",
    observations: "First 7 months of 2025 - daily rate scenario",
    params: {
      income: 100,
      incomeFrequency: FrequencyChoices.Day,
      nrDaysOff: 10,
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

  // ============================================================
  // AUGUST-DECEMBER 2025 PERIOD SCENARIOS
  // ============================================================
  
  // Activity opened in August - represents Aug-Dec period (5 months)
  {
    name: "August-December 2025 period - Activity opened August 1st with €2,000/month",
    observations: "Last 5 months of 2025 - €10,000 yearly equivalent (5 months × €2,000)",
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
      dateOfOpeningAcivity: new Date(2025, 7, 1), // August 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "August-December 2025 period - Activity opened August 15th with €3,000/month",
    observations: "Last 5 months of 2025 - €15,000 yearly equivalent (5 months × €3,000)",
    params: {
      income: 3000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 7, 15), // August 15, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "August-December 2025 period - Activity opened mid-August with €4,000/month",
    observations: "Last 5 months of 2025 - €20,000 yearly equivalent (5 months × €4,000)",
    params: {
      income: 4000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 7, 10), // August 10, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "August-December 2025 period - Low income €1,500/month",
    observations: "Last 5 months of 2025 - €7,500 yearly equivalent (5 months × €1,500)",
    params: {
      income: 1500,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 7, 1), // August 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "August-December 2025 period - High income €5,000/month",
    observations: "Last 5 months of 2025 - €25,000 yearly equivalent (5 months × €5,000)",
    params: {
      income: 5000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 7, 1), // August 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "August-December 2025 period - Daily rate €150/day with 15 days off",
    observations: "Last 5 months of 2025 - daily rate scenario",
    params: {
      income: 150,
      incomeFrequency: FrequencyChoices.Day,
      nrDaysOff: 15,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 7, 1), // August 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // ============================================================
  // MID-YEAR PERIOD SCENARIOS
  // ============================================================
  
  {
    name: "Mid-year period - Activity opened April 1st with €2,500/month",
    observations: "Mid-year start (April) - 9 months of 2025 - €22,500 yearly equivalent",
    params: {
      income: 2500,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 3, 1), // April 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Mid-year period - Activity opened May 15th with €3,500/month",
    observations: "Mid-year start (May) - 7.5 months of 2025 - €26,250 yearly equivalent",
    params: {
      income: 3500,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 4, 15), // May 15, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Mid-year period - Activity opened June 1st with €4,000/month",
    observations: "Mid-year start (June) - 7 months of 2025 - €28,000 yearly equivalent",
    params: {
      income: 4000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 5, 1), // June 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Mid-year period - Activity opened July 1st with €2,000/month",
    observations: "Mid-year start (July) - 6 months of 2025 - €12,000 yearly equivalent",
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
      dateOfOpeningAcivity: new Date(2025, 6, 1), // July 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Mid-year period - Activity opened September 1st with €3,000/month",
    observations: "Mid-year start (September) - 4 months of 2025 - €12,000 yearly equivalent",
    params: {
      income: 3000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 8, 1), // September 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Mid-year period - Activity opened October 15th with €2,500/month",
    observations: "Mid-year start (October) - 2.5 months of 2025 - €6,250 yearly equivalent",
    params: {
      income: 2500,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 9, 15), // October 15, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // ============================================================
  // LATE YEAR PERIOD SCENARIOS
  // ============================================================
  
  {
    name: "Late year period - Activity opened November 1st with €3,000/month",
    observations: "Late year start (November) - 2 months of 2025 - €6,000 yearly equivalent",
    params: {
      income: 3000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 10, 1), // November 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Late year period - Activity opened November 15th with €4,000/month",
    observations: "Late year start (November) - 1.5 months of 2025 - €6,000 yearly equivalent",
    params: {
      income: 4000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 10, 15), // November 15, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Late year period - Activity opened December 1st with €5,000/month",
    observations: "Late year start (December) - 1 month of 2025 - €5,000 yearly equivalent",
    params: {
      income: 5000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 11, 1), // December 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Late year period - Activity opened December 15th with €6,000/month",
    observations: "Late year start (December) - 0.5 months of 2025 - €3,000 yearly equivalent",
    params: {
      income: 6000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 11, 15), // December 15, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "Late year period - Activity opened December 31st with €2,000/month",
    observations: "Activity opened on last day of year - minimal period",
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
      dateOfOpeningAcivity: new Date(2025, 11, 31), // December 31, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // ============================================================
  // PERIOD SCENARIOS WITH EXPENSES
  // ============================================================
  
  {
    name: "January-July 2025 period with €3,000 expenses",
    observations: "First 7 months with organized accounting expenses",
    params: {
      income: 2500,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 3000,
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
    name: "August-December 2025 period with €2,000 expenses",
    observations: "Last 5 months with organized accounting expenses",
    params: {
      income: 3000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 2000,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 7, 1), // August 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },

  // ============================================================
  // PERIOD SCENARIOS WITH YOUTH IRS
  // ============================================================
  
  {
    name: "January-July 2025 period with Youth IRS benefits (year 2)",
    observations: "First 7 months with Youth IRS 25% discount",
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
      dateOfOpeningAcivity: new Date(2025, 0, 1), // January 1, 2025
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 2,
    },
  },
  {
    name: "August-December 2025 period with Youth IRS benefits (year 1)",
    observations: "Last 5 months with Youth IRS 50% discount",
    params: {
      income: 3000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: false,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 7, 1), // August 1, 2025
      benefitsOfYouthIrs: true,
      yearOfYouthIrs: 1,
    },
  },

  // ============================================================
  // PERIOD SCENARIOS WITH RNH
  // ============================================================
  
  {
    name: "January-July 2025 period with RNH regime",
    observations: "First 7 months with RNH 20% flat tax rate",
    params: {
      income: 4000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: true,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 0, 1), // January 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
  {
    name: "August-December 2025 period with RNH regime",
    observations: "Last 5 months with RNH 20% flat tax rate",
    params: {
      income: 5000,
      incomeFrequency: FrequencyChoices.Month,
      nrDaysOff: 0,
      ssDiscount: 0,
      maxExpensesTax: 15,
      expenses: 0,
      ssTax: 0.214,
      currentTaxRankYear: 2025,
      rnh: true,
      rnhTax: 0.2,
      dateOfOpeningAcivity: new Date(2025, 7, 1), // August 1, 2025
      benefitsOfYouthIrs: false,
      yearOfYouthIrs: 1,
    },
  },
];

