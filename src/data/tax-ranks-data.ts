import { TaxRank } from "@/independent-worker/schemas";
import { SUPPORTED_TAX_RANK_YEARS } from "./supported-tax-rank-years";

export const TAX_RANKS: { [K in typeof SUPPORTED_TAX_RANK_YEARS[number]]: TaxRank[] } = {
  2023: [
    { id: 1, min: 0, max: 7479, normalTax: 0.145, averageTax: 0.145 },
    { id: 2, min: 7479, max: 11284, normalTax: 0.21, averageTax: 0.1669 },
    { id: 3, min: 11284, max: 15992, normalTax: 0.265, averageTax: 0.1958 },
    { id: 4, min: 15992, max: 20700, normalTax: 0.285, averageTax: 0.2161 },
    { id: 5, min: 20700, max: 26355, normalTax: 0.35, averageTax: 0.2448 },
    { id: 6, min: 26355, max: 38632, normalTax: 0.37, averageTax: 0.2846 },
    { id: 7, min: 38632, max: 50483, normalTax: 0.435, averageTax: 0.3199 },
    { id: 8, min: 50483, max: 78834, normalTax: 0.45, averageTax: 0.3667 },
    { id: 9, min: 78834, normalTax: 0.48, max: null, averageTax: null },
  ],
  2024: [
    { id: 1, min: 0, max: 7703, normalTax: 0.13, averageTax: 0.13 },
    { id: 2, min: 7703, max: 11623, normalTax: 0.165, averageTax: 0.1418 },
    { id: 3, min: 11623, max: 16472, normalTax: 0.22, averageTax: 0.16482 },
    { id: 4, min: 16472, max: 21321, normalTax: 0.25, averageTax: 0.18419 },
    { id: 5, min: 21321, max: 27146, normalTax: 0.32, averageTax: 0.21334 },
    { id: 6, min: 27146, max: 39791, normalTax: 0.35, averageTax: 0.25835 },
    { id: 7, min: 39791, max: 43000, normalTax: 0.435, averageTax: 0.27154 },
    { id: 8, min: 43000, max: 80000, normalTax: 0.45, averageTax: 0.35408 },
    { id: 9, min: 80000, normalTax: 0.48, max: null, averageTax: null },
  ],
  2025: [
    { id: 1, min: 0, max: 8059, normalTax: 0.13, averageTax: 0.13 },
    { id: 2, min: 8059, max: 12160, normalTax: 0.165, averageTax: 0.1418 },
    { id: 3, min: 12160, max: 17233, normalTax: 0.22, averageTax: 0.16482 },
    { id: 4, min: 17233, max: 22306, normalTax: 0.25, averageTax: 0.18419 },
    { id: 5, min: 22306, max: 28400, normalTax: 0.32, averageTax: 0.21334 },
    { id: 6, min: 28400, max: 41629, normalTax: 0.355, averageTax: 0.25835 },
    { id: 7, min: 41629, max: 44987, normalTax: 0.435, averageTax: 0.27154 },
    { id: 8, min: 44987, max: 83696, normalTax: 0.45, averageTax: 0.35408 },
    { id: 9, min: 83696, normalTax: 0.48, max: null, averageTax: null },
  ],
  2026: [
    { id: 1, min: 0, max: 8342, normalTax: 0.125, averageTax: 0.125 },
    { id: 2, min: 8342, max: 12587, normalTax: 0.157, averageTax: 0.1358 },
    { id: 3, min: 12587, max: 17838, normalTax: 0.212, averageTax: 0.1583 },
    { id: 4, min: 17838, max: 23089, normalTax: 0.241, averageTax: 0.1773 },
    { id: 5, min: 23089, max: 29397, normalTax: 0.311, averageTax: 0.206 },
    { id: 6, min: 29397, max: 43090, normalTax: 0.349, averageTax: 0.2509 },
    { id: 7, min: 43090, max: 46566, normalTax: 0.431, averageTax: 0.2646 },
    { id: 8, min: 46566, max: 86634, normalTax: 0.446, averageTax: 0.348 },
    { id: 9, min: 86634, normalTax: 0.48, max: null, averageTax: null },
  ]
};
