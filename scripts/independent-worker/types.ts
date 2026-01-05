import { SimulateIndependentWorkerOptions } from "../../src/independent-worker/schemas";

export interface IndependentWorkerApiResponse {
  status: string;
  result: {
    grossIncome: {
      year: number;
      month: number;
      day: number;
    };
    taxableIncome: number;
    ssPay: {
      year: number;
      month: number;
      day: number;
    };
    specificDeductions: number;
    expenses: number;
    expensesNeeded: number;
    youthIrsDiscount: number;
    irsPay: {
      year: number;
      month: number;
      day: number;
    };
    netIncome: {
      year: number;
      month: number;
      day: number;
    };
    taxRank: {
      id: number;
      min: number;
      max: number | null;
      normalTax: number;
      averageTax: number | null;
    };
    currentIas: number;
    maxSsIncome: number;
    ssTax: number;
    maxExpensesTax: number;
    workerWithinFirstFinancialYear: boolean;
    workerWithinSecondFinancialYear: boolean;
    workerWithinFirst12Months: boolean;
    rnh: boolean;
    rnhTax: number;
    benefitsOfYouthIrs: boolean;
    yearOfYouthIrs: number;
  };
}

export interface IndependentWorkerTestScenario {
  name: string;
  observations?: string;
  params: SimulateIndependentWorkerOptions;
}
