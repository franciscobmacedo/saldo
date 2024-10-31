from tests.test_married_person_simulator.base import (
    verify_salary_calculation,
    SalaryTestCase,
)
import pytest


@pytest.mark.parametrize(
    "test_case",
    [
        SalaryTestCase(
            description="Base salary with 1 holders and 1 dependents",
            location="madeira",
            number_of_holders=1,
            number_of_dependents=1,
            expected_gross_income=1500,
            expected_tax=94.54,
            expected_social_security=165,
            expected_net_salary=1240.46,
        ),
        SalaryTestCase(
            description="Base salary with 1 holders and 2 dependents",
            location="madeira",
            number_of_holders=1,
            number_of_dependents=2,
            expected_gross_income=1500,
            expected_tax=94.54,
            expected_social_security=165,
            expected_net_salary=1240.46,
        ),
        SalaryTestCase(
            description="Base salary with 1 holders and 5 dependents",
            location="madeira",
            number_of_holders=1,
            number_of_dependents=5,
            expected_gross_income=1500,
            expected_tax=79.54,
            expected_social_security=165,
            expected_net_salary=1255.46,
        ),
        SalaryTestCase(
            description="Base salary with 1 holders and 10 dependents",
            location="madeira",
            number_of_holders=1,
            number_of_dependents=10,
            expected_gross_income=1500,
            expected_tax=79.54,
            expected_social_security=165,
            expected_net_salary=1255.46,
        ),
        SalaryTestCase(
            description="Base salary with 2 holders and 1 dependents",
            location="madeira",
            number_of_holders=2,
            number_of_dependents=1,
            expected_gross_income=1500,
            expected_tax=147.87,
            expected_social_security=165,
            expected_net_salary=1187.13,
        ),
        SalaryTestCase(
            description="Base salary with 2 holders and 2 dependents",
            location="madeira",
            number_of_holders=2,
            number_of_dependents=2,
            expected_gross_income=1500,
            expected_tax=147.87,
            expected_social_security=165,
            expected_net_salary=1187.13,
        ),
        SalaryTestCase(
            description="Base salary with 2 holders and 5 dependents",
            location="madeira",
            number_of_holders=2,
            number_of_dependents=5,
            expected_gross_income=1500,
            expected_tax=132.87,
            expected_social_security=165,
            expected_net_salary=1202.13,
        ),
        SalaryTestCase(
            description="Base salary with 2 holders and 10 dependents",
            location="madeira",
            number_of_holders=2,
            number_of_dependents=10,
            expected_gross_income=1500,
            expected_tax=132.87,
            expected_social_security=165,
            expected_net_salary=1202.13,
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
def test_salary_with_different_dependents_madeira(
    test_case: SalaryTestCase, base_married_params: dict
):
    """Test salary calculations with different twelfth configurations."""
    verify_salary_calculation(test_case, base_married_params)
