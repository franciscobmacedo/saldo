import { LocationT, SituationUtils } from "@/config/schemas";
import { TaxRetentionTable } from "@/tables/tax-retention";
import {
    validateNumberOfHolders,
    validateMarriedAndNumberOfHolders,
    validateDependents,
} from "@/dependent-worker/validators";
import {
    Twelfths,
    LunchAllowance,
    DependentWorkerResult,
    defaultLunchAllowance,
} from "@/dependent-worker/schemas";
import {
    getPartnerExtraDeduction,
    getTwelfthsIncome,
    getDisabledDependentExtraDeduction,
} from "@/dependent-worker/calculations";

interface SimulateDependentWorkerOptions {
    income: number;
    married?: boolean;
    disabled?: boolean;
    partnerDisabled?: boolean;
    location?: LocationT;
    numberOfHolders?: number | null;
    numberOfDependents?: number | null;
    numberOfDependentsDisabled?: number | null;
    dateStart?: Date;
    dateEnd?: Date;
    socialSecurityTaxRate?: number;
    twelfths?: Twelfths;
    lunchAllowance?: LunchAllowance;
}

export function simulateDependentWorker({
    income,
    married = false,
    disabled = false,
    partnerDisabled = false,
    location = "continente",
    numberOfHolders = null,
    numberOfDependents = null,
    numberOfDependentsDisabled = null,
    dateStart = new Date(2024, 0, 1), // JS months are 0-indexed
    dateEnd = new Date(2024, 7, 31),   // JS months are 0-indexed
    socialSecurityTaxRate = 0.11,
    twelfths = Twelfths.TWO_MONTHS,
    lunchAllowance = defaultLunchAllowance, // Use the imported default
}: SimulateDependentWorkerOptions): DependentWorkerResult {
    // Validate input
    validateNumberOfHolders(numberOfHolders);
    validateMarriedAndNumberOfHolders(married, numberOfHolders);
    validateDependents(numberOfDependents, numberOfDependentsDisabled);

    // Partner with disability results in extra deduction
    let extraDeduction = getPartnerExtraDeduction(
        married,
        numberOfHolders,
        partnerDisabled
    );

    // Holidays and Christmas income distributed over the year
    const twelfthsIncome = getTwelfthsIncome(income, twelfths);

    // Income for tax calculation
    const taxableIncome = income + lunchAllowance.taxable_monthly_value;

    // Income for gross salary and social security
    const retentionIncome = taxableIncome + twelfthsIncome;

    // Gross salary per month
    const grossIncome = retentionIncome + lunchAllowance.tax_free_monthly_value;

    // The situation to determine the tax bracket
    const situation = SituationUtils.getSituation(
        married,
        disabled,
        numberOfHolders,
        numberOfDependents === null ? undefined : numberOfDependents // Python None is undefined here
    );

    if (!situation) {
        throw new Error(
            `Could not determine situation for the given parameters: married=${married}, disabled=${disabled}, numberOfHolders=${numberOfHolders}, numberOfDependents=${numberOfDependents}`
        );
    }

    // Load the corresponding tax retention table
    const taxRetentionTable = TaxRetentionTable.load(
        dateStart,
        dateEnd,
        location,
        situation.code
    );

    // Find the tax bracket for the taxable income
    const bracket = taxRetentionTable.find_bracket(taxableIncome);
    if (!bracket) {
        throw new Error(
            `Could not find tax bracket for taxable income: ${taxableIncome} in table ${situation.code} for location ${location}`
        );
    }

    // Extra deduction for dependents with disability
    extraDeduction += getDisabledDependentExtraDeduction(
        taxRetentionTable,
        numberOfDependentsDisabled || 0
    );

    // Calculate the tax, social security and net salary
    const tax = bracket.calculate_tax(
        taxableIncome,
        twelfthsIncome,
        numberOfDependents || 0,
        extraDeduction
    );
    const socialSecurity = retentionIncome * socialSecurityTaxRate;
    const netSalary = grossIncome - tax - socialSecurity;

    const yearlyLunchAllowance = lunchAllowance.monthly_value * 11;

    const yearlyGrossSalary = income * 14 + yearlyLunchAllowance;

    
    const yearlyNetSalary = netSalary * (14 - twelfths);


    return {
        taxable_income: taxableIncome,
        gross_income: grossIncome,
        tax,
        social_security: socialSecurity,
        social_security_tax: socialSecurityTaxRate,
        net_salary: netSalary,
        yearly_net_salary: yearlyNetSalary,
        yearly_gross_salary: yearlyGrossSalary,
        lunch_allowance: lunchAllowance,
    };
}

// Example of how to structure the input for lunch allowance if not using default:
/*
const customLunchAllowance: LunchAllowance = {
    daily_value: 7.5,
    days_in_month: 21,
    tax_free_daily_limit: 6.00, // Ensure this matches current regulations
    // social_security_monthly_threshold: 120, // Example, if applicable
    get taxable_monthly_value(): number {
        const daily_taxable = Math.max(0, this.daily_value - this.tax_free_daily_limit);
        return daily_taxable * this.days_in_month;
    },
    get tax_free_monthly_value(): number {
        const daily_tax_free = Math.min(this.daily_value, this.tax_free_daily_limit);
        return daily_tax_free * this.days_in_month;
    },
    get monthly_value(): number {
        return this.daily_value * this.days_in_month;
    }
};
*/
