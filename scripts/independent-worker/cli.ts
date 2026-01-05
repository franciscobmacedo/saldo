#!/usr/bin/env tsx

import { chromium, Browser, Page } from 'playwright';
import { SimulateIndependentWorkerOptions } from '../../src/independent-worker/schemas';
import { IndependentWorkerComparator } from './comparator';



/**
 * Runs a single comparison test
 */
async function runSingleComparison(
  page: Page,
  options: SimulateIndependentWorkerOptions,
  tolerance: number = 0.01
) {
  console.log(`\n🧪 Testing with income: €${options.income}`);
  console.log(`✅ Our simulator calculated successfully`);
  
  const url = IndependentWorkerComparator.buildWebSimulatorUrl(options);
  console.log(`🌐 Navigating to: ${url}`);
  
  const result = await IndependentWorkerComparator.runSingleComparison(page, options, tolerance);
  console.log(`✅ Web simulator results extracted`);
  
  return result;
}

interface CliArgs {
  income?: number;
  tolerance?: number;
  nrDaysOff?: number;
  ssDiscount?: number;
  maxExpensesTax?: number;
  expenses?: number;
  ssTax?: number;
  currentTaxRankYear?: 2023 | 2024 | 2025;
  rnh?: boolean;
  rnhTax?: number;
  dateOfOpeningActivity?: string;
  benefitsOfYouthIrs?: boolean;
  yearOfYouthIrs?: number;
  headless?: boolean;
  help?: boolean;
}

/**
 * Parses command line arguments
 */
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const parsed: CliArgs = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    switch (arg) {
      case '--help':
      case '-h':
        parsed.help = true;
        break;
      case '--income':
        parsed.income = parseFloat(nextArg);
        i++;
        break;
      case '--tolerance':
        parsed.tolerance = parseFloat(nextArg);
        i++;
        break;
      case '--nr-days-off':
        parsed.nrDaysOff = parseInt(nextArg);
        i++;
        break;
      case '--ss-discount':
        parsed.ssDiscount = parseFloat(nextArg);
        i++;
        break;
      case '--max-expenses-tax':
        parsed.maxExpensesTax = parseFloat(nextArg);
        i++;
        break;
      case '--expenses':
        parsed.expenses = parseFloat(nextArg);
        i++;
        break;
      case '--ss-tax':
        parsed.ssTax = parseFloat(nextArg);
        i++;
        break;
      case '--tax-rank-year':
        const year = parseInt(nextArg);
        if ([2023, 2024, 2025].includes(year)) {
          parsed.currentTaxRankYear = year as 2023 | 2024 | 2025;
        }
        i++;
        break;
      case '--rnh':
        parsed.rnh = nextArg === 'true' || nextArg === '1';
        i++;
        break;
      case '--rnh-tax':
        parsed.rnhTax = parseFloat(nextArg);
        i++;
        break;
      case '--date-opening':
        parsed.dateOfOpeningActivity = nextArg;
        i++;
        break;
      case '--youth-irs':
        parsed.benefitsOfYouthIrs = nextArg === 'true' || nextArg === '1';
        i++;
        break;
      case '--year-youth-irs':
        parsed.yearOfYouthIrs = parseInt(nextArg);
        i++;
        break;
      case '--headless':
        parsed.headless = nextArg !== 'false' && nextArg !== '0';
        i++;
        break;
      default:
        // Support legacy positional arguments for backward compatibility
        if (i === 0 && !isNaN(parseFloat(arg))) {
          parsed.income = parseFloat(arg);
        } else if (i === 1 && !isNaN(parseFloat(arg))) {
          parsed.tolerance = parseFloat(arg);
        }
        break;
    }
  }
  
  return parsed;
}

/**
 * Shows help information
 */
function showHelp() {
  console.log(`
🧪 Independent Worker Simulator Comparison Tool

Usage: tsx scripts/independent-worker-comparison.ts [options]

Options:
  --income <amount>           Gross annual income (required)
  --tolerance <amount>        Tolerance for comparison (default: 0.01)
  --nr-days-off <days>        Number of days off (default: 0)
  --ss-discount <percentage>  Social security discount percentage (default: 0)
  --expenses-tax <percentage> Expenses tax percentage
  --max-expenses-tax <amount> Maximum expenses tax amount
  --expenses <amount>         Fixed expenses amount
  --ss-tax <percentage>       Social security tax percentage
  --tax-rank-year <year>      Tax rank year: 2023, 2024, or 2025 (default: 2025)
  --rnh <true|false>          RNH status (default: false)
  --rnh-tax <percentage>      RNH tax percentage
  --date-opening <date>       Date of opening activity (YYYY-MM-DD format)
  --youth-irs <true|false>    Benefits of youth IRS (default: false)
  --year-youth-irs <year>     Year of youth IRS
  --headless <true|false>     Run browser in headless mode (default: true)
  --help, -h                  Show this help message

Examples:
  # Basic usage with income
  tsx scripts/independent-worker-comparison.ts --income 15000
  
  # With additional options
  tsx scripts/independent-worker-comparison.ts --income 25000 --rnh true --youth-irs true --nr-days-off 30
  
  # Using legacy positional arguments (backward compatibility)
  tsx scripts/independent-worker-comparison.ts 15000 0.01
  
  # With opening date and custom tax year
  tsx scripts/independent-worker-comparison.ts --income 30000 --date-opening 2024-06-15 --tax-rank-year 2024
`);
}

/**
 * Validates parsed arguments
 */
function validateArgs(args: CliArgs): string | null {
  if (args.help) return null;
  
  if (!args.income || isNaN(args.income) || args.income <= 0) {
    return 'Income is required and must be a positive number';
  }
  
  if (args.tolerance !== undefined && (isNaN(args.tolerance) || args.tolerance < 0)) {
    return 'Tolerance must be a non-negative number';
  }
  
  if (args.nrDaysOff !== undefined && (isNaN(args.nrDaysOff) || args.nrDaysOff < 0 || args.nrDaysOff > 365)) {
    return 'Number of days off must be between 0 and 365';
  }
  
  if (args.dateOfOpeningActivity) {
    const date = new Date(args.dateOfOpeningActivity);
    if (isNaN(date.getTime())) {
      return 'Date of opening activity must be in YYYY-MM-DD format';
    }
  }
  
  return null;
}

/**
 * Main function to run the comparison
 */
async function main() {
  const args = parseArgs();
  
  if (args.help) {
    showHelp();
    process.exit(0);
  }
  
  const validationError = validateArgs(args);
  if (validationError) {
    console.error(`❌ ${validationError}`);
    console.error('Use --help for usage information');
    process.exit(1);
  }
  
  const income = args.income!;
  const tolerance = args.tolerance ?? 0.01;
  const headless = args.headless ?? true;
  
  console.log('🚀 Starting Independent Worker Simulator Comparison');
  console.log(`💰 Testing with gross annual income: €${income}`);
  console.log(`🎯 Tolerance: €${tolerance}`);
  
  // Show configured options
  const configuredOptions = Object.entries(args)
    .filter(([key, value]) => value !== undefined && !['income', 'tolerance', 'headless', 'help'].includes(key))
    .map(([key, value]) => `${key}: ${value}`);
  
  if (configuredOptions.length > 0) {
    console.log('⚙️  Additional options:', configuredOptions.join(', '));
  }
  console.log('');
  
  let browser: Browser | null = null;
  
  try {
    // Launch browser
    browser = await chromium.launch({ 
      headless
    });
    const page = await browser.newPage();
    
    // Set up options for comparison
    const options: SimulateIndependentWorkerOptions = {
      income,
      nrDaysOff: args.nrDaysOff ?? 0,
      ssDiscount: args.ssDiscount ?? 0,
      maxExpensesTax: args.maxExpensesTax,
      expenses: args.expenses,
      ssTax: args.ssTax,
      currentTaxRankYear: args.currentTaxRankYear ?? 2025,
      rnh: args.rnh ?? false,
      rnhTax: args.rnhTax,
      dateOfOpeningAcivity: args.dateOfOpeningActivity ? new Date(args.dateOfOpeningActivity) : null,
      benefitsOfYouthIrs: args.benefitsOfYouthIrs ?? false,
      yearOfYouthIrs: args.yearOfYouthIrs,
    };
    
    // Run the comparison
    const result = await runSingleComparison(page, options, tolerance);
    
    // Print results
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPARISON RESULTS');
    console.log('='.repeat(80));
    
    for (const detail of result.details) {
      const status = detail.matches ? '✅' : '❌';
      console.log(`${status} ${detail.name}:`);
      console.log(`    Our Result: €${detail.ourResult.toFixed(2)}`);
      console.log(`    Web Result: €${detail.webResult.toFixed(2)}`);
      if (!detail.matches) {
        console.log(`    Difference: €${detail.difference.toFixed(2)}`);
      }
    }
    
    console.log('\n' + '='.repeat(80));
    if (result.passed) {
      console.log('🎉 ALL TESTS PASSED! Our simulator matches the web simulator.');
    } else {
      console.log('⚠️  SOME TESTS FAILED! There are differences between simulators.');
    }
    console.log('='.repeat(80));
    
    process.exit(result.passed ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Error during comparison:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { main as runIndependentWorkerComparison };
