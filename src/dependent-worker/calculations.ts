// Assuming TaxRetentionTable is an interface or type defined elsewhere
// import { TaxRetentionTable } from \'../tables/tax_retention\'; // Adjust path as needed

interface TaxRetentionTable {
    dependent_disabled_addition_deduction?: number | null;
    // Add other properties of TaxRetentionTable if necessary
}

export function getPartnerExtraDeduction(
    married: boolean,
    numberOfHolders: number | null | undefined,
    partnerDisabled: boolean
): number {
    /**
     * https://diariodarepublica.pt/dr/detalhe/despacho/9971-a-2024-885806206#:~:text=b)%20Na%20situa%C3%A7%C3%A3o%20de%20%22casado%2C%20%C3%BAnico%20titular%22%20em
     *
     * b) Na situação de "casado, único titular" em que o cônjuge
     * não aufira rendimentos das categorias A ou H e apresente
     * um grau de incapacidade permanente igual ou superior a 60 %,
     * é adicionado o valor de € 135,71 à parcela a abater;
     */

    if (married && numberOfHolders === 1 && partnerDisabled) {
        return 135.71;
    }
    return 0.0;
}

export function getTwelfthsIncome(income: number, twelfths: number): number {
    /**
     * Calculate the income distributed for the number of twelfths.
     * Example: if the income is 1200€ and the twelfths is 2, the result is 200€
     * which is the holiday and christmas income distributed over the year.
     */
    const twelfthsCoefficient = twelfths / 12;
    return income * twelfthsCoefficient;
}

/**
 * Returns the per-month twelfths income coming from an "isenção de horário"
 * supplement. The supplement only counts in subsídio de férias (Art. 264.º
 * CT), so only the férias fraction of the twelfths is contributed.
 */
export function getIsencaoHorarioTwelfthsContribution(
    isencaoHorarioMonthly: number,
    feriasInTwelfthsFraction: number
): number {
    return (isencaoHorarioMonthly * feriasInTwelfthsFraction) / 12;
}

export function getDisabledDependentExtraDeduction(
    taxRetentionTable: TaxRetentionTable,
    numberOfDependentsDisabled: number
): number {
    /**
     * Get the extra deduction for the number of dependents disabled, different for each table.
     *
     * https://diariodarepublica.pt/dr/detalhe/despacho/9971-a-2024-885806206#:~:text=a)%20Por%20cada%20dependente%20com
     * a) Por cada dependente com grau de incapacidade permanente igual ou superior a 60 %,
     * é adicionado à parcela a abater o valor de € 84,82, no caso das tabelas ii, iii, v, vii, ii-a, iii-a, v-a e vii-a
     * e o valor de € 42,41, no caso das tabelas i, vi, i-a e vi-a;
     */
    if (taxRetentionTable.dependent_disabled_addition_deduction != null) {
        return (
            taxRetentionTable.dependent_disabled_addition_deduction
            * numberOfDependentsDisabled
        );
    }
    return 0.0;
} 