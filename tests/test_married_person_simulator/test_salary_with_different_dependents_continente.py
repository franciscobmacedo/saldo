import pytest

from tests.test_married_person_simulator.base import (
    SalaryTestCase,
    verify_salary_calculation,
)


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
            expected_tax=81.19,
            expected_social_security=165,
            expected_net_salary=1253.81,
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
def test_salary_with_different_dependents_continente(
    test_case: SalaryTestCase, base_married_params: dict
):
    """Test salary calculations with different twelfth configurations."""
    verify_salary_calculation(test_case, base_married_params)
