import { GreenReceiptRawRow, GreenReceipt, GreenReceiptAnnualStats, GreenReceiptTaxAnalysis } from "./green-receipts-schema";
import { simulateIndependentWorker } from "./simulator";
import { FrequencyChoices } from "./schemas";

/**
 * Parses a Portuguese-locale number string into a JavaScript number.
 *
 * Rules (from Portal das Finanças exports):
 *  - Thousands separator: "."  → remove
 *  - Decimal separator:   ","  → replace with "."
 *  - Empty / whitespace   → 0
 *
 * Examples:
 *   "3.240"    → 3240
 *   "745,2"    → 745.2
 *   "298,22"   → 298.22
 *   "3.945,51" → 3945.51
 *   ""         → 0
 *
 * @param raw - The Portuguese-formatted number string.
 * @returns The parsed numeric value.
 */
export function parsePortugueseNumber(raw: string): number {
    const trimmed = raw.trim();
    if (!trimmed) return 0;

    if (trimmed.includes(",")) {
        return parseFloat(trimmed.replace(/\./g, "").replace(",", "."));
    } else {
        return parseFloat(trimmed.replace(/\./g, ""));
    }
}

/**
 * Parses a standard date string into a JavaScript Date object.
 *
 * @param raw - The date string formatted as "YYYY-MM-DD".
 * @returns A local JavaScript Date object.
 */
export function parseDate(raw: string): Date {
    // Format: YYYY-MM-DD
    const [y, m, d] = raw.trim().split("-").map(Number);
    return new Date(y, m - 1, d);
}

const HEADERS: (keyof GreenReceiptRawRow)[] = [
    "referencia",       // 0
    "tipoDocumento",    // 1
    "atcud",            // 2
    "situacao",         // 3
    "motivoEmissao",    // 4
    "dataTransacao",    // 5
    "dataEmissao",      // 6
    "paisAdquirente",   // 7
    "nifAdquirente",    // 8
    "nomeAdquirente",   // 9
    "valorTributavel",  // 10
    "valorIVA",         // 11
    "impostoSeloRetencao", // 12
    "valorImpostoSelo", // 13
    "valorIRS",         // 14
    "totalImpostos",    // 15
    "totalComImpostos", // 16
    "totalRetencoes",   // 17
    "contribuicaoCultura", // 18
    "totalDocumento",   // 19
];

/**
 * Parses the raw CSV string from Portal das Finanças into structured `GreenReceiptRawRow` objects.
 * Expects the standard SIRE green receipts export format.
 *
 * @param content - The raw CSV string content.
 * @returns An array of raw row objects mapping to the CSV columns.
 * @throws {Error} If a row has an unexpected number of columns.
 */
export function parseGreenReceiptsCsv(content: string): GreenReceiptRawRow[] {
    const lines = content
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

    // Skip header line
    const dataLines = lines.slice(1);

    return dataLines.map((line, i) => {
        const cols = line.split(";");
        if (cols.length < HEADERS.length) {
            throw new Error(
                `Line ${i + 2} has ${cols.length} columns, expected ${HEADERS.length}:\n  ${line}`
            );
        }
        const row: Partial<GreenReceiptRawRow> = {};
        HEADERS.forEach((h, idx) => {
            row[h] = cols[idx] ?? "";
        });
        return row as GreenReceiptRawRow;
    });
}

/**
 * Maps a `GreenReceiptRawRow` into a formatted `GreenReceipt` object with proper types.
 * Converts date strings to `Date` objects and Portuguese number strings to generic JavaScript numbers.
 *
 * @param raw - The raw, unparsed record row.
 * @returns The cleanly typed and evaluated `GreenReceipt`.
 */
export function toGreenReceipt(raw: GreenReceiptRawRow): GreenReceipt {
    return {
        referencia: raw.referencia.trim(),
        situacao: raw.situacao.trim(),
        dataTransacao: parseDate(raw.dataTransacao),
        dataEmissao: parseDate(raw.dataEmissao),
        paisAdquirente: raw.paisAdquirente.trim(),
        nomeAdquirente: raw.nomeAdquirente.trim(),
        nifAdquirente: raw.nifAdquirente.trim(),
        valorTributavel: parsePortugueseNumber(raw.valorTributavel),
        valorIVA: parsePortugueseNumber(raw.valorIVA),
        valorIRS: parsePortugueseNumber(raw.valorIRS),
        contribuicaoCultura: parsePortugueseNumber(raw.contribuicaoCultura),
        totalDocumento: parsePortugueseNumber(raw.totalDocumento),
    };
}

/**
 * Aggregates a list of `GreenReceipt`s into annual and per-client statistics.
 *
 * @param receipts - Array of processed green receipts.
 * @returns A Map where the key is the year and the value is the aggregated statistics for that year.
 */
export function computeGreenReceiptsAnnualStats(receipts: GreenReceipt[]): Map<number, GreenReceiptAnnualStats> {
    const map = new Map<number, GreenReceiptAnnualStats>();

    for (const r of receipts) {
        const year = r.dataTransacao.getFullYear();

        if (!map.has(year)) {
            map.set(year, {
                year,
                receiptCount: 0,
                grossIncome: 0,
                totalIVACharged: 0,
                totalIRSWithheld: 0,
                totalReceived: 0,
                byClient: {},
            });
        }

        const stats = map.get(year)!;
        stats.receiptCount++;
        stats.grossIncome += r.valorTributavel;
        stats.totalIVACharged += r.valorIVA;
        stats.totalIRSWithheld += r.valorIRS;
        stats.totalReceived += r.totalDocumento;

        const clientKey = r.nifAdquirente || r.nomeAdquirente;
        if (!stats.byClient[clientKey]) {
            stats.byClient[clientKey] = {
                name: r.nomeAdquirente,
                receipts: 0,
                grossIncome: 0,
                ivaCharged: 0,
                irsWithheld: 0,
                received: 0,
            };
        }
        const c = stats.byClient[clientKey];
        c.receipts++;
        c.grossIncome += r.valorTributavel;
        c.ivaCharged += r.valorIVA;
        c.irsWithheld += r.valorIRS;
        c.received += r.totalDocumento;
    }

    return map;
}

/**
 * Computes an estimated tax analysis (IRS and Social Security) for a given year's green receipts.
 * This estimate assumes coefficient 0.75 (no 1st/2nd year reduction), no expenses declared, no RNH.
 *
 * @param stats - The annual green receipt statistics to base the estimation on.
 * @returns A comprehensive tax analysis including IRS and Social Security estimates.
 */
export function analyzeGreenReceiptTaxes(stats: GreenReceiptAnnualStats): GreenReceiptTaxAnalysis {
    const grossIncome = stats.grossIncome;
    const year = stats.year as 2023 | 2024 | 2025 | 2026;
    const irsAlreadyWithheld = stats.totalIRSWithheld;

    const sim = simulateIndependentWorker({
        income: grossIncome,
        incomeFrequency: FrequencyChoices.Year,
        currentTaxRankYear: year,
        // Standard coefficient (0.75)
        expenses: 0,
        rnh: false,
        benefitsOfYouthIrs: false,
    });

    const irsEstimatedTotal = sim.irsPay.year;
    const irsDelta = irsAlreadyWithheld - irsEstimatedTotal;

    let irsDeltaType: "refund" | "pay" | "none" = "none";
    if (irsDelta > 0) irsDeltaType = "refund";
    if (irsDelta < 0) irsDeltaType = "pay";

    const ssAnnualTotal = sim.ssPay.year;
    const ssMonthlyContribution = sim.ssPay.month;
    const ssBaseIncidenceMonthly = (grossIncome / 12) * 0.7;

    const totalBurden = irsEstimatedTotal + ssAnnualTotal;
    const netIncome = grossIncome - totalBurden;

    return {
        grossIncome,
        taxableIncome: sim.taxableIncome,
        marginalRatePercentage: sim.taxRank.normalTax * 100,
        averageRatePercentage: (sim.taxRank.averageTax ?? 0) * 100,

        irsEstimatedTotal,
        irsAlreadyWithheld,
        irsDelta,
        irsDeltaType,

        ssBaseIncidenceMonthly,
        ssMonthlyContribution,
        ssAnnualTotal,

        totalBurden,
        totalBurdenPercentage: grossIncome > 0 ? (totalBurden / grossIncome) * 100 : 0,
        netIncome,
    };
}
