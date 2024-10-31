import pytest

from tests.test_single_person_simulator.base import (
    SalaryTestCase,
    verify_salary_calculation,
)


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
