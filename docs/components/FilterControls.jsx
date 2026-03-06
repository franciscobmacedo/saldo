"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Search, Filter, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { formatDateRange } from "./utils"
import { getLangFromPath, getLocaleFromLang } from "@/lib/i18n"

const COPY = {
  pt: {
    searchPlaceholder: "Pesquisar tabelas fiscais...",
    region: "Regiao",
    dateRange: "Periodo",
    married: "Casamento",
    dependents: "Dependentes",
    disabled: "Deficiencia",
    partnerDisabled: "Deficiencia do conjuge",
    holders: "Titulares",
    filterByRegion: "Filtrar por regiao",
    filterByDateRange: "Filtrar por periodo",
    filterByMaritalStatus: "Filtrar por estado civil",
    filterByDependents: "Filtrar por dependentes",
    filterByDisability: "Filtrar por deficiencia",
    filterByPartnerDisability: "Filtrar por deficiencia do conjuge",
    filterByNumberOfHolders: "Filtrar por numero de titulares",
    clearAll: "Limpar",
    clearAllFilters: "Limpar filtros",
    marriedYes: "Casado",
    marriedNo: "Solteiro",
    dependentsYes: "Com dependentes",
    dependentsNo: "Sem dependentes",
    disabledYes: "Pessoa com deficiencia",
    disabledNo: "Pessoa sem deficiencia",
    partnerDisabledYes: "Conjuge com deficiencia",
    partnerDisabledNo: "Conjuge sem deficiencia",
    holder: "Titular",
  },
  en: {
    searchPlaceholder: "Search tax tables...",
    region: "Region",
    dateRange: "Date Range",
    married: "Married",
    dependents: "Dependents",
    disabled: "Disability",
    partnerDisabled: "Partner Disability",
    holders: "Holders",
    filterByRegion: "Filter by Region",
    filterByDateRange: "Filter by Date Range",
    filterByMaritalStatus: "Filter by Marital Status",
    filterByDependents: "Filter by Dependents",
    filterByDisability: "Filter by Disability",
    filterByPartnerDisability: "Filter by Partner Disability",
    filterByNumberOfHolders: "Filter by Number of Holders",
    clearAll: "Clear all",
    clearAllFilters: "Clear all filters",
    marriedYes: "Married",
    marriedNo: "Single",
    dependentsYes: "Has Dependents",
    dependentsNo: "No Dependents",
    disabledYes: "Person Disabled",
    disabledNo: "Person Not Disabled",
    partnerDisabledYes: "Partner Disabled",
    partnerDisabledNo: "Partner Not Disabled",
    holder: "Holder",
  },
}

const REGION_LABELS = {
  pt: {
    continent: "Continente",
    azores: "Acores",
    madeira: "Madeira",
  },
  en: {
    continent: "Continent",
    azores: "Azores",
    madeira: "Madeira",
  },
}

export function FilterControls({
  searchFilter,
  setSearchFilter,
  regionFilter,
  setRegionFilter,
  dateRangeFilter,
  setDateRangeFilter,
  marriedFilter,
  setMarriedFilter,
  dependentsFilter,
  setDependentsFilter,
  disabledFilter,
  setDisabledFilter,
  partnerDisabledFilter,
  setPartnerDisabledFilter,
  numberOfHoldersFilter,
  setNumberOfHoldersFilter,
  uniqueRegions,
  uniqueDateRanges,
  uniqueMarriedValues,
  uniqueDependentsValues,
  uniqueDisabledValues,
  uniquePartnerDisabledValues,
  uniqueNumberOfHoldersValues,
}) {
  const pathname = usePathname()
  const lang = getLangFromPath(pathname)
  const locale = getLocaleFromLang(lang)
  const copy = COPY[lang]
  const regionLabels = REGION_LABELS[lang]

  const hasActiveFilters = regionFilter.length > 0 || 
    dateRangeFilter.length > 0 || 
    marriedFilter.length > 0 || 
    dependentsFilter.length > 0 || 
    disabledFilter.length > 0 || 
    partnerDisabledFilter.length > 0 || 
    numberOfHoldersFilter.length > 0 || 
    searchFilter

  const clearAllFilters = () => {
    setRegionFilter([])
    setDateRangeFilter([])
    setMarriedFilter([])
    setDependentsFilter([])
    setDisabledFilter([])
    setPartnerDisabledFilter([])
    setNumberOfHoldersFilter([])
    setSearchFilter("")
  }

  const toggleInFilter = (checked, value, setter) => {
    setter((prev) => {
      if (checked) {
        return prev.includes(value) ? prev : [...prev, value]
      }

      return prev.filter((item) => item !== value)
    })
  }

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={copy.searchPlaceholder}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-10 max-w-sm"
          />
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            {copy.region}
            {regionFilter.length > 0 && (
              <Badge variant="default" className="ml-2">
                {regionFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>{copy.filterByRegion}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniqueRegions.map((region) => (
            <DropdownMenuCheckboxItem
              key={region}
              checked={regionFilter.includes(region)}
              onCheckedChange={(checked) => toggleInFilter(checked, region, setRegionFilter)}
            >
              {regionLabels[region] || region}
            </DropdownMenuCheckboxItem>
          ))}
          {regionFilter.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setRegionFilter([])}>
                <X className="mr-2 h-4 w-4" />
                {copy.clearAll}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            {copy.dateRange}
            {dateRangeFilter.length > 0 && (
              <Badge variant="default" className="ml-2">
                {dateRangeFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuLabel>{copy.filterByDateRange}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniqueDateRanges.map((dateRange) => (
            <DropdownMenuCheckboxItem
              key={dateRange}
              checked={dateRangeFilter.includes(dateRange)}
              onCheckedChange={(checked) => toggleInFilter(checked, dateRange, setDateRangeFilter)}
            >
              {formatDateRange(dateRange, locale)}
            </DropdownMenuCheckboxItem>
          ))}
          {dateRangeFilter.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDateRangeFilter([])}>
                <X className="mr-2 h-4 w-4" />
                {copy.clearAll}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            {copy.married}
            {marriedFilter.length > 0 && (
              <Badge variant="default" className="ml-2">
                {marriedFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>{copy.filterByMaritalStatus}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniqueMarriedValues.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={marriedFilter.includes(value)}
              onCheckedChange={(checked) => toggleInFilter(checked, value, setMarriedFilter)}
            >
              {value ? copy.marriedYes : copy.marriedNo}
            </DropdownMenuCheckboxItem>
          ))}
          {marriedFilter.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setMarriedFilter([])}>
                <X className="mr-2 h-4 w-4" />
                {copy.clearAll}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            {copy.dependents}
            {dependentsFilter.length > 0 && (
              <Badge variant="default" className="ml-2">
                {dependentsFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>{copy.filterByDependents}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniqueDependentsValues.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={dependentsFilter.includes(value)}
              onCheckedChange={(checked) => toggleInFilter(checked, value, setDependentsFilter)}
            >
              {value ? copy.dependentsYes : copy.dependentsNo}
            </DropdownMenuCheckboxItem>
          ))}
          {dependentsFilter.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDependentsFilter([])}>
                <X className="mr-2 h-4 w-4" />
                {copy.clearAll}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            {copy.disabled}
            {disabledFilter.length > 0 && (
              <Badge variant="default" className="ml-2">
                {disabledFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>{copy.filterByDisability}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniqueDisabledValues.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={disabledFilter.includes(value)}
              onCheckedChange={(checked) => toggleInFilter(checked, value, setDisabledFilter)}
            >
              {value ? copy.disabledYes : copy.disabledNo}
            </DropdownMenuCheckboxItem>
          ))}
          {disabledFilter.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDisabledFilter([])}>
                <X className="mr-2 h-4 w-4" />
                {copy.clearAll}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            {copy.partnerDisabled}
            {partnerDisabledFilter.length > 0 && (
              <Badge variant="default" className="ml-2">
                {partnerDisabledFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>{copy.filterByPartnerDisability}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniquePartnerDisabledValues.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={partnerDisabledFilter.includes(value)}
              onCheckedChange={(checked) => toggleInFilter(checked, value, setPartnerDisabledFilter)}
            >
              {value ? copy.partnerDisabledYes : copy.partnerDisabledNo}
            </DropdownMenuCheckboxItem>
          ))}
          {partnerDisabledFilter.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setPartnerDisabledFilter([])}>
                <X className="mr-2 h-4 w-4" />
                {copy.clearAll}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            {copy.holders}
            {numberOfHoldersFilter.length > 0 && (
              <Badge variant="default" className="ml-2">
                {numberOfHoldersFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>{copy.filterByNumberOfHolders}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniqueNumberOfHoldersValues.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={numberOfHoldersFilter.includes(value)}
              onCheckedChange={(checked) => toggleInFilter(checked, value, setNumberOfHoldersFilter)}
            >
              {value} {copy.holder}{value > 1 ? "s" : ""}
            </DropdownMenuCheckboxItem>
          ))}
          {numberOfHoldersFilter.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setNumberOfHoldersFilter([])}>
                <X className="mr-2 h-4 w-4" />
                {copy.clearAll}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={clearAllFilters}
          className="h-9"
        >
          <X className="mr-2 h-4 w-4" />
          {copy.clearAllFilters}
        </Button>
      )}
    </div>
  )
}
