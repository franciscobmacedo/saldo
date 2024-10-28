from saldo.schemas import LunchAllowance


def test_lunch_allowance_monthly_value():
    allowance = LunchAllowance(daily_value=5, days_count=20)
    assert allowance.monthly_value == 100


def test_lunch_allowance_cupon():
    allowance = LunchAllowance(daily_value=10, mode="cupon", days_count=20)
    assert allowance.taxable_monthly_value == 8
    assert allowance.tax_free_monthly_value == 192


def test_lunch_allowance_salary():
    allowance = LunchAllowance(daily_value=10, mode="salary", days_count=20)
    assert allowance.taxable_monthly_value == 80  # (10 * 20) - (6 * 20)
    assert allowance.tax_free_monthly_value == 120


def test_lunch_allowance_cupon_no_taxable_value():
    allowance = LunchAllowance(daily_value=9.6, mode="cupon", days_count=22)
    assert allowance.taxable_monthly_value == 0
    assert allowance.tax_free_monthly_value == 211.2


def test_lunch_allowance_salary_no_taxable_value():
    allowance = LunchAllowance(daily_value=6, mode="salary", days_count=22)
    assert allowance.taxable_monthly_value == 0
    assert allowance.tax_free_monthly_value == 132
