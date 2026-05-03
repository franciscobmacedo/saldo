import { YOUTH_IRS } from "@/data/youth-irs-data";
import { IAS_PER_YEAR } from "@/data/ias-data";
import {
  SUPPORTED_TAX_RANK_YEARS,
  SupportedTaxRankYear,
} from "@/data/supported-tax-rank-years";

export interface YouthIrs {
  maxDiscountPercentage: number;
  maxDiscountIasMultiplier: number;
}

export const YOUTH_IRS_PAYMENTS_PER_YEAR = 14;

export function getYouthIrsRules(
  currentTaxRankYear: SupportedTaxRankYear,
  yearOfBenefit: number
): YouthIrs {
  return YOUTH_IRS[currentTaxRankYear][yearOfBenefit];
}

export function validateYearOfYouthIrs(
  yearOfBenefit: number,
  currentTaxRankYear: SupportedTaxRankYear
): void {
  if (!Number.isInteger(yearOfBenefit)) {
    throw new Error("Year of youth IRS must be an integer");
  }
  const validRange = currentTaxRankYear >= 2025 ? 10 : 5;
  if (yearOfBenefit < 1 || yearOfBenefit > validRange) {
    throw new Error(
      `Year of youth IRS must be between 1 and ${validRange} for tax year ${currentTaxRankYear}`
    );
  }
}

export function calculateAnnualYouthIrsDiscount(
  benefitsOfYouthIrs: boolean,
  annualGrossIncome: number,
  currentTaxRankYear: SupportedTaxRankYear,
  yearOfBenefit: number,
  currentIas: number
): number {
  if (!benefitsOfYouthIrs) {
    return 0;
  }
  const rules = getYouthIrsRules(currentTaxRankYear, yearOfBenefit);
  const maxByPercentage = rules.maxDiscountPercentage * annualGrossIncome;
  const maxByIas = rules.maxDiscountIasMultiplier * currentIas;
  return Math.min(maxByPercentage, maxByIas);
}

/**
 * Per-payment exempt amount for monthly IRS retention under IRS Jovem
 * (Despacho 9971-A/2024 alínea g)).
 *
 * The annual cap (multiplier × IAS) is prorated across {@link
 * YOUTH_IRS_PAYMENTS_PER_YEAR} payments (12 base + subsídio de férias +
 * subsídio de Natal).
 */
export function calculateMonthlyYouthIrsExemption(
  benefitsOfYouthIrs: boolean,
  monthRemuneration: number,
  currentTaxRankYear: SupportedTaxRankYear,
  yearOfBenefit: number
): number {
  if (!benefitsOfYouthIrs || monthRemuneration <= 0) {
    return 0;
  }
  const rules = getYouthIrsRules(currentTaxRankYear, yearOfBenefit);
  const ias = IAS_PER_YEAR[currentTaxRankYear];
  const monthlyCap =
    (rules.maxDiscountIasMultiplier * ias) / YOUTH_IRS_PAYMENTS_PER_YEAR;
  const exemptByPercentage = rules.maxDiscountPercentage * monthRemuneration;
  return Math.min(exemptByPercentage, monthlyCap);
}

export function isSupportedYouthIrsYear(
  year: number
): year is SupportedTaxRankYear {
  return (SUPPORTED_TAX_RANK_YEARS as readonly number[]).includes(year);
}
