"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { formatCurrency, formatPercentage, formatBracketLimit } from "./utils"

// Bracket table component using DataTable
export function BracketTable({ brackets }) {
  const columns = React.useMemo(() => [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "limit",
      header: "Income Range",
      cell: ({ row }) => formatBracketLimit(row.original),
    },
    {
      accessorKey: "max_marginal_rate",
      header: "Marginal Rate",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {formatPercentage(row.original.max_marginal_rate)}
        </Badge>
      ),
    },
    {
      accessorKey: "deduction",
      header: "Deduction",
      cell: ({ row }) => {
        const bracket = row.original
        const hasVar1 = bracket.var1_deduction && bracket.var1_deduction !== 0
        const hasVar2 = bracket.var2_deduction && bracket.var2_deduction !== 0

        if (hasVar1 && hasVar2) {
          // Show formula format when both var1 and var2 exist
          const marginalRate = formatPercentage(bracket.max_marginal_rate)
          const var2Value = formatCurrency(bracket.var2_deduction)
          return (
            <div className="text-sm font-mono">
              {marginalRate} * {bracket.var1_deduction} * ({var2Value} - R)
            </div>
          )
        } else if (hasVar1) {
          return formatCurrency(bracket.var1_deduction)
        } else if (hasVar2) {
          return formatCurrency(bracket.var2_deduction)
        } else {
          return formatCurrency(bracket.deduction)
        }
      },
    },
    {
      accessorKey: "dependent_aditional_deduction",
      header: "Dep. Add.",
      cell: ({ row }) => formatCurrency(row.original.dependent_aditional_deduction),
    },
    {
      accessorKey: "effective_mensal_rate",
      header: "Eff. Rate",
      cell: ({ row }) => {
        const rate = row.original.effective_mensal_rate
        return rate === -1 ? (
          <span className="text-muted-foreground">-</span>
        ) : (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {formatPercentage(rate)}
          </Badge>
        )
      },
    },
  ], [])

  return <DataTable data={brackets} columns={columns} />
}
