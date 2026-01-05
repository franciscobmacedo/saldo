# Independent Worker Test Scenarios

This directory contains test scenarios for the `simulateIndependentWorker` function. These scenarios can be used for testing, validation, and comparison with external calculators.

## Structure

The scenarios are organized into categories based on different aspects of independent worker calculations:

### 📁 Basic Scenarios (`basic/`)
- **Basic Independent Worker Scenarios** - Standard scenarios with various income levels and frequencies
- **Income Frequency Testing** - Yearly, monthly, and daily income calculations
- **Expense Scenarios** - Testing with declared expenses and deductions
- **Youth IRS Benefits** - Scenarios for workers under 35 with tax benefits
- **RNH Scenarios** - Resident Non-Habitual tax regime scenarios

## Current Test Coverage

### 💰 Income Scenarios
- **Low Income** - €15,000 - €20,000 yearly (testing lower tax brackets)
- **Medium Income** - €25,000 - €30,000 yearly (testing middle tax brackets)
- **High Income** - €40,000 - €50,000 yearly (testing higher tax brackets)

### 📅 Income Frequency Scenarios
- **Yearly** - Standard annual income calculations
- **Monthly** - Monthly contractor scenarios (€2,000/month)
- **Daily** - Daily contractor scenarios (€100/day with days off)

### 🧾 Expense Scenarios
- **No Expenses** - Standard simplified regime (15% expense rate)
- **Declared Expenses** - Scenarios with actual declared expenses (€3,000)

### 👶 Youth IRS Scenarios
- **Youth Benefits** - Workers under 35 with progressive tax benefits
- **Different Benefit Years** - Testing 1st, 2nd year benefits

### 🏖️ RNH Scenarios
- **RNH Regime** - 20% flat tax rate for qualified activities
- **Standard vs RNH** - Comparison scenarios

### ⚙️ Configuration Scenarios
- **Social Security Rates** - Standard 21.4% rate testing
- **Tax Years** - 2025 tax tables (latest available)
- **Days Off** - Impact of non-working days on daily contractors

## Test Scenario Format

Each scenario follows this structure:

```typescript
{
  name: string;                              // Descriptive test name
  observations?: string;                     // Optional notes about the scenario
  saldoRequest: SimulateIndependentWorkerOptions; // Parameters for our simulator
}
```

## Usage

Import and use the scenarios in your tests:

```typescript
import { independentWorkerTestScenarios } from './scenarios';
import { simulateIndependentWorker } from '../../src/independent-worker/simulator';

// Run a specific scenario
const scenario = independentWorkerTestScenarios[0];
const result = simulateIndependentWorker(scenario.saldoRequest);
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
