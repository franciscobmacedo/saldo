/**
 * process-receipts.ts
 *
 * Processes an export from Portal das Finanças (green receipts) for independent workers.
 * Run with: npx tsx scripts/green-receipts/process-receipts.ts <path-to-csv>
 *
 * CSV format notes:
 *  - Separator: semicolon (;)
 *  - Locale: Portuguese — thousands separator is "." and decimal separator is ","
 *    e.g. "3.240" → 3240, "745,2" → 745.20, "298,22" → 298.22
 *  - Cancelled receipts (Situação = "Anulado") are excluded from all calculations.
 */

import * as fs from "fs";
import * as path from "path";
import {
    parseGreenReceiptsCsv,
    toGreenReceipt,
    computeGreenReceiptsAnnualStats,
    simulateIndependentWorker,
    FrequencyChoices,
    GreenReceipt,
    GreenReceiptAnnualStats
} from "../../src";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(n: number): string {
    return n.toLocaleString("pt-PT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function pct(part: number, total: number): string {
    if (total === 0) return "0.00%";
    return ((part / total) * 100).toFixed(2) + "%";
}

// ---------------------------------------------------------------------------
// Receipt table
// ---------------------------------------------------------------------------

/**
 * Print a row-by-row table of active receipts (oldest first) with
 * running cumulative totals for Gross / IVA / IRS withheld / Net received.
 */
function printReceiptsTable(receipts: GreenReceipt[], separator: string) {
    // Sort oldest transaction first
    const sorted = [...receipts].sort(
        (a, b) => a.dataTransacao.getTime() - b.dataTransacao.getTime()
    );

    // Column widths
    const W = {
        ref: 18,
        date: 11,
        client: 28,
        num: 12,
    };

    const col = (s: string, w: number) => s.padStart(w);
    const lCol = (s: string, w: number) =>
        s.length > w ? s.slice(0, w - 1) + "…" : s.padEnd(w);

    const header =
        `  ${lCol("Referência", W.ref)}  ${lCol("Data Transação", W.date)}  ${lCol("Cliente", W.client)}` +
        `  ${col("Bruto (€)", W.num)}  ${col("IVA (€)", W.num)}  ${col("IRS Ret.(€)", W.num)}  ${col("Líquido (€)", W.num)}` +
        `  ${col("∑ Bruto", W.num)}  ${col("∑ IVA", W.num)}  ${col("∑ IRS Ret.", W.num)}  ${col("∑ Líquido", W.num)}`;

    console.log();
    console.log("  RECIBOS EMITIDOS (ordem cronológica + acumulados)");
    console.log(separator);
    console.log(header);
    console.log(separator);

    let cumGross = 0;
    let cumIVA = 0;
    let cumIRS = 0;
    let cumNet = 0;

    for (const r of sorted) {
        const net = r.totalDocumento;
        cumGross += r.valorTributavel;
        cumIVA += r.valorIVA;
        cumIRS += r.valorIRS;
        cumNet += net;

        const dateStr = r.dataTransacao.toISOString().slice(0, 10);

        console.log(
            `  ${lCol(r.referencia, W.ref)}  ${lCol(dateStr, W.date)}  ${lCol(r.nomeAdquirente, W.client)}` +
            `  ${col(fmt(r.valorTributavel), W.num)}  ${col(fmt(r.valorIVA), W.num)}  ${col(fmt(r.valorIRS), W.num)}  ${col(fmt(net), W.num)}` +
            `  ${col(fmt(cumGross), W.num)}  ${col(fmt(cumIVA), W.num)}  ${col(fmt(cumIRS), W.num)}  ${col(fmt(cumNet), W.num)}`
        );
    }

    console.log(separator);
    console.log(
        `  ${lCol("TOTAL", W.ref)}  ${lCol("", W.date)}  ${lCol("", W.client)}` +
        `  ${col(fmt(cumGross), W.num)}  ${col(fmt(cumIVA), W.num)}  ${col(fmt(cumIRS), W.num)}  ${col(fmt(cumNet), W.num)}` +
        `  ${"".padStart(W.num)}  ${"".padStart(W.num)}  ${"".padStart(W.num)}  ${"".padStart(W.num)}`
    );
    console.log(separator);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function printReport(allStats: Map<number, GreenReceiptAnnualStats>, cancelled: GreenReceipt[], active: GreenReceipt[]) {
    const separator = "─".repeat(72);
    const doubleSep = "═".repeat(72);

    console.log();
    console.log(doubleSep);
    console.log("  RECIBOS VERDES — ANÁLISE DE EXPORTAÇÃO (SIRE)");
    console.log(doubleSep);

    if (cancelled.length > 0) {
        console.log();
        console.log(`⚠️  Recibos anulados excluídos (${cancelled.length}):`);
        for (const r of cancelled) {
            console.log(
                `   • ${r.referencia} — ${r.nomeAdquirente} — ${fmt(r.valorTributavel)} €`
            );
        }
    }

    const years = [...allStats.keys()].sort();

    for (const year of years) {
        const s = allStats.get(year)!;

        console.log();
        console.log(doubleSep);
        console.log(`  ANO ${year}  (${s.receiptCount} recibos emitidos)`);
        console.log(doubleSep);

        console.log();
        console.log("  RESUMO ANUAL");
        console.log(separator);
        console.log(
            `  Rendimento bruto (base tributável)   : ${fmt(s.grossIncome).padStart(12)} €`
        );
        console.log(
            `  IVA cobrado ao cliente               : ${fmt(s.totalIVACharged).padStart(12)} €  (${pct(s.totalIVACharged, s.grossIncome)} do bruto)`
        );
        console.log(
            `  IRS retido na fonte (pelo cliente)   : ${fmt(s.totalIRSWithheld).padStart(12)} €  (${pct(s.totalIRSWithheld, s.grossIncome)} do bruto)`
        );
        console.log(separator);
        console.log(
            `  Total recebido em conta              : ${fmt(s.totalReceived).padStart(12)} €`
        );
        console.log(separator);

        // Per-receipt table (pass only receipts for this year, sorted by date)
        const yearReceipts = active
            .filter((r: GreenReceipt) => r.dataTransacao.getFullYear() === year);
        printReceiptsTable(yearReceipts, separator);

        console.log();
        console.log("  POR CLIENTE");
        console.log(separator);
        console.log(
            `  ${"Cliente".padEnd(40)} ${"Bruto (€)".padStart(12)}  ${"IVA (€)".padStart(10)}  ${"IRS Ret.(€)".padStart(11)}  ${"Recebido (€)".padStart(12)}`
        );
        console.log(separator);

        // Sort clients by gross income descending
        const clients = Object.values(s.byClient).sort(
            (a, b) => b.grossIncome - a.grossIncome
        );

        for (const c of clients) {
            const shortName =
                c.name.length > 38 ? c.name.slice(0, 35) + "..." : c.name;
            console.log(
                `  ${shortName.padEnd(40)} ${fmt(c.grossIncome).padStart(12)}  ${fmt(c.ivaCharged).padStart(10)}  ${fmt(c.irsWithheld).padStart(11)}  ${fmt(c.received).padStart(12)}`
            );
        }

        console.log(separator);
        console.log(
            `  ${"TOTAL".padEnd(40)} ${fmt(s.grossIncome).padStart(12)}  ${fmt(s.totalIVACharged).padStart(10)}  ${fmt(s.totalIRSWithheld).padStart(11)}  ${fmt(s.totalReceived).padStart(12)}`
        );
        console.log(separator);

        // Quick income composition
        const notWithheld = s.grossIncome - s.totalIRSWithheld;
        console.log();
        console.log("  COMPOSIÇÃO DO RENDIMENTO BRUTO");
        console.log(separator);
        console.log(
            `  IRS já retido na fonte               : ${fmt(s.totalIRSWithheld).padStart(12)} €  (${pct(s.totalIRSWithheld, s.grossIncome)} do bruto)`
        );
        console.log(
            `  Rendimento líquido de retenções      : ${fmt(notWithheld).padStart(12)} €  (${pct(notWithheld, s.grossIncome)} do bruto)`
        );
        console.log(separator);

        // IRS settlement + SS estimation
        printTaxAnalysis(s, separator, doubleSep);
    }

    console.log();
    console.log(doubleSep);
    console.log("  FIM DO RELATÓRIO");
    console.log(doubleSep);
    console.log();
}

// ---------------------------------------------------------------------------
// Tax analysis via saldo simulator
// ---------------------------------------------------------------------------

/**
 * Runs simulateIndependentWorker and prints:
 *  - IRS total owed vs. already withheld at source → still to pay / to receive
 *  - Social Security annual contribution
 */
function printTaxAnalysis(stats: GreenReceiptAnnualStats, separator: string, doubleSep: string) {
    const sim = simulateIndependentWorker({
        income: stats.grossIncome,
        incomeFrequency: FrequencyChoices.Year,
        currentTaxRankYear: stats.year as any,
        expenses: 0,
        rnh: false,
        benefitsOfYouthIrs: false,
    });

    const irsEstimatedTotal = sim.irsPay.year;
    const irsAlreadyWithheld = stats.totalIRSWithheld;
    const irsDelta = irsAlreadyWithheld - irsEstimatedTotal;

    let irsDeltaType: "refund" | "pay" | "none" = "none";
    if (irsDelta > 0) irsDeltaType = "refund";
    if (irsDelta < 0) irsDeltaType = "pay";

    const ssBaseIncidenceMonthly = (stats.grossIncome / 12) * 0.7;
    const ssMonthlyContribution = sim.ssPay.month;
    const ssAnnualTotal = sim.ssPay.year;

    const totalBurden = irsEstimatedTotal + ssAnnualTotal;
    const totalBurdenPercentage = stats.grossIncome > 0 ? (totalBurden / stats.grossIncome) * 100 : 0;
    const netIncome = stats.grossIncome - totalBurden;

    const grossIncome = stats.grossIncome;
    const taxableIncome = sim.taxableIncome;
    const marginalRatePercentage = sim.taxRank.normalTax * 100;
    const averageRatePercentage = (sim.taxRank.averageTax ?? 0) * 100;

    console.log();
    console.log(doubleSep);
    console.log("  ESTIMATIVA FISCAL (via saldo)");
    console.log(doubleSep);

    console.log();
    console.log("  IRS");
    console.log(separator);
    console.log(`  Rendimento bruto anual               : ${fmt(grossIncome).padStart(12)} €`);
    console.log(`  Rendimento tributável (coef. 0.75)   : ${fmt(taxableIncome).padStart(12)} €`);
    console.log(`  Escalão marginal                     : ${String(marginalRatePercentage.toFixed(0) + "%").padStart(12)}   (taxa média do escalão anterior: ${averageRatePercentage.toFixed(0)}%)`);
    console.log(separator);
    console.log(`  IRS total estimado (ano ${stats.year})        : ${fmt(irsEstimatedTotal).padStart(12)} €`);
    console.log(`  IRS já retido na fonte               : ${fmt(irsAlreadyWithheld).padStart(12)} €`);
    console.log(separator);
    if (irsDeltaType === "refund" || irsDeltaType === "none") {
        console.log(`  ✅ IRS a RECEBER (reembolso esperado) : ${fmt(irsDelta).padStart(12)} €`);
    } else {
        console.log(`  ⚠️  IRS a PAGAR (liquidação adicional): ${fmt(-irsDelta).padStart(12)} €`);
    }
    console.log(separator);

    console.log();
    console.log("  SEGURANÇA SOCIAL");
    console.log(separator);
    console.log(`  Base de incidência (70% do bruto/mês): ${fmt(ssBaseIncidenceMonthly).padStart(12)} €/mês`);
    console.log(`  Taxa SS (21.4%)                      : ${fmt(ssMonthlyContribution).padStart(12)} €/mês`);
    console.log(separator);
    console.log(`  SS total anual estimado              : ${fmt(ssAnnualTotal).padStart(12)} €`);
    console.log(separator);

    console.log();
    console.log("  RESUMO TOTAL DE ENCARGOS ESTIMADOS");
    console.log(separator);
    console.log(`  IRS estimado                         : ${fmt(irsEstimatedTotal).padStart(12)} €`);
    console.log(`  SS estimado                          : ${fmt(ssAnnualTotal).padStart(12)} €`);
    console.log(separator);
    console.log(`  Total encargos                       : ${fmt(totalBurden).padStart(12)} €  (${totalBurdenPercentage.toFixed(2)}% do bruto)`);
    console.log(`  Rendimento líquido após IRS + SS     : ${fmt(netIncome).padStart(12)} €`);
    console.log(separator);

    console.log();
    console.log(`  ⚠️  Nota: estimativa baseada em rendimento total anual, coeficiente 0.75`);
    console.log(`      (nem 1º nem 2º ano de atividade), sem despesas dedutíveis, sem RNH.`);
    console.log(`      Confirma sempre com contabilista.`);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------


function main() {
    const csvPath = process.argv[2];

    if (!csvPath) {
        console.error("Usage: npx tsx scripts/green-receipts/process-receipts.ts <path-to-csv>");
        process.exit(1);
    }

    const absolutePath = path.resolve(csvPath);

    if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(absolutePath, "utf-8");

    // Parse
    const rawRows = parseGreenReceiptsCsv(content);
    const receipts = rawRows.map(toGreenReceipt);

    // Split active vs cancelled
    const active = receipts.filter((r) => r.situacao !== "Anulado");
    const cancelled = receipts.filter((r) => r.situacao === "Anulado");

    console.log(`\nTotal de registos: ${receipts.length}`);
    console.log(`  ✅ Emitidos : ${active.length}`);
    console.log(`  ❌ Anulados : ${cancelled.length}`);

    // Compute stats only for active receipts
    const annualStats = computeGreenReceiptsAnnualStats(active);

    // Print
    printReport(annualStats, cancelled, active);
}

main();
