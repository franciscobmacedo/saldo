import datetime
from typing import Literal, Optional
from saldo.config.schemas import Condition, Situations
from saldo.schemas import Twelfths, LunchAllowance, SimulationResult
from saldo.tables.tax_retention import TaxRetentionTable


def simulate_dependent_worker(
    income: float,
    location: Literal[
        "Portugal Continental",
        "Região Autónoma dos Açores",
        "Região Autónoma da Madeira",
    ],
    married: bool,
    disabled: bool,
    number_of_holders: Optional[int] = None,
    number_of_dependents: Optional[int]= None,
    date_start: datetime.date = datetime.date(2024, 1, 1),
    date_end: datetime.date = datetime.date(2024, 8, 31),
    social_security_tax: float = 0.11,
    twelfths: Twelfths = Twelfths.TWO_MONTHS,
    lunch_allowance: LunchAllowance = LunchAllowance(),
) -> SimulationResult:
    
    if married and not number_of_holders:
        raise ValueError("number_of_holders is required for married workers")
    twelfths_income = get_twelfths_income(income, twelfths)

    taxable_income = income + lunch_allowance.taxable_monthly_value
    retention_income = taxable_income + twelfths_income 
    gross_income = retention_income + lunch_allowance.tax_free_monthly_value

    
    condition = Condition(
        married=married,
        number_of_holders=number_of_holders,
        number_of_dependents=number_of_dependents,
        disabled=disabled,
    )

    # print(f"{condition=}")
    situation = Situations.get_situation_from_condition(condition)
    # print("situation", situation)

    tax_retention_table = TaxRetentionTable.load(date_start, date_end, situation.code)
    bracket = tax_retention_table.find_bracket(taxable_income)
    # print("bracket", bracket)
    tax = bracket.calculate_tax(taxable_income, twelfths_income, number_of_dependents or 0) if bracket else 0.0

    social_security = retention_income * social_security_tax

    net_salary = gross_income - tax - social_security

    yearly_lunch_allowance = lunch_allowance.monthly_value * 11
    yearly_gross_salary = taxable_income * 14 + yearly_lunch_allowance
    yearly_net_salary = net_salary * (14 - twelfths)

    return SimulationResult(
        taxable_income=taxable_income,
        gross_income=gross_income,
        tax=tax,
        social_security=social_security,
        social_security_tax=social_security_tax,
        net_salary=net_salary,
        yearly_net_salary=yearly_net_salary,
        yearly_gross_salary=yearly_gross_salary,
        lunch_allowance=lunch_allowance,
    )


def get_twelfths_income(taxable_income: float, twelfths: Twelfths) -> float:
    """
    Calculate the extra income for a twelfths option.
    taxable_income: the base taxable income
    twelfths: the number of months of salary paid in twelfths

    Example:
    taxable_income = 1000
    twelfths = Twelfths.TWO_MONTHS

    this means the worker will receive 2 months of salary split in 12 parts for each month

    1000 * 2 / 12 = 166.67€
    166.67€ is the extra twelfths income
    """
    twelfths_coefficient = twelfths / 12
    return taxable_income * twelfths_coefficient
