# saldo

A comprehensive TypeScript library for calculating Portuguese taxes for both dependent (category A/H) and independent (category B) workers.

## 🇵🇹 About

`saldo` provides accurate calculations for Portuguese income tax and social security:
- **Dependent workers**: official 2025 retention tables (continent, Azores, Madeira), lunch allowances, and holiday bonus twelfths.
- **Independent workers**: simplified regime calculations with youth IRS benefits, RNH flat rate, expense caps, social security caps/discounts, and first/second year rules.

## ✨ Features

- 📊 **Dependent worker calculations**: 2025 IRS retention tables with regional coverage and twelfths/holiday handling
- 🍽️ **Allowances**: Meal vouchers vs. cash allowances with the correct taxable/tax-free split
- 🧮 **Independent worker simulator**: Simplified regime with expense caps, specific deductions, and year-based business-day defaults
- 🧒 **Youth IRS + RNH**: Year-capped youth IRS discounts (per IAS limits) and RNH flat-rate option
- 🛡️ **Social security**: Rate overrides, discounts, caps (12× IAS), and first-12-month exemption for new activities
- 🔎 **Validation**: Detailed input validation errors for misconfigured scenarios

## 📦 Installation

```bash
pnpm add saldo
# or
npm install saldo
# or
yarn add saldo
```

## 🚀 Quick Start (CLI)

You can use saldo directly from your terminal after installing it globally:

```bash
# Global installation for CLI usage
pnpm install -g saldo

# Dependent worker
saldo dependent --year 2025 --income 1500 --twelfths 2

# Independent worker
saldo independent --income 30000 --expenses 2500 --benefits-of-youth-irs

# Parse and simulate directly from a Green Receipts CSV
saldo independent-csv --csv path/to/receipts.csv
```

## 🚀 Quick Start (Library)

```typescript
import {
  simulateDependentWorker,
  simulateIndependentWorker,
  Twelfths,
  FrequencyChoices,
} from 'saldo';

// Dependent worker (monthly income, calculates full year breakdown)
const dependent = simulateDependentWorker({
  year: 2025,
  income: 1500,
  twelfths: Twelfths.TWO_MONTHS,
  location: 'continent',
});

// Access per-month breakdown
const january = dependent.monthlyBreakdown[0];
console.log(`January Net: €${january.netIncome.totalAmount.toFixed(2)}`);
console.log(`Annual Total Net: €${dependent.yearly.totalNetIncomeAmount.toFixed(2)}`);

// Independent worker (annual income, simplified regime)
const independent = simulateIndependentWorker({
  income: 30000,
  incomeFrequency: FrequencyChoices.Year,
  expenses: 2500,
  benefitsOfYouthIrs: true,
  yearOfYouthIrs: 1,
});

console.log(`Independent Net Income (year): €${independent.netIncome.year.toFixed(2)}`);
```

## 📖 Usage Examples

### Dependent worker scenarios

```typescript
// Married household with dependents
const married = simulateDependentWorker({
  year: 2025,
  income: 2500,
  married: true,
  numberOfHolders: 2,
  numberOfDependents: 2,
  location: "continent",
});

console.log(`Annual Net: €${married.yearly.totalNetIncomeAmount.toFixed(2)}`);

// Worker with disability and meal vouchers
const disabled = simulateDependentWorker({
  year: 2025,
  income: 1800,
  disabled: true,
  partnerDisabled: true,
  married: true,
  numberOfHolders: 1,
  lunchAllowanceDailyValue: 8.5,
  lunchAllowanceMode: "salary",
});

// Azores with twelfths distributed
const azores = simulateDependentWorker({
  year: 2025,
  income: 1600,
  location: "azores",
  twelfths: Twelfths.TWO_MONTHS,
});
```

### Independent worker scenarios

```typescript
import { FrequencyChoices } from "saldo";

// Monthly freelancer with days off and simplified regime
const freelancer = simulateIndependentWorker({
  income: 2500,
  incomeFrequency: FrequencyChoices.Month,
  nrDaysOff: 25, // yearly days off
  expenses: 1800, // declared expenses
  ssDiscount: -0.1, // 10% reduction
});

// RNH flat rate with youth IRS benefits
const rnh = simulateIndependentWorker({
  income: 45000,
  rnh: true,
  rnhTax: 0.2,
  benefitsOfYouthIrs: true,
  yearOfYouthIrs: 2,
});
```

## 🏗️ API Reference

### `simulateDependentWorker(options: SimulateDependentWorkerOptions)`

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `year` | `number` | **required** | Tax year (e.g. `2025`) |
| `income` | `number` | **required** | Monthly gross income in EUR |
| `married` | `boolean` | `false` | Marital status |
| `disabled` | `boolean` | `false` | Worker disability status |
| `partnerDisabled` | `boolean` | `false` | Partner disability status |
| `location` | `"continent" \| "azores" \| "madeira"` | `"continent"` | Tax location |
| `numberOfHolders` | `number \| null` | `null` | Number of income holders |
| `numberOfDependents` | `number \| null` | `null` | Number of dependents |
| `numberOfDependentsDisabled` | `number \| null` | `null` | Number of disabled dependents |
| `socialSecurityContributionRate` | `number` | `0.11` | Social security contribution rate (11%) |
| `twelfths` | `Twelfths` | `TWO_MONTHS` | Holiday bonus distribution |
| `lunchAllowanceDailyValue` | `number` | `10.2` | Daily lunch allowance value |
| `lunchAllowanceMode` | `"cupon" \| "salary"` | `"cupon"` | Lunch allowance type |
| `lunchAllowanceDaysCount` | `number` | `22` | Monthly lunch allowance days |
| `includeLunchAllowanceInJune` | `boolean` | `false` | Whether June includes lunch allowance |
| `oneHalfMonthTwelfthsLumpSumMonth` | `"june" \| "december"` | `"december"` | Which month receives the ONE_HALF_MONTH lump sum |

#### Returns: `DependentWorkerResult`

```typescript
interface DependentWorkerResult {
  yearly: {
    totalGrossIncomeAmount: number;      // Annual gross income
    totalNetIncomeAmount: number;        // Annual net income
    totalLunchAllowanceGrossAmount: number; // Annual lunch allowance
  };
  socialSecurityContributionRate: number; // SS rate applied
  monthlyBreakdown: MonthlyBreakdownResult[]; // 12-entry array, one per month
}

// Each MonthlyBreakdownResult includes:
interface MonthlyBreakdownResult {
  month: MonthName;
  period: PeriodT;
  grossIncome: GrossIncomeAmountBreakdown;
  irsWithholdingTax: IncomeComponentAmountBreakdown; // .totalAmount, .fromBaseSalaryAmount, ...
  socialSecurityContribution: IncomeComponentAmountBreakdown;
  netIncome: IncomeComponentAmountBreakdown; // .totalAmount is the monthly net
  lunchAllowance: LunchAllowanceAmountBreakdown;
  subsidyTwelfths: SubsidyTwelfthsAmountBreakdown;
  bracket: BracketResult;
  taxRetentionTable: TaxRetentionTableResult;
}
```

### `simulateIndependentWorker(options: SimulateIndependentWorkerOptions)`

Key parameters:
- `income`: Gross income (year/month/day depending on `incomeFrequency`)
- `incomeFrequency`: `"year"` (default), `"month"`, or `"day"` (uses year-specific business days)
- `yearBusinessDays`: Optional override for the year business-day baseline (ideal for UI customization)
- `nrDaysOff`: Days off for daily calculations (cannot reach/exceed resolved `yearBusinessDays`)
- `ssTax`: Social security rate (default 21.4%), `ssDiscount`: adjustment range -25%..25%
- `currentTaxRankYear`: 2023/2024/2025/2026 progressive IRS tables
- `maxExpensesTax`: Simplified regime percentage (default 15%) and `expenses`: declared expenses
- `dateOfOpeningActivity`: Determines first/second year factors and first-12-month SS exemption
- `rnh` / `rnhTax`: Apply RNH flat rate instead of progressive brackets
- `benefitsOfYouthIrs` + `yearOfYouthIrs`: Youth IRS discount with IAS caps (up to 10 years in 2025 tables)

Return highlights:
- `grossIncome`, `taxableIncome`, `netIncome`, `ssPay`, `irsPay` (per year/month/day)
- `specificDeductions` (max of €4104 vs 10% SS)
- `expensesNeeded` (missing expenses to hit the simplified cap)
- `youthIrsDiscount`, `taxRank`, `currentIas`, `maxSsIncome`
- Flags: `workerWithinFirstFinancialYear`, `workerWithinSecondFinancialYear`, `workerWithinFirst12Months`

## 🧪 Development

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Setup

```bash
pnpm install

# Run unit tests
pnpm test

# Build the library
pnpm build

# Run documentation site (builds the lib first)
pnpm saldo:docs
```

### Comparison suites

- Dependent worker vs. Doutor Finanças: `pnpm compare:dependent [-- --tolerance=1 --verbose]`
- Independent worker vs. web simulator: `pnpm compare:independent [-- --tolerance=1 --verbose]`

Both suites stream progress and highlight mismatches with detailed diffs.

### Project Structure

```
saldo/
├── src/                          # Library source code
│   ├── dependent-worker/         # Main calculation logic
│   ├── data/                     # Tax retention tables
│   ├── tables/                   # Tax table utilities
│   └── config/                   # Configuration and schemas
├── docs/                         # Documentation website (Next.js)
├── scripts/                      # Data processing scripts
├── raw/                          # Raw tax data (unprocessed)
└── tests/                        # Test files
```

## 🚢 Releasing

This project uses GitHub Actions for automated releases. To create a new release:

1. Go to the **Actions** tab in the GitHub repository
2. Select the **Release** workflow in the left sidebar
3. Click **Run workflow**
4. Choose a version type:
   - `patch` — 1.0.0 → 1.0.1 (bug fixes)
   - `minor` — 1.0.0 → 1.1.0 (new features)
   - `major` — 1.0.0 → 2.0.0 (breaking changes)
   - `prerelease` — creates a beta prerelease (e.g., 1.0.0 → 1.0.1-beta.0)
5. Click **Run workflow**

The workflow will automatically:
- Run tests
- Build the package
- Bump the version in `package.json`
- Create a git tag
- Push changes to `main`
- Create a GitHub Release
- Publish to NPM

**Note:** Requires `NPM_TOKEN` secret to be configured in GitHub repository settings.

## 📚 Documentation

Visit the documentation site for guides, scenarios, and API reference:

```bash
pnpm saldo:docs
```

The docs cover dependent and independent simulators, tax tables, lunch allowances, and worked examples.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## ⚖️ Legal Notice

This library uses official Portuguese tax retention tables and follows Portuguese tax law. However, it's provided for informational purposes only. Always consult with a qualified tax professional for official tax advice.

---

Made with ❤️ for the Portuguese developer community 
