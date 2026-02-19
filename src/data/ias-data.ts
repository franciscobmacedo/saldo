import { SUPPORTED_TAX_RANK_YEARS } from "@/data/tax-ranks-data";


export const IAS_PER_YEAR: { [K in typeof SUPPORTED_TAX_RANK_YEARS[number]]: number } = {
  2023: 480.43,
  2024: 509.26,
  2025: 522.50,
  2026: 537.13,
};
