from typing import Literal
from saldo.schemas import Twelfths, LunchAllowance, SimulationResult
from saldo.tables.tax_retention import TaxRetentionTable


def simulate_dependent_worker(
    taxable_income: float,
    location: Literal[
        "Portugal Continental",
        "Região Autónoma dos Açores",
        "Região Autónoma da Madeira",
    ],
    year: int = 2024,
    marital_status: Literal[
        "single", "married_1_holder", "married_2_holder"
    ] = "single",
    number_of_dependents: int = 0,
    social_security_tax: float = 0.11,
    twelfths: Twelfths = Twelfths.TWO_MONTHS,
    lunch_allowance: LunchAllowance = LunchAllowance(),
) -> SimulationResult:
    twelfths_income = get_twelfths_income(taxable_income, twelfths)
    retention_income = taxable_income + twelfths_income
    gross_income = retention_income + lunch_allowance.monthly_value

    tax_retention_table = TaxRetentionTable.load(year, marital_status)
    bracket = tax_retention_table.find_bracket(taxable_income)
    tax = bracket.calculate_tax(taxable_income, twelfths_income) if bracket else 0.0

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
