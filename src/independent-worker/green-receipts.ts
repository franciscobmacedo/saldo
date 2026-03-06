import { GreenReceiptRawRow, GreenReceipt, GreenReceiptAnnualStats } from "./green-receipts-schema";
import { simulateIndependentWorker } from "./simulator";
import { FrequencyChoices, SimulateIndependentWorkerOptions, IndependentWorkerResult, IndependentWorkerReceipt } from "./schemas";
import { SUPPORTED_TAX_RANK_YEARS } from "@/data/supported-tax-rank-years";
import type { SupportedTaxRankYear } from "@/data/supported-tax-rank-years";

export interface SimulateFromGreenReceiptsCsvOptions extends Omit<SimulateIndependentWorkerOptions, "income" | "incomeFrequency" | "previousYearQ4MonthlyIncome"> {
    csvContent: string;
    /**
     * The year for which the simulation takes place. We will filter the CSV receipts for this year 
     * and construct the 12-month income array.
     */
    currentTaxRankYear?: SupportedTaxRankYear;
}

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
    "dataTransacao",    // 4
    "motivoEmissao",    // 5
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
    // Handle potential BOM and normalize line endings
    const cleanContent = content.replace(/^\uFEFF/, "");
    const lines = cleanContent
        .split(/\r\n|\r|\n/)
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

export interface GreenReceiptsData {
    income: IndependentWorkerReceipt[][];
    previousYearQ4MonthlyIncome?: number;
    targetYear: SupportedTaxRankYear;
}

function isSupportedTaxRankYear(year: number): year is SupportedTaxRankYear {
    return SUPPORTED_TAX_RANK_YEARS.includes(year as SupportedTaxRankYear);
}

function inferMostCommonReceiptYear(receipts: GreenReceipt[]): number | undefined {
    const yearCounts = new Map<number, number>();

    for (const receipt of receipts) {
        const year = receipt.dataTransacao.getFullYear();
        if (isNaN(year)) {
            continue;
        }

        yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1);
    }

    let mostCommonYear: number | undefined;
    let mostCommonCount = -1;

    for (const [year, count] of yearCounts) {
        if (count > mostCommonCount || (count === mostCommonCount && (mostCommonYear === undefined || year > mostCommonYear))) {
            mostCommonYear = year;
            mostCommonCount = count;
        }
    }

    return mostCommonYear;
}

/**
 * Prepares the data for an independent worker simulation from a green receipts CSV.
 * It extracts the income matrix for the target year and calculates the average monthly income for the 
 * preceding year's Q4.
 * 
 * @param csvContent - The raw CSV string content.
 * @param targetYear - The year for which to prepare the data.
 * @returns An object containing the income matrix and optionally the previous year's Q4 monthly income.
 */
export function prepareIndependentWorkerDataFromCsv(
    csvContent: string,
    targetYear?: number
): GreenReceiptsData {
    const rawRows = parseGreenReceiptsCsv(csvContent);
    const receipts = rawRows.map(toGreenReceipt);

    const inferredYear = inferMostCommonReceiptYear(receipts);
    const yearToMatch = Number(targetYear ?? inferredYear);

    if (!isSupportedTaxRankYear(yearToMatch)) {
        const yearsFound = receipts
            .map((receipt) => receipt.dataTransacao.getFullYear())
            .filter((year) => !isNaN(year));

        throw new Error(
            `Could not resolve a supported tax rank year from CSV. Found years: ${yearsFound.length ? Array.from(new Set(yearsFound)).join(", ") : "none"}. Supported years: ${SUPPORTED_TAX_RANK_YEARS.join(", ")}.`
        );
    }

    // For debugging
    const foundYears = new Set<number>();
    receipts.forEach(r => {
        const y = r.dataTransacao.getFullYear();
        if (!isNaN(y)) foundYears.add(y);
    });

    const incomeMatrix: IndependentWorkerReceipt[][] = Array.from({ length: 12 }, () => []);

    let q4Total = 0;
    let q4ReceiptCount = 0;

    for (const r of receipts) {
        // Skip cancelled receipts
        if (r.situacao === "Anulado") {
            continue;
        }

        const year = r.dataTransacao.getFullYear();
        // Skip invalid dates
        if (isNaN(year)) {
            continue;
        }

        const month = r.dataTransacao.getMonth();

        // Include receipts for the target year
        if (year === yearToMatch) {
            incomeMatrix[month].push({
                income: r.valorTributavel,
                // Only consider retention valid if the receipt has IRS withheld.
                // We calculate the retention percentage based on the value 
                // and pass it directly to be simulated.
                retention: r.valorTributavel > 0 ? r.valorIRS / r.valorTributavel : 0
            });
        }
        // Accumulate data for the previous year's Q4 (Oct, Nov, Dec)
        else if (year === yearToMatch - 1 && month >= 9 && month <= 11) {
            q4Total += r.valorTributavel;
            q4ReceiptCount++;
        }
    }

    const totalIncomeFound = incomeMatrix.reduce((acc, month) => acc + month.reduce((sum, r) => sum + r.income, 0), 0);

    if (totalIncomeFound === 0) {
        console.error(`\x1b[33m⚠ No income found for year ${yearToMatch}. Found data for years: ${Array.from(foundYears).join(", ")}\x1b[0m`);
    }

    const hasPreviousYearQ4 = q4ReceiptCount > 0;
    // Average over the 3 months of Q4 if any data exists. 
    // Example: If user earned 3000 in Q4 total across 1 or 3 receipts, the average monthly income for Q4 is 1000.
    const previousYearQ4MonthlyIncome = hasPreviousYearQ4 ? q4Total / 3 : undefined;

    return {
        income: incomeMatrix,
        previousYearQ4MonthlyIncome,
        targetYear: yearToMatch
    };
}

/**
 * Parses a green receipts CSV and runs a complete simulation for the specified target year.
 * It maps receipts directly to the simulated year's 12 months.
 * 
 * If receipts from the preceding year's 4th quarter (Oct, Nov, Dec) are present in the CSV,
 * they are automatically averaged to provide the `previousYearQ4MonthlyIncome` for a more accurate 
 * Q1 Social Security estimation.
 * 
 * @param options - Simulation options without `income`, `incomeFrequency`, and `previousYearQ4MonthlyIncome`. Includes `csvContent`.
 * @returns The full `IndependentWorkerResult`.
 */
export function simulateFromGreenReceiptsCsv({
    csvContent,
    currentTaxRankYear,
    ...restParams
}: SimulateFromGreenReceiptsCsvOptions): IndependentWorkerResult {
    const { income, previousYearQ4MonthlyIncome, targetYear } = prepareIndependentWorkerDataFromCsv(csvContent, currentTaxRankYear);

    return simulateIndependentWorker({
        ...restParams,
        income,
        incomeFrequency: FrequencyChoices.Year,
        currentTaxRankYear: targetYear,
        previousYearQ4MonthlyIncome,
    });
}
