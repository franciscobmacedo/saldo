from typing import Literal
from enum import Enum
from dataclasses import dataclass



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
    daily_value: float = 4.77
    mode: Literal["cupon", "salary", None] = "cupon"
    days_count: int = 0

    @property
    def monthly_value(self) -> float:
        """
        Calculate the monthly value of the lunch allowance.
        it's nr of days * daily value
        """
        return self.daily_value * self.days_count
@dataclass
class SimulationResult:
    taxable_income: float
    gross_income: float
    tax: float
    social_security: float
    social_security_tax: float
    net_salary: float
    yearly_net_salary: float
    yearly_gross_salary: float


    @property
    def explanation(self) -> str:
        from saldo.text import generate_salary_explanation
        return generate_salary_explanation(self)
