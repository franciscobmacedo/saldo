import { SituationUtils } from "saldo"
import { formatDateRange } from "./utils"

const TABLE_NAME_PT = {
  "Table I": "Tabela I",
  "Table II": "Tabela II",
  "Table III": "Tabela III",
  "Table IV": "Tabela IV",
  "Table V": "Tabela V",
  "Table VI": "Tabela VI",
  "Table VII": "Tabela VII",
}

const TABLE_DESCRIPTION_PT = {
  "Dependent work, Single without dependents or married 2 holders":
    "Trabalho dependente, Solteiro sem dependentes ou casado 2 titulares",
  "Dependent work, Single with one or more dependents":
    "Trabalho dependente, Solteiro com um ou mais dependentes",
  "Dependent work, Married single holder":
    "Trabalho dependente, Casado, único titular",
  "Dependent work, Single or married two holders without dependents - Person with disability":
    "Trabalho dependente, Solteiro ou casado 2 titulares sem dependentes - Pessoa com deficiência",
  "Dependent work, Single with one or more dependents - Disabled":
    "Trabalho dependente, Solteiro com um ou mais dependentes - Pessoa com deficiência",
  "Dependent work, Single with one or more dependents - Person with disability":
    "Trabalho dependente, Solteiro com um ou mais dependentes - Pessoa com deficiência",
  "Dependent work, Married 2 holders with one or more dependents - Disabled":
    "Trabalho dependente, Casado 2 titulares com um ou mais dependentes - Pessoa com deficiência",
  "Dependent work, Married two holders with one or more dependents - Person with disability":
    "Trabalho dependente, Casado 2 titulares com um ou mais dependentes - Pessoa com deficiência",
  "Dependent work, Married 2 holders with dependents person with disability":
    "Trabalho dependente, Casado 2 titulares com dependentes - Pessoa com deficiência",
  "Dependent work, Married 1 holder without dependents - Disabled":
    "Trabalho dependente, Casado único titular - Pessoa com deficiência",
  "Dependent work, Married 1 holder person with disability":
    "Trabalho dependente, Casado único titular - Pessoa com deficiência",
  "Dependent work, Married single holder - Person with disability":
    "Trabalho dependente, Casado, único titular - Pessoa com deficiência",
  "Dependent work, Without dependents person with disability":
    "Trabalho dependente, Sem dependentes - Pessoa com deficiência",
  "Dependent work, With dependents person with disability":
    "Trabalho dependente, Com dependentes - Pessoa com deficiência",
}

const SITUATION_DESCRIPTION_PT = {
  "Dependent work - Single without dependents or married two holders":
    "Trabalho dependente - Solteiro sem dependentes ou casado 2 titulares",
  "Dependent work - Single with one or more dependents":
    "Trabalho dependente - Solteiro com um ou mais dependentes",
  "Dependent work - Married single holder":
    "Trabalho dependente - Casado, único titular",
  "Dependent work - Single or married two holders without dependents - disabled":
    "Trabalho dependente - Solteiro ou casado 2 titulares sem dependentes - Pessoa com deficiência",
  "Dependent work - Single with one or more dependents - disabled":
    "Trabalho dependente - Solteiro com um ou mais dependentes - Pessoa com deficiência",
  "Dependent work - Married two holders with one or more dependents - disabled":
    "Trabalho dependente - Casado 2 titulares com um ou mais dependentes - Pessoa com deficiência",
  "Dependent work - Married single holder - deficiente":
    "Trabalho dependente - Casado, único titular - Pessoa com deficiência",
}

const isPortuguese = (locale) => typeof locale === "string" && locale.toLowerCase().startsWith("pt")

const translateTableName = (name, locale) =>
  isPortuguese(locale) ? TABLE_NAME_PT[name] || name : name

const translateTableDescription = (description, locale) =>
  isPortuguese(locale) ? TABLE_DESCRIPTION_PT[description] || description : description

const translateSituationDescription = (description, locale) =>
  isPortuguese(locale) ? SITUATION_DESCRIPTION_PT[description] || description : description

// Transform the tax tables data into a flat structure
export function transformTaxTablesData(taxTablesData, locale = "pt-PT") {
  const transformedData = []

  for (const [key, tableData] of Object.entries(taxTablesData)) {
    const [year, region, dateRange, tableName] = key.split('/')

    // Get situation information from the table name
    const situation = SituationUtils.getSituationFromCode(tableName)

    // Extract all possible conditions for this situation
    const allConditions = situation?.conditions || []

    transformedData.push({
      id: key,
      year,
      region,
      dateRange,
      formattedDateRange: formatDateRange(dateRange, locale),
      tableName: translateTableName(tableData.table, locale),
      description: translateTableDescription(tableData.description, locale),
      brackets: tableData.brackets,
      dependentDisabledDeduction: tableData.dependent_disabled_addition_deduction || 0,
      situationCode: tableName,
      situation: situation,
      situationDescription: translateSituationDescription(
        situation?.description || "Unknown situation",
        locale
      ),
      // Condition properties for filtering
      conditions: allConditions,
      // Extract unique values for filtering
      marriedValues: [...new Set(allConditions.map(c => c.married))],
      dependentsValues: [...new Set(allConditions.map(c => c.dependents))],
      disabledValues: [...new Set(allConditions.map(c => c.disabled))],
      partnerDisabledValues: [...new Set(allConditions.map(c => c.partnerDisabled))],
      numberOfHoldersValues: [...new Set(allConditions.map(c => c.numberOfHolders).filter(h => h !== null && h !== undefined))],
      rawData: tableData
    })
  }

  return transformedData
}
