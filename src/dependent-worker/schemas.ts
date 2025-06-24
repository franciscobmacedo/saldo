export enum Twelfths {
    NONE = 0, // No twelfths
    ONE_MONTH = 1, // Christmas OR Holiday allowance in twelfths
    TWO_MONTHS = 2, // Christmas AND Holiday allowance in twelfths
}

export interface LunchAllowance {
    daily_value: number;
    mode: "cupon" | "salary" | null;
    days_count: number;
    monthly_value: number;
    taxable_monthly_value: number;
    tax_free_monthly_value: number;
    yearly_value: number;
}

export interface DependentWorkerResult {
    taxable_income: number;
    gross_income: number;
    tax: number;
    social_security: number;
    social_security_tax: number;
    net_salary: number;
    yearly_net_salary: number;
    yearly_gross_salary: number;
    lunch_allowance: LunchAllowance;
}

// Default LunchAllowance values, matching Python's default
export const defaultLunchAllowance: LunchAllowance = {
    daily_value: 0,
    mode: null,
    days_count: 0,
    get monthly_value(): number {
        return this.daily_value * this.days_count;
    },
    get taxable_monthly_value(): number {
        const max_daily_value = this.mode === "salary" ? 6 : 9.6;
        const free_of_tax_amount = max_daily_value * this.days_count;
        return Math.max(0, this.monthly_value - free_of_tax_amount);
    },
    get tax_free_monthly_value(): number {
        return this.monthly_value - this.taxable_monthly_value;
    },
    get yearly_value(): number {
        return this.monthly_value * 11;
    }
}; 