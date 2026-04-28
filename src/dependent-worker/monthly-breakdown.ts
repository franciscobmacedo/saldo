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

/**
 * For a given Twelfths setting, returns the fraction (0..1) of each subsídio
 * (férias and natal) that is paid as a lump sum (in June and December
 * respectively). The remaining fraction is distributed monthly via twelfths.
 *
 * isenção de horário is added to the férias subsídio only — knowing how that
 * subsídio splits between lump and twelfths lets us route the IHT amount
 * correctly without conflating it with the natal subsídio.
 */
export function getSubsidyLumpSumFractions(
  twelfths: Twelfths,
  oneHalfMonthTwelfthsLumpSumMonth: OneHalfMonthTwelfthsLumpSumMonth
): { ferias: number; natal: number } {
  switch (twelfths) {
    case Twelfths.NONE:
      return { ferias: 1, natal: 1 };
    case Twelfths.ONE_HALF_MONTH:
      return oneHalfMonthTwelfthsLumpSumMonth === "june"
        ? { ferias: 0.5, natal: 1 }
        : { ferias: 1, natal: 0.5 };
    case Twelfths.ONE_MONTH:
      return { ferias: 0.5, natal: 0.5 };
    case Twelfths.TWO_MONTHS:
      return { ferias: 0, natal: 0 };
    default: {
      const remaining = Math.max(0, 2 - Number(twelfths));
      const each = (remaining / 2);
      return { ferias: each, natal: each };
    }
  }
}

export function buildTwelfthsLumpSumByMonth(
  feriasSubsidyAmount: number,
  natalSubsidyAmount: number,
  twelfths: Twelfths,
  oneHalfMonthTwelfthsLumpSumMonth: OneHalfMonthTwelfthsLumpSumMonth
): Record<MonthName, number> {
  const lumpSums = Object.fromEntries(
    MONTHS.map((month) => [month, 0])
  ) as Record<MonthName, number>;

  const fractions = getSubsidyLumpSumFractions(
    twelfths,
    oneHalfMonthTwelfthsLumpSumMonth
  );

  lumpSums[HOLIDAY_ALLOWANCE_MONTH] += feriasSubsidyAmount * fractions.ferias;
  lumpSums[CHRISTMAS_ALLOWANCE_MONTH] += natalSubsidyAmount * fractions.natal;

  return lumpSums;
}
