"use client"

import * as React from "react"
import { ChevronDown, ChevronRight, Copy, ExternalLink, Search } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { taxTablesData } from "saldo"
import { transformTaxTablesData } from "./dataTransformation"
import { FilterControls } from "./FilterControls"
import { BracketTable } from "./BracketTable"
import { formatCurrency, generateGitHubUrl } from "./utils"

function TaxTableRow({ table }) {
  const [expanded, setExpanded] = React.useState(false)

  const handleCopyData = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(JSON.stringify(table.rawData, null, 2))
  }

  const handleExternalLink = (e) => {
    e.stopPropagation()
    window.open(generateGitHubUrl(table.id), "_blank")
  }

  return (
    <>
      <tr
        className="border-b hover:bg-muted/40 cursor-pointer transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="py-2 px-3 w-6 text-muted-foreground">
          {expanded
            ? <ChevronDown className="h-3.5 w-3.5" />
            : <ChevronRight className="h-3.5 w-3.5" />}
        </td>
        <td className="py-2 px-3">
          <span className="font-mono text-xs text-muted-foreground">{table.tableName}</span>
        </td>
        <td className="py-2 px-3 text-sm">
          {table.description}
        </td>
        <td className="py-2 px-3">
          <Badge variant="outline" className="capitalize text-xs">{table.region}</Badge>
        </td>
        <td className="py-2 px-3 text-xs text-muted-foreground whitespace-nowrap">
          {table.formattedDateRange}
        </td>
        <td className="py-2 px-3 text-xs text-muted-foreground">
          {table.brackets.length} brackets
        </td>
        {table.dependentDisabledDeduction > 0 && (
          <td className="py-2 px-3 text-xs text-green-700">
            +{formatCurrency(table.dependentDisabledDeduction)} dep. disabled
          </td>
        )}
        {table.dependentDisabledDeduction === 0 && (
          <td className="py-2 px-3" />
        )}
        <td className="py-2 px-3">
          <div className="flex items-center gap-1 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyData}
              className="h-6 w-6 p-0"
              title="Copy JSON"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExternalLink}
              className="h-6 w-6 p-0"
              title="View on GitHub"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={8} className="bg-muted/20 px-6 py-4 border-b">
            <BracketTable brackets={table.brackets} />
          </td>
        </tr>
      )}
    </>
  )
}

export function TaxBracketsViewer() {
  const data = React.useMemo(() => transformTaxTablesData(taxTablesData), [])

  const [regionFilter, setRegionFilter] = React.useState([])
  const [dateRangeFilter, setDateRangeFilter] = React.useState([])
  const [marriedFilter, setMarriedFilter] = React.useState([])
  const [dependentsFilter, setDependentsFilter] = React.useState([])
  const [disabledFilter, setDisabledFilter] = React.useState([])
  const [partnerDisabledFilter, setPartnerDisabledFilter] = React.useState([])
  const [numberOfHoldersFilter, setNumberOfHoldersFilter] = React.useState([])
  const [searchFilter, setSearchFilter] = React.useState("")

  const uniqueRegions = React.useMemo(() => [...new Set(data.map(d => d.region))], [data])
  const uniqueDateRanges = React.useMemo(() => [...new Set(data.map(d => d.dateRange))], [data])
  const uniqueMarriedValues = React.useMemo(() => [...new Set(data.flatMap(d => d.marriedValues))], [data])
  const uniqueDependentsValues = React.useMemo(() => [...new Set(data.flatMap(d => d.dependentsValues))], [data])
  const uniqueDisabledValues = React.useMemo(() => [...new Set(data.flatMap(d => d.disabledValues))], [data])
  const uniquePartnerDisabledValues = React.useMemo(() => [...new Set(data.flatMap(d => d.partnerDisabledValues))], [data])
  const uniqueNumberOfHoldersValues = React.useMemo(() => [...new Set(data.flatMap(d => d.numberOfHoldersValues))].sort((a, b) => a - b), [data])

  const filteredData = React.useMemo(() => {
    return data.filter(item => {
      if (regionFilter.length > 0 && !regionFilter.includes(item.region)) return false
      if (dateRangeFilter.length > 0 && !dateRangeFilter.includes(item.dateRange)) return false
      if (marriedFilter.length > 0 && !marriedFilter.some(v => item.marriedValues.includes(v))) return false
      if (dependentsFilter.length > 0 && !dependentsFilter.some(v => item.dependentsValues.includes(v))) return false
      if (disabledFilter.length > 0 && !disabledFilter.some(v => item.disabledValues.includes(v))) return false
      if (partnerDisabledFilter.length > 0 && !partnerDisabledFilter.some(v => item.partnerDisabledValues.includes(v))) return false
      if (numberOfHoldersFilter.length > 0 && !numberOfHoldersFilter.some(v => item.numberOfHoldersValues.includes(v))) return false
      if (searchFilter && (
        !item.description.toLowerCase().includes(searchFilter.toLowerCase()) &&
        !item.tableName.toLowerCase().includes(searchFilter.toLowerCase()) &&
        !item.situationDescription.toLowerCase().includes(searchFilter.toLowerCase())
      )) return false
      return true
    })
  }, [data, regionFilter, dateRangeFilter, marriedFilter, dependentsFilter, disabledFilter, partnerDisabledFilter, numberOfHoldersFilter, searchFilter])

  return (
    <div className="space-y-4">
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

      <div className="text-xs text-muted-foreground">
        {filteredData.length} of {data.length} tables — click a row to expand brackets
      </div>

      {filteredData.length === 0 ? (
        <Alert>
          <Search className="h-4 w-4" />
          <AlertDescription>No tax tables match the current filters.</AlertDescription>
        </Alert>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-xs text-muted-foreground">
                <th className="py-2 px-3 w-6" />
                <th className="py-2 px-3 text-left font-medium">Table</th>
                <th className="py-2 px-3 text-left font-medium">Description</th>
                <th className="py-2 px-3 text-left font-medium">Region</th>
                <th className="py-2 px-3 text-left font-medium whitespace-nowrap">Period</th>
                <th className="py-2 px-3 text-left font-medium">Brackets</th>
                <th className="py-2 px-3 text-left font-medium">Dep. Disabled</th>
                <th className="py-2 px-3" />
              </tr>
            </thead>
            <tbody>
              {filteredData.map((table) => (
                <TaxTableRow key={table.id} table={table} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
