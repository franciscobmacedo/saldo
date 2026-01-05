import {
  SimulateIndependentWorkerOptions,
  IndependentWorkerResult,
  FrequencyChoices,
} from "./schemas";
import {
  calculateGrossIncome,
  calculateSsPay,
  calculateSpecificDeductions,
  calculateMaxExpenses,
  calculateExpensesNeeded,
  calculateTaxableIncome,
  calculateYouthIrsDiscount,
  findTaxRank,
  calculateIrsPay,
  calculateNetIncome,
} from "./calculations";
import { IAS_PER_YEAR } from "@/data/ias-data";
import {
  validateIncome,
  validateIncomeFrequency,
  validateNrDaysOff,
  validateSsDiscount,
  validateMaxExpensesTax,
  validateExpenses,
  validateSsTax,
  validateCurrentTaxRankYear,
  validateRnhTax,
  validateYearOfYouthIrs,
} from "./validators";
import { SUPPORTED_TAX_RANK_YEARS, TAX_RANKS } from "@/data/tax-ranks-data";


const isWithinFirstFinancialYear = (dateOfOpeningAcivity: Date | null): boolean => {
  if (!dateOfOpeningAcivity) {
    return false;
  }
  // if the date of opening activity is during this year, then the worker is within the first financial year
  return dateOfOpeningAcivity.getFullYear() === new Date().getFullYear();
}

const isWithinSecondFinancialYear = (dateOfOpeningAcivity: Date | null): boolean => {
  if (!dateOfOpeningAcivity) {
    return false;
  }
  // if the date of opening activity is during the last year, then the worker is within the second financial year
  return dateOfOpeningAcivity.getFullYear() === new Date().getFullYear() - 1;
}

const isWithinFirst12Months = (dateOfOpeningAcivity: Date | null): boolean => {
  if (!dateOfOpeningAcivity) {
    return false;
  }

  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());

  return dateOfOpeningAcivity >= twelveMonthsAgo;
}

export function simulateIndependentWorker({
  income,
  incomeFrequency = FrequencyChoices.Year,
  nrDaysOff = 0, // relevant for daily income frequency
  ssDiscount = 0,
  maxExpensesTax = 15,
  expenses = 0,
  ssTax = 0.214,
  currentTaxRankYear = SUPPORTED_TAX_RANK_YEARS[SUPPORTED_TAX_RANK_YEARS.length - 1], // latest year
  rnh = false,
  rnhTax = 0.2,
  dateOfOpeningAcivity = null,
  benefitsOfYouthIrs = false,
  yearOfYouthIrs = 1,
}: SimulateIndependentWorkerOptions): IndependentWorkerResult {
  // Validate all inputs
  validateIncome(income);
  validateIncomeFrequency(incomeFrequency);
  validateNrDaysOff(nrDaysOff);
  validateSsDiscount(ssDiscount);
  validateMaxExpensesTax(maxExpensesTax);
  validateExpenses(expenses);
  validateSsTax(ssTax);
  validateCurrentTaxRankYear(currentTaxRankYear);
  validateRnhTax(rnhTax);
  validateYearOfYouthIrs(yearOfYouthIrs, currentTaxRankYear);

  const workerWithinFirstFinancialYear = isWithinFirstFinancialYear(dateOfOpeningAcivity);
  const workerWithinSecondFinancialYear = isWithinSecondFinancialYear(dateOfOpeningAcivity);
  const workerWithinFirst12Months = isWithinFirst12Months(dateOfOpeningAcivity);




  // Calculate gross income based on frequency
  const grossIncome = calculateGrossIncome(
    income,
    incomeFrequency,
    nrDaysOff
  );

  // Get current IAS value
  const currentIas = IAS_PER_YEAR[currentTaxRankYear];
  const maxSsIncome = 12 * currentIas;

  // Calculate social security payments
  const ssPay = calculateSsPay(
    grossIncome,
    ssTax,
    ssDiscount,
    maxSsIncome,
    workerWithinFirst12Months,
    nrDaysOff
  );

  // Calculate specific deductions
  const specificDeductions = calculateSpecificDeductions(ssPay, grossIncome);

  // Calculate expenses
  const maxExpenses = calculateMaxExpenses(grossIncome, maxExpensesTax);
  const expensesNeeded = calculateExpensesNeeded(maxExpenses, specificDeductions);

  // Calculate youth IRS discount
  const youthIrsDiscount = calculateYouthIrsDiscount(
    benefitsOfYouthIrs,
    grossIncome,
    currentTaxRankYear,
    yearOfYouthIrs,
    currentIas
  );

  // Calculate taxable income
  const taxableIncome = calculateTaxableIncome(
    grossIncome,
    youthIrsDiscount,
    workerWithinFirstFinancialYear,
    workerWithinSecondFinancialYear,
    expensesNeeded,
    expenses
  );

  // Find tax rank
  const taxRank = findTaxRank(taxableIncome, currentTaxRankYear);

  // Calculate IRS payments
  const irsPay = calculateIrsPay(
    taxableIncome,
    taxRank,
    rnh,
    rnhTax,
    nrDaysOff,
    TAX_RANKS[currentTaxRankYear]
  );

  // Calculate net income
  const netIncome = calculateNetIncome(grossIncome, irsPay, ssPay);

  return {
    grossIncome,
    taxableIncome,
    ssPay,
    specificDeductions,
    expenses,
    expensesNeeded,
    youthIrsDiscount,
    irsPay,
    netIncome,
    taxRank,
    currentIas,
    maxSsIncome,
    ssTax,
    maxExpensesTax,
    workerWithinFirstFinancialYear,
    workerWithinSecondFinancialYear,
    workerWithinFirst12Months,
    rnh,
    rnhTax,
    benefitsOfYouthIrs,
    yearOfYouthIrs,
  };
}
