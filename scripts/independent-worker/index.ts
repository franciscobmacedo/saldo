#!/usr/bin/env tsx

import { chromium, Browser } from 'playwright';
import cliProgress from 'cli-progress';
import { independentWorkerTestScenarios } from './scenarios';
import { IndependentWorkerComparator } from './comparator';

const DEFAULT_TOLERANCE = 1;

interface FailureDetails {
  scenarioName: string;
  observations?: string;
  ourResult: any;
  webResult: any;
  comparisonDetails?: any;
  error?: Error;
  url?: string | null;
}

export async function runScenarioTests(tolerance: number = DEFAULT_TOLERANCE, verbose: boolean = false): Promise<void> {
  console.log("🧪 Starting Independent Worker scenario tests...");
  console.log(`📊 Running ${independentWorkerTestScenarios.length} test scenarios`);
  console.log(`🎯 Tolerance: €${tolerance.toFixed(2)}\n`);

  let passedTests = 0;
  let failedTests = 0;
  const failedScenarios: FailureDetails[] = [];

  let browser: Browser | null = null;

  // Create progress bar
  const progressBar = new cliProgress.SingleBar({
    format: '  {bar} | {percentage}% | {value}/{total} | {status}',
    barCompleteChar: '█',
    barIncompleteChar: '░',
    hideCursor: true,
    clearOnComplete: false,
    barsize: 30,
  }, cliProgress.Presets.shades_classic);

  try {
    // Launch browser once for all tests
    browser = await chromium.launch({ headless: true });
    
    progressBar.start(independentWorkerTestScenarios.length, 0, { status: 'Starting...' });

    for (let i = 0; i < independentWorkerTestScenarios.length; i++) {
      const scenario = independentWorkerTestScenarios[i];
      const page = await browser.newPage();
      
      // Truncate scenario name to fit in progress bar
      const truncatedName = scenario.name.length > 50 
        ? scenario.name.substring(0, 47) + '...' 
        : scenario.name;
      
      progressBar.update(i, { status: truncatedName });
      
      try {
        // Run the comparison using the comparator
        const result = await IndependentWorkerComparator.runSingleComparison(page, scenario.params, tolerance);
        
        if (result.passed) {
          passedTests++;
        } else {
          failedTests++;
          
          // Stop progress bar to show failure details
          progressBar.stop();
          
          console.log(`\n❌ FAILED: ${scenario.name}`);
          if (scenario.observations) {
            console.log(`   📝 Notes: ${scenario.observations}`);
          }
          console.log('   📊 Comparison details:');
          result.details.forEach((detail: any) => {
            const status = detail.matches ? "✅" : "❌";
            console.log(`      ${status} ${detail.name}: Our €${detail.ourResult.toFixed(2)} vs Web €${detail.webResult.toFixed(2)}${!detail.matches ? ` (diff: €${detail.difference.toFixed(2)})` : ''}`);
          });
          console.log(`   🔗 URL: ${result.url}\n`);
          
          // Restart progress bar
          progressBar.start(independentWorkerTestScenarios.length, i + 1, { status: 'Continuing...' });
          
          failedScenarios.push({
            scenarioName: scenario.name,
            observations: scenario.observations,
            ourResult: result.ourResult,
            webResult: result.webResult,
            comparisonDetails: result.details,
            url: result.url,
          });
        }
        
      } catch (error) {
        failedTests++;
        
        // Stop progress bar to show error
        progressBar.stop();
        console.error(`\n❌ Error in scenario "${scenario.name}":`, error);
        
        // Restart progress bar
        progressBar.start(independentWorkerTestScenarios.length, i + 1, { status: 'Continuing...' });
        
        failedScenarios.push({
          scenarioName: scenario.name,
          observations: scenario.observations,
          ourResult: null,
          webResult: null,
          error: error as Error,
          url: null,
        });
      } finally {
        await page.close();
      }
    }
    
    progressBar.update(independentWorkerTestScenarios.length, { status: 'Complete!' });
    progressBar.stop();

  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📈 TEST SUMMARY");
  console.log("=".repeat(60));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📊 Total: ${independentWorkerTestScenarios.length}`);
  console.log(`🎯 Success Rate: ${((passedTests / independentWorkerTestScenarios.length) * 100).toFixed(1)}%`);

  if (failedScenarios.length > 0) {
    console.log("\n❌ Failed scenarios:");
    failedScenarios.forEach((failure, index) => {
      console.log(`\n${index + 1}. ${failure.scenarioName}`);
      if (failure.observations) {
        console.log(`   📝 ${failure.observations}`);
      }
      
      if (verbose) {
        console.log("=".repeat(50));
        
        if (failure.error) {
          console.log("🚨 ERROR:");
          console.log(`   ${failure.error.message}`);
          console.log(`   URL: ${failure.url}`);
        } else if (failure.comparisonDetails) {
          console.log("📊 COMPARISON DETAILS:");
          failure.comparisonDetails.forEach((detail: any) => {
            const status = detail.matches ? "✅" : "❌";
            console.log(`   ${status} ${detail.name}:`);
            console.log(`     Our Result: €${detail.ourResult.toFixed(2)}`);
            console.log(`     Web Result: €${detail.webResult.toFixed(2)}`);
            console.log(`     URL: ${failure.url}`);
            if (!detail.matches) {
              console.log(`     Difference: €${detail.difference.toFixed(2)}`);
            }
          });
        }
        console.log("\n" + "-".repeat(80));
      }
    });
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

// Run the tests if this file is executed directly
if (require.main === module) {
  // Parse command line arguments
  const toleranceArg = process.argv.find(arg => arg.startsWith('--tolerance='));
  const tolerance = toleranceArg ? parseFloat(toleranceArg.split('=')[1]) : DEFAULT_TOLERANCE;
  const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
  
  if (isNaN(tolerance) || tolerance < 0) {
    console.error("❌ Invalid tolerance value. Please provide a positive number.");
    console.error("Usage: tsx index.ts --tolerance=0.01 [--verbose|-v]");
    process.exit(1);
  }
  
  runScenarioTests(tolerance, verbose).catch(console.error);
}
