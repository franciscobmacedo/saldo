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


@pytest.mark.parametrize(
    "test_case",
    [
        SalaryTestCase(
            description="1 dependent",
            number_of_dependents=1,
            expected_gross_income=1500,
            expected_tax=169.05,
            expected_social_security=165,
            expected_net_salary=1165.95,
        ),
        SalaryTestCase(
            description="2 dependents",
            number_of_dependents=2,
            expected_gross_income=1500,
            expected_tax=134.76,
            expected_social_security=165,
            expected_net_salary=1200.24,
        ),
        SalaryTestCase(
            description="5 dependents",
            number_of_dependents=5,
            expected_gross_income=1500,
            expected_tax=31.89,
            expected_social_security=165,
            expected_net_salary=1303.11,
        ),
        SalaryTestCase(
            description="10 dependents",
            number_of_dependents=10,
            expected_gross_income=1500,
            expected_tax=0,
            expected_social_security=165,
            expected_net_salary=1335,
        ),
        
    ],
    ids=[
        "1 dependent",
        "2 dependents",
        "5 dependents",
        "10 dependents",
    ],
)
def test_salary_with_different_dependents(
    test_case: SalaryTestCase, base_single_params: dict
):
    """Test salary calculations with different twelfth configurations."""
    verify_salary_calculation(test_case, base_single_params)


@pytest.mark.parametrize(
    "test_case",
    [
        SalaryTestCase(
            description="1 dependent",
            location="acores",
            number_of_dependents=1,
            expected_gross_income=1500,
            expected_tax=102.75,
            expected_social_security=165,
            expected_net_salary=1232.25,
        ),
        SalaryTestCase(
            description="2 dependents",
            location="acores",
            number_of_dependents=2,
            expected_gross_income=1500,
            expected_tax=68.46,
            expected_social_security=165,
            expected_net_salary=1266.54,
        ),
        SalaryTestCase(
            description="5 dependents",
            location="acores",
            number_of_dependents=5,
            expected_gross_income=1500,
            expected_tax=0,
            expected_social_security=165,
            expected_net_salary=1335.0,
        ),
        SalaryTestCase(
            description="10 dependents",
            location="acores",
            number_of_dependents=10,
            expected_gross_income=1500,
            expected_tax=0,
            expected_social_security=165,
            expected_net_salary=1335,
        ),
        
    ],
    ids=[
        "1 dependent",
        "2 dependents",
        "5 dependents",
        "10 dependents",
    ],
)
def test_salary_with_different_dependents_acores(
    test_case: SalaryTestCase, base_single_params: dict
):
    """Test salary calculations with different twelfth configurations."""
    verify_salary_calculation(test_case, base_single_params)




@pytest.mark.parametrize(
    "test_case",
    [
        SalaryTestCase(
            description="1 dependent",
            location="madeira",
            number_of_dependents=1,
            expected_gross_income=1500,
            expected_tax=124.3,
            expected_social_security=165,
            expected_net_salary=1210.7,
        ),
        SalaryTestCase(
            description="2 dependents",
            location="madeira",
            number_of_dependents=2,
            expected_gross_income=1500,
            expected_tax=90.01,
            expected_social_security=165,
            expected_net_salary=1244.99,
        ),
        SalaryTestCase(
            description="5 dependents",
            location="madeira",
            number_of_dependents=5,
            expected_gross_income=1500,
            expected_tax=0,
            expected_social_security=165,
            expected_net_salary=1335.0,
        ),
        SalaryTestCase(
            description="10 dependents",
            location="madeira",
            number_of_dependents=10,
            expected_gross_income=1500,
            expected_tax=0,
            expected_social_security=165,
            expected_net_salary=1335,
        ),
        
    ],
    ids=[
        "1 dependent",
        "2 dependents",
        "5 dependents",
        "10 dependents",
    ],
)
def test_salary_with_different_dependents_madeira(
    test_case: SalaryTestCase, base_single_params: dict
):
    """Test salary calculations with different twelfth configurations."""
    verify_salary_calculation(test_case, base_single_params)



@pytest.mark.parametrize(
    "test_case",
    [
        SalaryTestCase(
            description="Base salary without twelfths",
            twelfths=0,
            expected_gross_income=1500,
            expected_tax=203.34,
            expected_social_security=165,
            expected_net_salary=1131.66,
        ),
        SalaryTestCase(
            description="Base salary with half twelfth",
            twelfths=0.5,
            expected_gross_income=1562.5,
            expected_tax=211.8125,
            expected_social_security=171.875,
            expected_net_salary=1178.8125,
        ),
        SalaryTestCase(
            description="Base salary with one twelfth",
            twelfths=1,
            expected_gross_income=1625,
            expected_tax=220.285,
            expected_social_security=178.75,
            expected_net_salary=1225.965,
        ),
        SalaryTestCase(
            description="Base salary with two twelfths",
            twelfths=2,
            expected_gross_income=1750,
            expected_tax=237.23,
            expected_social_security=192.50,
            expected_net_salary=1320.27,
        ),
    ],
    ids=[
        "Base salary without twelfths",
        "Base salary with half twelfth",
        "Base salary with one twelfth",
        "Base salary with two twelfths",
    ],
)
def test_salary_with_different_twelfths(
    test_case: SalaryTestCase, base_single_params: dict
):
    """Test salary calculations with different twelfth configurations."""
    verify_salary_calculation(test_case, base_single_params)


@pytest.mark.parametrize(
    "test_case",
    [
        SalaryTestCase(
            description="No lunch allowance",
            expected_gross_income=1500,
            expected_taxable_income=1500,
            expected_tax=203.34,
            expected_social_security=165,
            expected_net_salary=1131.66,
            lunch_allowance=LunchAllowance(daily_value=0, mode="cupon", days_count=0),
        ),
        SalaryTestCase(
            description="Lunch allowance below limit (7€/day)",
            expected_gross_income=1654,
            expected_taxable_income=1500,
            expected_tax=203.34,
            expected_social_security=165,
            expected_net_salary=1285.66,
            lunch_allowance=LunchAllowance(daily_value=7, mode="cupon", days_count=22),
        ),
        SalaryTestCase(
            description="Lunch allowance above limit (10€/day)",
            expected_gross_income=1720,
            expected_taxable_income=1508.8,
            expected_tax=205.628,
            expected_social_security=165.968,
            expected_net_salary=1348.404,
            lunch_allowance=LunchAllowance(daily_value=10, mode="cupon", days_count=22),
        ),
        SalaryTestCase(
            description="Lunch allowance in salary bellow limit  (5€/day)",
            expected_gross_income=1610,
            expected_taxable_income=1500,
            expected_tax=203.34,
            expected_social_security=165,
            expected_net_salary=1241.66,
            lunch_allowance=LunchAllowance(daily_value=5, mode="salary", days_count=22),
        ),
        SalaryTestCase(
            description="Lunch allowance in salary above limit (10€/day)",
            expected_gross_income=1720,
            expected_taxable_income=1588.0,
            expected_tax=226.22,
            expected_social_security=174.68,
            expected_net_salary=1319.1,
            lunch_allowance=LunchAllowance(daily_value=10, mode="salary", days_count=22),
        ),
    ],
    ids=[
        "No lunch allowance",
        "Lunch allowance below limit",
        "Lunch allowance above limit",
        "Lunch allowance in salary below limit",
        "Lunch allowance in salary above limit",
    ],
)
def test_salary_with_different_lunch_allowances(
    test_case: SalaryTestCase, base_single_params: dict
):
    """Test salary calculations with different lunch allowance configurations."""
    verify_salary_calculation(test_case, base_single_params)
