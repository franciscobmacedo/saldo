export type SituationCodesT =
  | "TABLE1_SINGLE_OR_MARRIED_2_HOLDERS"
  | "TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS"
  | "TABLE3_MARRIED_1_HOLDER"
  | "TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY"
  | "TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY"
  | "TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY"
  | "TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY"

export type LocationT = "continent" | "azores" | "madeira";

export type PeriodT = 
  | "2025-01-01_2025-07-31"
  | "2025-08-01_2025-09-30" 
  | "2025-10-01_2025-12-31";

export const VALID_PERIODS: readonly PeriodT[] = Object.freeze([
  "2025-01-01_2025-07-31",
  "2025-08-01_2025-09-30", 
  "2025-10-01_2025-12-31"
] as const);

export function getYearFromPeriod(period: PeriodT): number {
  // Validate period format: should be YYYY-MM-DD_YYYY-MM-DD
  const periodPattern = /^\d{4}-\d{2}-\d{2}_\d{4}-\d{2}-\d{2}$/;
  if (!periodPattern.test(period)) {
    throw new Error(`Could not extract year from period: ${period}`);
  }
  
  const yearStr = period.substring(0, 4);
  const year = parseInt(yearStr, 10);
  
  // Validate that the year part is actually numeric
  if (isNaN(year)) {
    throw new Error(`Could not extract year from period: ${period}`);
  }
  
  return year;
}

interface ParsedPeriod {
  period: PeriodT;
  year: number;
  startUtcMs: number;
  endUtcMs: number;
}

function parsePeriod(period: PeriodT): ParsedPeriod {
  const [startDate, endDate] = period.split("_");
  if (!startDate || !endDate) {
    throw new Error(`Could not parse period boundaries: ${period}`);
  }

  const [startYear, startMonth, startDay] = startDate
    .split("-")
    .map((part) => parseInt(part, 10));
  const [endYear, endMonth, endDay] = endDate
    .split("-")
    .map((part) => parseInt(part, 10));

  if (
    [startYear, startMonth, startDay, endYear, endMonth, endDay].some((value) =>
      Number.isNaN(value)
    )
  ) {
    throw new Error(`Could not parse period boundaries: ${period}`);
  }

  return {
    period,
    year: startYear,
    startUtcMs: Date.UTC(startYear, startMonth - 1, startDay),
    endUtcMs: Date.UTC(endYear, endMonth - 1, endDay),
  };
}

export function getAvailableYears(): number[] {
  const years = new Set<number>(VALID_PERIODS.map(getYearFromPeriod));
  return Array.from(years).sort((a, b) => a - b);
}

export function getPeriodsForYear(year: number): PeriodT[] {
  return VALID_PERIODS.filter((period) => getYearFromPeriod(period) === year);
}

export function getPeriodForMonth(
  year: number,
  monthIndexZeroBased: number
): PeriodT {
  if (!Number.isInteger(monthIndexZeroBased) || monthIndexZeroBased < 0 || monthIndexZeroBased > 11) {
    throw new Error(`'monthIndexZeroBased' must be an integer between 0 and 11. Provided: ${monthIndexZeroBased}`);
  }

  const periods = getPeriodsForYear(year).map(parsePeriod);
  if (periods.length === 0) {
    throw new Error(`No retention tax periods found for year: ${year}`);
  }

  const monthStart = Date.UTC(year, monthIndexZeroBased, 1);
  const period = periods.find(
    (candidate) =>
      monthStart >= candidate.startUtcMs && monthStart <= candidate.endUtcMs
  );

  if (!period) {
    throw new Error(
      `Could not find retention tax period for year ${year} and month index ${monthIndexZeroBased}`
    );
  }

  return period.period;
}

export interface Condition {
  married: boolean;
  dependents: boolean; // True if has dependents False if not
  disabled: boolean;
  partnerDisabled: boolean;
  description: string;
  numberOfHolders?: number | null; // Number of holders, null if it's not applicable (e.g. not married)
  // Note: The Python __init__ logic for dependents based on numberOfDependents is handled differently in TS.
  // Consumers of this interface will need to ensure 'dependents' is set correctly.
  // We can add a constructor or factory function if complex initialization is needed.
}

export interface Situation {
  code: SituationCodesT;
  description: string;
  conditions: Condition[];
}

export const Situations: { [key: string]: Situation } = {
  TABLE1_SINGLE_OR_MARRIED_2_HOLDERS: {
    code: "TABLE1_SINGLE_OR_MARRIED_2_HOLDERS",
    description:
      "Dependent work - Single without dependents or married two holders",
    conditions: [
      {
        description: "Single without dependents",
        married: false,
        dependents: false,
        disabled: false,
        partnerDisabled: false,
      },
      {
        description: "Married, 2 holders, without dependents",
        married: true,
        numberOfHolders: 2,
        dependents: false,
        disabled: false,
        partnerDisabled: false,
      },
      {
        description: "Married, 2 holders, with dependents",
        married: true,
        numberOfHolders: 2,
        dependents: true,
        disabled: false,
        partnerDisabled: false,
      },
      {
        description: "Married, 2 holders, without dependents, parceiro com deficiência",
        married: true,
        numberOfHolders: 2,
        dependents: false,
        disabled: false,
        partnerDisabled: true,
      },
      {
        description: "Married, 2 holders, with dependents, parceiro com deficiência",
        married: true,
        numberOfHolders: 2,
        dependents: true,
        disabled: false,
        partnerDisabled: true,
      },
    ],
  },
  TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS: {
    code: "TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS",
    description: "Dependent work - Single with one or more dependents",
    conditions: [
      {
        description: "Single with one or more dependents",
        married: false,
        dependents: true,
        disabled: false,
        partnerDisabled: false,
      },
    ],
  },
  TABLE3_MARRIED_1_HOLDER: {
    code: "TABLE3_MARRIED_1_HOLDER",
    description: "Dependent work - Married single holder",
    conditions: [
      {
        description: "Married single holder without dependents",
        married: true,
        numberOfHolders: 1,
        dependents: false,
        disabled: false,
        partnerDisabled: false,
      },
      {
        description: "Married single holder with dependents",
        married: true,
        numberOfHolders: 1,
        dependents: true,
        disabled: false,
        partnerDisabled: false,
      },
    ],
  },
  TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY: {
    code: "TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY",
    description:
      "Dependent work - Single or married two holders without dependents - disabled",
    conditions: [
      {
        description: "Single without dependents - deficiente",
        married: false,
        dependents: false,
        disabled: true,
        partnerDisabled: false,
      },
      {
        description: "Married, 2 holders, without dependents - deficiente",
        married: true,
        numberOfHolders: 2,
        dependents: false,
        disabled: true,
        partnerDisabled: false,
      },
    ],
  },
  TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY: {
    code: "TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY",
    description:
      "Dependent work - Single with one or more dependents - disabled",
    conditions: [
      {
        description: "Single with one or more dependents - deficiente",
        married: false,
        dependents: true,
        disabled: true,
        partnerDisabled: false,
      },
    ],
  },
  TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY: {
    code: "TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY",
    description:
      "Dependent work - Married two holders with one or more dependents - disabled",
    conditions: [
      {
        description: "Married, 2 holders, with dependents - deficiente",
        married: true,
        numberOfHolders: 2,
        dependents: true,
        disabled: true,
        partnerDisabled: false,
      },
      {
        description: "Married, 2 holders, with dependents - deficiente, parceiro com deficiência",
        married: true,
        numberOfHolders: 2,
        dependents: true,
        disabled: true,
        partnerDisabled: true,
      },
    ],
  },
  TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY: {
    code: "TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY",
    description: "Dependent work - Married single holder - deficiente",
    conditions: [
      {
        description: "Married single holder without dependents - deficiente",
        married: true,
        numberOfHolders: 1,
        dependents: false,
        disabled: true,
        partnerDisabled: false,
      },
      {
        description: "Married single holder with dependents - deficiente",
        married: true,
        numberOfHolders: 1,
        dependents: true,
        disabled: true,
        partnerDisabled: false,
      },
      {
        description: "Married single holder without dependents - parceiro com deficiência",
        married: true,
        numberOfHolders: 1,
        dependents: false,
        disabled: false,
        partnerDisabled: true,
      },
      {
        description: "Married single holder with dependents - parceiro com deficiência",
        married: true,
        numberOfHolders: 1,
        dependents: true,
        disabled: false,
        partnerDisabled: true,
      },
    ],
  },
};



// Utility functions for Situations
export class SituationUtils {
  public static getSituationFromCode(code: string): Situation | undefined {
    return Object.keys(Situations)
      .map((key) => Situations[key])
      .find((situation: Situation) => situation.code === code);
  }

  public static getSituation(
    married: boolean,
    disabled: boolean,
    partnerDisabled: boolean,
    numberOfHolders?: number | null,
    numberOfDependents?: number
  ): Situation | undefined {
    const inputCondition: Partial<Condition> & {
      married: boolean;
      disabled: boolean;
      partnerDisabled: boolean;
      dependents: boolean;
    } = {
      married,
      numberOfHolders: numberOfHolders,
      dependents:
        numberOfDependents !== undefined ? numberOfDependents > 0 : false,
      disabled,
      partnerDisabled,
    };
    return SituationUtils.getSituationFromCondition(
      inputCondition as Condition
    );
  }

  public static getSituationFromCondition(
    condition: Condition
  ): Situation | undefined {
    for (const key in Situations) {
      if (Object.prototype.hasOwnProperty.call(Situations, key)) {
        const situation = Situations[key];
        for (const situationCondition of situation.conditions) {
          const marriedMatch = situationCondition.married === condition.married;

          let holdersMatch = true;
          if (
            situationCondition.numberOfHolders !== undefined &&
            situationCondition.numberOfHolders !== null
          ) {
            holdersMatch =
              situationCondition.numberOfHolders === condition.numberOfHolders;
          }
          // In Python, if situation_condition.number_of_holders is None, it implies a match.
          // Here, if situationCondition.numberOfHolders is undefined/null, we consider it a match only if condition.numberOfHolders is also undefined/null.
          // This might need adjustment based on exact Python None semantics vs TypeScript undefined/null.
          // For now, if schema has no numberOfHolders, it matches any.
          // If schema *has* numberOfHolders, it must match.

          let dependentsMatch = true;
          if (situationCondition.dependents !== undefined) {
            // Python code treated None for dependents as a wildcard / match
            dependentsMatch =
              situationCondition.dependents === condition.dependents;
          }

          const disabledMatch =
            situationCondition.disabled === condition.disabled;

          if (marriedMatch && holdersMatch && dependentsMatch && disabledMatch) {
            return situation;
          }
        }
      }
    }
    // In Python, this raised ValueError. In TS, we return undefined.
    // console.error(`Situation with condition ${JSON.stringify(condition)} not found.`);
    return undefined;
  }
}

export function buildRetentionTableIdentifier(
  period: PeriodT,
  location: LocationT,
  situationCode: SituationCodesT
): string {
  const year = getYearFromPeriod(period);
  return `${year}/${location}/${period}/${situationCode}`;
}
