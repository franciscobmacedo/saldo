import datetime
from typing import Optional

from saldo import dependent_worker, validators
from saldo.config.schemas import LocationT, Situations
from saldo.schemas import LunchAllowance, SimulationResult, Twelfths
from saldo.tables.tax_retention import TaxRetentionTable


def simulate_dependent_worker(
    income: float,
    married: bool = False,
    disabled: bool = False,
    partner_disabled: bool = False,
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
    # validate input
    validators.validate_number_of_holders(number_of_holders)
    validators.validate_married_and_number_of_holders(married, number_of_holders)
    validators.validate_dependents(number_of_dependents, number_of_dependents_disabled)

    # partner with disability results in extra deduction
    extra_deduction = dependent_worker.get_partner_extra_deduction(
        married, number_of_holders, partner_disabled
    )

    # holidays and christmas income distributed over the year
    twelfths_income = dependent_worker.get_twelfths_income(income, twelfths)

    # income for tax calculation
    taxable_income = income + lunch_allowance.taxable_monthly_value

    # income for gross salary and social security
    retention_income = taxable_income + twelfths_income

    # gross salary per month
    gross_income = retention_income + lunch_allowance.tax_free_monthly_value

    # the situation to determine the tax bracket - it's connected with the table code
    situation = Situations.get_situation(
        married=married,
        number_of_holders=number_of_holders,
        number_of_dependents=number_of_dependents,
        disabled=disabled,
    )

    # load the corresponding tax retention table
    tax_retention_table = TaxRetentionTable.load(
        date_start, date_end, location, situation.code
    )

    # find the tax bracket for the taxable income
    bracket = tax_retention_table.find_bracket(taxable_income)

    # extra deduction for dependents with disability
    extra_deduction += dependent_worker.get_disabled_dependent_extra_deduction(
        tax_retention_table, number_of_dependents_disabled or 0
    )

    # calculate the tax, social security and net salary
    tax = bracket.calculate_tax(
        taxable_income,
        twelfths_income,
        number_of_dependents or 0,
        extra_deduction,
    )
    social_security = retention_income * social_security_tax
    net_salary = gross_income - tax - social_security

    # calculate yearly values
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
