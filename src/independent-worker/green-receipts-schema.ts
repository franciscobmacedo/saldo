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

/**
 * Comprehensive tax analysis for a given year based on green receipts.
 * Provides IRS and Social Security estimates, comparing them against amounts already withheld.
 */
export interface GreenReceiptTaxAnalysis {
    /** Total gross income for the year */
    grossIncome: number;
    /** Income subject to tax (usually 75% of gross income, assuming standard coefficient) */
    taxableIncome: number;
    /** The highest IRS tax bracket rate applied (percentage) */
    marginalRatePercentage: number;
    /** The average IRS tax rate applied across brackets (percentage) */
    averageRatePercentage: number;

    /** Total estimated IRS tax owed for the year */
    irsEstimatedTotal: number;
    /** Total IRS already withheld at source by clients */
    irsAlreadyWithheld: number;
    /** The difference between withheld IRS and estimated total IRS */
    irsDelta: number;
    /** Indicates whether the taxpayer will receive a refund, need to pay more, or neither */
    irsDeltaType: "refund" | "pay" | "none";

    /** The monthly base incidence for Social Security (usually 70% of 1/12th gross income) */
    ssBaseIncidenceMonthly: number;
    /** Estimated monthly Social Security contribution */
    ssMonthlyContribution: number;
    /** Estimated annual Social Security total contribution */
    ssAnnualTotal: number;

    /** Combined total of estimated IRS and Social Security */
    totalBurden: number;
    /** The percentage of gross income going towards taxes and Social Security */
    totalBurdenPercentage: number;
    /** Final net income after deducting total tax/SS burden from gross income */
    netIncome: number;
}
