from dataclasses import dataclass
from enum import Enum
from typing import Literal


class Twelfths(float, Enum):
    """
    How many months of salary are paid in twelfths.
    """

    ZERO_MONTHS = 0.0
    HALF_MONTH = 0.5
    ONE_MONTH_OR_TWO_HALFS = 1.0
    TWO_MONTHS = 2.0


@dataclass
class LunchAllowance:
    daily_value: float = 0
    mode: Literal["cupon", "salary", None] = None
    days_count: int = 0

    @property
    def monthly_value(self) -> float:
        """
        Calculate the monthly value of the lunch allowance.
        it's nr of days * daily value
        """
        return self.daily_value * self.days_count

    @property
    def taxable_monthly_value(self) -> float:
        """
        Calculate the taxable monthly value of the lunch allowance.
        if the allowance is payed in the salary, the max amount free of tax is 6€/day
        if it's payed in cupons, the max amount free of tax is 9.6€/day
        """
        max_daily_value = 6 if self.mode == "salary" else 9.6

        free_of_tax_amount = max_daily_value * self.days_count
        return max(0, self.monthly_value - free_of_tax_amount)

    @property
    def tax_free_monthly_value(self) -> float:
        """
        Calculate the tax free monthly value of the lunch allowance.
        """
        return self.monthly_value - self.taxable_monthly_value

    @property
    def yearly_value(self) -> float:
        """
        Calculate the yearly value of the lunch allowance.
        it's monthly value * 11
        """
        return self.monthly_value * 11


@dataclass
class DependentWorkerResult:
    taxable_income: float
    gross_income: float
    tax: float
    social_security: float
    social_security_tax: float
    net_salary: float
    yearly_net_salary: float
    yearly_gross_salary: float
    lunch_allowance: LunchAllowance

    @property
    def explanation(self) -> str:
        from saldo.dependent_worker.text import generate_salary_explanation

        return generate_salary_explanation(self)
