# Independent Worker Test Scenarios

This directory contains comparison scenarios for the `simulateIndependentWorker` function. They are executed through Playwright against the public web simulator (`https://freelancept.fmacedo.com`).

## Running the suite

```bash
# Full run (headless Playwright)
pnpm compare:independent

# Custom tolerance (default: €1.00) and verbose diffs
pnpm compare:independent -- --tolerance=0.05 --verbose
```

## Structure

The scenarios are organized into categories based on different aspects of independent worker calculations:

### 📁 Basic (`basic/`)
- Standard profiles with varied income frequencies and days off

### 📁 Income Levels (`income-level/`)
- Coverage from €5,000 to €150,000 to exercise every IRS bracket (2023-2025)

### 📁 Income Frequency (`income-frequency/`)
- Yearly, monthly, and daily flows using the 248 business-day calendar and `nrDaysOff`

### 📁 Expenses (`expenses/`)
- Simplified regime caps, declared expenses vs. missing expenses, and organized accounting toggles

### 📁 Regional Periods (`regional/`)
- Period-sensitive cases (Jan–Jul, Aug–Sep, Oct–Dec) to validate IAS and tax-rank year handling

### 📁 Social Security (`social-security/`)
- Rate overrides, discounts (-25% to +25%), caps (12× IAS), and first-12-month exemptions

### 📁 RNH (`rnh/`)
- Flat-rate RNH paths vs. progressive brackets, including custom `rnhTax`

### 📁 Edge Cases (`edge-cases/`)
- Parameter boundaries, date-based first/second year flags, and calculation cliffs

### 📁 Configuration (`configuration/`)
- Default-value coverage and mixed parameter combinations

### 📁 Real World (`real-world/`)
- Practical freelancer profiles and seasonal patterns

### 📁 Errors (`error-scenarios/`)
- Invalid inputs that should trigger validation errors

## Current Test Coverage

### Youth IRS coverage
- Benefits across allowed years (up to 10 years in 2025 tables) with IAS-capped discounts

## Test Scenario Format

Each scenario follows this structure:

```typescript
{
  name: string;                              // Descriptive test name
  observations?: string;                     // Optional notes about the scenario
  params: SimulateIndependentWorkerOptions;  // Parameters for our simulator
}
```

## Usage

Import and use the scenarios in your tests:

```typescript
import { independentWorkerTestScenarios } from './scenarios';
import { simulateIndependentWorker } from '../../src/independent-worker/simulator';

// Run a specific scenario
const scenario = independentWorkerTestScenarios[0];
const result = simulateIndependentWorker(scenario.params);
```

## Future Expansion

This structure can be expanded to include:

### 📊 Advanced Scenarios
- **First Year Benefits** - New business opening activity benefits
- **Second Year Benefits** - Second year business benefits
- **Social Security Discounts** - Various SS discount scenarios
- **Complex Expense Structures** - Mixed expense rates and limits

### 🌍 Regional Scenarios
- **Different Tax Years** - 2023, 2024 tax table comparisons
- **Historical Comparisons** - Year-over-year changes

### 🔄 Edge Cases
- **Maximum Income** - Testing income caps and limits
- **Boundary Conditions** - Testing edge values
- **Error Scenarios** - Invalid input handling

### 🤖 Automation
- **API Comparison** - Compare with external calculators
- **Regression Testing** - Automated test suite
- **Performance Testing** - Load and performance scenarios

## Adding New Scenarios

1. Create a new file in the appropriate category directory
2. Define scenarios following the `IndependentWorkerTestScenario` interface
3. Export the scenarios array
4. Add the import and spread in `scenarios/index.ts`

Example:
```typescript
// scenarios/advanced/rnh-advanced-scenarios.ts
export const rnhAdvancedScenarios: IndependentWorkerTestScenario[] = [
  // ... scenarios
];

// scenarios/index.ts
import { rnhAdvancedScenarios } from "./advanced/rnh-advanced-scenarios";

export const independentWorkerTestScenarios: IndependentWorkerTestScenario[] = [
    ...basicIndependentWorkerScenarios,
    ...rnhAdvancedScenarios, // Add new scenarios here
];
```
