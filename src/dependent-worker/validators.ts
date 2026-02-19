import { getPeriodsForYear } from "@/config/schemas";

export const validateNumberOfHolders = (numberOfHolders?: number | null): void => {
  if (
    numberOfHolders !== null &&
    numberOfHolders !== undefined &&
    (numberOfHolders !== 1 && numberOfHolders !== 2)
  ) {
    throw new Error("'numberOfHolders' must be null, undefined, 1 or 2");
  }
};

export const validateMarriedAndNumberOfHolders = (
  married: boolean,
  numberOfHolders?: number | null
): void => {
  if (!married) {
    return;
  }

  if (numberOfHolders === null || numberOfHolders === undefined) {
    throw new Error("'numberOfHolders' is required for married workers");
  }

  if (numberOfHolders !== 1 && numberOfHolders !== 2) {
    throw new Error("'numberOfHolders' must be 1 or 2 for married workers");
  }
};

export const validatePartnerDisabled = (
  married: boolean,
  partnerDisabled: boolean
): void => {
  if (!married && partnerDisabled) {
    throw new Error("'partnerDisabled' is not allowed for single workers");
  }
};

export const validateDependents = (
  numberOfDependents?: number | null,
  numberOfDependentsDisabled?: number | null
): void => {
  if (numberOfDependentsDisabled === null || numberOfDependentsDisabled === undefined) {
    return;
  }

  if (numberOfDependents === null || numberOfDependents === undefined) {
    throw new Error(
      "'numberOfDependents' is required when 'numberOfDependentsDisabled' is provided"
    );
  }

  if (numberOfDependentsDisabled > numberOfDependents) {
    throw new Error(
      "'numberOfDependentsDisabled' must be less than or equal to 'numberOfDependents'"
    );
  }
};

export const validateLunchAllowanceMode = (
  lunchAllowanceMode: "cupon" | "salary"
): void => {
  if (lunchAllowanceMode !== "cupon" && lunchAllowanceMode !== "salary") {
    throw new Error(
      `'lunchAllowanceMode' must be 'cupon' or 'salary'. Provided: ${lunchAllowanceMode}`
    );
  }
};

export const validateOneHalfMonthTwelfthsLumpSumMonth = (
  oneHalfMonthTwelfthsLumpSumMonth: "june" | "december"
): void => {
  if (
    oneHalfMonthTwelfthsLumpSumMonth !== "june" &&
    oneHalfMonthTwelfthsLumpSumMonth !== "december"
  ) {
    throw new Error(
      `'oneHalfMonthTwelfthsLumpSumMonth' must be 'june' or 'december'. Provided: ${oneHalfMonthTwelfthsLumpSumMonth}`
    );
  }
};

export const validateYear = (year: number): void => {
  if (!Number.isInteger(year)) {
    throw new Error(`'year' must be an integer. Provided: ${year}`);
  }

  if (getPeriodsForYear(year).length === 0) {
    throw new Error(`No retention tax periods found for year: ${year}`);
  }
};
