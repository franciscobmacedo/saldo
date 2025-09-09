"use client"

import * as React from "react"
import { Copy, Eye, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BracketTable } from "./BracketTable"
import { formatCurrency, generateGitHubUrl } from "./utils"

// Tax table card component
export function TaxTableCard({ table }) {
  const handleCopyData = () => {
    const jsonData = JSON.stringify(table.rawData, null, 2)
    navigator.clipboard.writeText(jsonData)
  }

  return (
    <Card className="hover:shadow-md transition-shadow max-w-md">
      <CardHeader>
        <div className="flex flex-col items-start justify-between gap-2 h-full">
          <div className="flex flex-col items-start justify-start">
            <CardTitle className="mb-3 text-sm leading-tight">
              {table.tableName}: {table.description}
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span>{table.formattedDateRange}</span>
              <Badge variant="outline" className="capitalize text-xs shrink-0">
                {table.region}
              </Badge>
            </div>
          </div>

          <CardAction>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyData}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(generateGitHubUrl(table.id), '_blank')}
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl min-w-6/7 overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{table.description}</DialogTitle>
                    <DialogDescription>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {table.year}
                        </Badge>
                        <Badge variant="outline" className="capitalize text-xs">
                          {table.region}
                        </Badge>
                        <span>{table.formattedDateRange}</span>
                        <Badge variant="outline" className="text-xs">
                          {table.situationCode}
                        </Badge>
                        {table.dependentDisabledDeduction > 0 && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                            Disabled deduction: {formatCurrency(table.dependentDisabledDeduction)}
                          </Badge>
                        )}
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Tax Brackets</h4>
                    <BracketTable brackets={table.brackets} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardAction>
        </div>
      </CardHeader>
    </Card>
  )
}
