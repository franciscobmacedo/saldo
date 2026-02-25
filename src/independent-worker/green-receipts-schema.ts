/**
 * Represents the raw, unparsed string data for a single row
 * from the Portal das Finanças green receipts export CSV.
 */
export interface GreenReceiptRawRow {
    referencia: string;
    tipoDocumento: string;
    atcud: string;
    situacao: string;
    dataTransacao: string;
    motivoEmissao: string;
    dataEmissao: string;
    paisAdquirente: string;
    nifAdquirente: string;
    nomeAdquirente: string;
    valorTributavel: string;
    valorIVA: string;
    impostoSeloRetencao: string;
    valorImpostoSelo: string;
    valorIRS: string;
    totalImpostos: string;
    totalComImpostos: string;
    totalRetencoes: string;
    contribuicaoCultura: string;
    totalDocumento: string;
}

/**
 * Represents a parsed and validated green receipt.
 * Numeric fields are parsed into JS numbers, and dates into Date objects.
 */
export interface GreenReceipt {
    referencia: string;
    situacao: "Emitido" | "Anulado" | string;
    dataTransacao: Date;
    dataEmissao: Date;
    paisAdquirente: string;
    nomeAdquirente: string;
    nifAdquirente: string;
    /** Gross income (net of VAT) — the taxable base */
    valorTributavel: number;
    /** VAT charged to the client */
    valorIVA: number;
    /** IRS withheld at source by the client (retenção na fonte) */
    valorIRS: number;
    /** Contribution to cultura (usually 0) */
    contribuicaoCultura: number;
    /** Amount effectively received (after withholdings) */
    totalDocumento: number;
}

/**
 * Annual aggregated statistics for green receipts.
 * Includes total gross income, VAT, IRS withheld, and a breakdown per client.
 */
export interface GreenReceiptAnnualStats {
    year: number;
    receiptCount: number;
    /** Sum of Valor Tributável — gross income before any taxes */
    grossIncome: number;
    /** Total VAT charged (collected on behalf of the state) */
    totalIVACharged: number;
    /** Total IRS withheld at source by clients */
    totalIRSWithheld: number;
    /** Total actually received in bank (Valor Tributável - IRS withheld) */
    totalReceived: number;
    /** Per-client breakdown mapping client NIF/Name to their statistics */
    byClient: Record<
        string,
        {
            /** The name of the client */
            name: string;
            /** Number of receipts issued to this client */
            receipts: number;
            /** Gross income (net of VAT) from this client */
            grossIncome: number;
            /** Total VAT charged to this client */
            ivaCharged: number;
            /** Total IRS withheld by this client */
            irsWithheld: number;
            /** Total amount received from this client */
            received: number;
        }
    >;
}

