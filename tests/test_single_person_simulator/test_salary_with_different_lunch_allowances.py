import pytest

from saldo.schemas import LunchAllowance
from tests.test_single_person_simulator.base import (
    SalaryTestCase,
    verify_salary_calculation,
)


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
            lunch_allowance=LunchAllowance(
                daily_value=10, mode="salary", days_count=22
            ),
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
