import {
  FrequencyChoices,
  IndependentWorkerIncomeSweepPoint,
  IndependentWorkerResult,
  SimulateIndependentWorkerIncomeSweepOptions,
  SimulateIndependentWorkerMonthlyIncomeSweepOptions,
  SimulateIndependentWorkerYearlyIncomeSweepOptions,
} from "./schemas";
import { simulateIndependentWorker } from "./simulator";

function validateIncomes(
  incomes: number[],
  inputKey: "monthlyIncomes" | "yearlyIncomes"
): void {
  if (!Array.isArray(incomes) || incomes.length === 0) {
    throw new Error(`'${inputKey}' must contain at least one value`);
  }

  incomes.forEach((income, index) => {
    if (!Number.isFinite(income) || income <= 0) {
      throw new Error(
        `'${inputKey}[${index}]' must be a finite number greater than 0`
      );
    }
  });
}

function resolveMarginalRate(result: IndependentWorkerResult): number {
  return result.rnh ? result.rnhTax : result.taxRank.normalTax;
}

function buildMonthlyIncomeSweepPoint(
  result: IndependentWorkerResult
): IndependentWorkerIncomeSweepPoint {
  const totalTax = result.irsPay.month + result.ssPay.month;
  const grossMonthly = result.grossIncome.month;

  return {
    scope: "monthly",
    gross: grossMonthly,
    grossAnnual: result.grossIncome.year,
    grossMonthly,
    net: result.netIncome.month,
    totalTax,
    overallTaxBurden: grossMonthly === 0 ? 0 : totalTax / grossMonthly,
    effectiveBracketRate: grossMonthly === 0 ? null : totalTax / grossMonthly,
    marginalRate: resolveMarginalRate(result),
  };
}

function buildAnnualIncomeSweepPoint(
  result: IndependentWorkerResult
): IndependentWorkerIncomeSweepPoint {
  const totalTaxAnnual = result.irsPay.year + result.ssPay.year;
  const grossAnnual = result.grossIncome.year;

  return {
    scope: "annual",
    gross: grossAnnual,
    grossAnnual,
    grossMonthly: result.grossIncome.month,
    net: result.netIncome.year,
    totalTax: totalTaxAnnual,
    netAnnual: result.netIncome.year,
    totalTaxAnnual,
    overallTaxBurden: grossAnnual === 0 ? 0 : totalTaxAnnual / grossAnnual,
    effectiveBracketRate: grossAnnual === 0 ? null : totalTaxAnnual / grossAnnual,
    marginalRate: resolveMarginalRate(result),
  };
}

function isMonthlySweepOptions(
  options: SimulateIndependentWorkerIncomeSweepOptions
): options is SimulateIndependentWorkerMonthlyIncomeSweepOptions {
  return (options as { monthlyIncomes?: number[] }).monthlyIncomes !== undefined;
}

function isYearlySweepOptions(
  options: SimulateIndependentWorkerIncomeSweepOptions
): options is SimulateIndependentWorkerYearlyIncomeSweepOptions {
  return (options as { yearlyIncomes?: number[] }).yearlyIncomes !== undefined;
}

export function simulateIndependentWorkerMonthlyIncomeSweep({
  monthlyIncomes,
  ...sharedOptions
}: SimulateIndependentWorkerMonthlyIncomeSweepOptions): IndependentWorkerIncomeSweepPoint[] {
  validateIncomes(monthlyIncomes, "monthlyIncomes");

  return monthlyIncomes.map((income) => {
    const result = simulateIndependentWorker({
      ...sharedOptions,
      income,
      incomeFrequency: FrequencyChoices.Month,
    });
    return buildMonthlyIncomeSweepPoint(result);
  });
}

export function simulateIndependentWorkerYearlyIncomeSweep({
  yearlyIncomes,
  ...sharedOptions
}: SimulateIndependentWorkerYearlyIncomeSweepOptions): IndependentWorkerIncomeSweepPoint[] {
  validateIncomes(yearlyIncomes, "yearlyIncomes");

  return yearlyIncomes.map((income) => {
    const result = simulateIndependentWorker({
      ...sharedOptions,
      income,
      incomeFrequency: FrequencyChoices.Year,
    });
    return buildAnnualIncomeSweepPoint(result);
  });
}

export function simulateIndependentWorkerIncomeSweep(
  options: SimulateIndependentWorkerIncomeSweepOptions
): IndependentWorkerIncomeSweepPoint[] {
  const hasMonthlyIncomes = isMonthlySweepOptions(options);
  const hasYearlyIncomes = isYearlySweepOptions(options);

  if (hasMonthlyIncomes && hasYearlyIncomes) {
    throw new Error("Provide only one: 'monthlyIncomes' or 'yearlyIncomes'");
  }

  if (!hasMonthlyIncomes && !hasYearlyIncomes) {
    throw new Error("One income list is required: 'monthlyIncomes' or 'yearlyIncomes'");
  }

  if (hasMonthlyIncomes) {
    return simulateIndependentWorkerMonthlyIncomeSweep(options);
  }

  return simulateIndependentWorkerYearlyIncomeSweep(options);
}
