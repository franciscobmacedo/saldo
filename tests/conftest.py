# conftest.py
import pytest
from datetime import date
from saldo.schemas import Twelfths, LunchAllowance

@pytest.fixture
def base_single_params():
    return {
        "income": 1500,
        "location": "continente",
        "married": False,
        "disabled": False,
        "date_start": date(2024, 1, 1),
        "date_end": date(2024, 8, 31),
        "social_security_tax": 0.11,
        "twelfths": Twelfths.ZERO_MONTHS,
        "lunch_allowance": LunchAllowance(
            daily_value=0,
            days_count=0,
        ),
        "number_of_dependents": 0,
    }


@pytest.fixture
def base_married_params():
    return {
        "income": 1500,
        "location": "continente",
        "married": True,
        "disabled": False,
        "date_start": date(2024, 1, 1),
        "date_end": date(2024, 8, 31),
        "social_security_tax": 0.11,
        "twelfths": Twelfths.ZERO_MONTHS,
        "lunch_allowance": LunchAllowance(
            daily_value=0,
            days_count=0,
        ),
        "number_of_dependents": 0,
    }
