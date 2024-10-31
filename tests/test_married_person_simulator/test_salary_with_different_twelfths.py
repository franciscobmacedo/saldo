from tests.test_married_person_simulator.base import (
    verify_salary_calculation,
    SalaryTestCase,
)
import pytest

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
