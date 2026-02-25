import {
  TaxRank,
  YouthIrs,
  CurrencyByFrequency,
  FrequencyChoices,
} from "./schemas";
import { TAX_RANKS } from "@/data/tax-ranks-data";
import { YOUTH_IRS } from "@/data/youth-irs-data";
import { SUPPORTED_TAX_RANK_YEARS } from "@/data/tax-ranks-data";

export function calculateGrossIncome(
  income: number | number[],
  incomeFrequency: FrequencyChoices,
  nrDaysOff: number,
  yearBusinessDays: number
): CurrencyByFrequency {
  const result: CurrencyByFrequency = {
    year: 0,
    month: 0,
    day: 0,
  };

  if (Array.isArray(income)) {
    result.year = income.reduce((sum, val) => sum + val, 0);
    result.month = result.year / 12; // Average monthly income
    result.day = result.year / (yearBusinessDays - nrDaysOff);
    return result;
  }

  switch (incomeFrequency) {
    case FrequencyChoices.Year:
      result.year = income;
      result.month = income / 12; // Always use 12 months for calculations
      result.day = income / (yearBusinessDays - nrDaysOff);
      break;
    case FrequencyChoices.Month:
      result.year = income * 12; // Always use 12 months for calculations
      result.month = income;
      result.day = result.year / (yearBusinessDays - nrDaysOff);
      break;
    case FrequencyChoices.Day:
      result.year = income * (yearBusinessDays - nrDaysOff);
      result.month = result.year / 12; // Always use 12 months for calculations
      result.day = income;
  }
  return result;
}

export function calculateSsPay(
  monthlyIncomes: number[],
  ssTax: number,
  ssDiscount: number,
  maxSsIncome: number,
  firstYearForSs: boolean,
  nrDaysOff: number,
  yearBusinessDays: number,
  previousYearQ4MonthlyIncome?: number
): { totals: CurrencyByFrequency; monthly: number[]; ssQ1Approximated: boolean } {
  if (firstYearForSs) {
    return {
      totals: { year: 0, month: 0, day: 0 },
      monthly: Array(12).fill(0),
      ssQ1Approximated: false,
    };
  }

  const q1Avg = (monthlyIncomes[0] + monthlyIncomes[1] + monthlyIncomes[2]) / 3;
  const q2Avg = (monthlyIncomes[3] + monthlyIncomes[4] + monthlyIncomes[5]) / 3;
  const q3Avg = (monthlyIncomes[6] + monthlyIncomes[7] + monthlyIncomes[8]) / 3;
  const q4Avg = (monthlyIncomes[9] + monthlyIncomes[10] + monthlyIncomes[11]) / 3;

  const calcMonthSS = (avg: number) => {
    const base = avg * 0.7 * (1 + ssDiscount);
    return Math.max(ssTax * Math.min(maxSsIncome, base), 20);
  };

  // Jan/Feb/Mar SS is determined by prior-year Q4 (Oct/Nov/Dec) income.
  // Use the supplied previousYearQ4MonthlyIncome when available; otherwise fall
  // back to the current-year Q3 average and flag the result as approximated.
  const ssQ1Approximated = previousYearQ4MonthlyIncome === undefined;
  const prevQ4Avg = previousYearQ4MonthlyIncome ?? q3Avg;

  const prevQ4SS = calcMonthSS(prevQ4Avg);
  const q1SS = calcMonthSS(q1Avg);
  const q2SS = calcMonthSS(q2Avg);
  const q3SS = calcMonthSS(q3Avg);
  const q4SS = calcMonthSS(q4Avg);

  // Payment mapping (income quarter → months when SS is paid):
  //   prev-year Q4  → Jan, Feb, Mar  (prevQ4SS)
  //   Q1 (Jan–Mar)  → Apr, May, Jun  (q1SS)
  //   Q2 (Apr–Jun)  → Jul, Aug, Sep  (q2SS)
  //   Q3 (Jul–Sep)  → Oct, Nov, Dec  (q3SS)
  const monthly = [
    prevQ4SS, prevQ4SS, prevQ4SS,   // Jan, Feb, Mar
    q1SS, q1SS, q1SS,               // Apr, May, Jun
    q2SS, q2SS, q2SS,               // Jul, Aug, Sep
    q3SS, q3SS, q3SS,               // Oct, Nov, Dec
  ];

  const yearSSPay = monthly.reduce((sum, val) => sum + val, 0);

  return {
    totals: {
      year: yearSSPay,
      month: yearSSPay / 12,
      day: yearSSPay / (yearBusinessDays - nrDaysOff),
    },
    monthly,
    ssQ1Approximated,
  };
}

export function calculateSpecificDeductions(ssPay: CurrencyByFrequency, grossIncome: CurrencyByFrequency): number {
  return Math.max(
    4104,
    Math.min(ssPay.year, 0.1 * grossIncome.year),
  );
}

export function calculateMaxExpenses(grossIncome: CurrencyByFrequency, maxExpensesTax: number): number {
  return (maxExpensesTax / 100) * grossIncome.year;
}

export function calculateExpensesNeeded(maxExpenses: number, specificDeductions: number): number {
  const expenses = maxExpenses - specificDeductions;
  return expenses > 0 ? expenses : 0;
}

export function calculateTaxableIncome(
  grossIncome: CurrencyByFrequency,
  youthIrsDiscount: number,
  firstYear: boolean,
  secondYear: boolean,
  expensesNeeded: number,
  expenses: number
): number {
  const expensesMissing =
    expensesNeeded > expenses
      ? expensesNeeded - expenses
      : 0;

  return (
    (grossIncome.year - youthIrsDiscount) *
    (firstYear ? 0.375 : secondYear ? 0.5625 : 0.75) +
    expensesMissing
  );
}

export function calculateYouthIrsDiscount(
  benefitsOfYouthIrs: boolean,
  grossIncome: CurrencyByFrequency,
  currentTaxRankYear: typeof SUPPORTED_TAX_RANK_YEARS[number],
  yearOfYouthIrs: number,
  currentIas: number
): number {
  if (!benefitsOfYouthIrs) {
    return 0;
  }
  const youthIrsRank = YOUTH_IRS[currentTaxRankYear][yearOfYouthIrs];
  const maxDiscount = youthIrsRank.maxDiscountPercentage * grossIncome.year;
  const maxDiscountIas = youthIrsRank.maxDiscountIasMultiplier * currentIas;
  return Math.min(maxDiscount, maxDiscountIas);
}

export function findTaxRank(
  taxableIncome: number,
  currentTaxRankYear: typeof SUPPORTED_TAX_RANK_YEARS[number]
): TaxRank {
  return TAX_RANKS[currentTaxRankYear].filter(
    (taxRank: TaxRank, index: number) => {
      const isFirstRank = index === 0;
      const isLastRank = index === TAX_RANKS[currentTaxRankYear].length - 1;
      // Use <= for first bracket to include taxable income of 0
      const isBiggerThanMin = isFirstRank ? taxRank.min <= taxableIncome : taxRank.min < taxableIncome;
      const isSmallerThanMax = taxRank.max === null || taxRank.max >= taxableIncome;

      if (isLastRank && isBiggerThanMin) {
        return true;
      }
      return isBiggerThanMin && isSmallerThanMax;
    },
  )[0];
}

export function calculateTaxIncomeAvg(taxRank: TaxRank, taxableIncome: number): number {
  if (taxRank.id <= 1) {
    return taxableIncome;
  }
  // For the last bracket (where max is null), use min as the threshold
  return taxRank.max ?? taxRank.min;
}

export function calculateTaxIncomeNormal(taxRank: TaxRank, taxableIncome: number): number {
  if (taxRank.id <= 1) {
    return 0;
  }
  return taxableIncome - calculateTaxIncomeAvg(taxRank, taxableIncome);
}

export function calculateIrsPay(
  taxableIncome: number,
  taxRank: TaxRank,
  rnh: boolean,
  rnhTax: number,
  nrDaysOff: number,
  taxRanks: TaxRank[],
  yearBusinessDays: number
): CurrencyByFrequency {
  let yearIRS: number;
  if (rnh) {
    yearIRS = taxableIncome * rnhTax;
  } else {
    const taxIncomeAvg = calculateTaxIncomeAvg(taxRank, taxableIncome);
    const taxIncomeNormal = calculateTaxIncomeNormal(taxRank, taxableIncome);

    // For the last bracket (averageTax is null), use previous bracket's averageTax
    let avgTax = taxRank.averageTax;
    if (avgTax === null) {
      const previousBracket = taxRanks.find(r => r.id === taxRank.id - 1);
      avgTax = previousBracket?.averageTax ?? 0;
    }

    yearIRS = taxIncomeAvg * avgTax + taxIncomeNormal * taxRank.normalTax;
  }

  const monthIRS = Math.max(yearIRS / 12, 0); // Always use 12 months for calculations
  const yearIrsPay = Math.max(yearIRS, 0);
  return {
    year: yearIrsPay,
    month: monthIRS,
    day: yearIrsPay / (yearBusinessDays - nrDaysOff),
  };
}

export function calculateNetIncome(
  grossIncome: CurrencyByFrequency,
  irsPay: CurrencyByFrequency,
  ssPay: CurrencyByFrequency,
  yearBusinessDays: number
): CurrencyByFrequency {
  const monthIncome = grossIncome.month - irsPay.month - ssPay.month;
  const yearIncome = grossIncome.year - irsPay.year - ssPay.year;
  return {
    year: yearIncome,
    month: monthIncome,
    day: yearIncome / yearBusinessDays,
  };
}
