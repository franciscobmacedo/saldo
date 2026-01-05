# saldo

A comprehensive TypeScript library for calculating Portuguese salary taxes, social security contributions, and net salary for dependent workers.

## 🇵🇹 About

`saldo` provides accurate salary calculations based on official Portuguese tax retention tables. It supports different Portuguese locations (Continent, Azores, Madeira), various tax situations, and includes features like lunch allowances and holiday bonus distributions.

## ✨ Features

- 📊 **Accurate Tax Calculations**: Uses official Portuguese tax retention tables (2024-2025)
- 🗺️ **Multi-location Support**: Continent, Azores, and Madeira tax tables
- 👥 **Complex Tax Situations**: Married/single, disabled workers, dependents
- 🍽️ **Lunch Allowances**: Supports both coupon and salary-based allowances  
- 🎁 **Holiday Bonuses**: Handles Christmas and holiday allowance distributions
- 📅 **Date-specific**: Accurate calculations based on tax table periods
- 🧮 **Complete Breakdown**: Gross salary, taxes, social security, and net salary
- 📈 **Yearly Projections**: Both monthly and yearly salary calculations

## 📦 Installation

```bash
pnpm add saldo
# or
npm install saldo
# or
yarn add saldo
```

## 🚀 Quick Start

```typescript
import { simulateDependentWorker, Twelfths } from 'saldo';

// Basic salary calculation
const result = simulateDependentWorker({
  income: 1500, // Monthly gross income in EUR
});

console.log(`Net Salary: €${result.netSalary.toFixed(2)}`);
console.log(`Tax: €${result.tax.toFixed(2)}`);
console.log(`Social Security: €${result.socialSecurity.toFixed(2)}`);
```

## 📖 Usage Examples

### Basic Single Worker

```typescript
const basicResult = simulateDependentWorker({
  income: 2000,
  location: "continent"
});
```

### Married Worker with Dependents

```typescript
const marriedResult = simulateDependentWorker({
  income: 2500,
  married: true,
  numberOfHolders: 2,
  numberOfDependents: 2,
  location: "continent"
});
```

### Worker with Disabilities and Custom Lunch Allowance

```typescript
const disabledResult = simulateDependentWorker({
  income: 1800,
  disabled: true,
  partnerDisabled: true,
  married: true,
  numberOfHolders: 1,
  lunchAllowanceDailyValue: 8.50,
  lunchAllowanceMode: "salary",
  lunchAllowanceDaysCount: 22
});
```

### Azores Location with Holiday Bonuses

```typescript
const azoresResult = simulateDependentWorker({
  income: 1600,
  location: "azores",
  twelfths: Twelfths.TWO_MONTHS, // Christmas + Holiday allowance
  period: "2025-01-01_2025-07-31" // Tax period
});
```

## 🏗️ API Reference

### `simulateDependentWorker(options: SimulateDependentWorkerOptions)`

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `income` | `number` | **required** | Monthly gross income in EUR |
| `married` | `boolean` | `false` | Marital status |
| `disabled` | `boolean` | `false` | Worker disability status |
| `partnerDisabled` | `boolean` | `false` | Partner disability status |
| `location` | `"continent" \| "azores" \| "madeira"` | `"continent"` | Tax location |
| `numberOfHolders` | `number \| null` | `null` | Number of income holders |
| `numberOfDependents` | `number \| null` | `null` | Number of dependents |
| `numberOfDependentsDisabled` | `number \| null` | `null` | Number of disabled dependents |
| `period` | `PeriodT` | `"2025-01-01_2025-07-31"` | Tax period |
| `socialSecurityTaxRate` | `number` | `0.11` | Social security tax rate (11%) |
| `twelfths` | `Twelfths` | `TWO_MONTHS` | Holiday bonus distribution |
| `lunchAllowanceDailyValue` | `number` | `10.2` | Daily lunch allowance value |
| `lunchAllowanceMode` | `"cupon" \| "salary"` | `"cupon"` | Lunch allowance type |
| `lunchAllowanceDaysCount` | `number` | `22` | Monthly lunch allowance days |

#### Returns: `DependentWorkerResult`

```typescript
interface DependentWorkerResult {
  taxableIncome: number;      // Monthly taxable income
  grossIncome: number;        // Monthly gross income
  tax: number;               // Monthly tax amount
  socialSecurity: number;    // Monthly social security contribution
  socialSecurityTax: number; // Social security tax rate
  netSalary: number;         // Monthly net salary
  yearlyNetSalary: number;   // Yearly net salary (14 months)
  yearlyGrossSalary: number; // Yearly gross salary (14 months)
  lunchAllowance: LunchAllowance; // Lunch allowance details
}
```

### `Twelfths` Enum

```typescript
enum Twelfths {
  NONE = 0,       // No holiday bonuses
  ONE_MONTH = 1,  // Christmas OR Holiday allowance
  TWO_MONTHS = 2  // Christmas AND Holiday allowance
}
```

## 🧪 Development

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd saldo

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the library
pnpm build

# Run documentation site
pnpm docs
```

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

Visit our comprehensive documentation site for detailed guides, examples, and API reference:

```bash
pnpm docs
```

The documentation includes:
- Getting started guide
- Tax situations explanations
- Lunch allowance guide
- API reference with examples
- Calculator showcase

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