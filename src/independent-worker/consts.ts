import { SUPPORTED_TAX_RANK_YEARS } from "@/data/supported-tax-rank-years";

export const YEAR_BUSINESS_DAYS_BY_TAX_YEAR: {
  [K in typeof SUPPORTED_TAX_RANK_YEARS[number]]: number;
} = {
  2023: 250,
  2024: 253,
  2025: 251,
  2026: 248,
};

export function resolveYearBusinessDays(
  currentTaxRankYear: typeof SUPPORTED_TAX_RANK_YEARS[number],
  overrideYearBusinessDays?: number
): number {
  if (overrideYearBusinessDays !== undefined) {
    return overrideYearBusinessDays;
  }

  return YEAR_BUSINESS_DAYS_BY_TAX_YEAR[currentTaxRankYear];
}
