import {
  MonthName,
  OneHalfMonthTwelfthsLumpSumMonth,
  Twelfths,
} from "@/dependent-worker/schemas";

export const MONTHS: MonthName[] = [
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

export const HOLIDAY_ALLOWANCE_MONTH: MonthName = "june";
export const CHRISTMAS_ALLOWANCE_MONTH: MonthName = "december";

export function buildTwelfthsLumpSumByMonth(
  income: number,
  twelfths: Twelfths,
  oneHalfMonthTwelfthsLumpSumMonth: OneHalfMonthTwelfthsLumpSumMonth
): Record<MonthName, number> {
  const lumpSums = Object.fromEntries(
    MONTHS.map((month) => [month, 0])
  ) as Record<MonthName, number>;

  switch (twelfths) {
    case Twelfths.NONE:
      lumpSums[HOLIDAY_ALLOWANCE_MONTH] += income;
      lumpSums[CHRISTMAS_ALLOWANCE_MONTH] += income;
      break;
    case Twelfths.ONE_HALF_MONTH:
      if (oneHalfMonthTwelfthsLumpSumMonth === "june") {
        lumpSums[HOLIDAY_ALLOWANCE_MONTH] += income * 0.5;
        lumpSums[CHRISTMAS_ALLOWANCE_MONTH] += income;
      } else {
        lumpSums[HOLIDAY_ALLOWANCE_MONTH] += income;
        lumpSums[CHRISTMAS_ALLOWANCE_MONTH] += income * 0.5;
      }
      break;
    case Twelfths.ONE_MONTH:
      lumpSums[HOLIDAY_ALLOWANCE_MONTH] += income * 0.5;
      lumpSums[CHRISTMAS_ALLOWANCE_MONTH] += income * 0.5;
      break;
    case Twelfths.TWO_MONTHS:
      break;
    default: {
      const remainingAllowances = Math.max(0, 2 - Number(twelfths));
      lumpSums[HOLIDAY_ALLOWANCE_MONTH] += (remainingAllowances / 2) * income;
      lumpSums[CHRISTMAS_ALLOWANCE_MONTH] +=
        (remainingAllowances / 2) * income;
      break;
    }
  }

  return lumpSums;
}
