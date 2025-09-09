"use client"

import * as React from "react"
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

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* Search Input */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tax tables..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-10 max-w-sm"
          />
        </div>
      </div>

      {/* Region Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Region
            {regionFilter.length > 0 && (
              <Badge variant="default" className="ml-2">
                {regionFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Filter by Region</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniqueRegions.map((region) => (
            <DropdownMenuCheckboxItem
              key={region}
              checked={regionFilter.includes(region)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setRegionFilter(prev => [...prev, region])
                } else {
                  setRegionFilter(prev => prev.filter(r => r !== region))
                }
              }}
            >
              {region.charAt(0).toUpperCase() + region.slice(1)}
            </DropdownMenuCheckboxItem>
          ))}
          {regionFilter.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setRegionFilter([])}>
                <X className="mr-2 h-4 w-4" />
                Clear all
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Date Range Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Date Range
            {dateRangeFilter.length > 0 && (
              <Badge variant="default" className="ml-2">
                {dateRangeFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuLabel>Filter by Date Range</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniqueDateRanges.map((dateRange) => (
            <DropdownMenuCheckboxItem
              key={dateRange}
              checked={dateRangeFilter.includes(dateRange)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setDateRangeFilter(prev => [...prev, dateRange])
                } else {
                  setDateRangeFilter(prev => prev.filter(d => d !== dateRange))
                }
              }}
            >
              {formatDateRange(dateRange)}
            </DropdownMenuCheckboxItem>
          ))}
          {dateRangeFilter.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDateRangeFilter([])}>
                <X className="mr-2 h-4 w-4" />
                Clear all
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Married Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Married
            {marriedFilter.length > 0 && (
              <Badge variant="default" className="ml-2">
                {marriedFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Filter by Marital Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniqueMarriedValues.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={marriedFilter.includes(value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setMarriedFilter(prev => [...prev, value])
                } else {
                  setMarriedFilter(prev => prev.filter(v => v !== value))
                }
              }}
            >
              {value ? 'Married' : 'Single'}
            </DropdownMenuCheckboxItem>
          ))}
          {marriedFilter.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setMarriedFilter([])}>
                <X className="mr-2 h-4 w-4" />
                Clear all
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dependents Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Dependents
            {dependentsFilter.length > 0 && (
              <Badge variant="default" className="ml-2">
                {dependentsFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Filter by Dependents</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniqueDependentsValues.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={dependentsFilter.includes(value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setDependentsFilter(prev => [...prev, value])
                } else {
                  setDependentsFilter(prev => prev.filter(v => v !== value))
                }
              }}
            >
              {value ? 'Has Dependents' : 'No Dependents'}
            </DropdownMenuCheckboxItem>
          ))}
          {dependentsFilter.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDependentsFilter([])}>
                <X className="mr-2 h-4 w-4" />
                Clear all
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Disabled Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Disabled
            {disabledFilter.length > 0 && (
              <Badge variant="default" className="ml-2">
                {disabledFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Filter by Disability</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniqueDisabledValues.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={disabledFilter.includes(value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setDisabledFilter(prev => [...prev, value])
                } else {
                  setDisabledFilter(prev => prev.filter(v => v !== value))
                }
              }}
            >
              {value ? 'Person Disabled' : 'Person Not Disabled'}
            </DropdownMenuCheckboxItem>
          ))}
          {disabledFilter.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDisabledFilter([])}>
                <X className="mr-2 h-4 w-4" />
                Clear all
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Partner Disabled Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Partner Disabled
            {partnerDisabledFilter.length > 0 && (
              <Badge variant="default" className="ml-2">
                {partnerDisabledFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Filter by Partner Disability</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniquePartnerDisabledValues.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={partnerDisabledFilter.includes(value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setPartnerDisabledFilter(prev => [...prev, value])
                } else {
                  setPartnerDisabledFilter(prev => prev.filter(v => v !== value))
                }
              }}
            >
              {value ? 'Partner Disabled' : 'Partner Not Disabled'}
            </DropdownMenuCheckboxItem>
          ))}
          {partnerDisabledFilter.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setPartnerDisabledFilter([])}>
                <X className="mr-2 h-4 w-4" />
                Clear all
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Number of Holders Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Holders
            {numberOfHoldersFilter.length > 0 && (
              <Badge variant="default" className="ml-2">
                {numberOfHoldersFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Filter by Number of Holders</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniqueNumberOfHoldersValues.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={numberOfHoldersFilter.includes(value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setNumberOfHoldersFilter(prev => [...prev, value])
                } else {
                  setNumberOfHoldersFilter(prev => prev.filter(v => v !== value))
                }
              }}
            >
              {value} Holder{value > 1 ? 's' : ''}
            </DropdownMenuCheckboxItem>
          ))}
          {numberOfHoldersFilter.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setNumberOfHoldersFilter([])}>
                <X className="mr-2 h-4 w-4" />
                Clear all
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear All Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={clearAllFilters}
          className="h-9"
        >
          <X className="mr-2 h-4 w-4" />
          Clear all filters
        </Button>
      )}
    </div>
  )
}
