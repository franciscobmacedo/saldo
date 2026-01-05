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

    const details: ComparisonDetail[] = [];
    let allMatch = true;
    
    for (const comparison of comparisons) {
      const diff = Math.abs(comparison.saldo - comparison.doutor);
      const matches = diff <= tolerance;
      
      if (!matches) {
        allMatch = false;
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
