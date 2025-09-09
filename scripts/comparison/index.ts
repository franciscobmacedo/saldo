#!/usr/bin/env tsx

import { simulateDependentWorker } from "../../src/dependent-worker/simulator";
import { DoutorFinancasAPI } from "./api-client";
import { TestComparator } from "./comparator";
import { testScenarios } from "./scenarios";

interface FailureDetails {
  scenarioName: string;
  saldoRequest: Parameters<typeof simulateDependentWorker>[0];
  doutorFinancasRequest: any;
  saldoResult: ReturnType<typeof simulateDependentWorker> | null;
  doutorResult: any | null;
  comparisonDetails?: any;
  error?: Error;
}

export async function runComparisonTests(tolerance: number = 0.01, verbose: boolean = false): Promise<void> {
  console.log("🧪 Starting comparison tests between Saldo and Doutor Finanças...");
  console.log(`📊 Running ${testScenarios.length} test scenarios`);
  console.log(`🎯 Tolerance: €${tolerance.toFixed(2)}\n`);

  let passedTests = 0;
  let failedTests = 0;
  const failedScenarios: FailureDetails[] = [];

  for (const scenario of testScenarios) {
    try {
      // Calculate using Saldo
      const saldoResult = simulateDependentWorker(scenario.saldoRequest);
      // console.log('saldoResult', saldoResult);
      
      // Calculate using Doutor Finanças API
      const doutorResult = await DoutorFinancasAPI.calculate(scenario.doutorFinancasRequest);
      // console.log('doutorResult', doutorResult);      
      
      // Compare results
      const comparisonResult = TestComparator.compareResults(saldoResult, doutorResult, scenario, tolerance);
      
      if (comparisonResult.passed) {
        passedTests++;
      } else {
        failedTests++;
        failedScenarios.push({
          scenarioName: scenario.name,
          saldoRequest: scenario.saldoRequest,
          doutorFinancasRequest: scenario.doutorFinancasRequest,
          saldoResult,
          doutorResult,
          comparisonDetails: comparisonResult.details
        });
      }
      
      // Add delay between API calls to be respectful
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error in scenario "${scenario.name}":`, error);
      failedTests++;
      failedScenarios.push({
        scenarioName: scenario.name,
        saldoRequest: scenario.saldoRequest,
        doutorFinancasRequest: scenario.doutorFinancasRequest,
        saldoResult: null,
        doutorResult: null,
        error: error as Error
      });
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📈 TEST SUMMARY");
  console.log("=".repeat(60));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📊 Total: ${testScenarios.length}`);
  console.log(`🎯 Success Rate: ${((passedTests / testScenarios.length) * 100).toFixed(1)}%`);

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
  const toleranceArg = process.argv.find(arg => arg.startsWith('--tolerance='));
  const tolerance = toleranceArg ? parseFloat(toleranceArg.split('=')[1]) : 0.01;
  const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
  
  if (isNaN(tolerance) || tolerance < 0) {
    console.error("❌ Invalid tolerance value. Please provide a positive number.");
    console.error("Usage: tsx index.ts --tolerance=0.79 [--verbose|-v]");
    process.exit(1);
  }
  
  runComparisonTests(tolerance, verbose).catch(console.error);
}
