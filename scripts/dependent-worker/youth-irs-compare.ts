#!/usr/bin/env tsx
/**
 * Standalone comparator that pits Saldo against Doutor Finanças' IRS Jovem
 * simulator. Runs only the youth-IRS scenarios — the broader comparator in
 * `index.ts` references fields from an older simulator output and is not used
 * here.
 *
 * Run with: pnpm exec tsx scripts/dependent-worker/youth-irs-compare.ts
 */

import { simulateDependentWorker } from "../../src/dependent-worker/simulator";
import { DoutorFinancasAPI } from "./api-client";
import { youthIrsScenarios } from "./scenarios/youth-irs/youth-irs-scenarios";

const TOLERANCE_EUR = 1; // ~€1/month tolerance

async function main() {
  let passed = 0;
  let failed = 0;

  for (const scenario of youthIrsScenarios) {
    const saldo = simulateDependentWorker(scenario.saldoRequest);
    const january = saldo.monthlyBreakdown[0];

    const doutor = await DoutorFinancasAPI.calculate(scenario.doutorFinancasRequest);
    const dfSim = doutor.result.simulation;

    const rows = [
      {
        label: "IRS retention",
        saldo: january.irsWithholdingTax.totalAmount,
        doutor: dfSim.irs_withholding,
      },
      {
        label: "SS contribution",
        saldo: january.socialSecurityContribution.totalAmount,
        doutor: dfSim.ss_contribution,
      },
      {
        label: "Net salary",
        saldo: january.netIncome.totalAmount,
        doutor: dfSim.net_salary,
      },
    ];

    const allWithinTolerance = rows.every(
      (r) => Math.abs(r.saldo - r.doutor) <= TOLERANCE_EUR
    );

    if (allWithinTolerance) {
      passed++;
      console.log(`✅ ${scenario.name}`);
    } else {
      failed++;
      console.log(`❌ ${scenario.name}`);
      for (const r of rows) {
        const diff = (r.saldo - r.doutor).toFixed(2);
        const status = Math.abs(r.saldo - r.doutor) <= TOLERANCE_EUR ? "ok" : "DIFF";
        console.log(
          `   ${status.padEnd(4)} ${r.label.padEnd(16)} saldo=€${r.saldo.toFixed(
            2
          )} doutor=€${r.doutor.toFixed(2)} (diff=${diff})`
        );
      }
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n${passed}/${passed + failed} passed (tolerance €${TOLERANCE_EUR})`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
