"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { formatCurrency, formatPercentage, formatBracketLimit } from "./utils"

const COPY = {
  pt: {
    incomeRange: "Intervalo de rendimento",
    marginalRate: "Taxa marginal",
    deduction: "Deducao",
    dependentAddition: "Dep. Adicional",
    effectiveRate: "Taxa efetiva",
  },
  en: {
    incomeRange: "Income Range",
    marginalRate: "Marginal Rate",
    deduction: "Deduction",
    dependentAddition: "Dep. Add.",
    effectiveRate: "Eff. Rate",
  },
}

export function BracketTable({ brackets, lang = "pt", locale = "pt-PT" }) {
  const copy = COPY[lang]

  const columns = React.useMemo(() => [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "limit",
      header: copy.incomeRange,
      cell: ({ row }) => formatBracketLimit(row.original, locale),
    },
    {
      accessorKey: "max_marginal_rate",
      header: copy.marginalRate,
      cell: ({ row }) => (
        <Badge variant="secondary">
          {formatPercentage(row.original.max_marginal_rate)}
        </Badge>
      ),
    },
    {
      accessorKey: "deduction",
      header: copy.deduction,
      cell: ({ row }) => {
        const bracket = row.original
        const hasVar1 = bracket.var1_deduction && bracket.var1_deduction !== 0
        const hasVar2 = bracket.var2_deduction && bracket.var2_deduction !== 0

        if (hasVar1 && hasVar2) {
          const marginalRate = formatPercentage(bracket.max_marginal_rate)
          const var2Value = formatCurrency(bracket.var2_deduction, locale)
          return (
            <div className="text-sm font-mono">
              {marginalRate} * {bracket.var1_deduction} * ({var2Value} - R)
            </div>
          )
        } else if (hasVar1) {
          return formatCurrency(bracket.var1_deduction, locale)
        } else if (hasVar2) {
          return formatCurrency(bracket.var2_deduction, locale)
        } else {
          return formatCurrency(bracket.deduction, locale)
        }
      },
    },
    {
      accessorKey: "dependent_aditional_deduction",
      header: copy.dependentAddition,
      cell: ({ row }) => formatCurrency(row.original.dependent_aditional_deduction, locale),
    },
    {
      accessorKey: "effective_mensal_rate",
      header: copy.effectiveRate,
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
  ], [copy, locale])

  return <DataTable data={brackets} columns={columns} lang={lang} filterColumnId="limit" />
}
