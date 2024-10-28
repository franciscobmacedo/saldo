from saldo.schemas import LunchAllowance
from saldo.simulator import simulate_dependent_worker
import pytest
from dataclasses import dataclass

# Constants for better readability
APPROX_FACTOR = 0.00001
BASE_TAXABLE_INCOME = 1500


@dataclass
class SalaryTestCase:
    """Data class to hold test parameters and expected results for salary calculations."""

    description: str
    number_of_holders: int
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
    simulation_params = {
        **base_params,
        "number_of_holders": test_case.number_of_holders,
        "number_of_dependents": test_case.number_of_dependents,
    }

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
            description="Base salary with one holder",
            number_of_holders=1,
            expected_gross_income=1500,
            expected_tax=129.93,
            expected_social_security=165,
            expected_net_salary=1205.07,
        ),
        SalaryTestCase(
            description="Base salary with two holders",
            number_of_holders=2,
            expected_gross_income=1500,
            expected_tax=203.34,
            expected_social_security=165,
            expected_net_salary=1131.66,
        ),
     
    ],
    ids=[
        "Base salary with one holder",
        "Base salary with two holders",
    ],
)
def test_salary_with_different_twelfths(
    test_case: SalaryTestCase, base_married_params: dict
):
    """Test salary calculations with different twelfth configurations."""
    verify_salary_calculation(test_case, base_married_params)



@pytest.mark.parametrize(
    "test_case",
    [
        SalaryTestCase(
            description="Base salary with 1 holders and 1 dependents",
            number_of_holders=1,
            number_of_dependents=1,
            expected_gross_income=1500,
            expected_tax=87.07,
            expected_social_security=165,
            expected_net_salary=1247.93,
        ),
        SalaryTestCase(
            description="Base salary with 1 holders and 2 dependents",
            number_of_holders=1,
            number_of_dependents=2,
            expected_gross_income=1500,
            expected_tax=44.21,
            expected_social_security=165,
            expected_net_salary=1290.79,
        ),
        SalaryTestCase(
            description="Base salary with 1 holders and 5 dependents",
            number_of_holders=1,
            number_of_dependents=5,
            expected_gross_income=1500,
            expected_tax=0,
            expected_social_security=165,
            expected_net_salary=1335,
        ),
        SalaryTestCase(
            description="Base salary with 1 holders and 10 dependents",
            number_of_holders=1,
            number_of_dependents=10,
            expected_gross_income=1500,
            expected_tax=0,
            expected_social_security=165,
            expected_net_salary=1335,
        ),
         SalaryTestCase(
            description="Base salary with 2 holders and 1 dependents",
            number_of_holders=2,
            number_of_dependents=1,
            expected_gross_income=1500,
            expected_tax=181.91,
            expected_social_security=165,
            expected_net_salary=1153.09,
        ),
        
        SalaryTestCase(
            description="Base salary with 2 holders and 2 dependents",
            number_of_holders=2,
            number_of_dependents=2,
            expected_gross_income=1500,
            expected_tax=160.48,
            expected_social_security=165,
            expected_net_salary=1174.52,
        ),
          SalaryTestCase(
            description="Base salary with 2 holders and 5 dependents",
            number_of_holders=2,
            number_of_dependents=5,
            expected_gross_income=1500,
            expected_tax=96.19,
            expected_social_security=165,
            expected_net_salary=1238.81,
        ),
        SalaryTestCase(
            description="Base salary with 2 holders and 10 dependents",
            number_of_holders=2,
            number_of_dependents=10,
            expected_gross_income=1500,
            expected_tax=0,
            expected_social_security=165,
            expected_net_salary=1335,
        ),
    ],
    ids=[
        "Base salary with one holder and 1 dependents",
        "Base salary with one holder and 2 dependents",
        "Base salary with one holder and 5 dependents",
        "Base salary with one holder and 10 dependents",
        "Base salary with two holders and 1 dependents",
        "Base salary with two holders and 2 dependents",
        "Base salary with two holders and 5 dependents",
        "Base salary with two holders and 10 dependents",
    ],
)
def test_salary_with_different_dependents(
    test_case: SalaryTestCase, base_married_params: dict
):
    """Test salary calculations with different twelfth configurations."""
    verify_salary_calculation(test_case, base_married_params)
