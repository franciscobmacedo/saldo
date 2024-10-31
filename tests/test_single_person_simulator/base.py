from saldo.schemas import LunchAllowance
from saldo.simulator import simulate_dependent_worker
import pytest
from dataclasses import dataclass
from typing import Optional

# Constants for better readability
APPROX_FACTOR = 0.00001
BASE_TAXABLE_INCOME = 1500


@dataclass
class SalaryTestCase:
    """Data class to hold test parameters and expected results for salary calculations."""

    description: str
    location: str = "continente"
    twelfths: float = 0
    lunch_allowance: Optional[LunchAllowance] = None
    number_of_dependents: int = 0
    expected_gross_income: float = 0
    expected_taxable_income: float = BASE_TAXABLE_INCOME
    expected_tax: float = 0
    expected_social_security: float = 0
    expected_net_salary: float = 0


def verify_salary_calculation(test_case: SalaryTestCase, base_params: dict):
    """
    Verify salary calculations match expected values.

    Args:
        test_case: SalaryTestCase containing test parameters and expected results
        base_params: Base simulation parameters
    """
    simulation_params = {**base_params, "twelfths": test_case.twelfths, "number_of_dependents": test_case.number_of_dependents, "location": test_case.location}

    if test_case.lunch_allowance:
        simulation_params["lunch_allowance"] = test_case.lunch_allowance

    result = simulate_dependent_worker(**simulation_params)

    # Using descriptive messages for assertions to make failures more informative
    assert result.taxable_income == pytest.approx(
        test_case.expected_taxable_income, APPROX_FACTOR
    ), f"Taxable income mismatch for {test_case.description}"
    assert result.gross_income == pytest.approx(
        test_case.expected_gross_income, APPROX_FACTOR
    ), f"Gross income mismatch for {test_case.description}"
    assert result.tax == pytest.approx(
        test_case.expected_tax, APPROX_FACTOR
    ), f"Tax calculation mismatch for {test_case.description}"
    assert result.social_security == pytest.approx(
        test_case.expected_social_security, APPROX_FACTOR
    ), f"Social security mismatch for {test_case.description}"
    assert result.net_salary == pytest.approx(
        test_case.expected_net_salary, APPROX_FACTOR
    ), f"Net salary mismatch for {test_case.description}"


