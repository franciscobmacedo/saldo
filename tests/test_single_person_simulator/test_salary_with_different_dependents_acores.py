import pytest

from tests.test_single_person_simulator.base import (
    SalaryTestCase,
    verify_salary_calculation,
)


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
