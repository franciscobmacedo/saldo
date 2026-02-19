import { LocationT, RetentionPathsSchema, SituationCodesT, PeriodT, getYearFromPeriod } from "@/config/schemas";
import { taxTablesData } from "@/data/retention-tax-tables-data"; // Import the pre-loaded JSON data

// Interface for the raw data structure of a tax bracket
interface TaxBracketData {
    signal: "max" | "min";
    limit: number;
    max_marginal_rate: number;
    deduction: number;
    var1_deduction: number;
    var2_deduction: number;
    dependent_aditional_deduction: number;
    effective_mensal_rate: number;
}

class TaxBracket {
    signal: "max" | "min";
    limit: number;
    max_marginal_rate: number;
    deduction: number;
    var1_deduction: number;
    var2_deduction: number;
    dependent_aditional_deduction: number;
    effective_mensal_rate: number;

    constructor(data: TaxBracketData) {
        this.signal = data.signal;
        this.limit = data.limit;
        this.max_marginal_rate = data.max_marginal_rate;
        this.deduction = data.deduction;
        this.var1_deduction = data.var1_deduction;
        this.var2_deduction = data.var2_deduction;
        this.dependent_aditional_deduction = data.dependent_aditional_deduction;
        this.effective_mensal_rate = data.effective_mensal_rate;
    }

    calculate_deductible(salary: number): number {
        // In Python, 0.0 is falsy. If var1_deduction or var2_deduction can be 0.0
        // and that should prevent this path, this JS/TS equivalent is fine.
        if (this.var1_deduction && this.var2_deduction) {
            return this.deduction * this.var1_deduction * (this.var2_deduction - salary);
        }
        return this.deduction;
    }

    calculate_tax(
        taxable_income: number,
        twelfths_income: number,
        number_of_dependents: number = 0,
        extra_deduction: number = 0
    ): number {
        const deduction = this.calculate_deductible(taxable_income);
        let rate: number;

        if (number_of_dependents >= 3) {
            // https://diariodarepublica.pt/dr/detalhe/despacho/9971-a-2024-885806206#:~:text=h)%20Aos%20titulares,abater%20por%20dependente%3B
            /*
            h) Aos titulares de rendimentos de trabalho dependente com três ou mais dependentes
            que se enquadrem nas tabelas previstas nas alíneas a) e b) do n.º 1, é aplicada uma
            redução de um ponto percentual à taxa marginal máxima correspondente ao escalão em que
            se integram, mantendo-se inalterada a parcela a abater e a parcela adicional a abater por dependente;
            */
            rate = this.max_marginal_rate - 0.01;
        } else {
            rate = this.max_marginal_rate;
        }

        const base_tax =
            taxable_income * rate -
            deduction -
            extra_deduction -
            number_of_dependents * this.dependent_aditional_deduction;

        // effective rate is the actual rate that is applied to the income after the deductions
        // this is what we use to calculate the tax for the twelfths income
        const effective_rate = taxable_income !== 0 ? base_tax / taxable_income : 0; // Avoid division by zero
        const twelfths_tax = twelfths_income * effective_rate;
        const tax = base_tax + twelfths_tax;

        return Math.max(0, tax);
    }

    toJSON(): TaxBracketData {
        return {
            signal: this.signal,
            limit: this.limit,
            max_marginal_rate: this.max_marginal_rate,
            deduction: this.deduction,
            var1_deduction: this.var1_deduction,
            var2_deduction: this.var2_deduction,
            dependent_aditional_deduction: this.dependent_aditional_deduction,
            effective_mensal_rate: this.effective_mensal_rate
        };
    }
}

// Interface for the raw JSON structure when loading from file
// This interface should ideally be the same as TaxTableJsonData in the manifest
interface TaxRetentionTableJsonData {
    situation: string;
    description: string;
    brackets: TaxBracketData[];
    dependent_disabled_addition_deduction?: number;
}

class TaxRetentionTable {
    region: string;
    situation: string;
    description: string;
    tax_brackets: TaxBracket[]; // Array of TaxBracket class instances
    dependent_disabled_addition_deduction?: number;

    constructor(
        region: string,
        situation: string,
        description: string,
        tax_brackets_data: TaxBracketData[], // Accepts raw data for brackets
        dependent_disabled_addition_deduction?: number
    ) {
        this.region = region;
        this.situation = situation;
        this.description = description;
        this.tax_brackets = tax_brackets_data.map(b => new TaxBracket(b));
        this.dependent_disabled_addition_deduction = dependent_disabled_addition_deduction;
    }

    find_bracket(salary: number): TaxBracket {
        for (const bracket of this.tax_brackets) {
            if (bracket.signal === "max" && salary <= bracket.limit) {
                return bracket;
            } else if (bracket.signal === "min" && salary > bracket.limit) {
                return bracket;
            }
        }
        throw new Error(`No bracket found for salary ${salary}`);
    }

    // Renamed from load_from_file and modified to accept data directly
    static from_data(region: string, data: TaxRetentionTableJsonData): TaxRetentionTable {
        if (!data) {
            throw new Error(`Tax table data not provided.`);
        }

        return new TaxRetentionTable(
            region, // Region might need to be passed or inferred differently
            data.situation,
            data.description,
            data.brackets, // Pass the raw bracket data
            data.dependent_disabled_addition_deduction
        );
    }

    static load(
        period: PeriodT,
        location: LocationT,
        situation_code: SituationCodesT
    ): TaxRetentionTable {
        const yearStr = String(getYearFromPeriod(period));

        const retentionTablePathGenerator = new RetentionPathsSchema(
            period,
            location,
            situation_code,
            yearStr
        );
        
        const identifier = retentionTablePathGenerator.path; // This now returns the identifier string
        const tableData = taxTablesData[identifier]; // Look up in the manifest

        if (!tableData) {
            throw new Error(`Tax table not found for identifier: ${identifier}. Ensure it's in retention-tax-tables-data.ts`);
        }
        
        // Assuming 'location' can be used as the region directly.
        // The original load_from_file hardcoded "continent". 
        // We use the 'location' parameter now, which seems more correct.
        return TaxRetentionTable.from_data(location, tableData as TaxRetentionTableJsonData);
    }

    toJSON(): TaxRetentionTableJsonData {
        return {
            situation: this.situation,
            description: this.description,
            brackets: this.tax_brackets.map(bracket => bracket.toJSON()),
            dependent_disabled_addition_deduction: this.dependent_disabled_addition_deduction
        };
    }
}

// Export the classes if they are to be used by other modules
export { TaxBracket, TaxRetentionTable }; 
