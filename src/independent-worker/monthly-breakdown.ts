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
  grossMonthly: number | number[];
  taxableIncomeAnnual: number;
  irsMonthly: number;
  ssMonthly: number | number[];
  netMonthly: number | number[];
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

  const getMonthVal = (val: number | number[], idx: number) =>
    Array.isArray(val) ? val[idx] : val;

  return MONTHS.map((month, idx) => {
    const mGross = getMonthVal(grossMonthly, idx);
    const mSS = getMonthVal(ssMonthly, idx);
    const mNet = getMonthVal(netMonthly, idx);
    const totalTax = irsMonthly + mSS;
    const overallTaxBurden = mGross === 0 ? 0 : totalTax / mGross;

    return {
      month,
      grossIncome: mGross,
      taxableIncome: taxableIncomeMonthly,
      irsPay: irsMonthly,
      ssPay: mSS,
      netIncome: mNet,
      totalTax,
      overallTaxBurden,
      effectiveBracketRate: mGross === 0 ? null : overallTaxBurden,
      marginalRate,
    };
  });
}
