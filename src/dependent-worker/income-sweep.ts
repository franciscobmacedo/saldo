import {
  IncomeSweepPoint,
  SimulateDependentWorkerIncomeSweepOptions,
  SimulateDependentWorkerMonthlyIncomeSweepOptions,
  SimulateDependentWorkerYearlyIncomeSweepOptions,
} from "@/dependent-worker/schemas";
import { MONTHS } from "@/dependent-worker/monthly-breakdown";
import {
  calculateDependentWorkerMonthBreakdown,
  DependentWorkerSimulationContext,
  prepareDependentWorkerIncomeContext,
  prepareDependentWorkerSharedContext,
} from "@/dependent-worker/simulation-core";

const MONTHLY_SALARY_COUNT_PER_YEAR = 14;

function validateIncomes(
  incomes: number[],
  inputKey: "monthlyIncomes" | "yearlyIncomes"
): void {
  if (!Array.isArray(incomes) || incomes.length === 0) {
    throw new Error(`'${inputKey}' must contain at least one value`);
  }

  incomes.forEach((income, index) => {
    if (!Number.isFinite(income) || income < 0) {
      throw new Error(
        `'${inputKey}[${index}]' must be a finite number greater than or equal to 0`
      );
    }
  });
}

function getMonthIndex(month: string): number {
  const monthIndex = MONTHS.indexOf(month as (typeof MONTHS)[number]);
  if (monthIndex === -1) {
    throw new Error(`Unknown month: ${month}`);
  }
  return monthIndex;
}

function toEffectiveBracketRate(value: number): number | null {
  return Number.isFinite(value) ? value : null;
}

function buildMonthlyIncomeSweepPoint(
  context: DependentWorkerSimulationContext,
  month: (typeof MONTHS)[number],
  monthIndex: number
): IncomeSweepPoint {
  const monthResult = calculateDependentWorkerMonthBreakdown(
    context,
    month,
    monthIndex
  );
  const totalTax =
    monthResult.irsWithholdingTax.totalAmount +
    monthResult.socialSecurityContribution.totalAmount;
  const grossMonthly =
    monthResult.grossIncome.totalWithLunchAllowanceAndSubsidyTwelfthsAmount;

  return {
    scope: "monthly",
    gross: grossMonthly,
    grossAnnual: context.yearlyGrossSalary,
    grossMonthly,
    net: monthResult.netIncome.totalAmount,
    totalTax,
    overallTaxBurden: grossMonthly === 0 ? 0 : totalTax / grossMonthly,
    effectiveBracketRate: toEffectiveBracketRate(
      monthResult.bracket.effective_mensal_rate
    ),
    marginalRate: monthResult.bracket.max_marginal_rate,
  };
}

function buildAnnualIncomeSweepPoint(
  context: DependentWorkerSimulationContext,
  monthIndex: number
): IncomeSweepPoint {
  const yearlyBreakdown = MONTHS.map((month, yearMonthIndex) =>
    calculateDependentWorkerMonthBreakdown(context, month, yearMonthIndex)
  );
  const selectedMonth = yearlyBreakdown[monthIndex];
  const annualNet = yearlyBreakdown.reduce(
    (total, item) => total + item.netIncome.totalAmount,
    0
  );
  const annualTotalTax = yearlyBreakdown.reduce(
    (total, item) =>
      total +
      item.irsWithholdingTax.totalAmount +
      item.socialSecurityContribution.totalAmount,
    0
  );
  const grossAnnual = context.yearlyGrossSalary;
  const grossMonthly =
    selectedMonth.grossIncome.totalWithLunchAllowanceAndSubsidyTwelfthsAmount;

  return {
    scope: "annual",
    gross: grossAnnual,
    grossAnnual,
    grossMonthly,
    net: annualNet,
    totalTax: annualTotalTax,
    netAnnual: annualNet,
    totalTaxAnnual: annualTotalTax,
    overallTaxBurden: grossAnnual === 0 ? 0 : annualTotalTax / grossAnnual,
    effectiveBracketRate: toEffectiveBracketRate(
      selectedMonth.bracket.effective_mensal_rate
    ),
    marginalRate: selectedMonth.bracket.max_marginal_rate,
  };
}

function isMonthlySweepOptions(
  options: SimulateDependentWorkerIncomeSweepOptions
): options is SimulateDependentWorkerMonthlyIncomeSweepOptions {
  return (options as { monthlyIncomes?: number[] }).monthlyIncomes !== undefined;
}

function isYearlySweepOptions(
  options: SimulateDependentWorkerIncomeSweepOptions
): options is SimulateDependentWorkerYearlyIncomeSweepOptions {
  return (options as { yearlyIncomes?: number[] }).yearlyIncomes !== undefined;
}

export function simulateDependentWorkerMonthlyIncomeSweep({
  monthlyIncomes,
  month,
  ...sharedOptions
}: SimulateDependentWorkerMonthlyIncomeSweepOptions): IncomeSweepPoint[] {
  validateIncomes(monthlyIncomes, "monthlyIncomes");

  const monthIndex = getMonthIndex(month);
  const sharedContext = prepareDependentWorkerSharedContext(sharedOptions);

  return monthlyIncomes.map((income) => {
    const context = prepareDependentWorkerIncomeContext(sharedContext, income);
    return buildMonthlyIncomeSweepPoint(context, month, monthIndex);
  });
}

export function simulateDependentWorkerYearlyIncomeSweep({
  yearlyIncomes,
  month,
  ...sharedOptions
}: SimulateDependentWorkerYearlyIncomeSweepOptions): IncomeSweepPoint[] {
  validateIncomes(yearlyIncomes, "yearlyIncomes");

  const monthIndex = getMonthIndex(month);
  const sharedContext = prepareDependentWorkerSharedContext(sharedOptions);

  return yearlyIncomes.map((yearlyIncome) => {
    const monthlyIncome = yearlyIncome / MONTHLY_SALARY_COUNT_PER_YEAR;
    const context = prepareDependentWorkerIncomeContext(
      sharedContext,
      monthlyIncome
    );
    return buildAnnualIncomeSweepPoint(context, monthIndex);
  });
}

export function simulateDependentWorkerIncomeSweep(
  options: SimulateDependentWorkerIncomeSweepOptions
): IncomeSweepPoint[] {
  const hasMonthlyIncomes = isMonthlySweepOptions(options);
  const hasYearlyIncomes = isYearlySweepOptions(options);

  if (hasMonthlyIncomes && hasYearlyIncomes) {
    throw new Error("Provide only one: 'monthlyIncomes' or 'yearlyIncomes'");
  }

  if (!hasMonthlyIncomes && !hasYearlyIncomes) {
    throw new Error("One income list is required: 'monthlyIncomes' or 'yearlyIncomes'");
  }

  if (hasMonthlyIncomes) {
    return simulateDependentWorkerMonthlyIncomeSweep(options);
  }

  return simulateDependentWorkerYearlyIncomeSweep(options);
}
