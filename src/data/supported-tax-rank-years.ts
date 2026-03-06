export const SUPPORTED_TAX_RANK_YEARS = [2023, 2024, 2025, 2026] as const;

export type SupportedTaxRankYear = typeof SUPPORTED_TAX_RANK_YEARS[number];
