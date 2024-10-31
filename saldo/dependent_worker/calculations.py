from typing import Optional

from saldo.tables.tax_retention import TaxRetentionTable


def get_partner_extra_deduction(
    married: bool,
    number_of_holders: Optional[int],
    partner_disabled: bool,
) -> float:
    """
    https://diariodarepublica.pt/dr/detalhe/despacho/9971-a-2024-885806206#:~:text=b)%20Na%20situa%C3%A7%C3%A3o%20de%20%22casado%2C%20%C3%BAnico%20titular%22%20em

    b) Na situação de "casado, único titular" em que o cônjuge
    não aufira rendimentos das categorias A ou H e apresente
    um grau de incapacidade permanente igual ou superior a 60 %,
    é adicionado o valor de € 135,71 à parcela a abater;
    """

    if married and number_of_holders == 1 and partner_disabled:
        return 135.71
    return 0.0


def get_twelfths_income(income: float, twelfths: float) -> float:
    """
    Calculate the income distributed for the number of twelfths.
    Example: if the income is 1200€ and the twelfths is 2, the result is 200€
    which is the holiday and christmas income distributed over the year.
    """
    twelfths_coefficient = twelfths / 12
    return income * twelfths_coefficient


def get_disabled_dependent_extra_deduction(
    tax_retention_table: TaxRetentionTable,
    number_of_dependents_disabled: int,
) -> float:
    """
    Get the extra deduction for the number of dependents disabled, different for each table.

    https://diariodarepublica.pt/dr/detalhe/despacho/9971-a-2024-885806206#:~:text=a)%20Por%20cada%20dependente%20com
    a) Por cada dependente com grau de incapacidade permanente igual ou superior a 60 %,
    é adicionado à parcela a abater o valor de € 84,82, no caso das tabelas ii, iii, v, vii, ii-a, iii-a, v-a e vii-a
    e o valor de € 42,41, no caso das tabelas i, vi, i-a e vi-a;
    """
    if tax_retention_table.dependent_disabled_addition_deduction is not None:
        return (
            tax_retention_table.dependent_disabled_addition_deduction
            * number_of_dependents_disabled
        )
    return 0.0
