import {
  DependentWorkerResult,
  SimulateDependentWorkerOptions,
} from "@/dependent-worker/schemas";
import { MONTHS } from "@/dependent-worker/monthly-breakdown";
import {
  calculateDependentWorkerMonthBreakdown,
  prepareDependentWorkerIncomeContext,
  prepareDependentWorkerSharedContext,
} from "@/dependent-worker/simulation-core";

export function simulateDependentWorker(
  options: SimulateDependentWorkerOptions
): DependentWorkerResult {
  const sharedContext = prepareDependentWorkerSharedContext(options);
  const incomeContext = prepareDependentWorkerIncomeContext(
    sharedContext,
    options.income
  );

  const monthlyBreakdown = MONTHS.map((month, monthIndex) =>
    calculateDependentWorkerMonthBreakdown(incomeContext, month, monthIndex)
  );

  const yearlyNetSalary = monthlyBreakdown.reduce(
    (total, month) => total + month.netIncome.totalAmount,
    0
  );

  return {
    yearly: {
      totalGrossIncomeAmount: incomeContext.yearlyGrossSalary,
      totalNetIncomeAmount: yearlyNetSalary,
      totalLunchAllowanceGrossAmount: incomeContext.yearlyLunchAllowance,
    },
    socialSecurityContributionRate: incomeContext.socialSecurityContributionRate,
    monthlyBreakdown,
  };
}
