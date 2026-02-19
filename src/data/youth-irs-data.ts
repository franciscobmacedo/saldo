import { YouthIrs } from "@/independent-worker/schemas";
import { SUPPORTED_TAX_RANK_YEARS } from "@/data/tax-ranks-data";

export const YOUTH_IRS: { [K in typeof SUPPORTED_TAX_RANK_YEARS[number]]: { [key: number]: YouthIrs } } = {
    2023: {
        1: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 12.5 },
        2: { maxDiscountPercentage: 0.4, maxDiscountIasMultiplier: 10 },
        3: { maxDiscountPercentage: 0.3, maxDiscountIasMultiplier: 7.5 },
        4: { maxDiscountPercentage: 0.3, maxDiscountIasMultiplier: 7.5 },
        5: { maxDiscountPercentage: 0.2, maxDiscountIasMultiplier: 5 },
    },
    2024: {
        1: { maxDiscountPercentage: 1, maxDiscountIasMultiplier: 40 },
        2: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 30 },
        3: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 20 },
        4: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 20 },
        5: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 10 },
    },
    2025: {
        1: { maxDiscountPercentage: 1, maxDiscountIasMultiplier: 55 },
        2: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
        3: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
        4: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
        5: { maxDiscountPercentage: 0.50, maxDiscountIasMultiplier: 55 },
        6: { maxDiscountPercentage: 0.50, maxDiscountIasMultiplier: 55 },
        7: { maxDiscountPercentage: 0.50, maxDiscountIasMultiplier: 55 },
        8: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
        9: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
        10: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
    },
    2026: {
        1: { maxDiscountPercentage: 1, maxDiscountIasMultiplier: 55 },
        2: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
        3: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
        4: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
        5: { maxDiscountPercentage: 0.50, maxDiscountIasMultiplier: 55 },
        6: { maxDiscountPercentage: 0.50, maxDiscountIasMultiplier: 55 },
        7: { maxDiscountPercentage: 0.50, maxDiscountIasMultiplier: 55 },
        8: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
        9: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
        10: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
    },
};
