import { simulateDependentWorker } from "../../src/dependent-worker/simulator";
import { DoutorFinancasResponse, TestScenario } from "./types";

interface ComparisonDetail {
  name: string;
  saldo: number;
  doutor: number;
  diff: number;
  matches: boolean;
}

interface ComparisonResult {
  passed: boolean;
  details: ComparisonDetail[];
}

export class TestComparator {
  private static readonly DEFAULT_TOLERANCE = 0.01; // 1 cent tolerance

  static compareResults(
    saldoResult: ReturnType<typeof simulateDependentWorker>, 
    doutorResult: DoutorFinancasResponse, 
    scenario: TestScenario,
    tolerance: number = TestComparator.DEFAULT_TOLERANCE
  ): ComparisonResult {
    const comparisons = [
      {
        name: "Gross Salary",
        saldo: saldoResult.grossIncome,
        doutor: doutorResult.result.simulation.gross_salary,
      },
      {
        name: "Net Salary",
        saldo: saldoResult.netSalary,
        doutor: doutorResult.result.simulation.net_salary,
      },
      {
        name: "IRS Retention",
        saldo: saldoResult.tax,
        doutor: doutorResult.result.simulation.irs_withholding,
      },
      {
        name: "Social Security",
        saldo: saldoResult.socialSecurity,
        doutor: doutorResult.result.simulation.ss_contribution,
      },
    ];

    console.log(`\n=== ${scenario.name} ===`);
    console.log("Request parameters:");
    console.log(`  Base Salary: €${scenario.doutorFinancasRequest.base_salary}`);
    console.log(`  Location: ${scenario.doutorFinancasRequest.location}`);
    console.log(`  Marital Status: ${scenario.doutorFinancasRequest.marital_status}`);
    console.log(`  Dependents: ${scenario.doutorFinancasRequest.number_of_dependents}`);
    console.log(`  Meal Card: €${scenario.doutorFinancasRequest.daily_meal_card_value} x ${scenario.doutorFinancasRequest.meal_card_days} days`);

    const details: ComparisonDetail[] = [];
    let allMatch = true;
    
    for (const comparison of comparisons) {
      const diff = Math.abs(comparison.saldo - comparison.doutor);
      const matches = diff <= tolerance;
      const status = matches ? "✅" : "❌";
      
      if (!matches) {
        allMatch = false;
      }
      
      console.log(`  ${status} ${comparison.name}:`);
      console.log(`    Saldo: €${comparison.saldo.toFixed(2)}`);
      console.log(`    Doutor: €${comparison.doutor.toFixed(2)}`);
      if (!matches) {
        console.log(`    Difference: €${diff.toFixed(2)}`);
      }

      details.push({
        name: comparison.name,
        saldo: comparison.saldo,
        doutor: comparison.doutor,
        diff,
        matches
      });
    }

    return {
      passed: allMatch,
      details
    };
  }
}
