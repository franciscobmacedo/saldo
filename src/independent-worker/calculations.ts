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
  income: number,
  incomeFrequency: FrequencyChoices,
  nrDaysOff: number,
  yearBusinessDays: number
): CurrencyByFrequency {
  const result: CurrencyByFrequency = {
    year: 0,
    month: 0,
    day: 0,
  };

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
  grossIncome: CurrencyByFrequency,
  ssTax: number,
  ssDiscount: number,
  maxSsIncome: number,
  firstYearForSs: boolean,
  nrDaysOff: number,
  yearBusinessDays: number
): CurrencyByFrequency {
  if (firstYearForSs) {
    
    return {
      year: 0,
      month: 0,
      day: 0,
    };
  }
  
  // We first calculate 70% of the gross income, with the discount applied,
  // then we compare it to the maximum SS income, and we take the minimum
  const monthSS =
    ssTax *
    Math.min(
      maxSsIncome,
      grossIncome.month * 0.7 * (1 + ssDiscount),
    );
  const yearSSPay = Math.max(12 * monthSS, 20 * 12);
  return {
    year: yearSSPay,
    month: Math.max(monthSS, 20),
    day: yearSSPay / (yearBusinessDays - nrDaysOff),
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
