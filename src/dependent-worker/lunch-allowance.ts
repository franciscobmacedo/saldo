export class LunchAllowance {
  constructor(
    public daily_value: number,
    public mode: "cupon" | "salary" | null,
    public days_count: number
  ) {}

  get monthly_value(): number {
    return this.daily_value * this.days_count;
  }

  get taxable_monthly_value(): number {
    const max_daily_value = this.mode === "salary" ? 6 : 10.2;
    const free_of_tax_amount = max_daily_value * this.days_count;
    return Math.max(0, this.monthly_value - free_of_tax_amount);
  }

  get tax_free_monthly_value(): number {
    return this.monthly_value - this.taxable_monthly_value;
  }

  get yearly_value(): number {
    return this.monthly_value * 11;
  }
}
