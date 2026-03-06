import { SituationUtils } from "saldo"
import { formatDateRange } from "./utils"

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
      tableName: tableData.table,
      description: tableData.description,
      brackets: tableData.brackets,
      dependentDisabledDeduction: tableData.dependent_disabled_addition_deduction || 0,
      situationCode: tableName,
      situation: situation,
      situationDescription: situation?.description || "Unknown situation",
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
