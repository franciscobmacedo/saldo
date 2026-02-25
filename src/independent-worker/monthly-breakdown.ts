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
  grossAnnual: number;
  taxableIncomeAnnual: number;
  irsAnnual: number;
  irsRetentionRate: number;
  ssMonthly: number | number[];
  marginalRate: number;
}

export function buildIndependentWorkerMonthlyBreakdown({
  grossMonthly,
  grossAnnual,
  taxableIncomeAnnual,
  irsAnnual,
  irsRetentionRate,
  ssMonthly,
  marginalRate,
}: BuildMonthlyBreakdownOptions): IndependentWorkerMonthlyBreakdownResult[] {
  const taxableIncomeMonthly = taxableIncomeAnnual / 12;

  const getMonthVal = (val: number | number[], idx: number) =>
    Array.isArray(val) ? val[idx] : val;

  // When variable income, apportion annual IRS proportionally to each month's gross.
  // When uniform, just divide by 12 as before.
  const isVariable = Array.isArray(grossMonthly);
  const getMonthlyIrsPay = (mGross: number): number => {
    if (!isVariable || grossAnnual === 0) return irsAnnual / 12;
    return (mGross / grossAnnual) * irsAnnual;
  };

  return MONTHS.map((month, idx) => {
    const mGross = getMonthVal(grossMonthly, idx);
    const mSS = getMonthVal(ssMonthly, idx);
    const mIrsPay = getMonthlyIrsPay(mGross);
    const mIrsRetention = mGross * irsRetentionRate;

    // Net income month: what the worker actually pockets (gross minus SS and what's retained at source)
    const mNet = mGross - mIrsRetention - mSS;
    const totalTax = mIrsRetention + mSS;
    const overallTaxBurden = mGross === 0 ? 0 : totalTax / mGross;

    return {
      month,
      grossIncome: mGross,
      taxableIncome: taxableIncomeMonthly,
      irsPay: mIrsPay,
      irsRetention: mIrsRetention,
      ssPay: mSS,
      netIncome: mNet,
      totalTax,
      overallTaxBurden,
      effectiveBracketRate: mGross === 0 ? null : overallTaxBurden,
      marginalRate,
    };
  });
}
