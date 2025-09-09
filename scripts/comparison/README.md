# Comparison Tests with Doutor Finanças

This comprehensive test suite compares the results of the `simulateDependentWorker` function with the Doutor Finanças online calculator API across hundreds of scenarios.

## Running the Tests

```bash
# Run all comparison tests
pnpm run test:compare

# Run with custom tolerance (default: €0.01)
tsx scripts/comparison/index.ts --tolerance=0.05

# Run with verbose output for failed scenarios
tsx scripts/comparison/index.ts --verbose
```

## Test Coverage

The test suite includes **hundreds of scenarios** organized into comprehensive categories:

### 🏠 Marital Status Scenarios
- **Single Person** - Various salary levels and configurations
- **Married (1 Holder)** - Single income households with dependents
- **Married (2 Holders)** - Dual income households

### 🌍 Regional Scenarios
- **Continente** - Mainland Portugal scenarios
- **Açores** - Azores-specific tax calculations
- **Madeira** - Madeira-specific tax calculations
- **Regional Edge Cases** - Boundary conditions and special cases

### ♿ Disability Scenarios
- **Person Disability** - Taxpayer with disability above 60%
- **Spouse Disability** - Spouse with disability
- **Dependents Disability** - Children with disabilities
- **Combined Disability** - Multiple family members with disabilities

### 👨‍👩‍👧‍👦 Dependents Scenarios
- **0-3+ Dependents** - Various family sizes
- **Disabled Dependents** - Children with special needs
- **Complex Family Structures** - Mixed disability scenarios

### 🍽️ Lunch Allowance Scenarios
- **Voucher Cards** - Standard meal vouchers (€10.20/day)
- **Cash Allowances** - Cash-based meal allowances
- **Salary Mode** - Meal allowance as part of salary
- **Edge Cases** - Unusual allowance configurations

### 📅 Twelfths Scenarios
- **No Twelfths** - Standard monthly payments
- **Half Month** - 1x50% allowance
- **One Month** - 2x50% allowances
- **Two Months** - 2x100% allowances
- **Edge Cases** - Boundary conditions

### 💰 Social Security Scenarios
- **9% Rate** - Lower social security contribution
- **11% Rate** - Standard social security contribution
- **Rate Variations** - Different contribution scenarios

### 📊 Edge Cases & Boundary Conditions
- **Date Range Edge Cases** - Multiple periods, boundaries, full/partial year
- **Mid-Year Periods** - August-September 2025 scenarios
- **Late-Year Periods** - October-December 2025 scenarios
- **Maximum Income** - €5000+ and highest tax brackets
- **General Edge Cases** - Boundary conditions and special situations

## Comparisons Made

For each scenario, the script compares:

- **Gross Salary** - Total salary including meal allowances and twelfths
- **Net Salary** - Take-home pay after taxes and social security
- **IRS Retention** - Income tax withheld
- **Social Security** - Social security contributions

## Configuration

### Tolerance
- **Default**: €0.01 (1 cent)
- **Customizable**: Use `--tolerance=X.XX` parameter
- **Purpose**: Accounts for minor rounding differences between calculators

### API Behavior
- **Rate Limiting**: Respectful delays between API calls (currently disabled for speed)
- **Error Handling**: Comprehensive error reporting with detailed failure analysis
- **Verbose Mode**: Detailed output for failed scenarios including request/response data

## Output Format

The script provides:
- ✅ **Success indicators** for matching results
- ❌ **Failure indicators** with exact differences shown
- 📊 **Summary statistics** at the end
- 🚨 **Detailed error reporting** for debugging
- **Exit codes**: 0 for success, 1 for any failures

## Test Data

- **Tax Year**: 2025 (latest tax tables)
- **Default Meal Cards**: Voucher type, €10.20 daily value, 22 days
- **Social Security**: 11% standard rate
- **Salary Ranges**: €500 - €5000+ (comprehensive coverage)
- **Regional Coverage**: Continente, Açores, Madeira

## Known Issues

Some scenarios are currently commented out due to discrepancies with Doutor Finanças:
- **Table Selection Issues**: DF sometimes uses incorrect tax tables
- **Regional Edge Cases**: Specific regional scenarios with table mismatches
- **Date Range Issues**: Period-specific table selection problems

These are documented in the code and represent areas where the Doutor Finanças calculator may have bugs or different interpretations of tax rules.
