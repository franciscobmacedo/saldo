

from typing import Optional


def validate_number_of_holders(number_of_holders: Optional[int]) -> None:
    if number_of_holders is not None and number_of_holders > 2:
        raise ValueError("'number_of_holders' must be None, 1 or 2")


def validate_married_and_number_of_holders(
    married: bool, number_of_holders: Optional[int]
) -> None:
    if married and number_of_holders is None:
        raise ValueError("'number_of_holders' is required for married workers")
    


def validate_dependents(number_of_dependents: Optional[int] = None, number_of_dependents_disabled: Optional[int] = None):
    """
    Validate the number of dependents and the number of dependents disabled.
    """
    if number_of_dependents_disabled is None:
        return
    
    if number_of_dependents is None:
        raise ValueError("'number_of_dependents' is required when 'number_of_dependents_disabled' is provided")

    
    if number_of_dependents_disabled > number_of_dependents:
        raise ValueError("'number_of_dependents_disabled' must be less than or equal to 'number_of_dependents'")
    