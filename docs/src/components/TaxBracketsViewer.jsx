"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { taxTablesData } from "saldo"
import { transformTaxTablesData } from "./dataTransformation"
import { FilterControls } from "./FilterControls"
import { TaxTableCard } from "./TaxTableCard"

export function TaxBracketsViewer() {
  const data = React.useMemo(() => transformTaxTablesData(taxTablesData), [taxTablesData])

  // Filtering state
  const [regionFilter, setRegionFilter] = React.useState([])
  const [dateRangeFilter, setDateRangeFilter] = React.useState([])
  const [marriedFilter, setMarriedFilter] = React.useState([])
  const [dependentsFilter, setDependentsFilter] = React.useState([])
  const [disabledFilter, setDisabledFilter] = React.useState([])
  const [partnerDisabledFilter, setPartnerDisabledFilter] = React.useState([])
  const [numberOfHoldersFilter, setNumberOfHoldersFilter] = React.useState([])
  const [searchFilter, setSearchFilter] = React.useState("")

  // Get unique values for filters
  const uniqueRegions = React.useMemo(() => [...new Set(data.map(item => item.region))], [data])
  const uniqueDateRanges = React.useMemo(() => [...new Set(data.map(item => item.dateRange))], [data])


  // Get unique condition values across all data
  const uniqueMarriedValues = React.useMemo(() => [...new Set(data.flatMap(item => item.marriedValues))], [data])
  const uniqueDependentsValues = React.useMemo(() => [...new Set(data.flatMap(item => item.dependentsValues))], [data])
  const uniqueDisabledValues = React.useMemo(() => [...new Set(data.flatMap(item => item.disabledValues))], [data])
  const uniquePartnerDisabledValues = React.useMemo(() => [...new Set(data.flatMap(item => item.partnerDisabledValues))], [data])
  const uniqueNumberOfHoldersValues = React.useMemo(() => [...new Set(data.flatMap(item => item.numberOfHoldersValues))].sort((a, b) => a - b), [data])

  // Filter the data based on current filters
  const filteredData = React.useMemo(() => {
    return data.filter(item => {
      // Region filter
      if (regionFilter.length > 0 && !regionFilter.includes(item.region)) {
        return false
      }

      // Date range filter
      if (dateRangeFilter.length > 0 && !dateRangeFilter.includes(item.dateRange)) {
        return false
      }




      // Condition-based filters
      if (marriedFilter.length > 0 && !marriedFilter.some(value => item.marriedValues.includes(value))) {
        return false
      }

      if (dependentsFilter.length > 0 && !dependentsFilter.some(value => item.dependentsValues.includes(value))) {
        return false
      }

      if (disabledFilter.length > 0 && !disabledFilter.some(value => item.disabledValues.includes(value))) {
        return false
      }

      if (partnerDisabledFilter.length > 0 && !partnerDisabledFilter.some(value => item.partnerDisabledValues.includes(value))) {
        return false
      }

      if (numberOfHoldersFilter.length > 0 && !numberOfHoldersFilter.some(value => item.numberOfHoldersValues.includes(value))) {
        return false
      }

      // Search filter
      if (searchFilter && !item.description.toLowerCase().includes(searchFilter.toLowerCase()) &&
        !item.tableName.toLowerCase().includes(searchFilter.toLowerCase()) &&
        !item.situationDescription.toLowerCase().includes(searchFilter.toLowerCase())) {
        return false
      }

      return true
    })
  }, [data, regionFilter, dateRangeFilter, marriedFilter, dependentsFilter, disabledFilter, partnerDisabledFilter, numberOfHoldersFilter, searchFilter])

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <FilterControls
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        regionFilter={regionFilter}
        setRegionFilter={setRegionFilter}
        dateRangeFilter={dateRangeFilter}
        setDateRangeFilter={setDateRangeFilter}
        marriedFilter={marriedFilter}
        setMarriedFilter={setMarriedFilter}
        dependentsFilter={dependentsFilter}
        setDependentsFilter={setDependentsFilter}
        disabledFilter={disabledFilter}
        setDisabledFilter={setDisabledFilter}
        partnerDisabledFilter={partnerDisabledFilter}
        setPartnerDisabledFilter={setPartnerDisabledFilter}
        numberOfHoldersFilter={numberOfHoldersFilter}
        setNumberOfHoldersFilter={setNumberOfHoldersFilter}
        uniqueRegions={uniqueRegions}
        uniqueDateRanges={uniqueDateRanges}
        uniqueMarriedValues={uniqueMarriedValues}
        uniqueDependentsValues={uniqueDependentsValues}
        uniqueDisabledValues={uniqueDisabledValues}
        uniquePartnerDisabledValues={uniquePartnerDisabledValues}
        uniqueNumberOfHoldersValues={uniqueNumberOfHoldersValues}
      />

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} of {data.length} tax tables
      </div>

      {/* Tax Tables Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((table) => (
          <TaxTableCard key={table.id} table={table} />
        ))}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <Alert>
          <Search className="h-4 w-4" />
          <AlertDescription>
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No tax tables found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
