import datetime
from typing import Optional
from saldo.config.schemas import Condition, Situations, LocationT
from saldo.schemas import Twelfths, LunchAllowance, SimulationResult
from saldo.tables.tax_retention import TaxRetentionTable


def simulate_dependent_worker(
    income: float,
    married: bool,
    disabled: bool,
    partner_disabled: Optional[bool] = False,
    location: LocationT = "continente",
    number_of_holders: Optional[int] = None,
    number_of_dependents: Optional[int] = None,
    number_of_dependents_disabled: Optional[int] = None,
    date_start: datetime.date = datetime.date(2024, 1, 1),
    date_end: datetime.date = datetime.date(2024, 8, 31),
    social_security_tax: float = 0.11,
    twelfths: Twelfths = Twelfths.TWO_MONTHS,
    lunch_allowance: LunchAllowance = LunchAllowance(),
) -> SimulationResult:
    
    if number_of_holders is not None and number_of_holders > 2:
        raise ValueError("number_of_holders must be None, 1 or 2")
    
    if married and not number_of_holders:
        raise ValueError("number_of_holders is required for married workers")

    if married and number_of_holders == 1 and partner_disabled:
        """
        https://diariodarepublica.pt/dr/detalhe/despacho/9971-a-2024-885806206#:~:text=b)%20Na%20situa%C3%A7%C3%A3o%20de%20%22casado%2C%20%C3%BAnico%20titular%22%20em

        b) Na situação de "casado, único titular" em que o cônjuge 
        não aufira rendimentos das categorias A ou H e apresente 
        um grau de incapacidade permanente igual ou superior a 60 %, 
        é adicionado o valor de € 135,71 à parcela a abater;
        """
        extra_deduction = 135.71
    else:
        extra_deduction = 0.0

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

    situation = Situations.get_situation_from_condition(condition)
    tax_retention_table = TaxRetentionTable.load(
        date_start, date_end, location, situation.code
    )
    if tax_retention_table.dependent_disabled_addition_deduction is not None and number_of_dependents_disabled is not None:
        extra_deduction += tax_retention_table.dependent_disabled_addition_deduction * number_of_dependents_disabled
        
    bracket = tax_retention_table.find_bracket(taxable_income)

    tax = (
        bracket.calculate_tax(
            taxable_income,
            twelfths_income,
            number_of_dependents or 0,
            extra_deduction,
        )
        if bracket
        else 0.0
    )

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
