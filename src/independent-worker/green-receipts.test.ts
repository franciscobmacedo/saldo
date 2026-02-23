import { describe, it, expect } from "vitest";
import { parsePortugueseNumber, parseDate, parseGreenReceiptsCsv, toGreenReceipt, computeGreenReceiptsAnnualStats, analyzeGreenReceiptTaxes } from "./green-receipts";
import { GreenReceiptRawRow, GreenReceiptAnnualStats } from "./green-receipts-schema";

describe("green-receipts module", () => {
    describe("parsePortugueseNumber", () => {
        it("handles integers correctly", () => {
            expect(parsePortugueseNumber("3240")).toBe(3240);
        });

        it("handles thousands separators", () => {
            expect(parsePortugueseNumber("3.240")).toBe(3240);
            expect(parsePortugueseNumber("1.000.000")).toBe(1000000);
        });

        it("handles decimals correctly", () => {
            expect(parsePortugueseNumber("745,2")).toBe(745.2);
            expect(parsePortugueseNumber("298,22")).toBe(298.22);
        });

        it("handles thousands and decimals together", () => {
            expect(parsePortugueseNumber("3.945,51")).toBe(3945.51);
            expect(parsePortugueseNumber("4.067,57")).toBe(4067.57);
        });

        it("handles empty or whitespace strings", () => {
            expect(parsePortugueseNumber("")).toBe(0);
            expect(parsePortugueseNumber("  ")).toBe(0);
        });
    });

    describe("parseDate", () => {
        it("parses valid standard ISO-like green-receipts dates correctly", () => {
            const d = parseDate("2025-12-30");
            expect(d.getFullYear()).toBe(2025);
            expect(d.getMonth()).toBe(11); // 0-indexed
            expect(d.getDate()).toBe(30);
        });
    });

    describe("parseGreenReceiptsCsv", () => {
        it("parses valid CSV string skipping the header", () => {
            const csv = `Referência;Tipo Documento;ATCUD;Situação;Data da Transação;Motivo Emissão;Data de Emissão;País do Adquirente;NIF Adquirente;Nome do Adquirente;Valor Tributável (em euros);Valor do IVA (em euros);Imposto do Selo como Retenção na Fonte;Valor do Imposto do Selo (em euros);Valor do IRS (em euros);Total de Impostos (em euros);Total com Impostos (em euros);Total de Retenções na Fonte (em euros);Contribuição Cultura (em euros);Total do Documento (em euros)
FR ATSIRE01FR/27;Fatura-Recibo;JJMY9BJ7-27;Emitido;Pagamento dos bens ou dos serviços;2025-12-30;2025-12-30;PORTUGAL;517263190;REENTRY SYSTEMS UNIPESSOAL LDA;3.240;745,2;;0;745,2;;3.985,2;745,2;0;3.240`;

            const rows = parseGreenReceiptsCsv(csv);
            expect(rows.length).toBe(1);
            expect(rows[0].referencia).toBe("FR ATSIRE01FR/27");
            expect(rows[0].valorTributavel).toBe("3.240");
            expect(rows[0].valorIVA).toBe("745,2");
            expect(rows[0].situacao).toBe("Emitido");
        });
    });

    describe("toGreenReceipt", () => {
        it("maps RawRow exactly to GreenReceipt correctly", () => {
            const rawRow: GreenReceiptRawRow = {
                referencia: "FR ATSIRE01FR/27 ",
                tipoDocumento: "Fatura-Recibo",
                atcud: "JJMY9BJ7-27",
                situacao: "Emitido ",
                dataTransacao: "2025-12-30",
                motivoEmissao: "Pagamento dos bens",
                dataEmissao: "2025-12-30",
                paisAdquirente: "PORTUGAL",
                nifAdquirente: "517263190 ",
                nomeAdquirente: " REENTRY SYSTEMS",
                valorTributavel: "3.240",
                valorIVA: "745,2",
                impostoSeloRetencao: "",
                valorImpostoSelo: "0",
                valorIRS: "745,2",
                totalImpostos: "",
                totalComImpostos: "3.985,2",
                totalRetencoes: "745,2",
                contribuicaoCultura: "0",
                totalDocumento: "3.240"
            };

            const receipt = toGreenReceipt(rawRow);
            expect(receipt.referencia).toBe("FR ATSIRE01FR/27");
            expect(receipt.situacao).toBe("Emitido");
            expect(receipt.nomeAdquirente).toBe("REENTRY SYSTEMS");
            expect(receipt.nifAdquirente).toBe("517263190");
            expect(receipt.valorTributavel).toBe(3240);
            expect(receipt.valorIVA).toBe(745.2);
            expect(receipt.valorIRS).toBe(745.2);
            expect(receipt.totalDocumento).toBe(3240);
            expect(receipt.dataTransacao.getFullYear()).toBe(2025);
        });
    });

    describe("computeGreenReceiptsAnnualStats", () => {
        it("aggregates receipts into annual stats properly per-client as well", () => {
            const r1 = toGreenReceipt({
                referencia: "1", situacao: "Emitido", dataTransacao: "2025-01-10", dataEmissao: "2025-01-10", paisAdquirente: "PT", nomeAdquirente: "Client A", nifAdquirente: "123", valorTributavel: "1.000", valorIVA: "230", valorIRS: "250", contribuicaoCultura: "0", totalDocumento: "980", tipoDocumento: "", atcud: "", motivoEmissao: "", impostoSeloRetencao: "", valorImpostoSelo: "", totalImpostos: "", totalComImpostos: "", totalRetencoes: ""
            });
            const r2 = toGreenReceipt({
                referencia: "2", situacao: "Emitido", dataTransacao: "2025-02-15", dataEmissao: "2025-02-15", paisAdquirente: "PT", nomeAdquirente: "Client A", nifAdquirente: "123", valorTributavel: "2.000", valorIVA: "460", valorIRS: "500", contribuicaoCultura: "0", totalDocumento: "1.960", tipoDocumento: "", atcud: "", motivoEmissao: "", impostoSeloRetencao: "", valorImpostoSelo: "", totalImpostos: "", totalComImpostos: "", totalRetencoes: ""
            });
            const r3 = toGreenReceipt({
                referencia: "3", situacao: "Emitido", dataTransacao: "2026-06-01", dataEmissao: "2026-06-01", paisAdquirente: "UK", nomeAdquirente: "Client B", nifAdquirente: "456", valorTributavel: "5.000", valorIVA: "0", valorIRS: "0", contribuicaoCultura: "0", totalDocumento: "5.000", tipoDocumento: "", atcud: "", motivoEmissao: "", impostoSeloRetencao: "", valorImpostoSelo: "", totalImpostos: "", totalComImpostos: "", totalRetencoes: ""
            });

            const stats = computeGreenReceiptsAnnualStats([r1, r2, r3]);

            // Should have two years: 2025 and 2026
            expect(stats.has(2025)).toBe(true);
            expect(stats.has(2026)).toBe(true);

            const s2025 = stats.get(2025)!;
            expect(s2025.receiptCount).toBe(2);
            expect(s2025.grossIncome).toBe(3000);
            expect(s2025.totalIVACharged).toBe(690);
            expect(s2025.totalIRSWithheld).toBe(750);
            expect(s2025.totalReceived).toBe(2940);
            expect(s2025.byClient["123"].grossIncome).toBe(3000);
            expect(s2025.byClient["123"].receipts).toBe(2);

            const s2026 = stats.get(2026)!;
            expect(s2026.receiptCount).toBe(1);
            expect(s2026.grossIncome).toBe(5000);
            expect(s2026.byClient["456"].grossIncome).toBe(5000);
        });
    });

    describe("analyzeGreenReceiptTaxes", () => {
        it("calculates expected IRS and SS for a specific year's stats", () => {
            const stats: GreenReceiptAnnualStats = {
                year: 2024,
                receiptCount: 5,
                grossIncome: 45000,
                totalIVACharged: 10350,
                totalIRSWithheld: 7500,
                totalReceived: 37500,
                byClient: {}
            };

            const analysis = analyzeGreenReceiptTaxes(stats);

            // Taxable income is calculated by the simulator based on coefficients and expenses.
            expect(analysis.taxableIncome).toBeGreaterThan(0);

            // Since marginal and average rate are retrieved from the simulator
            expect(analysis.marginalRatePercentage).toBeGreaterThan(0);
            expect(analysis.irsEstimatedTotal).toBeGreaterThan(0);

            // SS Base is 70% of 45000 / 12 = 2625
            // 21.4% of 2625 = 561.75
            expect(analysis.ssBaseIncidenceMonthly).toBe(2625);
            expect(analysis.ssMonthlyContribution).toBeCloseTo(561.75, 2);
            expect(analysis.ssAnnualTotal).toBeCloseTo(561.75 * 12, 2);

            // Validate totals
            expect(analysis.totalBurden).toBe(analysis.irsEstimatedTotal + analysis.ssAnnualTotal);
            expect(analysis.netIncome).toBe(stats.grossIncome - analysis.totalBurden);
        });
    });
});
