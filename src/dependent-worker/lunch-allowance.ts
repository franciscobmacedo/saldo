export class LunchAllowance {
  constructor(
    public dailyValue: number,
    public mode: "cupon" | "salary" | null,
    public daysCount: number
  ) {}

  get monthlyValue(): number {
    return this.dailyValue * this.daysCount;
  }

  get taxableMonthlyValue(): number {
    const maxDailyValue = this.mode === "salary" ? 6 : 10.2;
    const freeOfTaxAmount = maxDailyValue * this.daysCount;
    return Math.max(0, this.monthlyValue - freeOfTaxAmount);
  }

  get taxFreeMonthlyValue(): number {
    return this.monthlyValue - this.taxableMonthlyValue;
  }

  get yearlyValue(): number {
    return this.monthlyValue * 11;
  }
}
