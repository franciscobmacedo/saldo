export type SituationCodesT =
  | "TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES"
  | "TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES"
  | "TABLE3_CASADO_1_TITULAR"
  | "TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF"
  | "TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF"
  | "TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF"
  | "TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF"

export type LocationT = "continente" | "acores" | "madeira";

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
  TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES: {
    code: "TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES",
    description:
      "Trabalho dependente - Não casado sem dependentes ou casado dois titulares",
    conditions: [
      {
        description: "Não Casado sem dependentes",
        married: false,
        dependents: false,
        disabled: false,
        partnerDisabled: false,
      },
      {
        description: "Casado, 2 titulares, sem dependentes",
        married: true,
        numberOfHolders: 2,
        dependents: false,
        disabled: false,
        partnerDisabled: false,
      },
      {
        description: "Casado, 2 titulares, com dependentes",
        married: true,
        numberOfHolders: 2,
        dependents: true,
        disabled: false,
        partnerDisabled: false,
      },
      {
        description: "Casado, 2 titulares, sem dependentes, parceiro com deficiência",
        married: true,
        numberOfHolders: 2,
        dependents: false,
        disabled: false,
        partnerDisabled: true,
      },
      {
        description: "Casado, 2 titulares, com dependentes, parceiro com deficiência",
        married: true,
        numberOfHolders: 2,
        dependents: true,
        disabled: false,
        partnerDisabled: true,
      },
    ],
  },
  TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES: {
    code: "TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES",
    description: "Trabalho dependente - Não casado com um ou mais dependentes",
    conditions: [
      {
        description: "Não casado com um ou mais dependentes",
        married: false,
        dependents: true,
        disabled: false,
        partnerDisabled: false,
      },
    ],
  },
  TABLE3_CASADO_1_TITULAR: {
    code: "TABLE3_CASADO_1_TITULAR",
    description: "Trabalho dependente - Casado único titular",
    conditions: [
      {
        description: "Casado único titular sem dependentes",
        married: true,
        numberOfHolders: 1,
        dependents: false,
        disabled: false,
        partnerDisabled: false,
      },
      {
        description: "Casado único titular com dependentes",
        married: true,
        numberOfHolders: 1,
        dependents: true,
        disabled: false,
        partnerDisabled: false,
      },
    ],
  },
  TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF: {
    code: "TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF",
    description:
      "Trabalho dependente - Não casado ou casado dois titulares sem dependentes - deficiente",
    conditions: [
      {
        description: "Não Casado sem dependentes - deficiente",
        married: false,
        dependents: false,
        disabled: true,
        partnerDisabled: false,
      },
      {
        description: "Casado, 2 titulares, sem dependentes - deficiente",
        married: true,
        numberOfHolders: 2,
        dependents: false,
        disabled: true,
        partnerDisabled: false,
      },
    ],
  },
  TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF: {
    code: "TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF",
    description:
      "Trabalho dependente - Não casado, com um ou mais dependentes - deficiente",
    conditions: [
      {
        description: "Não casado com um ou mais dependentes - deficiente",
        married: false,
        dependents: true,
        disabled: true,
        partnerDisabled: false,
      },
    ],
  },
  TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF: {
    code: "TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF",
    description:
      "Trabalho dependente - Casado dois titulares, com um ou mais dependentes - deficiente",
    conditions: [
      {
        description: "Casado, 2 titulares, com dependentes - deficiente",
        married: true,
        numberOfHolders: 2,
        dependents: true,
        disabled: true,
        partnerDisabled: false,
      },
      {
        description: "Casado, 2 titulares, com dependentes - deficiente, parceiro com deficiência",
        married: true,
        numberOfHolders: 2,
        dependents: true,
        disabled: true,
        partnerDisabled: true,
      },
    ],
  },
  TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF: {
    code: "TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF",
    description: "Trabalho dependente - Casado único titular - deficiente",
    conditions: [
      {
        description: "Casado único titular sem dependentes - deficiente",
        married: true,
        numberOfHolders: 1,
        dependents: false,
        disabled: true,
        partnerDisabled: false,
      },
      {
        description: "Casado único titular com dependentes - deficiente",
        married: true,
        numberOfHolders: 1,
        dependents: true,
        disabled: true,
        partnerDisabled: false,
      },
      {
        description: "Casado único titular sem dependentes - parceiro com deficiência",
        married: true,
        numberOfHolders: 1,
        dependents: false,
        disabled: false,
        partnerDisabled: true,
      },
      {
        description: "Casado único titular com dependentes - parceiro com deficiência",
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

export class RetentionPathsSchema {
  public identifier: string; // Renamed from yearPath, locationPath, etc. to a single identifier

  constructor(
    dateStart: Date,
    dateEnd: Date,
    location: LocationT,
    situationCode: SituationCodesT,
    year: number | string
  ) {
    const yearStr = String(year);

    const customPadStart = (str: string, targetLength: number, padString: string): string => {
      targetLength = targetLength >> 0; // floor if number or convert non-number to 0
      padString = String(typeof padString !== 'undefined' ? padString : ' ');
      if (str.length > targetLength) {
        return String(str);
      } else {
        targetLength = targetLength - str.length;
        if (targetLength > padString.length) {
          padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer than needed
        }
        return padString.slice(0, targetLength) + String(str);
      }
    };

    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = customPadStart(String(date.getMonth() + 1), 2, "0");
      const d = customPadStart(String(date.getDate()), 2, "0");
      return `${y}-${m}-${d}`;
    };

    // Construct the identifier string matching the keys in taxTablesData
    // e.g., "2024/continente/2024-01-01_2024-12-31/SOLD"
    // Note: situationCode already comes without .json
    this.identifier = `${yearStr}/${location}/${formatDate(dateStart)}_${formatDate(dateEnd)}/${situationCode}`;
  }

  public get path(): string { // Keep 'path' getter name for compatibility if it's widely used,
    // but it now returns the identifier.
    return this.identifier;
  }
}
