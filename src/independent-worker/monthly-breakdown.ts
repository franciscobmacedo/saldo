import {
  IndependentMonthName,
  IndependentWorkerMonthlyBreakdownResult,
} from "./schemas";

export const MONTHS: IndependentMonthName[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

interface BuildMonthlyBreakdownOptions {
  grossMonthly: number;
  taxableIncomeAnnual: number;
  irsMonthly: number;
  ssMonthly: number;
  netMonthly: number;
  marginalRate: number;
}

export function buildIndependentWorkerMonthlyBreakdown({
  grossMonthly,
  taxableIncomeAnnual,
  irsMonthly,
  ssMonthly,
  netMonthly,
  marginalRate,
}: BuildMonthlyBreakdownOptions): IndependentWorkerMonthlyBreakdownResult[] {
  const taxableIncomeMonthly = taxableIncomeAnnual / 12;
  const totalTax = irsMonthly + ssMonthly;
  const overallTaxBurden = grossMonthly === 0 ? 0 : totalTax / grossMonthly;

  return MONTHS.map((month) => ({
    month,
    grossIncome: grossMonthly,
    taxableIncome: taxableIncomeMonthly,
    irsPay: irsMonthly,
    ssPay: ssMonthly,
    netIncome: netMonthly,
    totalTax,
    overallTaxBurden,
    effectiveBracketRate: grossMonthly === 0 ? null : overallTaxBurden,
    marginalRate,
  }));
}
