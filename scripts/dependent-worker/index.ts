#!/usr/bin/env tsx

import cliProgress from "cli-progress";
import { simulateDependentWorker } from "../../src/dependent-worker/simulator";
import { DoutorFinancasAPI } from "./api-client";
import { TestComparator } from "./comparator";
import { testScenarios } from "./scenarios";

const DEFAULT_TOLERANCE = 1;
interface FailureDetails {
  scenarioName: string;
  saldoRequest: Parameters<typeof simulateDependentWorker>[0];
  doutorFinancasRequest: any;
  saldoResult: ReturnType<typeof simulateDependentWorker> | null;
  doutorResult: any | null;
  comparisonDetails?: any;
  error?: Error;
}

export async function runComparisonTests(
  tolerance: number = DEFAULT_TOLERANCE,
  verbose: boolean = false
): Promise<void> {
  console.log(
    "🧪 Starting comparison tests between Saldo and Doutor Finanças..."
  );
  console.log(`📊 Running ${testScenarios.length} test scenarios`);
  console.log(`🎯 Tolerance: €${tolerance.toFixed(2)}\n`);

  let passedTests = 0;
  let failedTests = 0;
  const failedScenarios: FailureDetails[] = [];

  // Create progress bar
  const progressBar = new cliProgress.SingleBar({
    format: '  {bar} | {percentage}% | {value}/{total} | {status}',
    barCompleteChar: '█',
    barIncompleteChar: '░',
    hideCursor: true,
    clearOnComplete: false,
    barsize: 30,
  }, cliProgress.Presets.shades_classic);

  progressBar.start(testScenarios.length, 0, { status: 'Starting...' });

  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i];
    
    // Truncate scenario name to fit in progress bar
    const truncatedName = scenario.name.length > 50 
      ? scenario.name.substring(0, 47) + '...' 
      : scenario.name;
    
    progressBar.update(i, { status: truncatedName });
    
    try {
      // Calculate using Saldo
      const saldoResult = simulateDependentWorker(scenario.saldoRequest);

      // Calculate using Doutor Finanças API
      const doutorResult = await DoutorFinancasAPI.calculate(
        scenario.doutorFinancasRequest
      );

      // Compare results
      const comparisonResult = TestComparator.compareResults(
        saldoResult,
        doutorResult,
        scenario,
        tolerance
      );

      if (comparisonResult.passed) {
        passedTests++;
      } else {
        failedTests++;
        
        // Stop progress bar to show failure details
        progressBar.stop();
        
        console.log(`\n❌ FAILED: ${scenario.name}`);
        console.log('Request parameters:');
        console.log(`  Base Salary: €${scenario.doutorFinancasRequest.base_salary}`);
        console.log(`  Location: ${scenario.doutorFinancasRequest.location}`);
        console.log(`  Marital Status: ${scenario.doutorFinancasRequest.marital_status}`);
        console.log(`  Dependents: ${scenario.doutorFinancasRequest.number_of_dependents}`);
        console.log(`  Meal Card: €${scenario.doutorFinancasRequest.daily_meal_card_value} x ${scenario.doutorFinancasRequest.meal_card_days} days`);
        console.log('   📊 Comparison details:');
        comparisonResult.details.forEach((detail: any) => {
          const status = detail.matches ? "✅" : "❌";
          console.log(`      ${status} ${detail.name}: Saldo €${detail.saldo.toFixed(2)} vs Doutor €${detail.doutor.toFixed(2)}${!detail.matches ? ` (diff: €${detail.diff.toFixed(2)})` : ''}`);
        });
        console.log('');
        
        // Restart progress bar
        progressBar.start(testScenarios.length, i + 1, { status: 'Continuing...' });
        
        failedScenarios.push({
          scenarioName: scenario.name,
          saldoRequest: scenario.saldoRequest,
          doutorFinancasRequest: scenario.doutorFinancasRequest,
          saldoResult,
          doutorResult,
          comparisonDetails: comparisonResult.details,
        });
      }

      // Add delay between API calls to be respectful
      // await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      failedTests++;
      
      // Stop progress bar to show error
      progressBar.stop();
      console.error(`\n❌ Error in scenario "${scenario.name}":`, error);
      
      // Restart progress bar
      progressBar.start(testScenarios.length, i + 1, { status: 'Continuing...' });
      
      failedScenarios.push({
        scenarioName: scenario.name,
        saldoRequest: scenario.saldoRequest,
        doutorFinancasRequest: scenario.doutorFinancasRequest,
        saldoResult: null,
        doutorResult: null,
        error: error as Error,
      });
    }
  }
  
  progressBar.update(testScenarios.length, { status: 'Complete!' });
  progressBar.stop();

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📈 TEST SUMMARY");
  console.log("=".repeat(60));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📊 Total: ${testScenarios.length}`);
  console.log(
    `🎯 Success Rate: ${((passedTests / testScenarios.length) * 100).toFixed(
      1
    )}%`
  );

  if (failedScenarios.length > 0) {
    console.log("\n❌ Failed scenarios:");
    failedScenarios.forEach((failure, index) => {
      console.log(`\n${index + 1}. ${failure.scenarioName}`);

      if (verbose) {
        console.log("=".repeat(50));

        if (failure.error) {
          console.log("🚨 ERROR:");
          console.log(`   ${failure.error.message}`);
          console.log(`   Stack: ${failure.error.stack}`);
        } else {
          console.log("📊 COMPARISON DETAILS:");
          if (failure.comparisonDetails) {
            failure.comparisonDetails.forEach((detail: any) => {
              const status = detail.matches ? "✅" : "❌";
              console.log(`   ${status} ${detail.name}:`);
              console.log(`     Saldo: €${detail.saldo.toFixed(2)}`);
              console.log(`     Doutor: €${detail.doutor.toFixed(2)}`);
              if (!detail.matches) {
                console.log(`     Difference: €${detail.diff.toFixed(2)}`);
              }
            });
          }
        }

        console.log("\n📝 SALDO REQUEST:");
        console.log(JSON.stringify(failure.saldoRequest, null, 2));

        console.log("\n📝 DOUTOR FINANÇAS REQUEST:");
        console.log(JSON.stringify(failure.doutorFinancasRequest, null, 2));

        if (failure.saldoResult) {
          console.log("\n📊 SALDO RESULT:");
          console.log(JSON.stringify(failure.saldoResult, null, 2));
        }

        if (failure.doutorResult) {
          console.log("\n📊 DOUTOR FINANÇAS RESULT:");
          console.log(JSON.stringify(failure.doutorResult, null, 2));
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
  const toleranceArg = process.argv.find((arg) =>
    arg.startsWith("--tolerance=")
  );
  const tolerance = toleranceArg
    ? parseFloat(toleranceArg.split("=")[1])
    : DEFAULT_TOLERANCE;
  const verbose =
    process.argv.includes("--verbose") || process.argv.includes("-v");

  if (isNaN(tolerance) || tolerance < 0) {
    console.error(
      "❌ Invalid tolerance value. Please provide a positive number."
    );
    console.error("Usage: tsx index.ts --tolerance=0.79 [--verbose|-v]");
    process.exit(1);
  }

  runComparisonTests(tolerance, verbose).catch(console.error);
}
