"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { simulateDependentWorker } from "saldo-ts"

export function SalarySimulator() {
  const [income, setIncome] = useState("")
  const [numberOfDependents, setNumberOfDependents] = useState("")
  const [married, setMarried] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [partnerDisabled, setPartnerDisabled] = useState(false)
  const [location, setLocation] = useState("continente")
  const [numberOfHolders, setNumberOfHolders] = useState("")
  const [numberOfDependentsDisabled, setNumberOfDependentsDisabled] = useState("")
  const [dateStart, setDateStart] = useState("2025-01-01")
  const [dateEnd, setDateEnd] = useState("2025-12-31")
  const [socialSecurityTaxRate, setSocialSecurityTaxRate] = useState("0.11")
  const [twelfths, setTwelfths] = useState("2")
  const [lunchAllowanceDailyValue, setLunchAllowanceDailyValue] = useState("0")
  const [lunchAllowanceMode, setLunchAllowanceMode] = useState(null)
  const [lunchAllowanceDaysCount, setLunchAllowanceDaysCount] = useState("22")
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSimulate = async () => {
    if (!income || parseFloat(income) <= 0) {
      alert("Please enter a valid income")
      return
    }

    setIsLoading(true)
    try {
      const simulationResult = simulateDependentWorker({
        income: parseFloat(income),
        married: married,
        disabled: disabled,
        partnerDisabled: partnerDisabled,
        location: location,
        numberOfHolders: numberOfHolders ? parseInt(numberOfHolders) : null,
        numberOfDependents: numberOfDependents ? parseInt(numberOfDependents) : null,
        numberOfDependentsDisabled: numberOfDependentsDisabled ? parseInt(numberOfDependentsDisabled) : null,
        dateStart: new Date(dateStart),
        dateEnd: new Date(dateEnd),
        socialSecurityTaxRate: parseFloat(socialSecurityTaxRate),
        twelfths: parseInt(twelfths),
        lunchAllowanceDailyValue: parseFloat(lunchAllowanceDailyValue) || 0,
        lunchAllowanceMode: lunchAllowanceMode,
        lunchAllowanceDaysCount: parseInt(lunchAllowanceDaysCount) || 22,
      })
      setResult(simulationResult)
    } catch (error) {
      console.error("Simulation error:", error)
      alert("Error calculating salary: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portuguese Salary Calculator</CardTitle>
          <CardDescription>
            Calculate your net salary with Portuguese tax deductions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="income">Monthly Gross Income (€)</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="2000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="continente">Continente</option>
                  <option value="acores">Açores</option>
                  <option value="madeira">Madeira</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialSecurityTaxRate">Social Security Tax Rate</Label>
                <Input
                  id="socialSecurityTaxRate"
                  type="number"
                  step="0.01"
                  placeholder="0.11"
                  value={socialSecurityTaxRate}
                  onChange={(e) => setSocialSecurityTaxRate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Personal Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Marital Status</Label>
                <div className="flex items-center space-x-4 pt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="marital"
                      checked={!married}
                      onChange={() => setMarried(false)}
                      className="w-4 h-4"
                    />
                    <span>Single</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="marital"
                      checked={married}
                      onChange={() => setMarried(true)}
                      className="w-4 h-4"
                    />
                    <span>Married</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfHolders">Number of Holders (if married)</Label>
                <Input
                  id="numberOfHolders"
                  type="number"
                  placeholder="1 or 2"
                  min="1"
                  max="2"
                  value={numberOfHolders}
                  onChange={(e) => setNumberOfHolders(e.target.value)}
                  disabled={!married}
                />
              </div>

              <div className="space-y-2">
                <Label>Disability Status</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="disabled"
                    checked={disabled}
                    onChange={(e) => setDisabled(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="disabled">I have a disability</label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Partner Disability Status</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="partnerDisabled"
                    checked={partnerDisabled}
                    onChange={(e) => setPartnerDisabled(e.target.checked)}
                    className="w-4 h-4"
                    disabled={!married}
                  />
                  <label htmlFor="partnerDisabled">Partner has a disability</label>
                </div>
              </div>
            </div>
          </div>

          {/* Dependents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dependents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dependents">Number of Dependents</Label>
                <Input
                  id="dependents"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={numberOfDependents}
                  onChange={(e) => setNumberOfDependents(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependentsDisabled">Number of Disabled Dependents</Label>
                <Input
                  id="dependentsDisabled"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={numberOfDependentsDisabled}
                  onChange={(e) => setNumberOfDependentsDisabled(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tax Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateStart">Start Date</Label>
                <Input
                  id="dateStart"
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateEnd">End Date</Label>
                <Input
                  id="dateEnd"
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Twelfths */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Holiday & Christmas Allowance</h3>
            <div className="space-y-2">
              <Label htmlFor="twelfths">Twelfths Distribution</Label>
              <select
                id="twelfths"
                value={twelfths}
                onChange={(e) => setTwelfths(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="0">None</option>
                <option value="1">One Month (Christmas OR Holiday)</option>
                <option value="2">Two Months (Christmas AND Holiday)</option>
              </select>
            </div>
          </div>

          {/* Lunch Allowance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lunch Allowance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lunchAllowanceDailyValue">Daily Value (€)</Label>
                <Input
                  id="lunchAllowanceDailyValue"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={lunchAllowanceDailyValue}
                  onChange={(e) => setLunchAllowanceDailyValue(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lunchAllowanceMode">Mode</Label>
                <select
                  id="lunchAllowanceMode"
                  value={lunchAllowanceMode || ""}
                  onChange={(e) => setLunchAllowanceMode(e.target.value === "" ? null : e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">None</option>
                  <option value="cupon">Cupon</option>
                  <option value="salary">Salary</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lunchAllowanceDaysCount">Days per Month</Label>
                <Input
                  id="lunchAllowanceDaysCount"
                  type="number"
                  placeholder="22"
                  min="1"
                  max="31"
                  value={lunchAllowanceDaysCount}
                  onChange={(e) => setLunchAllowanceDaysCount(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSimulate} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Calculating..." : "Calculate Salary"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Monthly</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Gross Income:</span>
                    <span className="font-medium">{formatCurrency(result.gross_income)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxable Income:</span>
                    <span className="font-medium">{formatCurrency(result.taxable_income)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Income Tax:</span>
                    <span className="font-medium">-{formatCurrency(result.tax)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Social Security ({(result.social_security_tax * 100).toFixed(1)}%):</span>
                    <span className="font-medium">-{formatCurrency(result.social_security)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Net Salary:</span>
                    <span>{formatCurrency(result.net_salary)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Yearly</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Gross Salary:</span>
                    <span className="font-medium">{formatCurrency(result.yearly_gross_salary)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Net Salary:</span>
                    <span>{formatCurrency(result.yearly_net_salary)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.lunch_allowance && result.lunch_allowance.monthly_value > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-semibold mb-3">Lunch Allowance Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monthly Value:</span>
                      <span className="font-medium">{formatCurrency(result.lunch_allowance.monthly_value)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Free:</span>
                      <span className="font-medium">{formatCurrency(result.lunch_allowance.tax_free_monthly_value)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxable:</span>
                      <span className="font-medium">{formatCurrency(result.lunch_allowance.taxable_monthly_value)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Yearly Value:</span>
                      <span className="font-medium">{formatCurrency(result.lunch_allowance.yearly_value)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}